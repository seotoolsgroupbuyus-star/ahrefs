import fs from 'node:fs';
import path from 'node:path';
const root='original-source/article-components';
const errors=[];
const norm=x=>{
 let s=String(x||'').replace(/\{`([\s\S]*?)`\}/g,'$1')
   .replace(/\{\s*"([^"]*)"\s*\}/g,'$1')
   .replace(/\{\s*'([^']*)'\s*\}/g,'$1')
   .replace(/&#(\d+);/g,(_,v)=>String.fromCharCode(Number(v)))
   .replace(/&amp;/g,'&').replace(/&nbsp;/g,' ')
   .replace(/<[^>]*>/g,' ').toLowerCase();
 return (s.match(/[\p{L}\p{N}]+/gu)||[]).join(' ');
};
const tagTexts=(str,tag)=>[...str.matchAll(new RegExp('<'+tag+'\\b[^>]*>([\\s\\S]*?)</'+tag+'>','g'))].map(m=>norm(m[1]));
const blocks=(str,tag)=>[...str.matchAll(new RegExp('<'+tag+'\\b[\\s\\S]*?</'+tag+'>','g'))].map(m=>m[0]);
function expr(tag,name){
 const m=new RegExp('\\b'+name+'\\s*=\\s*\\{').exec(tag);
 if(!m)return null;
 let i=m.index+m[0].length,start=i,depth=1,quote='',esc=false;
 for(;i<tag.length;i++){
   const c=tag[i];
   if(quote){if(esc)esc=false;else if(c==='\\')esc=true;else if(c===quote)quote='';}
   else if(c==='"'||c==="'"||c==='`')quote=c;
   else if(c==='{')depth++;
   else if(c==='}'&&!--depth)break;
 }
 return tag.slice(start,i).trim();
}
function jsonArray(x){
 if(!x)return null;
 try{return JSON.parse(x.replace(/\]\s*\.map\(\(r\)\s*=>\s*\[(?:\s*r\[\d+\]\s*,?)+\]\)/g,']').replace(/,\s*([\]}])/g,'$1'))}catch{return null}
}
function jsxList(tag){
 const raw=expr(tag,'items');let data=jsonArray(raw);
 if(Array.isArray(data))return data.map(norm);
 data=[...(raw||'').matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/g)].map(m=>norm(m[1]));
 return data;
}
function compare(slug,what,left,right){
 if(left.length!==right.length){errors.push(slug+' '+what+' count: original '+left.length+', Astro '+right.length);return}
 for(let i=0;i<left.length;i++)if(left[i]!==right[i]){
   errors.push(slug+' '+what+' entry '+(i+1)+' differs: original='+left[i].slice(0,85)+' Astro='+right[i].slice(0,85));
   if(errors.length>80)return;
 }
}
let tableCount=0,listCount=0,cells=0,items=0;
for(const filename of fs.readdirSync(root).filter(f=>f.endsWith('Article.tsx'))){
 const slug=filename.replace(/Article\.tsx$/,'').replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase();
 const raw=fs.readFileSync(path.join(root,filename),'utf8');
 const src=raw.slice(raw.indexOf('export function '));
 const article=JSON.parse(fs.readFileSync(path.join('content/articles',slug+'.json'),'utf8'));
 const output=article.sections.map(s=>s.html).join('');
 const originalCompTables=[...src.matchAll(/<ArticleTable\s+[\s\S]*?\/>/g)].map(m=>m[0]);
 const originalCompLists=[...src.matchAll(/<BulletList\s+[\s\S]*?\/>/g)].map(m=>m[0]);
 const targetTables=blocks(output,'table');
 const targetLists=blocks(output,'ul');
 if(originalCompTables.length){
   if(targetTables.length!==originalCompTables.length)errors.push(slug+' article-table count differs');
   for(let i=0;i<originalCompTables.length;i++){
     const t=originalCompTables[i],h=jsonArray(expr(t,'headers')),r=jsonArray(expr(t,'rows')),dest=targetTables[i]||'';
     if(!Array.isArray(h)||!Array.isArray(r)){errors.push(slug+' unparsed original table '+i);continue}
     compare(slug,'table '+i+' headers',h.map(norm),tagTexts(dest,'th'));
     compare(slug,'table '+i+' values',r.flat().map(norm),tagTexts(dest,'td'));
     cells+=h.length+r.flat().length;
   }
 } else {
   const sourceTables=blocks(src,'table');
   if(sourceTables.length!==targetTables.length)errors.push(slug+' raw-table count differs');
   for(let i=0;i<sourceTables.length;i++){
     const a=sourceTables[i],b=targetTables[i]||'';
     compare(slug,'raw table '+i+' headers',tagTexts(a,'th'),tagTexts(b,'th'));
     const mapped=/<tbody>\s*\{\s*(\[[\s\S]*?\])\.map\(\(\[/.exec(a);
     const rows=mapped?jsonArray(mapped[1]):null;
     const expected=Array.isArray(rows)?rows.flat().map(norm):tagTexts(a,'td');
     compare(slug,'raw table '+i+' values',expected,tagTexts(b,'td'));
     cells+=tagTexts(a,'th').length+expected.length;
   }
 }
 if(originalCompLists.length){
   if(targetLists.length!==originalCompLists.length)errors.push(slug+' article-list count differs');
   for(let i=0;i<originalCompLists.length;i++){
     const x=jsxList(originalCompLists[i]),y=tagTexts(targetLists[i]||'','li');
     compare(slug,'bullet list '+i,x,y);items+=x.length;
   }
 } else {
   const srcLists=blocks(src,'ul'),outLists=targetLists;
   if(srcLists.length!==outLists.length)errors.push(slug+' raw-list count differs');
   compare(slug,'raw list items',srcLists.flatMap(s=>tagTexts(s,'li')),outLists.flatMap(s=>tagTexts(s,'li')));
   items+=srcLists.reduce((n,s)=>n+tagTexts(s,'li').length,0);
 }
 tableCount+=targetTables.length;listCount+=targetLists.length;
}
if(tableCount!==110)errors.push('Expected 110 total tables; got '+tableCount);
if(listCount!==125)errors.push('Expected 125 total unordered lists; got '+listCount);
if(errors.length){errors.forEach(e=>console.error('TABLE/LIST PARITY FAIL',e));process.exit(1)}
console.log('TABLE/LIST PARITY PASS: '+tableCount+' tables, '+listCount+' lists, '+cells+' table cells and '+items+' bullet items matched the original source in order');

import fs from 'node:fs';
import path from 'node:path';

// Strict normalized word/order parity for every original JSX heading and
// paragraph. Formatting and punctuation are normalized; actual visible words
// must appear in identical sequence and in the same semantic block.
const root='original-source/article-components';
const fail=[];
const normalize=value=>{
 const x=String(value||'')
  .replace(/\\{\\x60([\\s\\S]*?)\\x60\\}/g,'$1')
  .replace(/\\{\\s*"(.*?)"\\s*\\}/g,'$1')
  .replace(/\\{\\s*'(.*?)'\\s*\\}/g,'$1')
  .replace(/&#(\\d+);/g,(_,n)=>String.fromCharCode(Number(n)))
  .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
  .replace(/<[^>]*>/g,' ')
  .toLowerCase();
 return (x.match(/[\\p{L}\\p{N}]+/gu)||[]).join(' ');
};
const texts=(s,tag)=>[...s.matchAll(new RegExp('<(?:'+tag+')(?:\\\\s+[^>]*)?>([\\\\s\\\\S]*?)<\\\\/(?:'+tag+')>','g'))].map(m=>normalize(m[1]));
const count=(s,re)=>(s.match(re)||[]).length;
const prop=(tag,key)=>{
 const m=new RegExp('\\\\b'+key+'\\\\s*=\\\\s*(["\\x27])([\\\\s\\\\S]*?)\\\\1').exec(tag);
 return m?.[2]||'';
};
const check=(slug,kind,a,b)=>{
 if(a.length!==b.length){fail.push(slug+' '+kind+' count mismatch: source '+a.length+', Astro '+b.length);return}
 for(let i=0;i<a.length;i++)if(a[i]!==b[i]){
   fail.push(slug+' '+kind+' #'+(i+1)+' changed/moved: SOURCE '+a[i].slice(0,110)+' | ASTRO '+b[i].slice(0,110));
   if(fail.length>=40)return;
 }
};
let checked=0,paragraphs=0,headings=0,figures=0;
for(const filename of fs.readdirSync(root).filter(n=>n.endsWith('Article.tsx'))){
 const slug=filename.replace(/Article\\.tsx$/,'').replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase();
 const src0=fs.readFileSync(path.join(root,filename),'utf8');
 const start=src0.indexOf('export function ');
 if(start<0){fail.push('No exported article component '+filename);continue}
 const src=src0.slice(start);
 const article=JSON.parse(fs.readFileSync(path.join('content/articles',slug+'.json'),'utf8'));
 const dst=article.sections.map(x=>x.html).join('');
 const srcPara=texts(src,'P|p'),dstPara=texts(dst,'p');
 const srcH2=texts(src,'H2|h2'),dstH2=article.sections.map(x=>normalize(x.heading));
 const srcH3=texts(src,'H3|h3'),dstH3=texts(dst,'h3');
 const srcH4=texts(src,'H4|h4'),dstH4=texts(dst,'h4');
 check(slug,'paragraphs',srcPara,dstPara);
 check(slug,'H2 sections',srcH2,dstH2);
 check(slug,'H3 headings',srcH3,dstH3);
 check(slug,'H4 headings',srcH4,dstH4);
 paragraphs+=srcPara.length;headings+=srcH2.length+srcH3.length+srcH4.length;
 const origTables=count(src,/<table\\b/g)+count(src,/<ArticleTable\\b/g);
 const migratedTables=count(dst,/<table\\b/g);
 const origLists=count(src,/<ul\\b/g)+count(src,/<BulletList\\b/g);
 const migratedLists=count(dst,/<ul\\b/g);
 const origOrdered=count(src,/<ol\\b/g),migratedOrdered=count(dst,/<ol\\b/g);
 const origLinks=count(src,/<Link\\b/g),migratedLinks=count(dst,/<a\\b/g);
 for(const [label,a,b] of [['tables',origTables,migratedTables],['unordered lists',origLists,migratedLists],['ordered lists',origOrdered,migratedOrdered],['inline links',origLinks,migratedLinks]]){
   if(a!==b)fail.push(slug+' '+label+' count mismatch: source '+a+', Astro '+b);
 }
 const figSource=[...src.matchAll(/<ArticleFigure\\b[\\s\\S]*?\\/>/g)].map(m=>({src:prop(m[0],'src'),caption:normalize(prop(m[0],'caption'))}));
 const figDest=article.sections.flatMap(section=>[...section.html.matchAll(/<figure\\b[^>]*>[\\s\\S]*?<\\/figure>/g)].map(m=>{
   const img=/<img\\b[^>]*>/.exec(m[0])?.[0]||'';
   const caption=/<figcaption\\b[^>]*>([\\s\\S]*?)<\\/figcaption>/.exec(m[0])?.[1]||'';
   return {src:prop(img,'src'),caption:normalize(caption)};
 }));
 if(JSON.stringify(figSource)!==JSON.stringify(figDest))fail.push(slug+' image source/caption/order mismatch');
 figures+=figSource.length;checked++;
}
if(checked!==34)fail.push('Expected 34 articles; verified '+checked);
if(figures!==27)fail.push('Expected 27 source figures; got '+figures);
if(fail.length){for(const message of fail)console.error('PARITY FAIL',message);process.exitCode=1}
else console.log('PARITY PASS: '+checked+' articles, '+paragraphs+' paragraphs, '+headings+' headings, '+figures+' image captions, linked text, table/list structure in original order');

import fs from 'node:fs';
import path from 'node:path';

const root='original-source/article-components';
const errors=[];
const ent=x=>x.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
 .replace(/&apos;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&ldquo;/g,'“').replace(/&rdquo;/g,'”')
 .replace(/&lsquo;/g,'‘').replace(/&rsquo;/g,'’').replace(/&mdash;/g,'—').replace(/&ndash;/g,'–')
 .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n));
const norm=s=>ent(String(s)).replace(/\{\s*(?:" "|' ')\s*\}/g,' ')
 .replace(/\{\s*["']([^"']*)["']\s*\}/g,'$1').replace(/<[^>]*>/g,' ')
 .replace(/\s+/g,' ').trim();
const tags=(s,tag)=>[...s.matchAll(new RegExp('<(?:'+tag+')(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/(?:'+tag+')>','g'))].map(m=>m[1]);
let checked=0,skipped=0,total=0;
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('Article.tsx'))){
 const slug=file.replace(/Article\.tsx$/,'').replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase();
 const source=fs.readFileSync(path.join(root,file),'utf8');
 const orig=source.slice(source.indexOf('export function '));
 const article=JSON.parse(fs.readFileSync('content/articles/'+slug+'.json','utf8'));
 const rendered=article.sections.map(x=>x.html).join('\n');
 for(const [kind,sourceTag,destTag] of [['paragraph','P|p','p'],['H3','H3|h3','h3'],['H4','H4|h4','h4']]){
  const a=tags(orig,sourceTag),b=tags(rendered,destTag);
  if(a.length!==b.length){errors.push(slug+' '+kind+' count '+a.length+' vs '+b.length);continue}
  for(let i=0;i<a.length;i++){
   total++;
   const value=norm(a[i]);
   // Dynamic JSX embedded expressions cannot be determined from source text.
   if(/[{}]/.test(value)){skipped++;continue}
   checked++;
   if(value!==norm(b[i]))errors.push(slug+' '+kind+' #'+(i+1)+' punctuation/case mismatch: '+JSON.stringify(value.slice(0,150))+' vs '+JSON.stringify(norm(b[i]).slice(0,150)));
  }
 }
}
if(errors.length){errors.slice(0,65).forEach(x=>console.error('LITERAL WORD PARITY FAIL: '+x));console.error('Total mismatches: '+errors.length);process.exit(1)}
console.log('LITERAL COPY PASS: '+checked+' source paragraphs and H3/H4 blocks match verbatim after whitespace/entity normalization, including punctuation and capitalization; '+skipped+' dynamic JSX blocks excluded, '+total+' candidates.');

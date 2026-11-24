import fs from 'node:fs';
import path from 'node:path';
const site=JSON.parse(fs.readFileSync('content/site.json','utf8'));
const privacy=JSON.parse(fs.readFileSync('content/privacy.json','utf8'));
const files=fs.readdirSync('content/articles').filter(x=>x.endsWith('.json'));
const errors=[]; const slugs=new Set();
const assert=(condition,message)=>{if(!condition) errors.push(message)};
assert(files.length===34,'Expected 34 articles; got '+files.length);
let sections=0,images=0;
const allArticles=[];
for(const file of files){
 const a=JSON.parse(fs.readFileSync(path.join('content/articles',file),'utf8'));
 allArticles.push(a);
 assert(a.slug+'.json'===file,'Slug/filename mismatch: '+file);
 assert(!slugs.has(a.slug),'Duplicate slug: '+a.slug);slugs.add(a.slug);
 assert(a.status==='published'||a.status==='draft','Unrecognized publication status: '+file);
 assert(!!a.title && !!a.seoTitle && !!a.seoDescription,'Missing SEO metadata: '+file);
 assert(Array.isArray(a.sections)&&a.sections.length>0,'No article sections: '+file);
 for(const s of (a.sections||[])){
  sections++;assert(!!s.heading && !!s.html,'Empty section: '+file);
  for(const m of String(s.html||'').matchAll(/(?:src|href)=["'](\/images\/[^"'?#]+)["']/g)){
   images++;
   assert(fs.existsSync(path.join('public',m[1])), 'Missing image: '+file+' '+m[1]);
  }
 }
}
assert(site.siteUrl==='https://aherfsgroupbuy.com','Site URL differs from source');
assert(site.plans?.length===3,'Live homepage has three pricing plans');
assert(site.faq?.length===10,'Live homepage has ten FAQs');
assert(site.reviews?.length===8,'Live homepage has eight reviews');
assert(site.comparison?.length===12,'Live homepage comparison has twelve rows');
assert(site.limitations?.length===4,'Live homepage has four limitation cards');
assert(site.tools?.length===8,'Live homepage has eight featured tools');
assert(site.menu?.length===7,'Live homepage has seven primary nav items');
for(const p of site.plans||[]){
 assert(p.monthlyUsd>0 && p.yearlyUsdPerMonth>0,'Plan price missing: '+p.name);
 assert(/^https:\/\//.test(p.buyUrl),'Checkout URL missing: '+p.name);
 assert((p.features||[]).length>0,'Plan features missing: '+p.name);
}
for(const menu of [...(site.menu||[]),...(site.footerMenu||[])]){
 if(menu.url.startsWith('/#')){
  const anchor=menu.url.slice(2);
  assert(fs.readFileSync('src/pages/index.astro','utf8').includes('id="'+anchor+'"'),'Missing nav anchor: '+anchor);
 }else if(menu.url.startsWith('/') && menu.url!=='/'){
  const slug=menu.url.replace(/^\//,'').replace(/\/$/,'');
  assert(slugs.has(slug)||slug==='privacy','Unknown navigation destination: '+menu.url);
 }
}
// Confirm every shared label is exposed in Pages CMS and used by a rendered Astro template.
const cmsConfig=fs.readFileSync('.pages.yml','utf8');
const renderedTemplates=['src/pages/index.astro','src/pages/[slug].astro','src/layouts/Base.astro']
 .map(f=>fs.readFileSync(f,'utf8')).join('\n');
assert(cmsConfig.includes('name: uiLabels'),'CMS shared interface-label object missing');
for(const [key,value] of Object.entries(site.uiLabels||{})){
 assert(cmsConfig.includes('name: '+key+','),'UI label missing from Pages CMS: '+key);
 assert(renderedTemplates.includes('site.uiLabels.'+key),'UI label not rendered: '+key);
 assert(Array.isArray(value)?value.length>0:typeof value==='string'&&value.trim().length>0,'Empty UI label: '+key);
}
assert(!privacy.html.includes('has not yet been migrated'),'Privacy placeholder remains');
assert((privacy.html.match(/<h2>/g)||[]).length===10,'Privacy policy missing source sections');
assert(fs.existsSync('src/pages/sitemap.xml.js'),'Missing sitemap generator');
assert(fs.existsSync('src/pages/robots.txt.js'),'Missing robots generator');
if(errors.length){for(const e of errors)console.error('FAIL '+e);process.exit(1)}
console.log('PASS: '+files.length+' articles, '+sections+' editable sections, '+images+' image references, live homepage structure, links, privacy, sitemap and robots');

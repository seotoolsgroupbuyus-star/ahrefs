import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const site=JSON.parse(fs.readFileSync('content/site.json','utf8'));
const privacy=JSON.parse(fs.readFileSync('content/privacy.json','utf8'));
const root='dist';
const articleDir='content/articles';
const articles=fs.readdirSync(articleDir).filter(name=>name.endsWith('.json')).map(name=>JSON.parse(fs.readFileSync(path.join(articleDir,name),'utf8'))).filter(a=>a.status==='published');
const errors=[];
const decode=s=>String(s||'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)));
const normalize=s=>decode(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const check=(condition,context)=>{if(!condition)errors.push(context)};
const render=(urlPath)=>fs.readFileSync(path.join(root,urlPath,'index.html'),'utf8');
const attr=(html,tag,name)=>{const block=new RegExp('<'+tag+'\\b[^>]*>','i').exec(html)?.[0]||'';return decode(new RegExp('\\b'+name+'="([^"]*)"').exec(block)?.[1]||'')};
const getMeta=(html,key,value)=>{for(const m of html.matchAll(/<meta\b[^>]*>/g)){if(attr(m[0],'meta',key)===value)return attr(m[0],'meta','content')}return ''};
const getCanonical=html=>{for(const m of html.matchAll(/<link\b[^>]*>/g))if(attr(m[0],'link','rel')==='canonical')return attr(m[0],'link','href');return ''};
// Validate the actual rendered head metadata, not just the JSON data.
function checkSocialTags(html,route,title,description){
 for(const [attr,name,value] of [
  ['property','og:title',title],['property','og:description',description],
  ['name','twitter:title',title],['name','twitter:description',description]
 ]){
  check(getMeta(html,attr,name)===value,route+': '+name+' differs from CMS meta');
 }
}
const allSlugs=new Set(articles.map(a=>a.slug));
const home=render('');
check(normalize(/<title>([\s\S]*?)<\/title>/.exec(home)?.[1])===site.homeTitle,'Homepage <title> differs from CMS');
check(getCanonical(home)===site.siteUrl+'/','Homepage canonical mismatch');
check(getMeta(home,'name','description')===site.homeDescription,'Homepage meta description mismatch');
checkSocialTags(home,'homepage',site.homeTitle,site.homeDescription);
const privacyHtml=render('privacy');
check(normalize(/<title>([\s\S]*?)<\/title>/.exec(privacyHtml)?.[1])===privacy.seoTitle,'Privacy page SEO title mismatch');
check(getMeta(privacyHtml,'name','description')===privacy.seoDescription,'Privacy meta description mismatch');
checkSocialTags(privacyHtml,'privacy',privacy.seoTitle,privacy.seoDescription);
check(privacyHtml.includes(privacy.html.slice(0,120)),'Privacy source HTML not present in rendered page');
let images=0,internalLinks=0,sections=0;
for(const article of articles){
 let html;
 try{html=render(article.slug)}catch{errors.push(article.slug+': missing generated URL');continue}
 check(normalize(/<title>([\s\S]*?)<\/title>/.exec(html)?.[1])===article.seoTitle,article.slug+': SEO title differs');
 check(getMeta(html,'name','description')===article.seoDescription,article.slug+': SEO description differs');
 checkSocialTags(html,article.slug,article.seoTitle,article.seoDescription);
 check(getCanonical(html)===site.siteUrl+'/'+article.slug+'/',article.slug+': canonical wrong');
 check(getMeta(html,'name','robots').includes('index,follow'),article.slug+': robots missing index,follow');
 const heading=normalize(/<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1]);
 check(heading===article.title,article.slug+': visible H1 differs: '+heading);
 check(html.includes('BreadcrumbList'),article.slug+': breadcrumb schema missing');
 const h2=[...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(m=>normalize(m[1]));
 let cursor=0;
 for(const section of article.sections){
  sections++;
  const i=h2.indexOf(normalize(section.heading),cursor);
  check(i>=0,article.slug+': missing/out-of-order heading '+section.heading);
  if(i>=0)cursor=i+1;
  const firstParagraph=/<p\b[^>]*>([\s\S]*?)<\/p>/.exec(section.html)?.[1];
  if(firstParagraph){
   const txt=normalize(firstParagraph);
   check(normalize(html).includes(txt),article.slug+': article paragraph missing from rendered HTML');
  }
  for(const m of section.html.matchAll(/src=["'](\/images\/[^"'?#]+)["']/g)){
   images++;
   check(fs.existsSync(path.join(root,m[1])),article.slug+': built image missing '+m[1]);
  }
  for(const m of section.html.matchAll(/href=["'](\/[^"'?#]+)["']/g)){
   internalLinks++;
   const slug=m[1].replace(/^\/|\/$/g,'');
   check(!slug||slug==='privacy'||allSlugs.has(slug),article.slug+': broken internal article link '+m[1]);
  }
 }
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=['/','/privacy/',...articles.map(a=>'/'+a.slug+'/')];
for(const url of urls)check(sitemap.includes('<loc>'+site.siteUrl+url+'</loc>'),'Missing sitemap URL '+url);
check((sitemap.match(/<loc>/g)||[]).length===urls.length,'Sitemap has unexpected URL count');
const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
check(robots.includes('User-agent: *\nAllow: /'),'Robots indexing policy differs');
check(robots.includes('Sitemap: '+site.siteUrl+'/sitemap.xml'),'Robots sitemap link wrong');
check(site.articleOrder?.length===articles.length,'Editorial article order missing entries');
check(new Set(site.articleOrder||[]).size===articles.length,'Editorial article order has duplicates');
for(const slug of site.articleOrder||[])check(allSlugs.has(slug),'Unrecognized article slug in display order: '+slug);
if(errors.length){errors.forEach(msg=>console.error('BUILT PAGE AUDIT FAIL:',msg));process.exit(1)}
console.log('BUILT PAGE AUDIT PASS: homepage, privacy, '+articles.length+' articles, '+sections+' rendered article sections, '+images+' source images, '+internalLinks+' internal article links, original editorial order, SEO metadata, canonicals, index settings, XML sitemap and robots.txt.');

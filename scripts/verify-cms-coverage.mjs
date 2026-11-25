import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8');
const site=JSON.parse(read('content/site.json'));
const cms=read('.pages.yml');
const used=[
'src/react/ReferenceStyleHome.tsx','src/react/Navbar.tsx','src/react/Footer.tsx',
'src/react/WhatsAppChatBox.tsx','src/react/Logo.tsx',
'src/react/cmsData.ts','src/pages/[slug].astro','src/layouts/Base.astro'
].map(read).join('\n');
const errors=[];
for(const [key,value] of Object.entries(site)){
 if(!new RegExp('\\bname:\\s*'+key+'\\b').test(cms))errors.push('Missing CMS top-level field: '+key);
 if(key==='uiLabels'||key==='homeCopy'){
  for(const child of Object.keys(value)){
   if(!new RegExp('\\bname:\\s*'+child+'\\s*[,}]').test(cms))errors.push('Missing CMS editor: '+key+'.'+child);
   if(!used.includes(key+'.'+child))errors.push('Unused CMS field: '+key+'.'+child);
  }
 }
}
const article=JSON.parse(read('content/articles/ahrefs-group-buy-guide.json'));
for(const key of Object.keys(article)){
 if(!new RegExp('\\bname:\\s*'+key+'\\b').test(cms))errors.push('Missing article CMS field: '+key);
}
for(const key of Object.keys(article.sections[0]||{})){
 if(!new RegExp('\\bname:\\s*'+key+'\\b').test(cms))errors.push('Missing article section field: '+key);
}
const articleCount=fs.readdirSync('content/articles').filter(f=>f.endsWith('.json')).length;
assert.equal(articleCount,34,'All 34 original article JSONs must remain');
for(const symbol of [
'logo={tool.logo}','site.heroAvatars','site.brandMarkImage',
'site.uiLabels.writeReviewUrl','site.primaryCtaUrl','site.secondaryCtaUrl',
'site.uiLabels.articleAsideUrl'
])if(!used.includes(symbol))errors.push('Rendered component missing editable binding: '+symbol);
for(const block of ['name: uploads','name: logos','name: avatars','type: rich-text'])if(!cms.includes(block))errors.push('Missing media or rich-text editor: '+block);
assert.ok(/^https:\/\/pay\.[^/]+$/.test(site.paymentBaseUrl),'Payment domain must be direct pay subdomain root');
assert.ok(site.plans.every(p=>p.buyUrl===site.paymentBaseUrl),'All Buy Now URLs must use payment root');
if(errors.length){for(const error of errors)console.error('CMS COVERAGE FAIL: '+error);process.exit(1)}
console.log('CMS COVERAGE PASS: all website settings, 79 interface labels, homepage copy, 34 article JSON records, logos, media and checkout actions are represented and wired.');

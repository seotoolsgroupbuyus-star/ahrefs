import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const paths=['content/site.json','content/articles/ahrefs-group-buy-guide.json'];
const original=new Map(paths.map(p=>[p,fs.readFileSync(p,'utf8')]));
const marker='AHREFS_CMS_EDIT_TEST_84921';
try{
 const site=JSON.parse(original.get(paths[0]));
 site.homeCopy.pricingTitle=marker+'_PRICING';
 site.uiLabels.reviewPlatformLabel=marker+'_REVIEW';
 site.plans[0].monthlyUsd=907;
 site.tools[0].logo='/logos/ahrefs.svg';
 fs.writeFileSync(paths[0],JSON.stringify(site,null,2)+'\n');
 const article=JSON.parse(original.get(paths[1]));
 article.title=marker+'_ARTICLE';
 fs.writeFileSync(paths[1],JSON.stringify(article,null,2)+'\n');
 execFileSync('npm',['run','build'],{stdio:'inherit',timeout:180000});
 const home=fs.readFileSync('dist/index.html','utf8');
 const page=fs.readFileSync('dist/ahrefs-group-buy-guide/index.html','utf8');
 assert.ok(home.includes(marker+'_PRICING'),'CMS pricing section text does not render');
 assert.ok(home.includes(marker+'_REVIEW'),'CMS review platform does not render');
 assert.ok(home.includes('907'),'CMS plan price does not render');
 assert.ok(home.includes('/logos/ahrefs.svg'),'CMS tool logo does not render');
 assert.ok(page.includes(marker+'_ARTICLE'),'CMS article title does not render');
 console.log('CMS EDIT SIMULATION PASS: pricing, review text, plan price, tool logo and article title update generated pages.');
}finally{for(const [p,text] of original)fs.writeFileSync(p,text)}

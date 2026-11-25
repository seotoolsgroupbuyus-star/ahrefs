import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {transformSync} from 'esbuild';

const source=fs.readFileSync('original-source/site.ts','utf8');
const compiled=transformSync(source,{loader:'ts',format:'cjs',target:'node20'}).code;
const module={exports:{}};
vm.runInNewContext(compiled,{module,exports:module.exports},{timeout:3000,filename:'original-source/site.ts'});
const original=module.exports.PAGES;
assert.ok(original && typeof original==='object','Original source page map unavailable');
const site=JSON.parse(fs.readFileSync('content/site.json','utf8'));
const privacy=JSON.parse(fs.readFileSync('content/privacy.json','utf8'));
// Exact strings read from newahrefs-main.zip: src/app/layout.tsx,
// src/app/page.tsx and src/app/privacy/page.tsx.
const sourceHomeTitle='AhrefsGroupBuy – Fast, Stable Shared Ahrefs Access';
const sourceHomeDescription='AhrefsGroupBuy shares Ahrefs for keyword research, backlinks, audits, and competitors—dashboard access with responsive support.';
const sourcePrivacyTitle='Privacy Policy for AhrefsGroupBuy Users & Data';
const sourcePrivacyDescription='How AhrefsGroupBuy collects and uses your data: cookies, third parties, your rights, and how to contact us.';
assert.equal(site.homeTitle,sourceHomeTitle,'Original ZIP homepage SEO title mismatch');
assert.equal(site.homeDescription,sourceHomeDescription,'Original ZIP homepage meta description mismatch');
assert.equal(privacy.seoTitle,sourcePrivacyTitle,'Original ZIP Privacy Policy SEO title mismatch');
assert.equal(privacy.seoDescription,sourcePrivacyDescription,'Original ZIP Privacy Policy meta description mismatch');
const articlePaths=fs.readdirSync('content/articles').filter(x=>x.endsWith('.json'));
const errors=[];
const norm=v=>v===undefined||v===null?'':String(v);
const verify=(slug,key,a,b)=>{
 if(norm(a)!==norm(b))errors.push({slug,key,original:norm(a),migrated:norm(b)});
};
for(const file of articlePaths){
 const a=JSON.parse(fs.readFileSync(path.join('content/articles',file),'utf8'));
 const b=original[a.slug];
 if(!b){errors.push({slug:a.slug,key:'route',original:'missing from old source',migrated:'present'});continue}
 for(const [key,originalValue,migratedValue] of [
  ['H1',b.title,a.title],
  ['SEO title',b.metaTitle||b.title,a.seoTitle],
  ['SEO description',b.metaDescription||b.description,a.seoDescription],
  ['cluster',b.cluster,a.cluster],
  ['pillar',b.isPillar,a.isPillar],
  ['parentSlug',b.parentSlug||'',a.parentSlug||'']
 ]) verify(a.slug,key,originalValue,migratedValue);
}
for(const slug of Object.keys(original))if(!articlePaths.includes(slug+'.json'))errors.push({slug,key:'missing migrated route'});
if(errors.length){for(const err of errors)console.error('ORIGINAL PAGE PARITY FAIL:',JSON.stringify(err));process.exit(1)}
console.log('ORIGINAL PAGE SEO PASS: homepage and Privacy titles/descriptions plus '+articlePaths.length+' original article URLs, titles, descriptions and relationships.');

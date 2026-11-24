import fs from 'node:fs';import path from 'node:path';
const site=JSON.parse(fs.readFileSync('content/site.json','utf8'));
const files=fs.readdirSync('content/articles').filter(x=>x.endsWith('.json'));
if(files.length!==34)throw Error('Expected 34 articles; got '+files.length);
let slugs=new Set();for(const file of files){const a=JSON.parse(fs.readFileSync('content/articles/'+file,'utf8'));if(a.slug+'.json'!==file)throw Error('Slug mismatch '+file);if(slugs.has(a.slug))throw Error('Duplicate slug '+a.slug);slugs.add(a.slug);if(!a.title||!a.seoTitle||!a.seoDescription||!a.sections?.length)throw Error('Incomplete '+a.slug);if(a.sections.some(s=>!s.html||!s.heading))throw Error('Empty sections '+a.slug)}
if(!site.siteUrl.startsWith('https://'))throw Error('Bad site URL');console.log('PASS: '+files.length+' article files; unique routes; populated SEO and editable sections');

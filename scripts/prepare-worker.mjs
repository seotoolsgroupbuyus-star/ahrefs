import fs from 'node:fs';
const path=new URL('../wrangler.jsonc',import.meta.url);
const config=JSON.parse(fs.readFileSync(path,'utf8'));
// The existing Worker is ahrefs.digizoon7.workers.dev. Its deployment target
// must be "ahrefs", not a newly created service called ahrefs-astro-cms.
// The repo remains an Astro + Pages CMS project; only the deployed Worker name changes.
config.name='ahrefs';
fs.writeFileSync(path,JSON.stringify(config,null,2)+'\n');
console.log('Configured existing Cloudflare Worker: '+config.name);

import fs from 'node:fs';import path from 'node:path';
const base=path.join(process.cwd(),'content');
export const site=JSON.parse(fs.readFileSync(path.join(base,'site.json'),'utf8'));
export const articles=fs.readdirSync(path.join(base,'articles')).filter(x=>x.endsWith('.json')).map(x=>JSON.parse(fs.readFileSync(path.join(base,'articles',x),'utf8'))).filter(x=>x.status==='published');
export const absolute=url=>site.siteUrl.replace(/\/$/,'')+url;

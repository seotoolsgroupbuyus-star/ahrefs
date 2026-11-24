import {site} from '../lib/data.js';
export function GET(){return new Response(`User-agent: *\nAllow: /\nSitemap: ${site.siteUrl}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain'}})}

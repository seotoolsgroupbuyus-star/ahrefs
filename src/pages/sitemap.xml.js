import {site,articles} from '../lib/data.js';
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
export function GET(){let urls=['/','/privacy/',...articles.map(a=>'/'+a.slug+'/')];const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(u=>'<url><loc>'+escape(site.siteUrl+u)+'</loc></url>').join('')+'</urlset>';return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8'}})}

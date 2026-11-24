import {site} from '../lib/data.js';
// Preserve the original Next.js source robots policy while keeping indexing enabled.
const excluded=['GPTBot','ChatGPT-User','OAI-SearchBot','ClaudeBot','anthropic-ai','PerplexityBot','Perplexity-User','CCBot','Bytespider','Amazonbot','Google-Extended'];
export function GET(){
  const lines=['User-agent: *','Allow: /','',...excluded.flatMap(bot=>['User-agent: '+bot,'Disallow: /','']), 'Sitemap: '+site.siteUrl.replace(/\/$/,'')+'/sitemap.xml'];
  return new Response(lines.join('\n')+'\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}

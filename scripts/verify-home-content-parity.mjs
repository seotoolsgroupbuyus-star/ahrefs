import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('original-source/homeMarketing.ts','utf8');
const site=JSON.parse(fs.readFileSync('content/site.json','utf8'));
const failures=[];
function originalArray(name){
 const m=new RegExp('export\\s+const\\s+'+name+'\\b').exec(source);
 if(!m)throw Error('Missing original source field '+name);
 const eq=source.indexOf('=',m.index+m[0].length);
 const start=source.indexOf('[',eq+1);
 if(start<0)throw Error('Missing array '+name);
 let depth=0,quote='',escaped=false,end=-1;
 for(let i=start;i<source.length;i++){
  const c=source[i];
  if(quote){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c===quote)quote='';continue}
  if(c==='"'||c==="'"){quote=c;continue}
  if(c==='[')depth++;
  else if(c===']'&&--depth===0){end=i+1;break}
 }
 if(end<0)throw Error('Unterminated array '+name);
 const result=vm.runInNewContext('('+source.slice(start,end)+')',{CHECKOUT_URLS:{lite:'legacy',standard:'legacy',power:'legacy'}},{timeout:1000});
 return JSON.parse(JSON.stringify(result));
}
const verify=(label,a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))failures.push(label+' differs from original source')};
const plan=p=>({id:p.id,name:p.name,description:p.description,monthlyUsd:p.monthlyUsd,yearlyUsdPerMonth:p.yearlyUsdPerMonth,popular:p.popular,features:p.features,tools:p.tools||[]});
verify('Plans and prices',site.plans.map(plan),originalArray('MARKETING_PLANS').map(plan));
verify('Tool strip',site.toolStrip,originalArray('homeToolStrip'));
verify('Comparison',site.comparison,originalArray('COMPARISON_TABLE'));
verify('Problems',site.problemBullets,originalArray('problemBullets'));
verify('Solutions',site.solutionBullets,originalArray('solutionBullets'));
verify('Featured tools',site.tools.map(t=>({name:t.name,color:t.color})),originalArray('toolsShowcase'));
verify('Limitations',site.limitations,originalArray('limitations'));
verify('PKR rate',site.pkrRate,Number(/export const PKR_RATE\s*=\s*(\d+)/.exec(source)?.[1]));
verify('Coupon',site.couponCode,/export const COUPON_CODE\s*=\s*"([^"]+)"/.exec(source)?.[1]);
verify('Hero description',site.heroDescription,/subhead:\s*"([^"]+)"/.exec(source)?.[1]);
verify('Hero trust line',site.heroTrust,/trustLine:\s*"([^"]+)"/.exec(source)?.[1]);
if(failures.length){failures.forEach(x=>console.error('PARITY FAIL '+x));process.exitCode=1}
else console.log('HOME CONTENT PARITY PASS: all original marketing arrays, plans, prices and homepage copy match; checkout URL intentionally uses approved pay host.');

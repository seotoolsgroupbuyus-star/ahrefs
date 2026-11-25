import site from '../../content/site.json';

export type BillingCycle = 'monthly' | 'annual';
export type MarketingPlan = {
  id:string; name:string; description:string; monthlyUsd:number; yearlyUsdPerMonth:number;
  popular:boolean; features:string[]; tools?:string[]; buyUrl:string;
};
export type ComparisonRow = {feature:string;groupBuy:string;direct:string};
export const cn=(...values:(string|false|null|undefined)[])=>values.filter(Boolean).join(' ');

export const SITE_CONFIG={
  name:site.brand,
  url:site.siteUrl,
  description:site.homeDescription,
  whatsappUrl:site.whatsappUrl,
};
export const brand={name:site.brand,url:site.siteUrl,description:site.homeDescription};
export const hero={
  badge:site.heroBadge,
  headlineBefore:'AHREFS ACCESS',
  headlineAccent:'AT 90% OFF.',
  subhead:site.heroDescription,
  trustLine:site.heroTrust,
};
export const homeToolStrip=site.toolStrip;
export const MARKETING_PLANS:MarketingPlan[]=site.plans;
export const PKR_RATE=site.pkrRate;
export const COUPON_CODE=site.couponCode;
export const COMPARISON_TABLE:ComparisonRow[]=site.comparison;
export const problemBullets=site.problemBullets;
export const solutionBullets=site.solutionBullets;
export const toolsShowcase=site.tools;
export const limitations=site.limitations;
export const FAQ_ITEMS=site.faq;
export const REVIEW_ITEMS=site.reviews;

export function planDisplayUsd(plan:Pick<MarketingPlan,'monthlyUsd'|'yearlyUsdPerMonth'>,billingCycle:BillingCycle){
 return billingCycle==='monthly'?plan.monthlyUsd:plan.yearlyUsdPerMonth*12;
}
export function planPriceSuffix(cycle:BillingCycle){return cycle==='monthly'?'/mo':'/yr'}
export function formatPlanDisplayAmount(amount:number,currency:'usd'|'pkr'){
 if(currency==='pkr')return Math.round(amount).toLocaleString();
 return Number.isInteger(amount)?String(amount):amount.toFixed(2);
}
export function planForProjects(count:number):string{return count<=1?'lite':count<=5?'standard':'power'}

export const springSnappy={type:'spring' as const,stiffness:380,damping:28};

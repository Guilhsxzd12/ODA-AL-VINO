'use client';

const SUPABASE_URL='https://rmyybeaepscmzbddnvzr.supabase.co';
const SUPABASE_KEY='sb_publishable_lINNHBmZk9rvHYgtQetewg_NTRAEWq2';

let catalogPromise;

function toneFor(w){
  const s=[w.grape,w.name,w.type].filter(Boolean).join(' ').toLowerCase();
  if(s.includes('rosé')||s.includes('rose')) return 'pinot';
  if(s.includes('pinot noir')) return 'pinot';
  if(s.includes('malbec')) return 'malbec';
  if(s.includes('chardonnay')||s.includes('sauvignon blanc')||s.includes('riesling')||s.includes('moscatel')||s.includes('moscato')||s.includes('glera')||s.includes('prosecco')||s.includes('branco')) return 'gold';
  if(s.includes('cabernet')||s.includes('tannat')||s.includes('syrah')||s.includes('shiraz')||s.includes('pinotage')) return 'cabernet';
  return 'blend';
}

function isBlend(raw=''){
  const s=String(raw).trim();
  if(!s) return false;
  const pct=(s.match(/\d+(?:[.,]\d+)?\s*%/g)||[]).length;
  return pct>1 || /,|\s+e\s+|\s*&\s*|\s*\/\s*|\s*\+\s*/i.test(s) || /\boutras?\b|\bblend\b/i.test(s);
}

function canonicalPure(value=''){
  let v=String(value)
    .replace(/^\s*\d+(?:[.,]\d+)?\s*%\s*/,'')
    .replace(/\s+/g,' ')
    .trim();
  if(/^cabernet[-\s]sauvignon$/i.test(v)) return 'Cabernet Sauvignon';
  if(/^carmenere$/i.test(v)||/^carménère$/i.test(v)) return 'Carménère';
  if(/^sangiovese grosso$/i.test(v)) return 'Sangiovese';
  return v;
}

export function grapeCategory(raw){
  if(!raw) return '';
  if(isBlend(raw)) return 'Blends';
  return canonicalPure(raw);
}

export function grapeDisplay(raw){
  if(!raw) return '';
  if(isBlend(raw)) return String(raw).replace(/\s+/g,' ').trim();
  return canonicalPure(raw);
}

export function slugify(value=''){
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

export function wineSlug(w){
  return `${slugify(w?.name||'vinho')}--${w?.id||''}`;
}
export function winePath(w){return `/vinho?produto=${encodeURIComponent(wineSlug(w))}`;}
export function wineIdFromSlug(slug=''){
  const clean=decodeURIComponent(String(slug).split('?')[0]).replace(/\/+$/,'');
  const marker=clean.lastIndexOf('--');
  return marker>=0?clean.slice(marker+2):clean;
}

function normalize(w){
  const item={
    ...w,
    flag:w.country_code||'',
    notes:w.tasting_notes||'',
    source:w.source_catalog||'',
    sourcePage:w.source_page,
    isNew:Boolean(w.new_arrival),
  };
  item.tone=toneFor(item);
  item.filterGrape=grapeCategory(item.grape);
  item.grapeDisplay=grapeDisplay(item.grape);
  return item;
}

export function loadCatalog(){
  if(!catalogPromise){
    catalogPromise=(async()=>{
      const url=SUPABASE_URL+'/rest/v1/products?select=*&active=eq.true&order=sort_order.asc';
      const response=await fetch(url,{headers:{apikey:SUPABASE_KEY},cache:'no-store'});
      if(!response.ok) throw new Error('Não foi possível carregar o catálogo.');
      const rows=await response.json();
      return rows.map(normalize);
    })();
  }
  return catalogPromise;
}

export function money(value){
  return Number(value||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

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
  return item;
}

export function loadCatalog(){
  if(!catalogPromise){
    catalogPromise=(async()=>{
      const url=SUPABASE_URL+'/rest/v1/products?select=*&active=eq.true&order=sort_order.asc';
      const response=await fetch(url,{
        headers:{apikey:SUPABASE_KEY},
        cache:'no-store'
      });
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

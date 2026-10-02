'use client';
import { useEffect, useMemo, useState } from 'react';
import { HEADER_LOGO } from '../brand';
import { loadCatalog, money, winePath } from '../catalogLoader';

function CartIcon(){return <svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7"/></svg>}
function SearchIcon(){return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>}
function MenuIcon(){return <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>}
function FilterIcon(){return <svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></svg>}
function Arrow(){return <span>→</span>}
function WhatsIcon(){return <img className="social-icon-img" src="https://cdn.simpleicons.org/whatsapp/ffffff" alt=""/>}
function Flag({code,name,className=''}){return code?<span className={`flag-wrap ${className}`}><img src={`https://flagcdn.com/w80/${code}.png`} alt={`Bandeira de ${name}`}/></span>:null}
function Bottle({wine}){return <div className="bottle-wrap"><div className={`bottle ${wine?.tone||'blend'}`}><div className="neck"/><div className="shoulder"/><div className="body"><div className="label"><b>{(wine?.name||'VINHO').slice(0,18)}</b><small>{(wine?.winery||'VIDEIRA').slice(0,18)}</small></div></div></div></div>}
function ProductVisual({wine}){return wine?.image_url?<img className="wine-photo" src={wine.image_url} alt={wine.name} draggable="false"/>:<Bottle wine={wine}/>}
function ProductCard({w,onAdd}){return <article className="wine-card"><Flag code={w.flag} name={w.country} className="origin-flag"/><a className="wine-card-link" href={winePath(w)}><div className="wine-image"><ProductVisual wine={w}/></div><div className="wine-meta"><small>{w.country||'Vinho'}</small><h3>{w.name}</h3><p>{w.winery}</p><span>{w.grapeDisplay||w.type||''}</span></div></a><div className="price-line"><strong>{money(w.price)}</strong><button onClick={e=>{e.preventDefault();e.stopPropagation();onAdd(w)}}><CartIcon/></button></div></article>}

export default function LojaPage(){
 const [wines,setWines]=useState([]),[cart,setCart]=useState([]),[cartOpen,setCartOpen]=useState(false),[menuOpen,setMenuOpen]=useState(false),[filtersOpen,setFiltersOpen]=useState(false),[page,setPage]=useState(1),[country,setCountry]=useState(''),[grape,setGrape]=useState(''),[winery,setWinery]=useState(''),[query,setQuery]=useState('');
 useEffect(()=>{loadCatalog().then(setWines).catch(console.error);const p=new URLSearchParams(location.search);setCountry(p.get('pais')||'');setGrape(p.get('uva')||'');setWinery(p.get('bodega')||'');setQuery(p.get('q')||'')},[]);
 const countries=useMemo(()=>[...new Set(wines.map(w=>w.country).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR')),[wines]);
 const grapes=useMemo(()=>[...new Set(wines.map(w=>w.filterGrape).filter(Boolean))].sort((a,b)=>a==='Blends'?1:b==='Blends'?-1:a.localeCompare(b,'pt-BR')),[wines]);
 const wineries=useMemo(()=>[...new Set(wines.map(w=>w.winery).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR')),[wines]);
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return wines.filter(w=>(!country||w.country===country)&&(!grape||w.filterGrape===grape)&&(!winery||w.winery===winery)&&(!q||[w.name,w.winery,w.country,w.region,w.grapeDisplay,w.type].some(v=>(v||'').toLowerCase().includes(q))))},[wines,country,grape,winery,query]);
 const perPage=16,pages=Math.max(1,Math.ceil(filtered.length/perPage)),visible=filtered.slice((page-1)*perPage,page*perPage);
 useEffect(()=>{if(page>pages)setPage(1)},[pages,page]);
 const total=cart.reduce((s,p)=>s+Number(p.price||0),0);const add=p=>setCart(v=>[...v,p]);const remove=i=>setCart(v=>v.filter((_,x)=>x!==i));const reset=()=>{setCountry('');setGrape('');setWinery('');setQuery('');setPage(1);history.replaceState(null,'','/loja')};
 const checkout=()=>{const lines=cart.map(p=>`• ${p.name} — ${money(p.price)}`).join('\n');window.open(`https://wa.me/5545999056277?text=${encodeURIComponent(`Olá! Quero consultar estes vinhos:\n\n${lines}\n\nTotal: ${money(total)}`)}`,'_blank')};

 return <>
  <header className="floating-header"><div className="header-pill"><a className="header-logo" href="/"><img src={HEADER_LOGO} alt="Videira Vinhoteca"/></a><nav><a href="/">Início</a><a href="/#vinhos">Vinhos</a><a href="/#uvas">Uvas</a><a href="/#bodegas">Bodegas</a><a href="/#sobre">Sobre nós</a><a href="/#faq">FAQ</a></nav><div className="header-actions"><a className="icon-btn search-btn" href="#busca"><SearchIcon/></a><button className="icon-btn cart-icon" onClick={()=>setCartOpen(true)}><CartIcon/>{cart.length>0&&<span>{cart.length}</span>}</button><a className="shop-pill active" href="/loja">Loja <Arrow/></a><button className="icon-btn mobile-menu-btn" onClick={()=>setMenuOpen(true)} aria-label="Abrir menu"><MenuIcon/></button></div></div></header>
  <main className="shop-page">
   <section id="busca" className="shop-search-wrap"><div className="shop-search"><SearchIcon/><input value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}} placeholder="Pesquise por vinho, uva, país, região ou bodega..."/></div></section>
   <section className="shop-layout">
    <aside className={`filters ${filtersOpen?'mobile-open':''}`}><div className="filter-head"><h3>Filtros</h3><div><button onClick={reset}>Limpar</button><button className="filter-close" onClick={()=>setFiltersOpen(false)}>×</button></div></div><label>País<select value={country} onChange={e=>{setCountry(e.target.value);setPage(1)}}><option value="">Todos</option>{countries.map(x=><option key={x}>{x}</option>)}</select></label><label>Uva<select value={grape} onChange={e=>{setGrape(e.target.value);setPage(1)}}><option value="">Todas</option>{grapes.map(x=><option key={x}>{x}</option>)}</select></label><label>Bodega<select value={winery} onChange={e=>{setWinery(e.target.value);setPage(1)}}><option value="">Todas</option>{wineries.map(x=><option key={x}>{x}</option>)}</select></label><button className="apply-filters" onClick={()=>setFiltersOpen(false)}>Ver {filtered.length} rótulos</button></aside>
    <div className="shop-results"><div className="results-head"><div><h2>{filtered.length} rótulos</h2><span>{country||grape||winery||query?'Filtros ativos':'Todos os vinhos'}</span></div><button className="mobile-filter-btn" onClick={()=>setFiltersOpen(true)}><FilterIcon/> Filtrar</button></div>{wines.length===0?<p>Carregando catálogo...</p>:<div className="shop-grid">{visible.map(w=><ProductCard key={w.id} w={w} onAdd={add}/>)}</div>}<div className="pagination">{Array.from({length:pages},(_,i)=>i+1).map(n=><button className={n===page?'active':''} key={n} onClick={()=>{setPage(n);scrollTo({top:0,behavior:'smooth'})}}>{n}</button>)}</div></div>
   </section>
  </main>

  <aside className={`mobile-menu ${menuOpen?'open':''}`}><div className="mobile-menu-shell"><div className="mobile-menu-top"><img src={HEADER_LOGO} alt="Videira Vinhoteca"/><div><button className="mobile-menu-cart" onClick={()=>{setMenuOpen(false);setCartOpen(true)}} aria-label="Abrir carrinho"><CartIcon/>{cart.length>0&&<span>{cart.length}</span>}</button><button className="mobile-menu-close" onClick={()=>setMenuOpen(false)} aria-label="Fechar menu">×</button></div></div><nav className="mobile-menu-links"><a href="/">Início</a><a href="/loja">Loja</a><a href="/#vinhos">Vinhos</a><a href="/#uvas">Uvas</a><a href="/#bodegas">Bodegas</a><a href="/#sobre">Sobre nós</a><a href="/#faq">FAQ</a></nav></div></aside>{menuOpen&&<button className="menu-backdrop" onClick={()=>setMenuOpen(false)}/>}
  {filtersOpen&&<button className="filter-backdrop" onClick={()=>setFiltersOpen(false)}/>}
  <a className="whatsapp-float" href="https://wa.me/5545999056277" target="_blank"><WhatsIcon/></a>
  <aside className={`cart-drawer ${cartOpen?'open':''}`}><button className="drawer-close" onClick={()=>setCartOpen(false)}>×</button><p className="kicker dark">SEU CARRINHO</p><h2>Minha seleção</h2><div className="cart-items">{cart.length===0?<p className="empty">Seu carrinho está vazio.</p>:cart.map((p,i)=><div className="cart-item" key={i}><div><strong>{p.name}</strong><span>{p.winery}</span></div><div><b>{money(p.price)}</b><button onClick={()=>remove(i)}>Remover</button></div></div>)}</div><div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div><button className="checkout" disabled={!cart.length} onClick={checkout}>Continuar no WhatsApp</button></aside>{cartOpen&&<button className="backdrop" onClick={()=>setCartOpen(false)}/>}
 </>;
}

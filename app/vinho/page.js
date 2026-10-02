'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HEADER_LOGO } from '../brand';
import { loadCatalog, money, winePath, wineIdFromSlug } from '../catalogLoader';

function CartIcon(){return <svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7"/></svg>}
function MenuIcon(){return <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>}
function Arrow(){return <span>→</span>}
function Flag({code,name,className=''}){return code?<span className={`flag-wrap ${className}`}><img src={`https://flagcdn.com/w80/${code}.png`} alt={`Bandeira de ${name}`}/></span>:null}
function Bottle({wine}){return <div className="bottle-wrap"><div className={`bottle ${wine?.tone||'blend'}`}><div className="neck"/><div className="shoulder"/><div className="body"><div className="label"><b>{(wine?.name||'VINHO').slice(0,18)}</b><small>{(wine?.winery||'VIDEIRA').slice(0,18)}</small></div></div></div></div>}
function ProductVisual({wine}){return wine?.image_url?<img className="wine-photo detail-photo" src={wine.image_url} alt={wine.name}/>:<Bottle wine={wine}/>}
function Related({w}){return <a className="wine-card related-card" href={winePath(w)}><Flag code={w.flag} name={w.country} className="origin-flag"/><div className="wine-image"><ProductVisual wine={w}/></div><div className="wine-meta"><small>{w.country}</small><h3>{w.name}</h3><p>{w.winery}</p><span>{w.grapeDisplay||w.type||''}</span><div className="price-line"><strong>{money(w.price)}</strong><Arrow/></div></div></a>}
function Slider({children}){const ref=useRef(null);return <div ref={ref} className="horizontal-scroll product-row detail-related-row">{children}</div>}

export default function WinePage(){
 const pathname=usePathname();
 const slug=decodeURIComponent((pathname||'').split('/').filter(Boolean).pop()||'');
 const id=wineIdFromSlug(slug);
 const [wines,setWines]=useState([]),[qty,setQty]=useState(1),[cartOpen,setCartOpen]=useState(false),[cartCount,setCartCount]=useState(0),[menuOpen,setMenuOpen]=useState(false);
 useEffect(()=>{loadCatalog().then(setWines).catch(console.error)},[]);
 const wine=useMemo(()=>wines.find(w=>String(w.id)===String(id)),[wines,id]);
 const related=useMemo(()=>wine?wines.filter(w=>w.winery===wine.winery&&w.id!==wine.id).slice(0,12):[],[wines,wine]);
 useEffect(()=>{if(wine)document.title=`${wine.name} | Videira Vinhoteca`},[wine]);
 if(!wine)return <main className="policy-page"><a className="detail-back" href="/loja">← Voltar para loja</a><p>{wines.length?'Rótulo não encontrado.':'Carregando rótulo...'}</p></main>;
 const add=()=>{setCartCount(v=>v+qty);setCartOpen(true)};
 const quote=()=>window.open(`https://wa.me/5545999056277?text=${encodeURIComponent(`Olá! Gostaria de pedir um orçamento para ${qty} unidade(s) de ${wine.name} — ${wine.winery}.`)}`,'_blank','noopener,noreferrer');

 return <>
  <header className="floating-header"><div className="header-pill"><a className="header-logo" href="/"><img src={HEADER_LOGO} alt="Videira Vinhoteca"/></a><nav><a href="/">Início</a><a href="/loja">Vinhos</a><a href="/#uvas">Uvas</a><a href="/#bodegas">Bodegas</a><a href="/#sobre">Sobre nós</a><a href="/#faq">FAQ</a></nav><div className="header-actions"><button className="icon-btn cart-icon" onClick={()=>setCartOpen(true)}><CartIcon/>{cartCount>0&&<span>{cartCount}</span>}</button><a className="shop-pill" href="/loja">Loja <Arrow/></a><button className="icon-btn mobile-menu-btn" onClick={()=>setMenuOpen(true)} aria-label="Abrir menu"><MenuIcon/></button></div></div></header>

  <main className="wine-detail-page">
   <section className="wine-detail">
    <div className="detail-visual"><Flag code={wine.flag} name={wine.country} className="detail-flag"/><ProductVisual wine={wine}/></div>
    <div className="detail-info"><a className="detail-back" href="/loja">← Voltar para loja</a><p className="kicker dark">{[wine.country,wine.region].filter(Boolean).join(' · ')}</p><h1>{wine.name}</h1><a className="detail-winery" href={`/loja?bodega=${encodeURIComponent(wine.winery)}`}>{wine.winery}</a><p className="detail-grape">{wine.grapeDisplay||wine.type||''}</p><div className="wine-facts">{wine.alcohol&&<p><b>Álcool:</b> {wine.alcohol}</p>}{wine.aging&&<p><b>Amadurecimento:</b> {wine.aging}</p>}{wine.type&&<p><b>Estilo:</b> {wine.type}</p>}{wine.grape&&wine.filterGrape==='Blends'&&<p><b>Uvas:</b> {wine.grapeDisplay}</p>}</div>{wine.notes&&<div className="tasting-notes"><h3>Notas</h3><p>{wine.notes}</p></div>}<strong className="detail-price">{money(wine.price)}</strong><div className="detail-actions"><div className="qty"><button onClick={()=>setQty(v=>Math.max(1,v-1))}>−</button><span>{qty}</span><button onClick={()=>setQty(v=>v+1)}>+</button></div><button className="detail-add" onClick={add}>Adicionar ao carrinho</button><button className="detail-quote" onClick={quote}>Pedir orçamento no WhatsApp</button></div></div>
   </section>
   <section className="section-shell related-section"><div className="slider-head"><div><p className="kicker dark">DA MESMA BODEGA</p><h2>Mais de {wine.winery}</h2></div><a href={`/loja?bodega=${encodeURIComponent(wine.winery)}`}>Ver todos <Arrow/></a></div>{related.length?<Slider>{related.map(w=><Related key={w.id} w={w}/>)}</Slider>:<div className="related-empty">Em breve mais rótulos desta bodega.</div>}</section>
  </main>

  <aside className={`mobile-menu ${menuOpen?'open':''}`}><div className="mobile-menu-shell"><div className="mobile-menu-top"><img src={HEADER_LOGO} alt="Videira Vinhoteca"/><div><button className="mobile-menu-cart" onClick={()=>{setMenuOpen(false);setCartOpen(true)}}><CartIcon/></button><button className="mobile-menu-close" onClick={()=>setMenuOpen(false)}>×</button></div></div><nav className="mobile-menu-links"><a href="/">Início</a><a href="/loja">Loja</a><a href="/#vinhos">Vinhos</a><a href="/#uvas">Uvas</a><a href="/#bodegas">Bodegas</a><a href="/#sobre">Sobre nós</a><a href="/#faq">FAQ</a></nav></div></aside>{menuOpen&&<button className="menu-backdrop" onClick={()=>setMenuOpen(false)}/>}
  <aside className={`cart-drawer ${cartOpen?'open':''}`}><button className="drawer-close" onClick={()=>setCartOpen(false)}>×</button><p className="kicker dark">SEU CARRINHO</p><h2>Minha seleção</h2><div className="cart-items"><div className="cart-item"><div><strong>{wine.name}</strong><span>{qty} unidade(s)</span></div><div><b>{money(Number(wine.price||0)*qty)}</b></div></div></div><div className="cart-total"><span>Total</span><strong>{money(Number(wine.price||0)*qty)}</strong></div><button className="checkout" onClick={quote}>Continuar no WhatsApp</button></aside>{cartOpen&&<button className="backdrop" onClick={()=>setCartOpen(false)}/>}
 </>;
}

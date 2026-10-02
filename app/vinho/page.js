'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HEADER_LOGO } from '../brand';
import { loadWineById, loadRelatedWines, money, winePath, wineIdFromSlug } from '../catalogLoader';
import useCart from '../useCart';

function CartIcon(){return <svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7"/></svg>}
function MenuIcon(){return <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>}
function CloseIcon(){return <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>}
function Arrow(){return <span>→</span>}
function Flag({code,name,className=''}){return code?<span className={`flag-wrap ${className}`}><img src={`https://flagcdn.com/w80/${code}.png`} alt={`Bandeira de ${name}`}/></span>:null}
function Bottle({wine}){return <div className="bottle-wrap"><div className={`bottle ${wine?.tone||'blend'}`}><div className="neck"/><div className="shoulder"/><div className="body"><div className="label"><b>{(wine?.name||'VINHO').slice(0,18)}</b><small>{(wine?.winery||'VIDEIRA').slice(0,18)}</small></div></div></div></div>}
function ProductVisual({wine}){return wine?.image_url?<img className="wine-photo detail-photo" src={wine.image_url} alt={wine.name}/>:<Bottle wine={wine}/>}
function Related({w}){return <a className="wine-card related-card" href={winePath(w)}><Flag code={w.flag} name={w.country} className="origin-flag"/><div className="wine-image"><ProductVisual wine={w}/></div><div className="wine-meta"><small>{w.country}</small><h3>{w.name}</h3><p>{w.winery}</p><span>{w.grapeDisplay||w.type||''}</span><div className="price-line"><strong>{money(w.price)}</strong><Arrow/></div></div></a>}
function Slider({children}){const ref=useRef(null);return <div ref={ref} className="horizontal-scroll product-row detail-related-row">{children}</div>}

export default function WinePage(){
 const [slug,setSlug]=useState('');
 const [wine,setWine]=useState(null),[related,setRelated]=useState([]),[loading,setLoading]=useState(true),[qty,setQty]=useState(1),[cartOpen,setCartOpen]=useState(false),[menuOpen,setMenuOpen]=useState(false);
 const {cart,add,updateQty,remove,count:cartCount,total}=useCart();
 useEffect(()=>{const p=new URLSearchParams(window.location.search);setSlug(p.get('produto')||'')},[]);
 const id=wineIdFromSlug(slug);
 useEffect(()=>{if(!id)return;let alive=true;setLoading(true);loadWineById(id).then(async w=>{if(!alive)return;setWine(w);if(w){const r=await loadRelatedWines(w.winery,w.id,12);if(alive)setRelated(r)}}).catch(console.error).finally(()=>alive&&setLoading(false));return()=>{alive=false}},[id]);
 useEffect(()=>{if(wine)document.title=`${wine.name} | Videira Vinhoteca`},[wine]);
 if(!wine)return <main className="policy-page"><a className="detail-back" href="/loja">← Voltar para loja</a><p>{loading?'Carregando rótulo...':'Rótulo não encontrado.'}</p></main>;
 const addCurrent=()=>{add(wine,qty);setCartOpen(true)};
 const quote=()=>window.open(`https://wa.me/5545999056277?text=${encodeURIComponent(`Olá! Gostaria de pedir um orçamento para ${qty} unidade(s) de ${wine.name} — ${wine.winery}.`)}`,'_blank','noopener,noreferrer');

 return <>
  <header className="floating-header"><div className="header-pill"><a className="header-logo" href="/"><img src={HEADER_LOGO} alt="Videira Vinhoteca"/></a><nav><a href="/">Início</a><a href="/loja">Vinhos</a><a href="/#uvas">Uvas</a><a href="/#bodegas">Bodegas</a><a href="/#sobre">Sobre nós</a><a href="/#faq">FAQ</a></nav><div className="header-actions"><button className="icon-btn cart-icon" onClick={()=>setCartOpen(true)}><CartIcon/>{cartCount>0&&<span>{cartCount}</span>}</button><a className="shop-pill" href="/loja">Loja <Arrow/></a><button className={`icon-btn mobile-menu-btn ${menuOpen?'is-open':''}`} onClick={()=>setMenuOpen(v=>!v)} aria-label={menuOpen?'Fechar menu':'Abrir menu'}>{menuOpen?<CloseIcon/>:<MenuIcon/>}</button></div></div></header>

  <main className="wine-detail-page">
   <section className="wine-detail">
    <div className="detail-visual"><Flag code={wine.flag} name={wine.country} className="detail-flag"/><ProductVisual wine={wine}/></div>
    <div className="detail-info"><a className="detail-back" href="/loja">← Voltar para loja</a><p className="kicker dark">{[wine.country,wine.region].filter(Boolean).join(' · ')}</p><h1>{wine.name}</h1><a className="detail-winery" href={`/loja?bodega=${encodeURIComponent(wine.winery)}`}>{wine.winery}</a><p className="detail-grape">{wine.grapeDisplay||wine.type||''}</p><div className="wine-facts">{wine.alcohol&&<p><b>Álcool:</b> {wine.alcohol}</p>}{wine.aging&&<p><b>Amadurecimento:</b> {wine.aging}</p>}{wine.type&&<p><b>Estilo:</b> {wine.type}</p>}{wine.grape&&wine.filterGrape==='Blends'&&<p><b>Uvas:</b> {wine.grapeDisplay}</p>}</div>{wine.notes&&<div className="tasting-notes"><h3>Notas</h3><p>{wine.notes}</p></div>}<strong className="detail-price">{money(wine.price)}</strong>{wine.in_stock===false&&<div className="detail-stock-out">Sem estoque no momento</div>}<div className="detail-actions"><div className="qty"><button disabled={wine.in_stock===false} onClick={()=>setQty(v=>Math.max(1,v-1))}>−</button><input type="number" min="1" value={qty} disabled={wine.in_stock===false} onChange={e=>setQty(Math.max(1,Number(e.target.value)||1))}/><button disabled={wine.in_stock===false} onClick={()=>setQty(v=>v+1)}>+</button></div><button className="detail-add" disabled={wine.in_stock===false} onClick={addCurrent}>{wine.in_stock===false?'Sem estoque':'Adicionar ao carrinho'}</button><button className="detail-quote" onClick={quote}>Pedir orçamento no WhatsApp</button></div></div>
   </section>
   <section className="section-shell related-section"><div className="slider-head"><div><p className="kicker dark">DA MESMA BODEGA</p><h2>Mais de {wine.winery}</h2></div><a href={`/loja?bodega=${encodeURIComponent(wine.winery)}`}>Ver todos <Arrow/></a></div>{related.length?<Slider>{related.map(w=><Related key={w.id} w={w}/>)}</Slider>:<div className="related-empty">Em breve mais rótulos desta bodega.</div>}</section>
  </main>

  <aside className={`mobile-menu ${menuOpen?'open':''}`}><div className="mobile-menu-shell"><nav className="mobile-menu-links"><a href="/">Início</a><a href="/loja">Loja</a><a href="/#vinhos">Vinhos</a><a href="/#uvas">Uvas</a><a href="/#bodegas">Bodegas</a><a href="/#sobre">Sobre nós</a><a href="/#faq">FAQ</a></nav></div></aside>{menuOpen&&<button className="menu-backdrop" onClick={()=>setMenuOpen(false)}/>}
  <aside className={`cart-drawer ${cartOpen?'open':''}`}><button className="drawer-close" onClick={()=>setCartOpen(false)}>×</button><p className="kicker dark">SEU CARRINHO</p><h2>Minha seleção</h2><div className="cart-items">{cart.length===0?<p className="empty">Seu carrinho está vazio.</p>:cart.map(p=><div className="cart-item" key={p.id}><div><strong>{p.name}</strong><span>{p.winery}</span><div className="cart-qty"><button onClick={()=>updateQty(p.id,p.qty-1)}>−</button><input type="number" min="1" value={p.qty} onChange={e=>updateQty(p.id,e.target.value)}/><button onClick={()=>updateQty(p.id,p.qty+1)}>+</button></div></div><div><b>{money(Number(p.price||0)*p.qty)}</b><button onClick={()=>remove(p.id)}>Remover</button></div></div>)}</div><div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div><button className="checkout" disabled={!cart.length} onClick={()=>{const lines=cart.map(p=>`• ${p.qty}x ${p.name} — ${money(Number(p.price||0)*p.qty)}`).join('\n');window.open(`https://wa.me/5545999056277?text=${encodeURIComponent(`Olá! Quero consultar estes vinhos da Videira Vinhoteca:\n\n${lines}\n\nTotal: ${money(total)}`)}`,'_blank','noopener,noreferrer')}}>Continuar no WhatsApp</button></aside>{cartOpen&&<button className="backdrop" onClick={()=>setCartOpen(false)}/>}
 </>;
}

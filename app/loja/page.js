'use client';
import { useEffect, useMemo, useState } from 'react';
import { HEADER_LOGO } from '../brand';

const wines = [
  {id:1,name:'Catena Malbec',winery:'Catena Zapata',country:'Argentina',flag:'ar',grape:'Malbec',price:189.90,tone:'malbec',isNew:true},
  {id:2,name:'Marques de Casa Concha',winery:'Concha y Toro',country:'Chile',flag:'cl',grape:'Cabernet Sauvignon',price:259.90,tone:'cabernet',isNew:true},
  {id:3,name:'Brunello di Montalcino',winery:'Antinori',country:'Itália',flag:'it',grape:'Sangiovese',price:429.90,tone:'blend',isNew:false},
  {id:4,name:'Pinot Noir Reserva',winery:'Patagonia Select',country:'Argentina',flag:'ar',grape:'Pinot Noir',price:219.90,tone:'pinot',isNew:false},
  {id:5,name:'Chardonnay Gran Reserva',winery:'Casa del Valle',country:'Chile',flag:'cl',grape:'Chardonnay',price:169.90,tone:'gold',isNew:true},
  {id:6,name:'Bordeaux Supérieur',winery:'Maison Rouge',country:'França',flag:'fr',grape:'Blend',price:329.90,tone:'cabernet',isNew:false},
  {id:7,name:'Malbec Adrianna Vineyard',winery:'Catena Zapata',country:'Argentina',flag:'ar',grape:'Malbec',price:399.90,tone:'malbec',isNew:true},
  {id:8,name:'Malbec Estate',winery:'Rutini',country:'Argentina',flag:'ar',grape:'Malbec',price:279.90,tone:'blend',isNew:false},
  {id:9,name:'Gran Reserva Malbec',winery:'Luigi Bosca',country:'Argentina',flag:'ar',grape:'Malbec',price:249.90,tone:'malbec',isNew:true},
  {id:10,name:'Cabernet Franc',winery:'Salentein',country:'Argentina',flag:'ar',grape:'Cabernet Franc',price:229.90,tone:'cabernet',isNew:false},
  {id:11,name:'Sauvignon Blanc',winery:'Concha y Toro',country:'Chile',flag:'cl',grape:'Sauvignon Blanc',price:129.90,tone:'gold',isNew:true},
  {id:12,name:'Chianti Classico',winery:'Antinori',country:'Itália',flag:'it',grape:'Sangiovese',price:289.90,tone:'blend',isNew:false},
];

const regions = [
  {name:'Argentina',flag:'ar',sub:'Mendoza · Salta · Patagônia'},
  {name:'Chile',flag:'cl',sub:'Maipo · Colchagua · Casablanca'},
  {name:'Itália',flag:'it',sub:'Toscana · Piemonte · Veneto'},
  {name:'França',flag:'fr',sub:'Bordeaux · Borgonha · Rhône'},
];

const grapes = [
  ['Malbec','Macio e frutado'],
  ['Cabernet Sauvignon','Estruturado e intenso'],
  ['Pinot Noir','Delicado e fresco'],
  ['Chardonnay','Elegante e versátil'],
  ['Sauvignon Blanc','Cítrico e vibrante'],
];

const wineries = [
  ['Catena Zapata','Argentina','ar'],
  ['Concha y Toro','Chile','cl'],
  ['Antinori','Itália','it'],
  ['Maison Rouge','França','fr'],
  ['Rutini','Argentina','ar'],
];

function money(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function CartIcon(){return <svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7"/></svg>}
function SearchIcon(){return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>}
function Arrow(){return <span aria-hidden="true">→</span>}
function InstagramIcon(){return <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>}
function WhatsIcon(){return <img className="social-icon-img" src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="" draggable="false"/>}
function Flag({code,name,className=''}){return <span className={`flag-wrap ${className}`} title={name}><img src={`https://flagcdn.com/w80/${code}.png`} alt={`Bandeira de ${name}`} draggable="false"/></span>}
function Bottle({tone='malbec'}){return <div className="bottle-wrap"><div className={`bottle ${tone}`}><div className="neck"/><div className="shoulder"/><div className="body"><div className="label"><b>VIDEIRA</b><small>VINHOTECA</small></div></div></div></div>}
function ProductCard({w,onAdd}){return <article className="wine-card">
  <Flag code={w.flag} name={w.country} className="origin-flag"/>
  <div className="wine-image"><Bottle tone={w.tone}/></div>
  <div className="wine-meta">
    <small>{w.country}</small><h3>{w.name}</h3><p>{w.winery}</p><span>{w.grape}</span>
    <div className="price-line"><strong>{money(w.price)}</strong><button onClick={()=>onAdd(w)} aria-label={`Adicionar ${w.name}`}><CartIcon/></button></div>
  </div>
</article>}

export default function LojaPage(){
  const [cart,setCart]=useState([]);
  const [cartOpen,setCartOpen]=useState(false);
  const [page,setPage]=useState(1);
  const [country,setCountry]=useState('');
  const [grape,setGrape]=useState('');
  const [winery,setWinery]=useState('');
  const [onlyNew,setOnlyNew]=useState(false);
  const [query,setQuery]=useState('');

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    setCountry(params.get('pais')||'');
    setGrape(params.get('uva')||'');
    setWinery(params.get('bodega')||'');
    setOnlyNew(params.get('novidades')==='1');
  },[]);
  const perPage=8;

  const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return wines.filter(w=>(!country||w.country===country)&&(!grape||w.grape===grape)&&(!winery||w.winery===winery)&&(!onlyNew||w.isNew)&&(!q||[w.name,w.winery,w.country,w.grape].some(v=>v.toLowerCase().includes(q))))},[country,grape,winery,onlyNew,query]);
  const pages=Math.max(1,Math.ceil(filtered.length/perPage));
  const visible=filtered.slice((page-1)*perPage,page*perPage);
  const total=cart.reduce((s,p)=>s+p.price,0);
  const add=p=>setCart(v=>[...v,p]);
  const remove=i=>setCart(v=>v.filter((_,idx)=>idx!==i));
  const reset=()=>{setCountry('');setGrape('');setWinery('');setOnlyNew(false);setQuery('');setPage(1)};
  const checkout=()=>{const lines=cart.map(p=>`• ${p.name} — ${money(p.price)}`).join('\n');const msg=encodeURIComponent(`Olá! Quero consultar estes vinhos da Videira Vinhoteca:\n\n${lines}\n\nTotal: ${money(total)}`);window.open(`https://wa.me/5545999056277?text=${msg}`,'_blank','noopener,noreferrer')};

  return <>
    <header className="floating-header"><div className="header-pill">
      <a className="header-logo" href="/"><img src={HEADER_LOGO} alt="Videira Vinhoteca"/></a>
      <nav><a href="/">Início</a><a href="/#vinhos">Vinhos</a><a href="/#uvas">Uvas</a><a href="/#bodegas">Bodegas</a><a href="/#sobre">Sobre nós</a><a href="/#faq">FAQ</a></nav>
      <div className="header-actions"><button className="icon-btn search-btn"><SearchIcon/></button><button className="icon-btn cart-icon" onClick={()=>setCartOpen(true)}><CartIcon/>{cart.length>0&&<span>{cart.length}</span>}</button><a className="shop-pill active" href="/loja">Loja <Arrow/></a></div>
    </div></header>

    <main className="shop-page">
      <section className="shop-search-wrap"><div className="shop-search"><SearchIcon/><input value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}} placeholder="Pesquise por vinho, uva, país ou bodega..." aria-label="Pesquisar vinhos"/></div></section>
      <section className="shop-layout">
        <aside className="filters">
          <div className="filter-head"><h3>Filtros</h3><button onClick={reset}>Limpar</button></div>
          <label>País<select value={country} onChange={e=>{setCountry(e.target.value);setPage(1)}}><option value="">Todos</option>{regions.map(r=><option key={r.name}>{r.name}</option>)}</select></label>
          <label>Uva<select value={grape} onChange={e=>{setGrape(e.target.value);setPage(1)}}><option value="">Todas</option>{[...new Set(wines.map(w=>w.grape))].map(g=><option key={g}>{g}</option>)}</select></label>
          <label>Bodega<select value={winery} onChange={e=>{setWinery(e.target.value);setPage(1)}}><option value="">Todas</option>{[...new Set(wines.map(w=>w.winery))].map(b=><option key={b}>{b}</option>)}</select></label>
          <label className="check-line"><input type="checkbox" checked={onlyNew} onChange={e=>{setOnlyNew(e.target.checked);setPage(1)}}/> Somente novidades</label>
        </aside>
        <div className="shop-results">
          <div className="results-head"><h2>{filtered.length} rótulos</h2><span>{country||grape||winery||onlyNew?'Filtros ativos':'Todos os vinhos'}</span></div>
          <div className="shop-grid">{visible.map(w=><ProductCard w={w} onAdd={add} key={w.id}/>)}</div>
          <div className="pagination">{Array.from({length:pages},(_,i)=>i+1).map(n=><button className={n===page?'active':''} key={n} onClick={()=>{setPage(n);window.scrollTo({top:0,behavior:'smooth'})}}>{n}</button>)}</div>
        </div>
      </section>
    </main>

    <a className="whatsapp-float" href="https://wa.me/5545999056277" target="_blank" rel="noreferrer"><WhatsIcon/></a>
    <aside className={`cart-drawer ${cartOpen?'open':''}`}><button className="drawer-close" onClick={()=>setCartOpen(false)}>×</button><p className="kicker dark">SEU CARRINHO</p><h2>Minha seleção</h2><div className="cart-items">{cart.length===0?<p className="empty">Seu carrinho está vazio.</p>:cart.map((p,i)=><div className="cart-item" key={`${p.id}-${i}`}><div><strong>{p.name}</strong><span>{p.winery}</span></div><div><b>{money(p.price)}</b><button onClick={()=>remove(i)}>Remover</button></div></div>)}</div><div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div><button className="checkout" disabled={!cart.length} onClick={checkout}>Continuar no WhatsApp</button></aside>
    {cartOpen&&<button className="backdrop" onClick={()=>setCartOpen(false)}/>}
  </>
}
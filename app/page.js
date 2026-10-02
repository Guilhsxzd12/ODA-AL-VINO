'use client';
import { useMemo, useState } from 'react';

const wines = [
  {id:1,name:'Catena Malbec',winery:'Catena Zapata',country:'Argentina',flag:'🇦🇷',grape:'Malbec',price:189.90,tone:'malbec',isNew:true},
  {id:2,name:'Marques de Casa Concha',winery:'Concha y Toro',country:'Chile',flag:'🇨🇱',grape:'Cabernet Sauvignon',price:259.90,tone:'cabernet',isNew:true},
  {id:3,name:'Brunello di Montalcino',winery:'Antinori',country:'Itália',flag:'🇮🇹',grape:'Sangiovese',price:429.90,tone:'blend',isNew:false},
  {id:4,name:'Pinot Noir Reserva',winery:'Patagonia Select',country:'Argentina',flag:'🇦🇷',grape:'Pinot Noir',price:219.90,tone:'pinot',isNew:false},
  {id:5,name:'Chardonnay Gran Reserva',winery:'Casa del Valle',country:'Chile',flag:'🇨🇱',grape:'Chardonnay',price:169.90,tone:'gold',isNew:true},
  {id:6,name:'Bordeaux Supérieur',winery:'Maison Rouge',country:'França',flag:'🇫🇷',grape:'Blend',price:329.90,tone:'cabernet',isNew:false},
  {id:7,name:'Malbec Adrianna Vineyard',winery:'Catena Zapata',country:'Argentina',flag:'🇦🇷',grape:'Malbec',price:399.90,tone:'malbec',isNew:true},
  {id:8,name:'Malbec Estate',winery:'Rutini',country:'Argentina',flag:'🇦🇷',grape:'Malbec',price:279.90,tone:'blend',isNew:false},
  {id:9,name:'Gran Reserva Malbec',winery:'Luigi Bosca',country:'Argentina',flag:'🇦🇷',grape:'Malbec',price:249.90,tone:'malbec',isNew:true},
  {id:10,name:'Cabernet Franc',winery:'Salentein',country:'Argentina',flag:'🇦🇷',grape:'Cabernet Franc',price:229.90,tone:'cabernet',isNew:false},
  {id:11,name:'Sauvignon Blanc',winery:'Concha y Toro',country:'Chile',flag:'🇨🇱',grape:'Sauvignon Blanc',price:129.90,tone:'gold',isNew:true},
  {id:12,name:'Chianti Classico',winery:'Antinori',country:'Itália',flag:'🇮🇹',grape:'Sangiovese',price:289.90,tone:'blend',isNew:false},
];

const regions = [
  {name:'Argentina',flag:'🇦🇷',sub:'Mendoza · Salta · Patagônia'},
  {name:'Chile',flag:'🇨🇱',sub:'Maipo · Colchagua · Casablanca'},
  {name:'Itália',flag:'🇮🇹',sub:'Toscana · Piemonte · Veneto'},
  {name:'França',flag:'🇫🇷',sub:'Bordeaux · Borgonha · Rhône'},
];

const grapes = [
  ['Malbec','Macio e frutado'],
  ['Cabernet Sauvignon','Estruturado e intenso'],
  ['Pinot Noir','Delicado e fresco'],
  ['Chardonnay','Elegante e versátil'],
  ['Sauvignon Blanc','Cítrico e vibrante'],
];

const wineries = [
  ['Catena Zapata','Argentina','🇦🇷'],
  ['Concha y Toro','Chile','🇨🇱'],
  ['Antinori','Itália','🇮🇹'],
  ['Maison Rouge','França','🇫🇷'],
  ['Rutini','Argentina','🇦🇷'],
];

function money(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function CartIcon(){return <svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7"/></svg>}
function SearchIcon(){return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>}
function Arrow(){return <span aria-hidden="true">→</span>}
function InstagramIcon(){return <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>}
function WhatsIcon(){return <svg viewBox="0 0 24 24"><path d="M20 11.8a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.8Z"/><path d="M9 8.5c.3 2.1 1.4 4 3.2 5.2 1 .7 2.1 1.1 3.3 1.2l1-1.4-2-.9-1 1c-1.5-.7-2.7-1.8-3.5-3.3l1-1.1-.8-2-1.2 1.3Z"/></svg>}
function Bottle({tone='malbec'}){return <div className="bottle-wrap"><div className={`bottle ${tone}`}><div className="neck"/><div className="shoulder"/><div className="body"><div className="label"><b>VIDEIRA</b><small>VINHOTECA</small></div></div></div></div>}
function ProductCard({w,onAdd}){return <article className="wine-card">
  <span className="origin-flag" title={w.country}>{w.flag}</span>
  <div className="wine-image"><Bottle tone={w.tone}/></div>
  <div className="wine-meta">
    <small>{w.country}</small><h3>{w.name}</h3><p>{w.winery}</p><span>{w.grape}</span>
    <div className="price-line"><strong>{money(w.price)}</strong><button onClick={()=>onAdd(w)} aria-label={`Adicionar ${w.name}`}><CartIcon/></button></div>
  </div>
</article>}

export default function Page(){
  const [cart,setCart]=useState([]);
  const [cartOpen,setCartOpen]=useState(false);
  const total=useMemo(()=>cart.reduce((s,p)=>s+p.price,0),[cart]);
  const add=(p)=>setCart(v=>[...v,p]);
  const remove=(i)=>setCart(v=>v.filter((_,idx)=>idx!==i));
  const checkout=()=>{const lines=cart.map(p=>`• ${p.name} — ${money(p.price)}`).join('\n');const msg=encodeURIComponent(`Olá! Quero consultar estes vinhos da Videira Vinhoteca:\n\n${lines}\n\nTotal: ${money(total)}`);window.open(`https://wa.me/5545999056277?text=${msg}`,'_blank','noopener,noreferrer')};

  const malbecs=wines.filter(w=>w.grape==='Malbec');
  const novidades=wines.filter(w=>w.isNew);

  return <>
    <header className="floating-header"><div className="header-pill">
      <a className="header-logo" href="#inicio"><img src="/videira-logo.svg" alt="Videira Vinhoteca"/></a>
      <nav><a href="#inicio">Início</a><a href="#vinhos">Vinhos</a><a href="#uvas">Uvas</a><a href="#bodegas">Bodegas</a></nav>
      <div className="header-actions">
        <button className="icon-btn search-btn" aria-label="Buscar"><SearchIcon/></button>
        <button className="icon-btn cart-icon" onClick={()=>setCartOpen(true)} aria-label="Abrir carrinho"><CartIcon/>{cart.length>0&&<span>{cart.length}</span>}</button>
        <a className="shop-pill" href="/loja">Loja <Arrow/></a>
      </div>
    </div></header>

    <main>
      <section id="inicio" className="hero-clean">
        <div className="hero-text"><p className="kicker">CURADORIA DE VINHOS</p><h1>Grandes vinhos,<br/>bons momentos.</h1><p>Uma seleção de rótulos do mundo todo, escolhidos para quem gosta de descobrir novas histórias em cada taça.</p><a className="primary-btn" href="/loja">Ver catálogo <Arrow/></a></div>
        <div className="hero-product"><Bottle tone="malbec"/><div className="hero-note"><span>DESTAQUE</span><strong>Malbec Reserva</strong><small>Mendoza · Argentina</small></div></div>
      </section>

      <section className="regions-strip section-shell">
        <div className="slider-head"><h2>Explore por país</h2><a href="/loja">Ver todos <Arrow/></a></div>
        <div className="horizontal-scroll compact">
          {regions.map((r,i)=><a href={`/loja?pais=${encodeURIComponent(r.name)}`} className={`region-card region-${i+1}`} key={r.name}><span className="country-flag">{r.flag}</span><div><strong>{r.name}</strong><span>{r.sub}</span></div><Arrow/></a>)}
        </div>
      </section>

      <section id="vinhos" className="section-shell products-section">
        <div className="slider-head"><div><p className="kicker dark">NOSSA SELEÇÃO</p><h2>Vinhos em destaque</h2></div><a href="/loja">Ver todos <Arrow/></a></div>
        <div className="horizontal-scroll product-row">{wines.slice(0,8).map(w=><ProductCard w={w} onAdd={add} key={w.id}/>)}</div>
      </section>

      <section className="section-shell products-section">
        <div className="slider-head"><div><p className="kicker dark">RECÉM-CHEGADOS</p><h2>Novidades</h2></div><a href="/loja?novidades=1">Ver todas <Arrow/></a></div>
        <div className="horizontal-scroll product-row">{novidades.map(w=><ProductCard w={w} onAdd={add} key={w.id}/>)}</div>
      </section>

      <section className="section-shell products-section">
        <div className="slider-head"><div><p className="kicker dark">UMA UVA, MUITOS ESTILOS</p><h2>Malbecs</h2></div><a href="/loja?uva=Malbec">Ver todos <Arrow/></a></div>
        <div className="horizontal-scroll product-row">{malbecs.map(w=><ProductCard w={w} onAdd={add} key={w.id}/>)}</div>
      </section>

      <section id="uvas" className="section-shell">
        <div className="slider-head"><div><p className="kicker dark">DESCUBRA SEU ESTILO</p><h2>Por uva</h2></div><a href="/loja">Ver todas <Arrow/></a></div>
        <div className="horizontal-scroll grape-row">{grapes.map(([name,desc],i)=><a href={`/loja?uva=${encodeURIComponent(name)}`} className={`grape-tile grape-${i+1}`} key={name}><div><strong>{name}</strong><span>{desc}</span></div><Arrow/></a>)}</div>
      </section>

      <section id="bodegas" className="section-shell">
        <div className="slider-head"><div><p className="kicker dark">PRODUTORES</p><h2>Bodegas em destaque</h2></div><a href="/loja">Ver todas <Arrow/></a></div>
        <div className="horizontal-scroll winery-row">{wineries.map(([name,country,flag],i)=><a href={`/loja?bodega=${encodeURIComponent(name)}`} className={`winery-card winery-${i+1}`} key={name}><span className="country-flag small">{flag}</span><div><strong>{name}</strong><span>{country}</span></div><Arrow/></a>)}</div>
      </section>
    </main>

    <footer>
      <div className="footer-brand"><img src="/videira-logo.svg" alt="Videira Vinhoteca"/><p>Curadoria de vinhos com identidade.</p></div>
      <div className="footer-columns">
        <div><h4>Menu</h4><a href="#inicio">Início</a><a href="/loja">Loja</a><a href="#uvas">Uvas</a><a href="#bodegas">Bodegas</a></div>
        <div><h4>Políticas</h4><a href="#">Privacidade</a><a href="#">Trocas e devoluções</a><a href="#">Termos de uso</a></div>
      </div>
      <div className="footer-contact"><div className="socials"><a href="https://instagram.com/Videiravinhoteca" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon/></a><a href="https://wa.me/5545999056277" target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsIcon/></a></div><span>@Videiravinhoteca</span><span>CNPJ 69.423.008/0001-67</span></div>
    </footer>

    <a className="whatsapp-float" href="https://wa.me/5545999056277" target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsIcon/></a>

    <aside className={`cart-drawer ${cartOpen?'open':''}`}>
      <button className="drawer-close" onClick={()=>setCartOpen(false)}>×</button><p className="kicker dark">SEU CARRINHO</p><h2>Minha seleção</h2>
      <div className="cart-items">{cart.length===0?<p className="empty">Seu carrinho está vazio.</p>:cart.map((p,i)=><div className="cart-item" key={`${p.id}-${i}`}><div><strong>{p.name}</strong><span>{p.winery}</span></div><div><b>{money(p.price)}</b><button onClick={()=>remove(i)}>Remover</button></div></div>)}</div>
      <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div><button className="checkout" disabled={!cart.length} onClick={checkout}>Continuar no WhatsApp</button>
    </aside>
    {cartOpen&&<button className="backdrop" onClick={()=>setCartOpen(false)} aria-label="Fechar carrinho"/>}
  </>
}
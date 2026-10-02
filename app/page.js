'use client';

import { useMemo, useState } from 'react';

const wines = [
  {id:1,name:'Catena Malbec',winery:'Catena Zapata',country:'Argentina',grape:'Malbec',price:189.90,tone:'malbec'},
  {id:2,name:'Marques de Casa Concha',winery:'Concha y Toro',country:'Chile',grape:'Cabernet Sauvignon',price:259.90,tone:'cabernet'},
  {id:3,name:'Brunello di Montalcino',winery:'Altesino',country:'Itália',grape:'Sangiovese',price:429.90,tone:'blend'},
  {id:4,name:'Pinot Noir Reserva',winery:'Patagonia Select',country:'Argentina',grape:'Pinot Noir',price:219.90,tone:'pinot'},
  {id:5,name:'Chardonnay Gran Reserva',winery:'Casa del Valle',country:'Chile',grape:'Chardonnay',price:169.90,tone:'gold'},
  {id:6,name:'Bordeaux Supérieur',winery:'Maison Rouge',country:'França',grape:'Blend',price:329.90,tone:'cabernet'},
];

const regions = [
  {name:'Argentina',sub:'Mendoza · Salta · Patagônia'},
  {name:'Chile',sub:'Maipo · Colchagua · Casablanca'},
  {name:'Itália',sub:'Toscana · Piemonte · Veneto'},
  {name:'França',sub:'Bordeaux · Borgonha · Rhône'},
];

const grapes = [
  ['Malbec','Macio e frutado'],
  ['Cabernet Sauvignon','Estruturado e intenso'],
  ['Pinot Noir','Delicado e fresco'],
  ['Chardonnay','Elegante e versátil'],
  ['Sauvignon Blanc','Cítrico e vibrante'],
];

const wineries = [
  ['Catena Zapata','Argentina'],
  ['Concha y Toro','Chile'],
  ['Antinori','Itália'],
  ['Maison Rouge','França'],
];

function money(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}

function CartIcon(){return <svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7"/></svg>}
function SearchIcon(){return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>}
function Arrow(){return <span aria-hidden="true">→</span>}

function Bottle({tone='malbec'}){
  return <div className="bottle-wrap"><div className={`bottle ${tone}`}><div className="neck"/><div className="shoulder"/><div className="body"><div className="label"><b>VIDEIRA</b><small>VINHOTECA</small></div></div></div></div>
}

export default function Page(){
  const [cart,setCart]=useState([]);
  const [cartOpen,setCartOpen]=useState(false);
  const total=useMemo(()=>cart.reduce((s,p)=>s+p.price,0),[cart]);

  const add=(p)=>{setCart(v=>[...v,p]);setCartOpen(true)};
  const remove=(i)=>setCart(v=>v.filter((_,idx)=>idx!==i));
  const checkout=()=>{
    const lines=cart.map(p=>`• ${p.name} — ${money(p.price)}`).join('\n');
    const msg=encodeURIComponent(`Olá! Quero consultar estes vinhos da Videira Vinhoteca:\n\n${lines}\n\nTotal: ${money(total)}`);
    window.open(`https://wa.me/5545999056277?text=${msg}`,'_blank','noopener,noreferrer');
  };

  return <>
    <header className="floating-header">
      <div className="header-pill">
        <a className="header-logo" href="#inicio"><img src="/videira-logo.svg" alt="Videira Vinhoteca"/></a>
        <nav>
          <a href="#inicio">Início</a>
          <a href="#vinhos">Vinhos</a>
          <a href="#uvas">Uvas</a>
          <a href="#bodegas">Bodegas</a>
        </nav>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Buscar"><SearchIcon/></button>
          <button className="icon-btn cart-icon" onClick={()=>setCartOpen(true)} aria-label="Abrir carrinho">
            <CartIcon/>{cart.length>0&&<span>{cart.length}</span>}
          </button>
        </div>
      </div>
    </header>

    <main>
      <section id="inicio" className="hero-clean">
        <div className="hero-text">
          <p className="kicker">CURADORIA DE VINHOS</p>
          <h1>Grandes vinhos,<br/>bons momentos.</h1>
          <p>Uma seleção de rótulos do mundo todo, escolhidos para quem gosta de descobrir novas histórias em cada taça.</p>
          <a className="primary-btn" href="#vinhos">Ver catálogo <Arrow/></a>
        </div>
        <div className="hero-product">
          <Bottle tone="malbec"/>
          <div className="hero-note"><span>DESTAQUE</span><strong>Malbec Reserva</strong><small>Mendoza · Argentina</small></div>
        </div>
      </section>

      <section className="regions-strip section-shell">
        <div className="slider-head"><h2>Explore por região</h2><a href="#bodegas">Ver todas <Arrow/></a></div>
        <div className="horizontal-scroll compact">
          {regions.map((r,i)=><a href="#vinhos" className={`region-card region-${i+1}`} key={r.name}><div><strong>{r.name}</strong><span>{r.sub}</span></div><Arrow/></a>)}
        </div>
      </section>

      <section id="vinhos" className="section-shell products-section">
        <div className="slider-head"><div><p className="kicker dark">NOSSA SELEÇÃO</p><h2>Vinhos em destaque</h2></div><a href="#vinhos">Ver todos <Arrow/></a></div>
        <div className="horizontal-scroll product-row">
          {wines.map(w=><article className="wine-card" key={w.id}>
            <button className="heart" aria-label="Favoritar">♡</button>
            <div className="wine-image"><Bottle tone={w.tone}/></div>
            <div className="wine-meta">
              <small>{w.country}</small>
              <h3>{w.name}</h3>
              <p>{w.winery}</p>
              <span>{w.grape}</span>
              <div className="price-line"><strong>{money(w.price)}</strong><button onClick={()=>add(w)} aria-label={`Adicionar ${w.name}`}><CartIcon/></button></div>
            </div>
          </article>)}
        </div>
      </section>

      <section id="uvas" className="section-shell">
        <div className="slider-head"><div><p className="kicker dark">DESCUBRA SEU ESTILO</p><h2>Por uva</h2></div><a href="#vinhos">Ver todas <Arrow/></a></div>
        <div className="horizontal-scroll grape-row">
          {grapes.map(([name,desc],i)=><a href="#vinhos" className={`grape-tile grape-${i+1}`} key={name}><div><strong>{name}</strong><span>{desc}</span></div><Arrow/></a>)}
        </div>
      </section>

      <section id="bodegas" className="section-shell">
        <div className="slider-head"><div><p className="kicker dark">PRODUTORES</p><h2>Bodegas em destaque</h2></div><a href="#vinhos">Ver todas <Arrow/></a></div>
        <div className="horizontal-scroll winery-row">
          {wineries.map(([name,country],i)=><a href="#vinhos" className={`winery-card winery-${i+1}`} key={name}><div><strong>{name}</strong><span>{country}</span></div><Arrow/></a>)}
        </div>
      </section>

      <section className="story-banner section-shell">
        <div>
          <p className="kicker">SELEÇÃO VIDEIRA</p>
          <h2>Rótulos que contam histórias.</h2>
          <p>Descubra vinhos que traduzem o melhor de cada terroir.</p>
          <a className="secondary-btn" href="#bodegas">Explorar bodegas <Arrow/></a>
        </div>
      </section>
    </main>

    <footer>
      <div className="footer-brand"><img src="/videira-logo.svg" alt="Videira Vinhoteca"/><p>Curadoria de vinhos com identidade.</p></div>
      <div className="footer-center"><a href="#inicio">Início</a><a href="#vinhos">Vinhos</a><a href="#uvas">Uvas</a><a href="#bodegas">Bodegas</a></div>
      <div className="footer-contact"><a href="https://instagram.com/Videiravinhoteca" target="_blank" rel="noreferrer">@Videiravinhoteca</a><a href="https://wa.me/5545999056277" target="_blank" rel="noreferrer">WhatsApp</a><span>CNPJ 69.423.008/0001-67</span></div>
    </footer>

    <a className="whatsapp-float" href="https://wa.me/5545999056277" target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a>

    <aside className={`cart-drawer ${cartOpen?'open':''}`}>
      <button className="drawer-close" onClick={()=>setCartOpen(false)}>×</button>
      <p className="kicker dark">SEU CARRINHO</p>
      <h2>Minha seleção</h2>
      <div className="cart-items">
        {cart.length===0?<p className="empty">Seu carrinho está vazio.</p>:cart.map((p,i)=><div className="cart-item" key={`${p.id}-${i}`}><div><strong>{p.name}</strong><span>{p.winery}</span></div><div><b>{money(p.price)}</b><button onClick={()=>remove(i)}>Remover</button></div></div>)}
      </div>
      <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>
      <button className="checkout" disabled={!cart.length} onClick={checkout}>Finalizar pelo WhatsApp</button>
    </aside>
    {cartOpen&&<button className="backdrop" onClick={()=>setCartOpen(false)} aria-label="Fechar carrinho"/>}
  </>
}
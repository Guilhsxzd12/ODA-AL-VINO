'use client';
import { useMemo, useRef, useState } from 'react';

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
function Flag({code,name,className=''}){return <span className={`flag-wrap ${className}`} title={name}><img src={`https://flagcdn.com/w80/${code}.png`} alt={`Bandeira de ${name}`} draggable="false"/></span>}
function DragSlider({children,className=''}){const ref=useRef(null);const state=useRef({down:false,x:0,left:0,moved:false});const down=e=>{const el=ref.current;if(!el)return;state.current={down:true,x:e.clientX,left:el.scrollLeft,moved:false};el.setPointerCapture?.(e.pointerId);el.classList.add('dragging')};const move=e=>{const el=ref.current;if(!el||!state.current.down)return;const dx=e.clientX-state.current.x;if(Math.abs(dx)>4)state.current.moved=true;el.scrollLeft=state.current.left-dx;e.preventDefault()};const up=e=>{const el=ref.current;if(!el)return;state.current.down=false;el.classList.remove('dragging');el.releasePointerCapture?.(e.pointerId)};const click=e=>{if(state.current.moved){e.preventDefault();e.stopPropagation();state.current.moved=false}};return <div ref={ref} className={`horizontal-scroll drag-slider ${className}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClickCapture={click}>{children}</div>}
function Bottle({tone='malbec'}){return <div className="bottle-wrap"><div className={`bottle ${tone}`}><div className="neck"/><div className="shoulder"/><div className="body"><div className="label"><b>VIDEIRA</b><small>VINHOTECA</small></div></div></div></div>}
function ProductCard({w,onAdd}){return <article className="wine-card">
  <Flag code={w.flag} name={w.country} className="origin-flag"/>
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
      <nav><a className="active" href="#inicio">Início</a><a href="#vinhos">Vinhos</a><a href="#uvas">Uvas</a><a href="#bodegas">Bodegas</a><a href="#sobre">Sobre nós</a><a href="#faq">FAQ</a></nav>
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
        <DragSlider className="compact">
          {regions.map((r,i)=><a href={`/loja?pais=${encodeURIComponent(r.name)}`} className={`region-card region-${i+1}`} key={r.name}><Flag code={r.flag} name={r.name} className="country-flag"/><div><strong>{r.name}</strong><span>{r.sub}</span></div><Arrow/></a>)}
        </DragSlider>
      </section>

      <section id="vinhos" className="section-shell products-section">
        <div className="slider-head"><div><p className="kicker dark">NOSSA SELEÇÃO</p><h2>Vinhos em destaque</h2></div><a href="/loja">Ver todos <Arrow/></a></div>
        <DragSlider className="product-row">{wines.slice(0,8).map(w=><ProductCard w={w} onAdd={add} key={w.id}/>)}</DragSlider>
      </section>

      <section className="section-shell products-section">
        <div className="slider-head"><div><p className="kicker dark">RECÉM-CHEGADOS</p><h2>Novidades</h2></div><a href="/loja?novidades=1">Ver todas <Arrow/></a></div>
        <DragSlider className="product-row">{novidades.map(w=><ProductCard w={w} onAdd={add} key={w.id}/>)}</DragSlider>
      </section>

      <section className="section-shell products-section">
        <div className="slider-head"><div><p className="kicker dark">UMA UVA, MUITOS ESTILOS</p><h2>Malbecs</h2></div><a href="/loja?uva=Malbec">Ver todos <Arrow/></a></div>
        <DragSlider className="product-row">{malbecs.map(w=><ProductCard w={w} onAdd={add} key={w.id}/>)}</DragSlider>
      </section>

      <section id="uvas" className="section-shell">
        <div className="slider-head"><div><p className="kicker dark">DESCUBRA SEU ESTILO</p><h2>Por uva</h2></div><a href="/loja">Ver todas <Arrow/></a></div>
        <DragSlider className="grape-row">{grapes.map(([name,desc],i)=><a href={`/loja?uva=${encodeURIComponent(name)}`} className={`grape-tile grape-${i+1}`} key={name}><div><strong>{name}</strong><span>{desc}</span></div><Arrow/></a>)}</DragSlider>
      </section>

      <section id="bodegas" className="section-shell">
        <div className="slider-head"><div><p className="kicker dark">PRODUTORES</p><h2>Bodegas em destaque</h2></div><a href="/loja">Ver todas <Arrow/></a></div>
        <DragSlider className="winery-row">{wineries.map(([name,country,flag],i)=><a href={`/loja?bodega=${encodeURIComponent(name)}`} className={`winery-card winery-${i+1}`} key={name}><Flag code={flag} name={country} className="country-flag small"/><div><strong>{name}</strong><span>{country}</span></div><Arrow/></a>)}</DragSlider>
      </section>

      <section id="sobre" className="section-shell about-section">
        <div className="slider-head"><div><p className="kicker dark">VIDEIRA VINHOTECA</p><h2>Sobre nós</h2></div></div>
        <div className="about-card"><p>Selecionamos vinhos com identidade, boa procedência e histórias que merecem ser compartilhadas. A Videira Vinhoteca foi pensada para tornar a descoberta de novos rótulos simples, elegante e próxima.</p></div>
      </section>

      <section id="faq" className="section-shell faq-section">
        <div className="slider-head"><div><p className="kicker dark">DÚVIDAS FREQUENTES</p><h2>FAQ</h2></div></div>
        <div className="faq-list">
          <details><summary>Como faço um pedido?</summary><p>Adicione os rótulos ao carrinho e clique em “Continuar no WhatsApp”.</p></details>
          <details><summary>Posso filtrar os vinhos?</summary><p>Sim. Na Loja você pode filtrar por país, uva, bodega e novidades.</p></details>
          <details><summary>Vocês entregam para outras cidades?</summary><p>Consulte disponibilidade, prazo e frete diretamente pelo WhatsApp.</p></details>
        </div>
      </section>
    </main>

    <footer>
      <div className="footer-brand"><img src="/videira-logo.svg" alt="Videira Vinhoteca"/><p>Curadoria de vinhos com identidade.</p></div>
      <div className="footer-columns">
        <div><h4>Menu</h4><a href="#inicio">Início</a><a href="/loja">Loja</a><a href="#uvas">Uvas</a><a href="#bodegas">Bodegas</a></div>
        <div><h4>Políticas</h4><a href="#">Privacidade</a><a href="#">Trocas e devoluções</a><a href="#">Termos de uso</a></div>
      </div>
      <div className="footer-contact"><h4>Redes sociais</h4><div className="socials"><a href="https://instagram.com/Videiravinhoteca" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon/></a><a href="https://wa.me/5545999056277" target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsIcon/></a></div><span>@Videiravinhoteca</span><span>CNPJ 69.423.008/0001-67</span></div>
    </footer>
    <div className="site-bottom">© 2026 Videira Vinhoteca · @Videiravinhoteca · CNPJ 69.423.008/0001-67</div>

    <a className="whatsapp-float" href="https://wa.me/5545999056277" target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsIcon/></a>

    <aside className={`cart-drawer ${cartOpen?'open':''}`}>
      <button className="drawer-close" onClick={()=>setCartOpen(false)}>×</button><p className="kicker dark">SEU CARRINHO</p><h2>Minha seleção</h2>
      <div className="cart-items">{cart.length===0?<p className="empty">Seu carrinho está vazio.</p>:cart.map((p,i)=><div className="cart-item" key={`${p.id}-${i}`}><div><strong>{p.name}</strong><span>{p.winery}</span></div><div><b>{money(p.price)}</b><button onClick={()=>remove(i)}>Remover</button></div></div>)}</div>
      <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div><button className="checkout" disabled={!cart.length} onClick={checkout}>Continuar no WhatsApp</button>
    </aside>
    {cartOpen&&<button className="backdrop" onClick={()=>setCartOpen(false)} aria-label="Fechar carrinho"/>}
  </>
}
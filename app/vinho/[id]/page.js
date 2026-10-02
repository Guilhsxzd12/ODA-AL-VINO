'use client';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { HEADER_LOGO } from '../../brand';

const wines=[
{id:1,name:'Catena Malbec',winery:'Catena Zapata',country:'Argentina',flag:'ar',grape:'Malbec',region:'Mendoza',price:189.90,tone:'malbec',description:'Malbec argentino de perfil frutado, macio e equilibrado, com ótima presença à mesa.'},
{id:2,name:'Marques de Casa Concha',winery:'Concha y Toro',country:'Chile',flag:'cl',grape:'Cabernet Sauvignon',region:'Maipo',price:259.90,tone:'cabernet',description:'Cabernet Sauvignon estruturado, intenso e elegante, com fruta madura e final persistente.'},
{id:3,name:'Brunello di Montalcino',winery:'Antinori',country:'Itália',flag:'it',grape:'Sangiovese',region:'Toscana',price:429.90,tone:'blend',description:'Um tinto italiano clássico, elegante e gastronômico, com boa estrutura e complexidade.'},
{id:4,name:'Pinot Noir Reserva',winery:'Patagonia Select',country:'Argentina',flag:'ar',grape:'Pinot Noir',region:'Patagônia',price:219.90,tone:'pinot',description:'Pinot Noir delicado, fresco e aromático, com textura leve e ótima acidez.'},
{id:5,name:'Chardonnay Gran Reserva',winery:'Casa del Valle',country:'Chile',flag:'cl',grape:'Chardonnay',region:'Casablanca',price:169.90,tone:'gold',description:'Chardonnay elegante e versátil, com frescor, equilíbrio e notas de frutas claras.'},
{id:6,name:'Bordeaux Supérieur',winery:'Maison Rouge',country:'França',flag:'fr',grape:'Blend',region:'Bordeaux',price:329.90,tone:'cabernet',description:'Blend bordalês de perfil clássico, com estrutura, equilíbrio e excelente vocação gastronômica.'},
{id:7,name:'Malbec Adrianna Vineyard',winery:'Catena Zapata',country:'Argentina',flag:'ar',grape:'Malbec',region:'Mendoza',price:399.90,tone:'malbec',description:'Malbec de altitude, profundo e refinado, com fruta intensa e grande persistência.'},
{id:8,name:'Malbec Estate',winery:'Rutini',country:'Argentina',flag:'ar',grape:'Malbec',region:'Mendoza',price:279.90,tone:'blend',description:'Malbec de perfil elegante, equilibrado e macio, com fruta madura e bom corpo.'},
{id:9,name:'Gran Reserva Malbec',winery:'Luigi Bosca',country:'Argentina',flag:'ar',grape:'Malbec',region:'Mendoza',price:249.90,tone:'malbec',description:'Malbec encorpado e sofisticado, com fruta madura, especiarias e final longo.'},
{id:10,name:'Cabernet Franc',winery:'Salentein',country:'Argentina',flag:'ar',grape:'Cabernet Franc',region:'Valle de Uco',price:229.90,tone:'cabernet',description:'Cabernet Franc elegante, herbal e frutado, com taninos firmes e ótima acidez.'},
{id:11,name:'Sauvignon Blanc',winery:'Concha y Toro',country:'Chile',flag:'cl',grape:'Sauvignon Blanc',region:'Casablanca',price:129.90,tone:'gold',description:'Branco cítrico e vibrante, ideal para momentos leves e combinações frescas.'},
{id:12,name:'Chianti Classico',winery:'Antinori',country:'Itália',flag:'it',grape:'Sangiovese',region:'Toscana',price:289.90,tone:'blend',description:'Sangiovese clássico, gastronômico e equilibrado, com fruta vermelha e boa acidez.'}
];
function money(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function CartIcon(){return <svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7"/></svg>}
function Arrow(){return <span>→</span>}
function Flag({code,name}){return <span className="flag-wrap detail-flag"><img src={`https://flagcdn.com/w80/${code}.png`} alt={`Bandeira de ${name}`} draggable="false"/></span>}
function Bottle({tone='malbec'}){return <div className="bottle-wrap"><div className={`bottle ${tone}`}><div className="neck"/><div className="shoulder"/><div className="body"><div className="label"><b>VIDEIRA</b><small>VINHOTECA</small></div></div></div></div>}
function RelatedCard({w}){return <a className="wine-card related-card" href={`/vinho/${w.id}`}><Flag code={w.flag} name={w.country}/><div className="wine-image"><Bottle tone={w.tone}/></div><div className="wine-meta"><small>{w.country}</small><h3>{w.name}</h3><p>{w.winery}</p><span>{w.grape}</span><div className="price-line"><strong>{money(w.price)}</strong><Arrow/></div></div></a>}

export default function WinePage(){
 const params=useParams();
 const id=Number(params?.id);
 const wine=wines.find(w=>w.id===id)||wines[0];
 const [qty,setQty]=useState(1);
 const [cartOpen,setCartOpen]=useState(false);
 const [cartCount,setCartCount]=useState(0);
 const related=useMemo(()=>wines.filter(w=>w.winery===wine.winery&&w.id!==wine.id),[wine]);
 const add=()=>{setCartCount(v=>v+qty);setCartOpen(true)};
 const quote=()=>{const text=encodeURIComponent(`Olá! Gostaria de pedir um orçamento para ${wine.name} - ${wine.winery}.`);window.open(`https://wa.me/5545999056277?text=${text}`,'_blank','noopener,noreferrer')};
 return <>
  <header className="floating-header"><div className="header-pill">
    <a className="header-logo" href="/"><img src={HEADER_LOGO} alt="Videira Vinhoteca"/></a>
    <nav><a href="/">Início</a><a href="/#vinhos">Vinhos</a><a href="/#uvas">Uvas</a><a href="/#bodegas">Bodegas</a><a href="/#sobre">Sobre nós</a><a href="/#faq">FAQ</a></nav>
    <div className="header-actions"><button className="icon-btn cart-icon" onClick={()=>setCartOpen(true)}><CartIcon/>{cartCount>0&&<span>{cartCount}</span>}</button><a className="shop-pill" href="/loja">Loja <Arrow/></a></div>
  </div></header>
  <main className="wine-detail-page">
    <section className="wine-detail">
      <div className="detail-visual"><Flag code={wine.flag} name={wine.country}/><Bottle tone={wine.tone}/></div>
      <div className="detail-info">
        <a className="detail-back" href="/loja">← Voltar para loja</a>
        <p className="kicker dark">{wine.country} · {wine.region}</p>
        <h1>{wine.name}</h1>
        <a className="detail-winery" href={`/loja?bodega=${encodeURIComponent(wine.winery)}`}>{wine.winery}</a>
        <p className="detail-grape">{wine.grape}</p>
        <p className="detail-description">{wine.description}</p>
        <strong className="detail-price">{money(wine.price)}</strong>
        <div className="detail-actions">
          <div className="qty"><button onClick={()=>setQty(v=>Math.max(1,v-1))}>−</button><span>{qty}</span><button onClick={()=>setQty(v=>v+1)}>+</button></div>
          <button className="detail-add" onClick={add}>Adicionar ao carrinho</button>
          <button className="detail-quote" onClick={quote}>Pedir orçamento</button>
        </div>
      </div>
    </section>
    <section className="section-shell related-section">
      <div className="slider-head"><div><p className="kicker dark">DA MESMA BODEGA</p><h2>Mais de {wine.winery}</h2></div><a href={`/loja?bodega=${encodeURIComponent(wine.winery)}`}>Ver todos <Arrow/></a></div>
      {related.length?<div className="horizontal-scroll product-row">{related.map(w=><RelatedCard key={w.id} w={w}/>)}</div>:<div className="related-empty">Em breve mais rótulos desta bodega.</div>}
    </section>
  </main>
  <aside className={`cart-drawer ${cartOpen?'open':''}`}><button className="drawer-close" onClick={()=>setCartOpen(false)}>×</button><p className="kicker dark">SEU CARRINHO</p><h2>Minha seleção</h2><div className="cart-items"><div className="cart-item"><div><strong>{wine.name}</strong><span>{qty} unidade(s)</span></div><div><b>{money(wine.price*qty)}</b></div></div></div><div className="cart-total"><span>Total</span><strong>{money(wine.price*qty)}</strong></div><button className="checkout" onClick={quote}>Continuar no WhatsApp</button></aside>
  {cartOpen&&<button className="backdrop" onClick={()=>setCartOpen(false)}/>}
 </>;
}
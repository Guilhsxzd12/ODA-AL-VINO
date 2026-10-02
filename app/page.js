'use client';

import { useEffect, useMemo, useState } from 'react';

const products = [
  { id: 1, name: 'Malbec Reserva', winery: 'Seleção Videira', grape: 'Malbec', region: 'Mendoza', price: 129.90, tone: 'malbec' },
  { id: 2, name: 'Cabernet Franc', winery: 'Seleção Videira', grape: 'Cabernet Franc', region: 'Valle de Uco', price: 149.90, tone: 'cabernet' },
  { id: 3, name: 'Pinot Noir', winery: 'Seleção Videira', grape: 'Pinot Noir', region: 'Patagônia', price: 139.90, tone: 'pinot' },
  { id: 4, name: 'Torrontés', winery: 'Seleção Videira', grape: 'Torrontés', region: 'Salta', price: 99.90, tone: 'white' },
  { id: 5, name: 'Blend de Altitude', winery: 'Seleção Videira', grape: 'Blend', region: 'Mendoza', price: 169.90, tone: 'blend' },
  { id: 6, name: 'Chardonnay', winery: 'Seleção Videira', grape: 'Chardonnay', region: 'Vale do Rio Negro', price: 119.90, tone: 'gold' },
];

const grapes = [
  ['Malbec', 'Intenso, macio e frutado'],
  ['Cabernet Franc', 'Elegante, herbal e estruturado'],
  ['Pinot Noir', 'Delicado, fresco e aromático'],
  ['Torrontés', 'Floral, cítrico e vibrante'],
];

const wineries = ['Mendoza', 'Valle de Uco', 'Salta', 'Patagônia'];

function money(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="20" r="1" />
      <circle cx="19" cy="20" r="1" />
      <path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7" />
    </svg>
  );
}

function WineBottle({ tone = 'malbec' }) {
  return (
    <div className="bottle-stage" aria-hidden="true">
      <div className={`bottle ${tone}`}>
        <div className="bottle-neck" />
        <div className="bottle-shoulder" />
        <div className="bottle-body">
          <div className="bottle-label">
            <strong>VIDEIRA</strong>
            <span>VINHOTECA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [ageOpen, setAgeOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const ok = localStorage.getItem('videira_age_ok');
    if (ok === '1') setAgeOpen(false);
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);

  function acceptAge() {
    localStorage.setItem('videira_age_ok', '1');
    setAgeOpen(false);
  }

  function addToCart(product) {
    setCart((items) => [...items, product]);
    setCartOpen(true);
  }

  function removeFromCart(index) {
    setCart((items) => items.filter((_, i) => i !== index));
  }

  function finishWhatsApp() {
    const details = cart.map((item) => `• ${item.name} — ${money(item.price)}`).join('\n');
    const text = encodeURIComponent(`Olá! Quero consultar estes vinhos da Videira Vinhoteca:\n\n${details}\n\nTotal: ${money(total)}`);
    window.open(`https://wa.me/5545999056277?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      {ageOpen && (
        <div className="age-overlay">
          <div className="age-card">
            <p className="eyebrow">VERIFICAÇÃO DE IDADE</p>
            <h2>VIDEIRA</h2>
            <p className="script-word">Vinhoteca</p>
            <p className="age-question">Você tem 18 anos ou mais?</p>
            <p className="age-copy">O consumo e a venda de bebidas alcoólicas são destinados exclusivamente a maiores de 18 anos.</p>
            <div className="age-actions">
              <button className="btn harvest" onClick={acceptAge}>Tenho 18+</button>
              <button className="btn outline" onClick={() => window.location.href = 'https://www.google.com/'}>Não tenho 18</button>
            </div>
          </div>
        </div>
      )}

      <header className={`header-shell ${scrolled ? 'scrolled' : ''}`}>
        {!scrolled && (
          <a href="#inicio" className="top-logo" aria-label="Videira Vinhoteca">
            <img src="/videira-logo.svg" alt="Videira Vinhoteca" />
          </a>
        )}
        <div className="header-pill">
          <a href="#inicio" className="brand-mini" aria-label="Videira Vinhoteca">
            <img src="/videira-logo.svg" alt="" />
          </a>
          <nav>
            <a href="#inicio">Inicio</a>
            <a href="#uvas">Uvas</a>
            <a href="#bodegas">Bodegas</a>
          </nav>
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Abrir carrinho">
            <CartIcon />
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="hero-glow one" />
          <div className="hero-glow two" />
          <div className="hero-content">
            <p className="eyebrow">CURADORIA · VINHOS · EXPERIÊNCIAS</p>
            <h1>Vinhos que<br/><span className="script-word">aproximam</span></h1>
            <p className="hero-copy">Uma seleção para descobrir novas uvas, regiões e bodegas com calma, personalidade e boa conversa.</p>
            <a className="hero-cta" href="#loja">Explorar catálogo</a>
          </div>
          <div className="hero-card-stack">
            {products.slice(0,3).map((p, i) => (
              <div className={`mini-wine-card card-${i+1}`} key={p.id}>
                <WineBottle tone={p.tone} />
              </div>
            ))}
          </div>
        </section>

        <section id="loja" className="shop-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">NOSSA SELEÇÃO</p>
              <h2>Escolha seu <span className="script-word">vinho</span></h2>
            </div>
            <p className="section-copy">Catálogo inicial da Videira. Em seguida podemos substituir estes rótulos pelos seus produtos reais.</p>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-visual">
                  <span className="region-tag">{product.region}</span>
                  <WineBottle tone={product.tone} />
                </div>
                <div className="product-info">
                  <p className="product-winery">{product.winery}</p>
                  <h3>{product.name}</h3>
                  <p className="product-grape">{product.grape}</p>
                  <div className="product-bottom">
                    <strong>{money(product.price)}</strong>
                    <button onClick={() => addToCart(product)}>Adicionar</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="uvas" className="grapes-section">
          <div className="section-heading light">
            <div>
              <p className="eyebrow">DESCUBRA POR UVA</p>
              <h2>Encontre seu <span className="script-word">estilo</span></h2>
            </div>
          </div>
          <div className="grape-grid">
            {grapes.map(([name, desc], index) => (
              <a href="#loja" className="grape-card" key={name}>
                <span className="grape-number">0{index + 1}</span>
                <div><h3>{name}</h3><p>{desc}</p></div>
                <span className="arrow">→</span>
              </a>
            ))}
          </div>
        </section>

        <section id="bodegas" className="wineries-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">ORIGENS</p>
              <h2>Bodegas & <span className="script-word">regiões</span></h2>
            </div>
            <p className="section-copy">Navegue pelas principais regiões do vinho argentino e monte sua seleção por origem.</p>
          </div>
          <div className="winery-list">
            {wineries.map((name, index) => (
              <a href="#loja" key={name}>
                <span>0{index + 1}</span><strong>{name}</strong><em>Ver vinhos →</em>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div>
          <img src="/videira-logo.svg" alt="Videira Vinhoteca" />
          <p>Curadoria de vinhos com identidade.</p>
        </div>
        <div className="footer-links">
          <a href="https://instagram.com/Videiravinhoteca" target="_blank" rel="noreferrer">@Videiravinhoteca</a>
          <a href="https://wa.me/5545999056277" target="_blank" rel="noreferrer">WhatsApp</a>
          <span>CNPJ 69.423.008/0001-67</span>
        </div>
      </footer>

      <a className="whatsapp-float" href="https://wa.me/5545999056277" target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a>

      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho">×</button>
        <p className="eyebrow dark">SEU CARRINHO</p>
        <h2>Minha seleção</h2>
        <div className="cart-items">
          {cart.length === 0 ? <p className="empty-cart">Seu carrinho ainda está vazio.</p> : cart.map((item, index) => (
            <div className="cart-item" key={`${item.id}-${index}`}>
              <div><strong>{item.name}</strong><span>{item.grape}</span></div>
              <div><b>{money(item.price)}</b><button onClick={() => removeFromCart(index)}>Remover</button></div>
            </div>
          ))}
        </div>
        <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>
        <button className="checkout-btn" disabled={!cart.length} onClick={finishWhatsApp}>Finalizar pelo WhatsApp</button>
      </div>
      {cartOpen && <button className="drawer-backdrop" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho" />}
    </>
  );
}

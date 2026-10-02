import { HEADER_LOGO } from '../brand';

export default function PolicyLayout({title,intro,sections}){
 return <>
  <header className="floating-header"><div className="header-pill"><a className="header-logo" href="/"><img src={HEADER_LOGO} alt="Videira Vinhoteca"/></a><nav><a href="/">Início</a><a href="/loja">Loja</a><a href="/#uvas">Uvas</a><a href="/#bodegas">Bodegas</a><a href="/#sobre">Sobre nós</a><a href="/#faq">FAQ</a></nav><div className="header-actions"><a className="shop-pill" href="/loja">Loja →</a></div></div></header>
  <main className="policy-page"><a className="detail-back" href="/">← Voltar ao site</a><p className="kicker dark">VIDEIRA VINHOTECA</p><h1>{title}</h1><p className="policy-intro">{intro}</p><div className="policy-content">{sections.map(([h,p])=><section key={h}><h2>{h}</h2><p>{p}</p></section>)}</div><p className="policy-note">Última atualização: outubro de 2026.</p></main>
 </>;
}
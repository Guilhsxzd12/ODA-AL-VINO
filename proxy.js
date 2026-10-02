import { NextResponse } from 'next/server';

const ORIGIN = 'https://www.odaalvino.com.br';

function customizationScript() {
  return `
<script id="videira-customizations">
(() => {
  const WA = 'https://wa.me/5545999056277';
  const IG = 'https://www.instagram.com/Videiravinhoteca/';
  const CNPJ = '69.423.008/0001-67';

  const cartSvg = \`
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="9" cy="20" r="1"></circle>
      <circle cx="19" cy="20" r="1"></circle>
      <path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H7"></path>
    </svg>
  \`;

  function setTextNodeCnpj(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const oldCnpjs = [
      /39\\.349\\.807\\/0001-70/g,
      /39\\s*349\\s*807\\s*0001\\s*70/g
    ];
    let node;
    while ((node = walker.nextNode())) {
      let value = node.nodeValue || '';
      let next = value;
      oldCnpjs.forEach((rx) => { next = next.replace(rx, CNPJ); });
      if (next !== value) node.nodeValue = next;
    }
  }

  function replaceHeader() {
    const nav = document.querySelector('header nav');
    if (nav && nav.dataset.videiraNav !== '1') {
      nav.dataset.videiraNav = '1';
      const cls = 'rounded-full px-2 md:px-3 py-2 text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-paper/70 transition hover:bg-paper/15 hover:text-paper whitespace-nowrap';
      nav.innerHTML = [
        ['Inicio', '/#inicio'],
        ['Uvas', '/#uvas'],
        ['Bodegas', '/#bodegas']
      ].map(([label, href]) => \`<a href="\\${href}" class="\\${cls}">\\${label}</a>\`).join('');
    }

    document.querySelectorAll('button[title*="idioma" i], button[title*="language" i]').forEach((button) => {
      const wrapper = button.parentElement;
      if (wrapper) wrapper.remove();
      else button.remove();
    });

    const rightArea = document.querySelector('header div.flex.items-center.gap-1, header div.flex.items-center.gap-2');
    if (rightArea && !rightArea.querySelector('[data-videira-cart]')) {
      const cart = document.createElement('a');
      cart.href = '/#carrinho';
      cart.setAttribute('data-videira-cart', '1');
      cart.setAttribute('aria-label', 'Carrinho');
      cart.title = 'Carrinho';
      cart.className = 'flex items-center justify-center w-10 h-10 rounded-full text-paper hover:bg-paper/10 transition-all duration-300';
      cart.innerHTML = cartSvg;
      const buy = Array.from(rightArea.querySelectorAll('a')).find(a => /comprar/i.test(a.textContent || ''));
      if (buy) rightArea.insertBefore(cart, buy);
      else rightArea.appendChild(cart);
    }
  }

  function updateLinks() {
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach((a) => {
      a.href = WA;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
    document.querySelectorAll('a[href*="instagram.com"]').forEach((a) => {
      a.href = IG;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }

  function removeOldEventSymbols() {
    const selectors = [
      'img[src*="copas_y_personajes"]',
      'img[src*="Recurso_4_2x"]',
      'img[src*="lacre_oav"]',
      'img[src*="Lacre_OAV"]',
      'img[src*="Sellocalidad_ODA"]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach((img) => {
      const parent = img.parentElement;
      const text = parent ? (parent.textContent || '').trim() : '';
      if (parent && text === '' && parent.children.length <= 4) parent.remove();
      else img.remove();
    });
  }

  function addCnpjToFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    if ((footer.textContent || '').includes(CNPJ)) return;
    if (footer.querySelector('[data-videira-cnpj]')) return;
    const p = document.createElement('p');
    p.dataset.videiraCnpj = '1';
    p.textContent = 'CNPJ ' + CNPJ;
    p.className = 'text-[10px] md:text-xs opacity-60 tracking-wide mt-3';
    const target = footer.querySelector('div') || footer;
    target.appendChild(p);
  }

  function apply() {
    replaceHeader();
    updateLinks();
    removeOldEventSymbols();
    setTextNodeCnpj();
    addCnpjToFooter();
  }

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
    });
  };

  apply();
  document.addEventListener('DOMContentLoaded', apply, { once: true });
  window.addEventListener('load', apply, { once: true });
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
</script>
`;
}

export async function proxy(request) {
  const accept = request.headers.get('accept') || '';
  if (!accept.includes('text/html')) return NextResponse.next();

  const target = new URL(request.nextUrl.pathname + request.nextUrl.search, ORIGIN);
  const upstream = await fetch(target, {
    headers: {
      'user-agent': request.headers.get('user-agent') || 'Mozilla/5.0',
      'accept': 'text/html,application/xhtml+xml'
    },
    cache: 'no-store'
  });

  const contentType = upstream.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: upstream.headers
    });
  }

  let html = await upstream.text();
  const injection = customizationScript();
  html = html.includes('</body>') ? html.replace('</body>', injection + '</body>') : html + injection;

  const response = new NextResponse(html, { status: upstream.status });
  response.headers.set('content-type', 'text/html; charset=utf-8');
  response.headers.set('cache-control', 'no-store, max-age=0');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.png|robots.txt|sitemap.xml).*)']
};

/* ---------- CORE ---------- */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let lang='ca';
try{const s=localStorage.getItem('jp-lang');lang=s||((navigator.language||'').toLowerCase().startsWith('es')?'es':'ca')}catch(e){}
const L=(ca,es)=>lang==='es'?es:ca;
const eur=n=>n.toLocaleString(lang==='es'?'es-ES':'ca-ES',{style:'currency',currency:'EUR'});
const num=n=>n.toLocaleString(lang==='es'?'es-ES':'ca-ES',{maximumFractionDigits:2});
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pname=p=>lang==='es'?p.es:p.ca;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

let cart=store.get('jp-cart',{});
let shop={cat:'all',q:'',tag:'',sort:'rel',limit:24};
let co={mode:'delivery',store:3,day:0,slot:-1,pay:'card',sub:'sub',f:{}};
let lastOrder=null;
const pById=id=>PRODUCTS.find(p=>p.id===id);
const unitPrice=p=>p.o??p.p;
const saveCart=()=>store.set('jp-cart',cart);
const lines=()=>Object.entries(cart).map(([id,l])=>({p:pById(id),...l})).filter(l=>l.p);
const subtotal=()=>lines().reduce((s,l)=>s+unitPrice(l.p)*l.q,0);
const cnt=()=>lines().length;
const heavyCount=()=>lines().filter(l=>HEAVY.has(l.p.id)).reduce((n,l)=>n+l.q,0);
const packFee=()=>{const n=heavyCount();return co.mode==='pickup'||n<=PACK_BAND?0:PACK_FEE*(Math.ceil(n/PACK_BAND)-1)};
const baseFee=()=>{const s=subtotal();return co.mode==='pickup'||s===0||s>=FREE_FROM?0:FEE};
const fee=()=>baseFee()+packFee();
const fmtQ=p=>q=>p.u==='kg'?num(q)+' kg':String(q);

function tagPills(p){return p.tags.map(t=>{const d=TAGS[t];return `<span class="pill ${d[2]}">${lang==='es'?d[1]:d[0]}</span>`}).join('')+(p.o?`<span class="pill red">${L('Oferta','Oferta')}</span>`:'')}

/* ---------- PRODUCT CARD: the add button becomes the stepper in place ---------- */
function actHTML(p){
  const q=cart[p.id]?.q||0;
  return q?`<div class="stepper"><button data-act="dec" data-id="${p.id}" aria-label="${L('Treu','Quita')} ${esc(pname(p))}">${svg('minus')}</button><span aria-live="polite">${fmtQ(p)(q)}</span><button data-act="inc" data-id="${p.id}" aria-label="${L('Afegeix','Añade')} ${esc(pname(p))}">${svg('plus')}</button></div>`
    :`<button class="addbtn" data-act="inc" data-id="${p.id}" aria-label="${L('Afegeix a la cistella','Añadir a la cesta')}: ${esc(pname(p))}">${svg('plus')}${L('Afegir','Añadir')}</button>`;
}
/* every product has its own photo (img/p/<id>.jpg); if it is missing the section icon stays visible */
const ph=p=>`<img class="f" src="img/p/${p.id}.jpg" alt="" loading="lazy" decoding="async" onerror="this.remove()">`;
function prodCard(p){
  const c=CAT[p.c],unit=p.u==='kg'?'/kg':'';
  return `<article class="prod" data-card="${p.id}" style="--cc:${c.col}">
  <div class="pimg">${svg(p.c)}${ph(p)}<div class="tags">${tagPills(p)}</div></div>
  <div class="pbody"><h4>${esc(pname(p))}</h4>
  <div class="sz">${esc(p.size||(p.u==='kg'?L('Preu per quilo','Precio por kilo'):''))||'&nbsp;'}</div>
  <div class="price ${p.o?'off':''}">${eur(unitPrice(p))}<small>${unit}</small>${p.o?`<s>${eur(p.p)}</s>`:''}</div>
  <div class="act" data-actfor="${p.id}">${actHTML(p)}</div></div></article>`}

/* ---------- CART ops ---------- */
function change(id,dir){
  const p=pById(id);if(!p)return;
  const cur=cart[id]?.q||0;
  if(cur===0&&dir<0)return; /* e.g. a fast double click on a line that is already collapsing */
  const q=Math.round((cur+dir*p.step)*100)/100;
  if(q<=0){delete cart[id]}else{cart[id]={q,note:cart[id]?.note||''}}
  saveCart();syncCards(id,cur===0&&q>0);refreshCart(dir>0);pingBar();
}
function syncCards(id,fresh){
  const p=pById(id),q=cart[id]?.q||0;
  $$(`[data-actfor="${id}"]`).forEach(box=>{
    const sp=$('.stepper span',box);
    if(sp&&q){sp.textContent=fmtQ(p)(q);sp.classList.remove('tk');void sp.offsetWidth;sp.classList.add('tk');return}
    const had=box.contains(document.activeElement);
    box.innerHTML=actHTML(p);
    if(fresh&&!reduce)$('.stepper',box)?.classList.add('in');
    if(had)(q?$('[data-act="inc"]',box):$('.addbtn',box))?.focus({preventScroll:true});
  });
}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),3000)}

let wasFree=subtotal()>=FREE_FROM,booted=false;
const lineHTML=l=>{const c=CAT[l.p.c];return `<div class="line" data-id="${l.p.id}" style="--cc:${c.col}">
    <div class="th">${svg(l.p.c)}${ph(l.p)}</div>
    <div><div class="nm">${esc(pname(l.p))}</div><div class="meta">${eur(unitPrice(l.p))}${l.p.u==='kg'?'/kg':''} · <strong>${eur(unitPrice(l.p)*l.q)}</strong></div></div>
    <div class="stepper"><button data-act="dec" data-id="${l.p.id}" aria-label="${L('Treu','Quita')}">${svg('minus')}</button><span>${fmtQ(l.p)(l.q)}</span><button data-act="inc" data-id="${l.p.id}" aria-label="${L('Afegeix','Añade')}">${svg('plus')}</button></div>
    ${FRESH.has(l.p.c)?`<textarea data-note="${l.p.id}" placeholder="${L("Tall, gruix o comentari per a l'especialista",'Corte, grosor o comentario para el especialista')}" rows="1" aria-label="${L('Nota per a','Nota para')} ${esc(pname(l.p))}">${esc(l.note)}</textarea>`:''}
  </div>`};
function rebuildBody(){
  const body=$('#drawerbody');body.dataset.lang=lang;
  body.innerHTML=cnt()?lines().map(lineHTML).join(''):`<div class="empty">${svg('cart')}<p style="margin-inline:auto">${L('La cistella és buida. Comença a afegir productes.','La cesta está vacía. Empieza a añadir productos.')}</p><a class="btn" href="#botiga" data-close>${L('Anar a la botiga','Ir a la tienda')}</a></div>`;
}
function refreshCart(added){
  const n=cnt(),st=subtotal(),r=currentRoute();
  const cb=$('#cartbtn');
  if(cb){$('#cartn').textContent=n;cb.classList.toggle('has',n>0);
    const am=$('#cartamt');am.textContent=n?eur(st):'';if(added&&!reduce){cb.classList.remove('bump');void cb.offsetWidth;cb.classList.add('bump');am.classList.remove('tk');void am.offsetWidth;am.classList.add('tk')}}
  /* drawer: lines are updated in place (so a removed line can collapse and the progress bar can travel) */
  $('#drawer header').innerHTML=`<h3>${L('La teva cistella','Tu cesta')}</h3><button class="iconbtn" data-act="cart-close" aria-label="${L('Tancar la cistella','Cerrar la cesta')}">${svg('close')}</button>`;
  const body=$('#drawerbody'),ids=lines().map(l=>l.p.id),dom=$$('.line',body).map(e=>e.dataset.id);
  if(body.dataset.lang===lang&&dom.length&&!$('.line.out',body)&&ids.every(i=>dom.includes(i))){
    lines().forEach(l=>{const el=$(`.line[data-id="${l.p.id}"]`,body);if(!el)return;$('.stepper span',el).textContent=fmtQ(l.p)(l.q);$('.meta strong',el).textContent=eur(unitPrice(l.p)*l.q)});
    dom.filter(i=>!ids.includes(i)).forEach(i=>{const el=$(`.line[data-id="${i}"]`,body);if(!el)return;
      if(reduce){el.remove();return}
      el.style.maxHeight=el.offsetHeight+'px';void el.offsetWidth;el.classList.add('out');setTimeout(()=>el.remove(),240)});
    if(!n)setTimeout(()=>{if(!cnt())rebuildBody()},reduce?0:260);
  }else rebuildBody();
  const foot=$('#drawerfoot'),left=Math.max(0,FREE_FROM-st),free=st>=FREE_FROM;
  if(!n){foot.innerHTML='';delete foot.dataset.k}
  else{
    if(foot.dataset.k!==lang){
      foot.innerHTML=`<div><div class="free" id="freemsg"></div><div class="progress"><i id="freebar"></i></div></div><p class="packnote" id="packnote" hidden></p><div class="sum"><div class="tot"><span>${L('Subtotal','Subtotal')}</span><span id="subt"></span></div></div><a class="btn block" href="#comanda" data-close>${L('Finalitzar la comanda','Finalizar el pedido')}${svg('arrow')}</a>`;
      foot.dataset.k=lang;$('#freebar').style.width='0%';void $('#freebar').offsetWidth}
    const msg=$('#freemsg');
    msg.innerHTML=free?`<span class="ok">${svg('check')}<b>${L('Repartiment gratuït desbloquejat','Reparto gratuito desbloqueado')}</b></span>`:`<span>${L(`Et falten <b>${eur(left)}</b> per al repartiment gratuït`,`Te faltan <b>${eur(left)}</b> para el reparto gratuito`)}</span>`;
    if(free&&!wasFree&&!reduce){msg.classList.remove('pop');void msg.offsetWidth;msg.classList.add('pop')}
    $('#freebar').style.width=Math.min(100,st/FREE_FROM*100)+'%';
    $('#subt').textContent=eur(st);
    const pn=$('#packnote'),hc=heavyCount();pn.hidden=hc<=PACK_BAND;
    if(!pn.hidden)pn.textContent=L(`Tens ${hc} packs d'aigua, llet o garrafes: cada franja de ${PACK_BAND} packs addicionals afegeix ${PACK_FEE} € al repartiment.`,`Tienes ${hc} packs de agua, leche o garrafas: cada franja de ${PACK_BAND} packs adicionales añade ${PACK_FEE} € al reparto.`);
  }
  wasFree=free;
  /* confirmation bar: content only here; it is shown briefly by pingBar() after the user changes the cart */
  const bar=$('#cartbar');
  bar.setAttribute('aria-label',L('Resum de la cistella','Resumen de la cesta'));
  bar.innerHTML=`<div class="info"><b>${eur(st)}</b><span>${n} ${n===1?L('producte','producto'):L('productes','productos')}</span></div><button class="btn sm" data-act="cart">${svg('cart')}${L('Veure','Ver')}</button>`;
  if(added&&!reduce)$('.info b',bar).classList.add('tk');
  if(!n)hideBar();
  if(r==='comanda')paintSummary();
  fitNav();
}
/* the bar is a short confirmation (≈3 s), not permanent chrome: the header button already carries count and total */
let barTimer=0,barHot=false;
function hideBar(){clearTimeout(barTimer);const b=$('#cartbar');b.classList.remove('on');b.setAttribute('aria-hidden','true')}
function pingBar(){
  const r=currentRoute();
  if(!cnt()||ov.cart||ov.nav||r==='comanda'||r==='gracies')return hideBar();
  const b=$('#cartbar');b.classList.add('on');b.setAttribute('aria-hidden','false');
  clearTimeout(barTimer);barTimer=setTimeout(()=>{barHot?pingBar():hideBar()},3200);
}
(()=>{const b=document.getElementById('cartbar');if(!b)return;
  b.addEventListener('pointerenter',()=>barHot=true);b.addEventListener('pointerleave',()=>barHot=false);
  b.addEventListener('focusin',()=>barHot=true);b.addEventListener('focusout',()=>barHot=false)})();

/* overlays (one place decides scrim + scroll lock) */
const ov={cart:false,nav:false};
function syncOverlay(){$('#scrim').classList.toggle('on',ov.cart||ov.nav);document.documentElement.classList.toggle('lock',ov.cart||ov.nav||!!document.querySelector('.modal.on'));refreshBar()}
function refreshBar(){if(ov.cart||ov.nav)hideBar()}
function openCart(on=true){ov.cart=on;$('#drawer').classList.toggle('on',on);$('#drawer').setAttribute('aria-hidden',!on);syncOverlay();if(on)$('#drawer .iconbtn')?.focus({preventScroll:true})}
function setNav(on){ov.nav=on;$('#mnav').classList.toggle('on',on);$('#mnav').setAttribute('aria-hidden',!on);$('#burger')?.setAttribute('aria-expanded',on);syncOverlay();if(on)$('#mnav .iconbtn')?.focus({preventScroll:true})}

/* ---------- LOGO ---------- */
/* official logo, taken from the current jespac.com */
const logo=(h=46)=>`<img src="img/jespac/logo_jespac.png" width="622" height="192" alt="Jespac supermercats" style="height:${h}px;width:auto">`;

/* ---------- LAYOUT ---------- */
const NAVMAIN=[
 ['botiga',['Botiga online','Tienda online'],['botiga','comanda'],'cart'],
 ['ofertes',['Ofertes','Ofertas'],['ofertes'],'tag'],
 ['fresc',['Fresc de mercat','Fresco de mercado'],['fresc'],'fruita'],
 ['oferim',['Serveis','Servicios'],['oferim'],'hands'],
 ['establiments',['Botigues','Tiendas'],['establiments'],'pin'],
 ['empresa',['Qui som','Quiénes somos'],['empresa','compra360','igualtat','solidaritat','treballa','feina'],'users'],
 ['contacte',['Contacte','Contacto'],['contacte','ticket'],'phone']
];
const inNav=(n,r)=>n[2].includes(r)||(n[0]==='establiments'&&r.startsWith('tenda-'));
const langBtns=()=>`<button data-act="lang" data-l="ca" aria-pressed="${lang==='ca'}">Català</button><span aria-hidden="true">·</span><button data-act="lang" data-l="es" aria-pressed="${lang==='es'}">Castellano</button>`;
function paintHeader(){
  const r=currentRoute();
  $('#skip').textContent=L('Anar al contingut','Ir al contenido');
  $('#hbar').innerHTML=`<a class="logo" href="#inici" aria-label="Jespac · ${L('Inici','Inicio')}">${logo()}</a>
  <nav class="main" aria-label="${L('Menú principal','Menú principal')}">${NAVMAIN.map(n=>`<a href="#${n[0]}" class="${n[0]==='botiga'?'cta':''}" ${inNav(n,r)?'aria-current="page"':''}>${L(n[1][0],n[1][1])}</a>`).join('')}</nav>
  <div class="hactions">
  <button class="btn green sm cartbtn" id="cartbtn" data-act="cart" aria-label="${L('Obrir la cistella','Abrir la cesta')}">${svg('cart')}<span class="t">${L('Cistella','Cesta')}</span><span class="amt" id="cartamt">${cnt()?eur(subtotal()):''}</span><span class="n" id="cartn">${cnt()}</span></button>
  <button class="burger" id="burger" data-act="burger" aria-expanded="false" aria-controls="mnav">${svg('menu')}<span>${L('Menú','Menú')}</span></button></div>`;
  $('#cartbtn').classList.toggle('has',cnt()>0);
  const mi=(h,t,ic)=>`<a class="l" href="#${h}" ${h===r?'aria-current="page"':''}>${svg(ic)}${t}</a>`;
  $('#mnav').setAttribute('aria-label',L('Menú','Menú'));
  $('#mnav').innerHTML=`<div class="mh"><strong>${L('Menú','Menú')}</strong><button class="iconbtn" data-act="burger" aria-label="${L('Tancar el menú','Cerrar el menú')}">${svg('close')}</button></div>
  ${mi('inici',L('Inici','Inicio'),'home')}${NAVMAIN.map(n=>mi(n[0],L(n[1][0],n[1][1]),n[3])).join('')}${mi('mapa',L('Mapa del web','Mapa del sitio'),'map')}
  <a class="btn green" href="tel:${TEL_HREF}">${svg('phone')}${L("Truca'ns",'Llámanos')}: ${TEL}</a>
  <div class="langs mlangs" role="group" aria-label="Idioma">${langBtns()}</div>`;
  fitNav();
}
/* the menu is a hamburger ONLY when the written menu does not fit in the header */
function fitNav(){
  const hb=$('#hbar');if(!hb)return;
  hb.classList.remove('compact');
  if(hb.scrollWidth>hb.clientWidth+1)hb.classList.add('compact');
}
new ResizeObserver(()=>fitNav()).observe(document.documentElement);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitNav);

function paintFooter(){
  const sec=g=>`<div><h4>${L(g.t[0],g.t[1])}</h4><ul>${g.items.filter(i=>i[0]!=='feina').map(i=>`<li><a href="#${i[0]}">${L(i[1][0],i[1][1])}</a></li>`).join('')}</ul></div>`;
  const legal=SITE.find(g=>g.id==='legal');
  $('#footer').innerHTML=`<div class="wrap"><div class="cols">
  <div class="fbrand">${logo(64)}<p>${L('Supermercats de proximitat a Barcelona des de 1981.','Supermercados de proximidad en Barcelona desde 1981.')}</p>
   <p>C/ Alcúdia 9-11<br>08016 Barcelona</p>
   <div class="fsoc"><a class="ig" href="https://www.instagram.com/jespacsupermercats/">${svg('ig')}<span>Instagram</span></a><a class="fb" href="https://www.facebook.com/profile.php?id=61556109172075">${svg('fb')}<span>Facebook</span></a><a class="wa" href="https://wa.me/${WA_HREF}">${svg('wa')}<span>WhatsApp</span></a></div></div>
  ${SITE.filter(g=>g.id==='comprar'||g.id==='jespac').map(sec).join('')}
  <div class="fcontact"><h4>${L('Contacte','Contacto')}</h4>
   <a class="ftel" href="tel:${TEL_HREF}">${svg('phone')}${TEL}</a>
   <p>${L('Comandes per WhatsApp o telèfon','Pedidos por WhatsApp o teléfono')}:<br><a href="https://wa.me/${WA_HREF}"><b>${WA}</b></a><br>${L('de dilluns a divendres, de 9 a 14 h','de lunes a viernes, de 9 a 14 h')}</p>
   <p><a href="mailto:${MAIL}">${MAIL}</a><br><a href="mailto:${ORDERS_MAIL}">${ORDERS_MAIL}</a></p>
   <a class="btn green sm" href="#contacte">${L('Contacta amb nosaltres','Contacta con nosotros')}</a></div>
  </div><div class="base"><div class="langs flang" role="group" aria-label="Idioma"><span class="lb">${L('Idioma','Idioma')}:</span>${langBtns()}</div>
  <span style="display:flex;gap:1.2rem;flex-wrap:wrap">${legal.items.map(i=>`<a href="#${i[0]}">${L(i[1][0],i[1][1])}</a>`).join('')}<a href="#mapa">${L('Mapa del web','Mapa del sitio')}</a><a href="https://jespac.canaldenunciasanonimas.com/home">${L('Canal ètic','Canal ético')}</a></span>
  <span>© ${new Date().getFullYear()} Supermercats Jespac · ${L('Membre de FACSA i EUROMADI','Miembro de FACSA y EUROMADI')}</span></div></div>`;
}

/* ---------- ROUTER ---------- */
const ROUTES={};
function currentRoute(){const h=(location.hash||'').replace('#','');return ROUTES[h]?h:'inici'}
function render(first){
  const r=currentRoute();
  const go=()=>{
    hideBar();
    $('#view').innerHTML=ROUTES[r]();
    paintHeader();
    document.title='Supermercats Jespac'+(r==='inici'?'':' · '+(TITLES[r]?TITLES[r]():r));
    if(!first)scrollTo({top:0,behavior:'instant'});
    afterRender(!first||!booted);refreshCart();
  };
  if(!first&&!reduce&&document.startViewTransition)document.startViewTransition(go);else go();
}
const TITLES={};
function afterRender(animate){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!e.target.dataset.done){e.target.dataset.done=1;countUp(e.target)}}),{threshold:.6});
  $$('[data-count]').forEach(el=>io.observe(el));
  if(currentRoute()==='botiga')paintShop(true);
  if(currentRoute()==='comanda'){paintSummary();paintSlots()}
  initHero();autoReveal(animate);
}
function countUp(el){
  if(reduce)return;const end=+el.dataset.count,suf=el.dataset.suf||'';const t0=performance.now(),dur=1300;
  (function f(t){const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=Math.round(end*e)+suf;if(k<1)requestAnimationFrame(f)})(t0);
}
addEventListener('hashchange',()=>{openCart(false);setNav(false);render()});

/* ---------- HERO: full-screen photo carousel (autoplay, pause, swipe, keyboard; no autoplay with reduced motion) ---------- */
let heroStop=null;
const HERO_MS=6500;
function initHero(){
  if(heroStop){heroStop();heroStop=null}
  const h=$('#hero');if(!h)return;
  const slides=$$('.slide',h),dots=$$('.dot',h),n=slides.length,playBtn=$('#hplay');
  let i=0,timer=0,paused=reduce,hot=false,x0=null,alive=true;
  h.style.setProperty('--auto',HERO_MS+'ms');
  const setPlayIcon=()=>{playBtn.innerHTML=svg(paused?'play':'pause');playBtn.setAttribute('aria-label',paused?L('Reprèn el carrusel','Reanuda el carrusel'):L('Atura el carrusel','Detén el carrusel'))};
  const arm=()=>{clearTimeout(timer);h.classList.remove('run');void h.offsetWidth;if(!alive||paused||hot||document.hidden)return;h.classList.add('run');timer=setTimeout(()=>show(i+1),HERO_MS)};
  function show(k){
    i=(k+n)%n;
    slides.forEach((s,j)=>{const on=j===i;s.classList.toggle('on',on);s.setAttribute('aria-hidden',!on);s.inert=!on});
    dots.forEach((d,j)=>{d.classList.toggle('on',j===i);if(j===i)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')});
    h.setAttribute('aria-live',paused?'polite':'off');arm();
  }
  window.__heroGo=d=>show(i+d);window.__heroTo=k=>show(k);
  window.__heroToggle=()=>{paused=!paused;setPlayIcon();arm()};
  const enter=()=>{hot=true;arm()},leave=()=>{hot=false;arm()};
  const down=e=>{x0=e.clientX},up=e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>50)show(i+(dx<0?1:-1))};
  const key=e=>{if(e.key==='ArrowRight')show(i+1);else if(e.key==='ArrowLeft')show(i-1)};
  const vis=()=>arm();
  h.addEventListener('pointerenter',enter);h.addEventListener('pointerleave',leave);h.addEventListener('focusin',enter);h.addEventListener('focusout',leave);
  h.addEventListener('pointerdown',down);h.addEventListener('pointerup',up);h.addEventListener('keydown',key);document.addEventListener('visibilitychange',vis);
  setPlayIcon();arm();
  heroStop=()=>{alive=false;clearTimeout(timer);h.removeEventListener('pointerenter',enter);h.removeEventListener('pointerleave',leave);h.removeEventListener('focusin',enter);h.removeEventListener('focusout',leave);h.removeEventListener('pointerdown',down);h.removeEventListener('pointerup',up);h.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',vis);window.__heroGo=window.__heroTo=window.__heroToggle=null};
}

/* ---------- EVENTS ---------- */
document.addEventListener('click',e=>{
  if(e.target.id==='scrim'){openCart(false);setNav(false);return}
  const a=e.target.closest('[data-act]');
  if(e.target.closest('[data-close]'))openCart(false);
  if(!a)return;
  const act=a.dataset.act,id=a.dataset.id;
  if(act==='inc')change(id,1);
  else if(act==='dec')change(id,-1);
  else if(act==='cart')openCart(true);
  else if(act==='cart-close')openCart(false);
  else if(act==='lang'){lang=a.dataset.l;try{localStorage.setItem('jp-lang',lang)}catch(_){ }document.documentElement.lang=lang;paintFooter();render(true)}
  else if(act==='burger')setNav(!ov.nav);
  else if(act==='more'){shop.limit+=24;paintShop(false)}
  else if(act==='cat'){shop.limit=24;shop.cat=a.dataset.v;$('#sidewrap')?.classList.remove('open');$('#sidetoggle')?.setAttribute('aria-expanded','false');paintShop(true)}
  else if(act==='sidetoggle'){const o=$('#sidewrap').classList.toggle('open');a.setAttribute('aria-expanded',o)}
  else if(act==='cat-go'){shop.cat=a.dataset.v;shop.tag='';shop.q='';location.hash='botiga'}
  else if(act==='tag'){shop.limit=24;shop.tag=shop.tag===a.dataset.v?'':a.dataset.v;paintShop(true)}
  else if(act==='hprev'){window.__heroGo?.(-1)}
  else if(act==='hnext'){window.__heroGo?.(1)}
  else if(act==='hplay'){window.__heroToggle?.()}
  else if(act==='hdot'){window.__heroTo?.(+a.dataset.v)}
  else if(act==='listopen')openList(true);
  else if(act==='listclose')openList(false);
  else if(act==='listmatch')matchList();
  else if(act==='listadd'){addMatches();}
  else if(act==='mode'){co.mode=a.dataset.v;render(true)}
  else if(act==='day'){co.day=+a.dataset.v;co.slot=-1;paintSlots()}
  else if(act==='slot'){co.slot=+a.dataset.v;paintSlots()}
  else if(act==='store'){co.store=+a.dataset.v;location.hash='botiga';toast(L('Botiga seleccionada per preparar la comanda','Tienda seleccionada para preparar el pedido'))}
  else if(act==='place')placeOrder();
  else if(act==='reorder')reorder();
  else if(act==='demo-form'){e.preventDefault();demoForm(a)}
});
document.addEventListener('input',e=>{
  if(e.target.id==='q'){shop.limit=24;shop.q=e.target.value;paintShop(false)}
  else if(e.target.dataset.note){const l=cart[e.target.dataset.note];if(l){l.note=e.target.value;saveCart()}}
});
document.addEventListener('change',e=>{
  if(e.target.id==='sort'){shop.limit=24;shop.sort=e.target.value;paintShop(false)}
  else if(e.target.name==='pay'){co.pay=e.target.value;render(true)}
  else if(e.target.name==='sub'){co.sub=e.target.value}
  else if(e.target.id==='storesel'){co.store=+e.target.value}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){openCart(false);setNav(false);openList(false)}});

/* ---------- Drag-to-dismiss cistella (1:1 tracking, velocity, momentum projection, rubber-band) ---------- */
(function(){
  const d=document.getElementById('drawer');if(!d)return;
  let st=null,hist=[];
  const project=(v,r=.998)=>(v/1000)*r/(1-r);
  const rubber=(o,dim,c=.55)=>(o*dim*c)/(dim+c*Math.abs(o));
  d.addEventListener('pointerdown',e=>{
    if(!d.classList.contains('on')||e.target.closest('input,textarea,select,.dbody button,.dfoot a'))return;
    st={x:e.clientX,y:e.clientY,on:false};hist=[{x:e.clientX,t:e.timeStamp}];
  });
  d.addEventListener('pointermove',e=>{
    if(!st)return;
    const dx=e.clientX-st.x,dy=e.clientY-st.y;
    if(!st.on){
      if(Math.abs(dx)<10&&Math.abs(dy)<10)return;
      if(Math.abs(dy)>Math.abs(dx)){st=null;return}
      st.on=true;st.x=e.clientX;d.setPointerCapture(e.pointerId);d.classList.add('drag');
    }
    const w=d.offsetWidth,off=e.clientX-st.x;
    d.style.transform=`translateX(${off>=0?off:-rubber(-off,w)}px)`;
    hist.push({x:e.clientX,t:e.timeStamp});if(hist.length>6)hist.shift();
  });
  const end=()=>{
    if(!st)return;const was=st.on;st=null;if(!was)return;
    d.classList.remove('drag');
    const a=hist[0],b=hist[hist.length-1],v=b.t>a.t?(b.x-a.x)/(b.t-a.t)*1000:0;
    const cur=new DOMMatrixReadOnly(getComputedStyle(d).transform).m41;
    const close=cur+project(v)>d.offsetWidth/2;
    d.style.transform=`translateX(${cur}px)`;void d.offsetWidth;
    d.style.transform='';
    if(close)openCart(false);
    hist=[];
  };
  d.addEventListener('pointerup',end);d.addEventListener('pointercancel',end);
})();

/* photos fade in once loaded (no pop-in); cached images are settled by the observer */
document.addEventListener('load',e=>{if(e.target.tagName==='IMG'&&e.target.classList.contains('f'))e.target.classList.add('ld')},true);
(()=>{let q=0;const settle=()=>{q=0;$$('img.f:not(.ld)').forEach(i=>{if(i.complete&&i.naturalWidth)i.classList.add('ld')})};
  new MutationObserver(()=>{if(!q)q=requestAnimationFrame(settle)}).observe(document.body,{childList:true,subtree:true})})();

/* ---------- bouncy entrances: things jump up from below and settle with one organic rebound ---------- */
const REVEAL_SEL='.shead,.acttile,.steps>div,.soc,.band,.card,.phcard,.story,.stat,.docsec,.store,.fee,.sbox,.prod,.smap>*';
let revealIO=null;
function autoReveal(animate){
  const view=$('#view'),r=currentRoute();
  /* never on the shop grid, checkout or confirmation: those are used many times a day or re-render on every click */
  const quiet=!animate||['botiga','comanda','gracies'].includes(r);
  $$(REVEAL_SEL,view).filter(e=>!e.closest('#grid')&&!e.closest('.phead')).forEach(e=>e.classList.add('rv'));
  const all=$$('.rv:not(.in)',view);
  revealIO?.disconnect();
  if(reduce||quiet){all.forEach(e=>e.classList.add('in','now'));return}
  revealIO=new IntersectionObserver(es=>{
    es.filter(e=>e.isIntersecting).sort((a,b)=>a.target.compareDocumentPosition(b.target)&2?1:-1).forEach((e,i)=>{
      e.target.style.setProperty('--d',Math.min(i,5)*80+'ms');e.target.classList.add('in');revealIO.unobserve(e.target)});
  },{threshold:.1,rootMargin:'0px 0px -5% 0px'});
  all.forEach(e=>revealIO.observe(e));
}

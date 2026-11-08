/* ---------- HOME ---------- */
const HERO_SLIDES=()=>[
 {img:'fruita',eyebrow:L('Supermercats de Barcelona des de 1981','Supermercados de Barcelona desde 1981'),h:L('Cada dia treballem per tu','Cada día trabajamos para ti'),p:L('Perquè puguis fer una compra completa, ara també des de casa.','Para que puedas hacer una compra completa, ahora también desde casa.'),
  cta:`<a class="btn" href="#botiga">${svg('cart')}${L('Fes la compra online','Haz la compra online')}</a><button class="btn green" data-act="listopen">${svg('list')}${L('Enganxa la teva llista','Pega tu lista')}</button>`},
 {img:'forn',eyebrow:L('Forn','Horno'),h:L('Pa acabat de fer, tot el dia','Pan recién hecho todo el día'),p:L('A les nostres botigues, cada dia.','En nuestras tiendas, cada día.'),
  cta:`<a class="btn green" href="#establiments">${svg('pin')}${L('Troba la teva botiga','Encuentra tu tienda')}</a>`},
 {img:'peix',eyebrow:L('Fresc de mercat','Fresco de mercado'),h:L('El tall que tu vulguis','El corte que tú quieras'),p:L('Demana la quantitat, el gruix i el tall que vulguis, amb el consell dels nostres professionals.','Pide la cantidad, el grosor y el corte que quieras, con el consejo de nuestros profesionales.'),
  cta:`<a class="btn green" href="#fresc">${L('Descobreix el fresc','Descubre el fresco')}${svg('arrow')}</a>`},
 {img:'xarc',eyebrow:L('Xarcuteria','Charcutería'),h:L('El racó de l’ibèric','El rincón del ibérico'),p:L('Pernil de Guijuelo, Huelva, Dehesa de Extremadura i Teruel, tallat a mà.','Jamón de Guijuelo, Huelva, Dehesa de Extremadura y Teruel, cortado a mano.'),
  cta:`<a class="btn green" href="#fresc">${L('Veure xarcuteria','Ver charcutería')}${svg('arrow')}</a>`},
 {img:'eco',eyebrow:L('Productes de proximitat','Productos de proximidad'),h:L('Fruita i verdura de la nostra terra','Fruta y verdura de nuestra tierra'),p:L('El 80% de l’oferta és de proximitat. Cada setmana, producte ecològic certificat.','El 80% de la oferta es de proximidad. Cada semana, producto ecológico certificado.'),
  cta:`<button class="btn" data-act="cat-go" data-v="fruita">${svg('cart')}${L('Veure fruita i verdura','Ver fruta y verdura')}</button>`}
];
ROUTES.inici=()=>{
  const offers=PRODUCTS.filter(p=>p.o).slice(0,4);
  const act=(cls,href,ic,t,d,go)=>`<a class="acttile ${cls} rv" href="${href}">${svg(ic,'class="big"')}<div><strong>${t}</strong><span class="d">${d}</span></div><span class="go">${go}${svg('arrow')}</span></a>`;
  return `
<section class="hero" id="hero" aria-roledescription="carousel" aria-label="${L('Presentació','Presentación')}">
  <div class="slides">${HERO_SLIDES().map((s,i)=>`<article class="slide ${i?'':'on'}" role="group" aria-roledescription="${L('diapositiva','diapositiva')}" aria-label="${i+1} / ${HERO_SLIDES().length}" ${i?'aria-hidden="true" inert':''}>
    <img src="img/hero/${s.img}.jpg" alt="" ${i?'loading="lazy"':'fetchpriority="high"'} decoding="async">
    <div class="wrap sc"><span class="eyebrow">${s.eyebrow}</span>${i?`<h2>${s.h}</h2>`:`<h1>${s.h}</h1>`}<p class="lead">${s.p}</p><div class="hcta">${s.cta}</div></div></article>`).join('')}</div>
  <div class="wrap hctl"><div class="dots" role="group" aria-label="${L('Tria una diapositiva','Elige una diapositiva')}">${HERO_SLIDES().map((s,i)=>`<button class="dot ${i?'':'on'}" data-act="hdot" data-v="${i}" aria-label="${L('Diapositiva','Diapositiva')} ${i+1}"${i?'':' aria-current="true"'}><i></i></button>`).join('')}</div>
   <div class="arrows"><button class="iconbtn" data-act="hprev" aria-label="${L('Anterior','Anterior')}">${svg('back')}</button><button class="iconbtn" id="hplay" data-act="hplay" aria-label="${L('Atura el carrusel','Detén el carrusel')}">${svg('pause')}</button><button class="iconbtn" data-act="hnext" aria-label="${L('Següent','Siguiente')}">${svg('arrow')}</button></div></div>
</section>

<section class="sec"><div class="wrap">
  <div class="shead"><h2>${L('Què vols fer avui?','¿Qué quieres hacer hoy?')}</h2></div>
  <div class="acts4">
   ${act('red','#botiga','cart',L('Fer la compra online','Hacer la compra online'),L('Tria els productes i rep’ls a casa.','Elige los productos y recíbelos en casa.'),L('Començar','Empezar'))}
   ${act('dark','#ofertes','tag',L('Veure les ofertes','Ver las ofertas'),L('Els preus especials d’aquest mes.','Los precios especiales de este mes.'),L('Veure-les','Verlas'))}
   ${act('','#establiments','store',L('Trobar la meva botiga','Encontrar mi tienda'),L('Nou botigues a Barcelona.','Nueve tiendas en Barcelona.'),L('Veure botigues','Ver tiendas'))}
   ${act('','#contacte','phone',L('Trucar o escriure’ns','Llamar o escribirnos'),TEL,L('Contactar','Contactar'))}
  </div></div></section>

<section class="sec tight"><div class="wrap">
  <div class="shead"><h2>${L('Ofertes del mes','Ofertas del mes')}</h2><a class="link" href="#ofertes">${L('Veure-les totes','Verlas todas')}${svg('arrow')}</a></div>
  <div class="pgrid">${offers.map(prodCard).join('')}</div>
</div></section>

${aboutHTML()}

<section class="sec tight"><div class="wrap">
  <div class="shead"><h2>${L('Com funciona la botiga online','Cómo funciona la tienda online')}</h2></div>
  <div class="steps">
   <div class="rv"><h3>${L('Tria','Elige')}</h3><p>${L('Navega per seccions o enganxa la teva llista.','Navega por secciones o pega tu lista.')}</p></div>
   <div class="rv"><h3>${L('Programa','Programa')}</h3><p>${L('Escull la botiga i la franja horària, de 9 a 21 h.','Escoge la tienda y la franja horaria, de 9 a 21 h.')}</p></div>
   <div class="rv"><h3>${L('Rep','Recibe')}</h3><p>${L(`Gratuït a casa a partir de ${FREE_FROM} €; per sota, només ${FEE} €. O passa-la a recollir.`,`Gratis en casa a partir de ${FREE_FROM} €; por debajo, solo ${FEE} €. O pásalo a recoger.`)}</p></div>
  </div>
</div></section>



<section class="follow" aria-label="${L('Xarxes socials','Redes sociales')}"><div class="wrap"><a class="wa" href="https://wa.me/${WA_HREF}" aria-label="WhatsApp ${WA}" title="WhatsApp">${svg('wa')}</a><a class="ig" href="https://www.instagram.com/jespacsupermercats/" aria-label="Instagram" title="Instagram">${svg('ig')}</a><a class="fb" href="https://www.facebook.com/profile.php?id=61556109172075" aria-label="Facebook" title="Facebook">${svg('fb')}</a></div></section>`};

/* ---------- SHOP ---------- */
ROUTES.botiga=()=>head('',L('Botiga online','Tienda online'),L('Repartiment gratuït des de 60 €. Els preus són finals i el servei va inclòs.','Reparto gratuito desde 60 €. Los precios son finales y el servicio va incluido.'))+`
<section class="sec tight"><div class="wrap shop">
 <button class="btn ghost block sidetoggle" id="sidetoggle" data-act="sidetoggle" aria-expanded="false" aria-controls="side"></button>
 <div class="sidewrap" id="sidewrap"><nav class="side" id="side" aria-label="${L('Seccions','Secciones')}"></nav></div>
 <div><div class="toolbar"><div class="searchbox"><label class="sr" for="q">${L('Cerca','Buscar')}</label>${svg('search')}<input id="q" type="search" placeholder="${L('Cerca un producte…','Busca un producto…')}" value="${esc(shop.q)}" autocomplete="off"></div>
  <label class="sr" for="sort">${L('Ordena','Ordenar')}</label><select id="sort"><option value="rel">${L('Recomanats','Recomendados')}</option><option value="pa">${L('Preu: de menys a més','Precio: de menor a mayor')}</option><option value="pd">${L('Preu: de més a menys','Precio: de mayor a menor')}</option><option value="az">A–Z</option></select>
  <button class="btn ghost sm" data-act="listopen">${svg('list')}${L('Enganxa la teva llista','Pega tu lista')}</button></div>
  <div class="tagrow" id="tagrow" style="margin-bottom:1rem"></div>
  <div class="pgrid" id="grid"></div><div id="more" style="text-align:center;margin-top:2rem"></div></div>
</div></section>`;
TITLES.botiga=()=>L('Botiga online','Tienda online');

function filtered(){
  let a=PRODUCTS.filter(p=>(shop.cat==='all'||p.c===shop.cat)&&(!shop.tag||(shop.tag==='oferta'?p.o:p.tags.includes(shop.tag))));
  const q=norm(shop.q.trim());
  if(q)a=a.filter(p=>norm(p.ca+' '+p.es).includes(q));
  if(shop.sort==='pa')a.sort((x,y)=>unitPrice(x)-unitPrice(y));
  if(shop.sort==='pd')a.sort((x,y)=>unitPrice(y)-unitPrice(x));
  if(shop.sort==='az')a.sort((x,y)=>pname(x).localeCompare(pname(y)));
  return a;
}
function paintShop(full){
  const g=$('#grid');if(!g)return;
  if(full||!$('#side').children.length){
    $('#side').innerHTML=`<h4>${L('Seccions','Secciones')}</h4><button data-act="cat" data-v="all" aria-pressed="${shop.cat==='all'}" style="--cc:var(--red)">${svg('basket')}${L('Tot','Todo')}</button>`+CATS.map(c=>`<button data-act="cat" data-v="${c[0]}" aria-pressed="${shop.cat===c[0]}" style="--cc:${c[3]}">${svg(c[0])}${L(c[1],c[2])}</button>`).join('');
    $('#tagrow').innerHTML=[['oferta',L('Ofertes','Ofertas')],['local','Local'],['eco','Eco'],['nou',L('Novetats','Novedades')],['premium','Premium']].map(t=>`<button data-act="tag" data-v="${t[0]}" aria-pressed="${shop.tag===t[0]}">${t[1]}</button>`).join('');
    $('#sort').value=shop.sort;
    const cur=shop.cat==='all'?L('Tot','Todo'):L(CAT[shop.cat].ca,CAT[shop.cat].es);
    $('#sidetoggle').innerHTML=`${svg('basket')}<span>${L('Seccions','Secciones')}: <b>${cur}</b></span>${svg('chev')}`;
  }
  const a=filtered();
  const shown=a.slice(0,shop.limit);
  $('#more').innerHTML=a.length>shown.length?`<button class="btn green" data-act="more">${L('Mostra\'n més','Muestra más')} <span style="opacity:.7">(${a.length-shown.length})</span></button>`:'';
  g.innerHTML=a.length?shown.map(prodCard).join(''):`<div class="empty" style="grid-column:1/-1">${svg('search')}<p style="margin-inline:auto">${L('No hem trobat cap producte. Prova una altra cerca o envia’ns la llista.','No hemos encontrado ningún producto. Prueba otra búsqueda o envíanos la lista.')}</p></div>`;
}

/* paste-a-list */
let listMatches=[];
function openList(on){
  let m=$('#modal');
  if(!m){m=document.createElement('div');m.id='modal';m.className='modal';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m)openList(false)})}
  if(on){m.innerHTML=`<div class="box"><div style="display:flex;justify-content:space-between;align-items:center;gap:1rem"><h3 style="margin:0">${L('Enganxa la teva llista','Pega tu lista')}</h3><button class="iconbtn" data-act="listclose" aria-label="${L('Tancar','Cerrar')}">${svg('close')}</button></div>
   <p style="margin:.8rem 0">${L('Escriu o enganxa un producte per línia (per exemple “2 llet”, “tomàquet”, “pernil”). Trobarem les coincidències al nostre catàleg.','Escribe o pega un producto por línea (por ejemplo “2 leche”, “tomate”, “jamón”). Encontraremos las coincidencias en nuestro catálogo.')}</p>
   <label class="sr" for="listtxt">${L('Llista','Lista')}</label><textarea id="listtxt" placeholder="2 llet&#10;tomàquet&#10;pa de pagès"></textarea>
   <div id="matches" style="margin:1rem 0"></div>
   <div style="display:flex;gap:.6rem;flex-wrap:wrap"><button class="btn" data-act="listmatch">${svg('search')}${L('Cerca coincidències','Buscar coincidencias')}</button><button class="btn dark" data-act="listadd" id="addall" disabled>${svg('cart')}${L('Afegeix a la cistella','Añadir a la cesta')}</button></div></div>`;
   listMatches=[];requestAnimationFrame(()=>{m.classList.add('on');syncOverlay();$('#listtxt').focus()})}
  else{m.classList.remove('on');syncOverlay()}
}
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function matchList(){
  const txt=$('#listtxt').value.split('\n').map(s=>s.trim()).filter(Boolean);
  listMatches=txt.map(line=>{
    const m=line.match(/^(\d+(?:[.,]\d+)?)\s*(?:x|kg|u)?\s+(.*)$/i);
    const qty=m?parseFloat(m[1].replace(',','.')):1,term=norm(m?m[2]:line);
    const p=PRODUCTS.find(p=>norm(p.ca+' '+p.es).includes(term))||PRODUCTS.find(p=>term.split(' ').some(w=>w.length>3&&norm(p.ca+' '+p.es).includes(w)));
    return {line,p,qty};
  });
  $('#matches').innerHTML=listMatches.map(r=>`<div class="match"><span>${esc(r.line)}</span><span>${r.p?`<b>${esc(pname(r.p))}</b> · ${eur(unitPrice(r.p))}`:`<em style="color:var(--red-ink)">${L('Sense coincidència','Sin coincidencia')}</em>`}</span></div>`).join('');
  $('#addall').disabled=!listMatches.some(r=>r.p);
}
function addMatches(){
  let n=0;const ids=[];listMatches.forEach(r=>{if(!r.p)return;const q=r.p.u==='kg'?Math.max(r.p.step,r.qty):Math.max(1,Math.round(r.qty));cart[r.p.id]={q:(cart[r.p.id]?.q||0)+q,note:cart[r.p.id]?.note||''};ids.push(r.p.id);n++});
  saveCart();ids.forEach(id=>syncCards(id,false));refreshCart(true);openList(false);toast(L(`${n} productes afegits a la cistella`,`${n} productos añadidos a la cesta`));openCart(true);
}

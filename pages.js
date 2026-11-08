/* ---------- shared pieces for every content page ---------- */
const stepbar=n=>`<div class="stepbar" aria-label="${L('Passos de la compra','Pasos de la compra')}">${[L('Cistella','Cesta'),L('Dades i entrega','Datos y entrega'),L('Confirmació','Confirmación')].map((t,i)=>`<span class="${i+1<n?'done':i+1===n?'on':''}" ${i+1===n?'aria-current="step"':''}><i>${i+1<n?'✓':i+1}</i>${t}</span>`).join('')}</div>`;
const head=(crumb,title,lead,extra='')=>{
  const r=currentRoute(),b=baseRoute(r),g=groupOf(r),sub=g&&g.id!=='comprar'&&SUBNAV[g.id],cur=b==='feina'?'treballa':b;
  return `<section class="phead"><div class="wrap"><div class="crumbs"><a href="#inici">${svg('back')}${L('Inici','Inicio')}</a>${g?`<span aria-hidden="true">/</span><span>${L(g.t[0],g.t[1])}</span>`:''}</div>
  <h1>${title}</h1>${lead?`<p class="lead">${lead}</p>`:''}
  ${sub?`<nav class="subnav" aria-label="${L(g.t[0],g.t[1])}">${sub.map(id=>{const i=itemOf(id);return `<a href="#${id}" ${id===cur?'aria-current="page"':''}>${L(i[1][0],i[1][1])}</a>`}).join('')}</nav>`:''}${extra}</div></section>`};

const telHref=t=>t.replace(/\s/g,'');
const linkify=t=>esc(t).replace(/([\w.+-]+@[\w-]+\.[\w.-]*\w)/g,'<a href="mailto:$1">$1</a>').replace(/(^|[\s(])((?:https?:\/\/|www\.)[^\s<]*[^\s<.,;:)])/g,(m,a,u)=>`${a}<a href="${u.startsWith('http')?u:'https://'+u}">${u}</a>`);
const docOf=k=>(DOCS[lang]&&DOCS[lang][k])||DOCS.ca[k];
function docParts(k){
  const d=docOf(k),lead=[];let i=0;
  while(i<d.b.length&&d.b[i][0]==='p'){lead.push(d.b[i][1]);i++}
  const secs=[];let cur=null;
  d.b.slice(i).forEach(([t,x])=>{if(t==='h'){cur={h:x,p:[]};secs.push(cur)}else{if(!cur){cur={h:'',p:[]};secs.push(cur)}cur.p.push(x)}});
  return {title:d.t,lead,secs};
}
const secsHTML=(secs,skip)=>secs.filter(s=>!(skip&&skip.test(s.h))).map(s=>`<section class="docsec ${s.h?'':'nohead'} ${s.p.length?'':'label'}">${s.h?`<h2>${esc(s.h)}</h2>`:''}${s.p.length?`<div>${s.p.map(p=>`<p>${linkify(p)}</p>`).join('')}</div>`:''}</section>`).join('');

const STATS=()=>[[1981,'',L('Any de fundació a Barcelona','Año de fundación en Barcelona')],[9,'',L('Establiments a la ciutat','Establecimientos en la ciudad')],[80,'%',L('Fruita i verdura de proximitat','Fruta y verdura de proximidad')],[100,'%',L('Electricitat renovable','Electricidad renovable')]];
const statsHTML=()=>`<div class="stats">${STATS().map(s=>`<div class="stat"><div class="num" data-count="${s[0]}" data-suf="${s[1]}">${s[0]}${s[1]}</div><p>${s[2]}</p></div>`).join('')}</div>`;

/* delivery leaflet (data from the supplied photo) */
const feeBox=()=>`<div class="fee">
  <div class="red"><h3>${L('També repartim les compres inferiors a','También repartimos las compras inferiores a')} ${FREE_FROM} €</h3><b class="t">${L('Per només','Por solo')}</b><div class="coin">${FEE} €</div></div>
  <div class="notes"><strong>${L(`Repartiment gratuït per compres superiors a ${FREE_FROM} €`,`Reparto gratuito para compras superiores a ${FREE_FROM} €`)}</strong>
   <small>${L('De 9 h a 21 h, inclosos migdies.','De 9 h a 21 h, incluidos mediodías.')}</small>
   <small>* ${L(`Hi ha un màxim de ${PACK_BAND} packs d'aigua, llet o garrafes. Cada franja de ${PACK_BAND} packs addicionals té un cost afegit de ${PACK_FEE} € (Per exemple: de 5 a 8 packs tindria un cost de ${PACK_FEE} €, de 9 a 12 packs el cost és de ${PACK_FEE*2} € i successivament).`,`Hay un máximo de ${PACK_BAND} packs de agua, leche o garrafas. Cada franja de ${PACK_BAND} packs adicionales tiene un coste añadido de ${PACK_FEE} € (Por ejemplo: de 5 a 8 packs tendría un coste de ${PACK_FEE} €, de 9 a 12 packs el coste es de ${PACK_FEE*2} € y sucesivamente).`)}</small>
   <small>** ${L(`El servei de repartiment a domicili té un cost de ${FEE} € per a compres inferiors a ${FREE_FROM} €, per a compres superiors a aquest import el servei és totalment gratuït.`,`El servicio de reparto a domicilio tiene un coste de ${FEE} € para compras inferiores a ${FREE_FROM} €, para compras superiores a este importe el servicio es totalmente gratuito.`)}</small></div></div>`;
/* order service by WhatsApp / phone / email (from the leaflet banner on jespac.com) */
const ordersBox=()=>`<div class="sbox"><div><h3>${L('Nou servei de comandes','Nuevo servicio de pedidos')}</h3><p>${L('Pots fer la compra des de casa i la portem al teu domicili.','Puedes hacer la compra desde casa y la llevamos a tu domicilio.')}</p>
  <a class="big" href="https://wa.me/${WA_HREF}">${svg('wa')}${WA}</a><p style="margin:.6rem 0 0">WhatsApp · ${L('telèfon','teléfono')} · email</p></div>
  <div><ul><li>${svg('mail')}<a href="mailto:${ORDERS_MAIL}">${ORDERS_MAIL}</a></li>
  <li>${svg('clock')}${L('Horari d’atenció: de dilluns a divendres, de 9 a 14 h','Horario de atención: de lunes a viernes, de 9 a 14 h')}</li>
  <li>${svg('truck')}${L('Entrega el mateix dia o abans de 24 h*','Entrega el mismo día o antes de 24 h*')}</li>
  <li>${svg('pin')}${L('Àrea de repartiment: 5 illes (500 m a la rodona del teu establiment)','Área de reparto: 5 manzanas (500 m alrededor de tu establecimiento)')}</li>
  <li>${svg('card')}${L('Pagament al repartidor, amb targeta o efectiu','Pago al repartidor, con tarjeta o efectivo')}</li></ul>
  <p style="font-size:.8rem;margin:.9rem 0 0;opacity:.8">* ${L('El temps màxim de lliurament és de 24 h, encara que probablement es podran lliurar el mateix dia les comandes que es facin abans de les 19 h.','El tiempo máximo de entrega es de 24 h, aunque probablemente se podrán entregar el mismo día los pedidos que se hagan antes de las 19 h.')}</p></div></div>`;

/* ---------- "Qui som" on the landing: strengths told with big photos ---------- */
function aboutHTML(){
  const S=[
   ['img/cat/carn.jpg',L('Fresc de mercat','Fresco de mercado'),L('Som la combinació perfecta entre supermercats moderns i parades de mercat tradicional, ateses per professionals especialitzats.','Somos la combinación perfecta entre supermercados modernos y puestos de mercado tradicional, atendidos por profesionales especializados.'),'#fresc',L('Descobreix el fresc','Descubre el fresco')],
   ['img/cat/eco.jpg',L('Productes de proximitat','Productos de proximidad'),L('Apostem pel producte de la nostra terra, els d’aquí. Promovem el consum de productes «Kilòmetre 0»: el 80% de l’oferta de fruita i verdura és de proximitat.','Apostamos por el producto de nuestra tierra, los de aquí. Promovemos el consumo de productos «Kilómetro 0»: el 80% de la oferta de fruta y verdura es de proximidad.'),'#fresc',L('Fruita i verdura de temporada','Fruta y verdura de temporada')],
   ['img/cat/sec.jpg',L('Llibertat de decidir la teva compra','Libertad de decidir tu compra'),L('Oferim una gran varietat de productes de primeres marques i de les nostres marques exclusives, Alteza i Selex, on podràs escollir i decidir. Sempre amb el compromís de mantenir preus ajustats, continus i estables.','Ofrecemos una gran variedad de productos de primeras marcas y de nuestras marcas exclusivas, Alteza y Selex, donde podrás elegir y decidir. Siempre con el compromiso de mantener precios ajustados, continuos y estables.'),'#oferim',L('Què t’oferim','Qué te ofrecemos')],
   ['img/story/repartiment.jpg',L('Repartiment a domicili','Reparto a domicilio'),L(`Gaudeix la comoditat de marxar del supermercat, sense bosses, amb la confiança de rebre tota la teva compra a casa. Gratuït a partir de ${FREE_FROM} €; per sota, només ${FEE} €.`,`Disfruta la comodidad de irte del supermercado, sin bolsas, con la confianza de recibir toda tu compra en casa. Gratis a partir de ${FREE_FROM} €; por debajo, solo ${FEE} €.`),'#oferim',L('Veure el servei','Ver el servicio')],
   ['img/story/energia.jpg',L('Compromesos amb el planeta','Comprometidos con el planeta'),L('Renovem les botigues per fer-les més eficients —neveres tancades, llums de baix consum, portes automàtiques— i el nostre subministrador elèctric només proveeix energia renovable: 0% de combustibles fòssils.','Renovamos las tiendas para hacerlas más eficientes —neveras cerradas, luces de bajo consumo, puertas automáticas— y nuestro suministrador eléctrico solo provee energía renovable: 0% de combustibles fósiles.'),'#empresa',L('Coneix Jespac','Conoce Jespac')]
  ];
  return `<section class="sec tight" id="quisom"><div class="wrap">
  <span class="eyebrow">${L('Qui som','Quiénes somos')}</span>
  <div class="shead" style="margin-bottom:1.4rem"><h2>${L('Una empresa familiar catalana, des de 1981','Una empresa familiar catalana, desde 1981')}</h2></div>
  <p class="lead">${L('Som una empresa de supermercats de proximitat, basats en un ampli assortiment de productes de primeres marques, especialitzant-nos en l’alimentació, drogueria i perfumeria.','Somos una empresa de supermercados de proximidad, basados en un amplio surtido de productos de primeras marcas, especializándonos en la alimentación, droguería y perfumería.')}</p>
  ${statsHTML()}
  ${S.map((s,i)=>`<article class="story ${i%2?'flip':''}"><div class="sphoto"><img class="f" src="${s[0]}" alt="" loading="lazy" decoding="async"></div><div class="stext"><h3>${s[1]}</h3><p>${s[2]}</p><a class="btn green" href="${s[3]}">${s[4]}${svg('arrow')}</a></div></article>`).join('')}
  <div class="values">${[['Responsabilitat','Responsabilidad'],['Honestedat','Honestidad'],['Constància','Constancia'],['Treball en equip','Trabajo en equipo']].map(v=>`<span class="pill">${L(v[0],v[1])}</span>`).join('')}</div>
  <div style="margin-top:2.5rem"><a class="btn" href="#empresa">${L('Coneix Jespac','Conoce Jespac')}${svg('arrow')}</a></div>
  </div></section>`;
}

/* ---------- forms (demo: nothing is sent yet) ---------- */
function demoForm(btn){
  const f=btn.closest('form');if(!f.checkValidity()){f.reportValidity();return}
  f.innerHTML=`<div class="check" style="margin:0 0 12px"><svg viewBox="0 0 52 52"><path d="M12 27l10 10 18-20"/></svg></div><h3>${L('Formulari preparat','Formulario preparado')}</h3><p class="note">${L('Demo: aquest formulari encara no està connectat a cap servidor, així que no s\'ha enviat res.','Demo: este formulario aún no está conectado a ningún servidor, así que no se ha enviado nada.')}</p>`;
}
const formShell=inner=>`<form class="card form" novalidate onsubmit="return false">${inner}<label style="display:flex;gap:10px;align-items:flex-start;font-weight:400"><input type="checkbox" required style="width:auto;margin-top:6px;accent-color:var(--red)"><span>${L('He llegit i accepto la clàusula de protecció de dades.','He leído y acepto la cláusula de protección de datos.')} <a href="https://www.jespac.com/clausules-proteccio-dades-f2/">${L('Llegir','Leer')}</a></span></label><button class="btn" data-act="demo-form" style="justify-self:start">${L('Envia','Envía')}</button></form>`;
const inp=(id,l,t='text',req=true)=>`<label for="${id}">${l}${req?' *':''}<input id="${id}" type="${t}" ${req?'required':''}></label>`;

/* ---------- pages made from the original texts ---------- */
ROUTES.empresa=()=>{const p=docParts('empresa');return head('',L('Qui som','Quiénes somos'),p.lead.map(esc).join(' '))+`
<section class="sec tight"><div class="wrap">${statsHTML()}<div class="docs" style="margin-top:3.5rem">${secsHTML(p.secs)}</div></div></section>`};
TITLES.empresa=()=>L('Qui som','Quiénes somos');

ROUTES.compra360=()=>{const p=docParts('compra360'),d=docOf('compra360');return head('',L('La compra rodona (360°)','La compra redonda (360°)'),esc(d.t))+`
<section class="sec tight"><div class="wrap grid2" style="align-items:start"><div class="rv"><svg class="ring" viewBox="0 0 400 400" role="img" aria-label="${L('Prestatges en forma de U','Estantes en forma de U')}"><circle class="dash" cx="200" cy="200" r="150" fill="none" stroke="#8CC63F" stroke-width="3" stroke-dasharray="4 14" stroke-linecap="round"/><path d="M80 90v160a70 70 0 0 0 70 70h100a70 70 0 0 0 70-70V90" fill="none" stroke="#262626" stroke-width="22" stroke-linecap="round"/><circle cx="200" cy="230" r="26" fill="#F7403A"/><text x="200" y="237" text-anchor="middle" fill="#fff" font-weight="700" font-size="20" font-family="DejaVu Sans Condensed,sans-serif">360°</text></svg></div>
<div class="docs">${secsHTML([{h:'',p:p.lead},...p.secs])}</div></div></section>`};
TITLES.compra360=()=>L('La compra rodona','La compra redonda');

ROUTES.fresc=()=>{const p=docParts('fresc');return head('',L('Fresc de mercat','Fresco de mercado'),p.lead.map(esc).join(' '))+`
<section class="sec tight"><div class="wrap"><div class="grid3" style="margin-bottom:2.5rem">${['carn','xarc','fruita'].map(k=>`<figure class="phcard"><img class="f" src="img/cat/${k}.jpg" alt="" loading="lazy"><figcaption>${svg(k)}${k==='carn'?L('Carnisseria','Carnicería'):k==='xarc'?L('Xarcuteria','Charcutería'):L('Fruiteria','Frutería')}</figcaption></figure>`).join('')}</div>
<div class="docs"><img class="crate" src="img/jespac/home-fresc-de-mercat1.jpg" alt="${L('Fresc de mercat Jespac','Fresco de mercado Jespac')}" width="400" height="400" loading="lazy">${secsHTML(p.secs)}</div>
<div style="margin-top:2.5rem"><a class="btn" href="#botiga">${svg('cart')}${L('Encarrega-ho online','Encárgalo online')}</a></div></div></section>`};
TITLES.fresc=()=>L('Fresc de mercat','Fresco de mercado');

ROUTES.oferim=()=>{const p=docParts('oferim');return head('',esc(docOf('oferim').t||L('Què t’oferim?','¿Qué te ofrecemos?')),p.lead.map(esc).join(' '))+`
<section class="sec tight"><div class="wrap"><div style="display:grid;gap:1.5rem">${feeBox()}${ordersBox()}</div><div class="docs" style="margin-top:3rem">${secsHTML(p.secs)}</div>
<div style="margin-top:2.5rem"><a class="btn" href="#botiga">${svg('cart')}${L('Anar a la botiga online','Ir a la tienda online')}</a></div></div></section>`};
TITLES.oferim=()=>L('Serveis','Servicios');

ROUTES.ofertes=()=>{const p=docParts('ofertes'),d=docOf('ofertes');return head('',esc(d.t.replace(/\s+/g,' ')||L('Ofertes','Ofertas')),esc(p.lead[0]||''))+`
<section class="sec tight"><div class="wrap"><div class="band leaf rv" style="margin-bottom:3rem"><div><h2 style="font-size:1.8rem">${L('Fullet d’ofertes','Folleto de ofertas')}</h2>${p.lead.slice(1).map(x=>`<p>${esc(x)}</p>`).join('')}</div><a class="btn" href="https://online.fliphtml5.com/onidea/vnma/">${L('Obrir el fullet','Abrir el folleto')}${svg('arrow')}</a></div>
<div class="shead"><h2>${L('Ofertes del mes a la botiga online','Ofertas del mes en la tienda online')}</h2></div><div class="pgrid">${PRODUCTS.filter(p=>p.o).map(prodCard).join('')}</div></div></section>`};
TITLES.ofertes=()=>L('Ofertes','Ofertas');

ROUTES.igualtat=()=>{const p=docParts('igualtat'),cta=/consultar el nostre pla|consultar nuestro plan/i;const btn=(p.secs.find(s=>cta.test(s.h))||{}).h||L('Aquí pots consultar el nostre pla d’igualtat','Aquí puedes consultar nuestro plan de igualdad');
  return head('',L('Pla d’igualtat','Plan de igualdad'),p.lead.map(esc).join(' '))+`<section class="sec tight"><div class="wrap"><div class="docs">${secsHTML(p.secs,cta)}</div>
<div style="margin-top:2rem"><a class="btn" href="https://www.jespac.com/Documentacio/plan_igualdad_jespac.pdf">${esc(btn)}${svg('arrow')}</a></div></div></section>`};
TITLES.igualtat=()=>L('Pla d’igualtat','Plan de igualdad');

ROUTES.solidaritat=()=>{const p=docParts('solidaritat'),d=docOf('solidaritat');return head('',esc(d.t||L('Mulla’t per l’Esclerosi Múltiple','Mójate por la Esclerosis Múltiple')),'')+`
<section class="sec tight"><div class="wrap"><div class="docs">${secsHTML([{h:'',p:p.lead},...p.secs])}</div>
<div style="margin-top:2rem"><a class="btn" href="https://www.mullat.cat/repte?id=Jespac">www.mullat.cat${svg('arrow')}</a></div></div></section>`};
TITLES.solidaritat=()=>L('Mulla’t per l’Esclerosi Múltiple','Mójate por la Esclerosis Múltiple');

ROUTES.feina=()=>{const p=docParts('feina'),skip=/formulari|formulario|Anar al|Ir al/i;return head('',L('Ofertes de treball','Ofertas de trabajo'),p.lead.map(esc).join(' '))+`
<section class="sec tight"><div class="wrap"><article class="card rv" style="max-width:46rem"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap"><h3 style="margin:0">${L('Repartidor/a','Repartidor/a')}</h3><span class="pill leaf">${L('Contracte indefinit de 36 h','Contrato indefinido de 36 h')}</span></div>
<ul class="list" style="margin:1rem 0"><li><b>${L('Tipus de contracte','Tipo de contrato')}:</b> ${L('Contracte indefinit de 36 h','Contrato indefinido de 36 h')}</li><li><b>${L('Experiència','Experiencia')}:</b> ${L('No es requereix experiència','No se requiere experiencia')}</li></ul>
<p>${L('Necessitem professionals amb vocació de treballar de cara al client. Es realitzaran tasques d’embossat, reposició i repartiment a domicili.','Necesitamos profesionales con vocación de trabajar de cara al cliente. Se realizarán tareas de embolsado, reposición y reparto a domicilio.')}</p>
<p style="margin-bottom:1.4rem">${L('Si hi ha una vacant que t’interessa, ves a la pàgina de «Treballa amb nosaltres» i omple el formulari per enviar-nos les teves dades i el teu currículum.','Si hay una vacante que te interesa, ve a la página de «Trabaja con nosotros» y rellena el formulario para enviarnos tus datos y tu currículum.')}</p><a class="btn" href="#treballa">${L('Omple el formulari de treball','Rellena el formulario de trabajo')}${svg('arrow')}</a></article>
<div class="docs" style="margin-top:3rem">${secsHTML(p.secs,skip)}</div></div></section>`};
TITLES.feina=()=>L('Ofertes de treball','Ofertas de trabajo');

ROUTES.treballa=()=>head('',L('Treballa amb nosaltres','Trabaja con nosotros'),L('Som una empresa en constant evolució i sovint necessitem noves incorporacions de personal per a les nostres botigues. Si vols treballar amb nosaltres pots enviar-nos el teu currículum.','Somos una empresa en constante evolución y a menudo necesitamos nuevas incorporaciones de personal para nuestras tiendas. Si quieres trabajar con nosotros puedes enviarnos tu currículum.'))+`
<section class="sec tight"><div class="wrap grid2" style="align-items:start"><div><h2>${L('Formulari de treball','Formulario de trabajo')}</h2><p>${L('Amb aquest formulari et pots posar en contacte amb nosaltres per enviar-nos les teves dades i el teu currículum. Els tindrem en compte per a properes vacants.','Con este formulario puedes ponerte en contacto con nosotros para enviarnos tus datos y tu currículum. Los tendremos en cuenta para próximas vacantes.')}</p>${formShell(`<div class="two">${inp('w1',L('Nom','Nombre'))}${inp('w2',L('Primer cognom','Primer apellido'))}</div><div class="two">${inp('w3',L('Segon cognom','Segundo apellido'))}${inp('w4','E-mail','email')}</div>${inp('w5',L('Telèfon contacte','Teléfono contacto'),'tel')}<label for="w6">${L('Lloc de treball al qual optes','Puesto al que optas')}<select id="w6">${[['Reponedor/a','Reponedor/a'],['Repartidor/a','Repartidor/a'],['Caixer/a','Cajero/a'],['Carnisseria','Carnicería'],['Xarcuteria','Charcutería'],['Fruiteria','Frutería']].map(o=>`<option>${L(o[0],o[1])}</option>`).join('')}</select></label><label for="w7">${L('Puja el currículum (màx. 2 MB)','Sube el currículum (máx. 2 MB)')}<input id="w7" type="file" accept=".pdf,.doc,.docx"></label><label for="w8">${L('Comentaris','Comentarios')}<textarea id="w8" rows="3"></textarea></label>`)}</div>
<div class="card rv"><h3>${L('Consulta de vacants disponibles','Consulta de vacantes disponibles')}</h3><p>${L('En aquest vincle pots consultar els anuncis de les vacants de què disposem actualment:','En este vínculo puedes consultar los anuncios de las vacantes de que disponemos actualmente:')}</p><a class="btn" href="#feina">${L('Consultar ofertes de treball','Consultar ofertas de trabajo')}${svg('arrow')}</a></div></div></section>`;
TITLES.treballa=()=>L('Treballa amb nosaltres','Trabaja con nosotros');

ROUTES.contacte=()=>head('',L('Contacta amb nosaltres','Contacta con nosotros'),L('Valorem positivament el contacte amb els nostres clients i sempre intentarem respondre a qualsevol de les teves consultes o suggeriments.','Valoramos positivamente el contacto con nuestros clientes y siempre intentaremos responder a cualquiera de tus consultas o sugerencias.'))+`
<section class="sec tight"><div class="wrap grid2" style="align-items:start"><div><h2>${L('Formulari per clients','Formulario para clientes')}</h2><p>${L('Amb aquest formulari et pots posar en contacte amb nosaltres, expressar els teus suggeriments, queixes o bé sol·licitar la targeta client.','Con este formulario puedes ponerte en contacto con nosotros, expresar tus sugerencias, quejas o solicitar la tarjeta cliente.')}</p>${formShell(`<div class="two">${inp('c1',L('Nom','Nombre'))}${inp('c2',L('Cognom','Apellido'))}</div><div class="two">${inp('c3','E-mail','email')}${inp('c4',L('Telèfon de contacte','Teléfono de contacto'),'tel')}</div><label for="c5">${L('Motiu','Motivo')}<select id="c5"><option>${L('Targeta de client','Tarjeta de cliente')}</option><option>${L('Suggeriments','Sugerencias')}</option><option>${L('Queixes','Quejas')}</option><option>${L('Contacte','Contacto')}</option></select></label><label for="c6">${L('El teu missatge','Tu mensaje')}<textarea id="c6" rows="4"></textarea></label>`)}</div>
<div style="display:grid;gap:1.5rem"><div class="card rv"><h3>${L('Informació de contacte','Información de contacto')}</h3><ul class="list"><li>${L('Telèfon','Teléfono')}: <a href="tel:${TEL_HREF}"><b>${TEL}</b></a></li><li>Fax: 932 539 042</li><li>Email: <a href="mailto:${MAIL}">${MAIL}</a></li><li>C/ Alcúdia 9-11<br>08016 Barcelona</li></ul></div>${ordersBox()}</div></div></section>`;
TITLES.contacte=()=>L('Contacta amb nosaltres','Contacta con nosotros');

ROUTES.ticket=()=>head('',L('Vols rebre el ticket per email?','¿Quieres recibir el ticket por email?'),L('També rebràs un resum de totes les teves compres mensuals realitzades a Jespac.','También recibirás un resumen de todas tus compras mensuales realizadas en Jespac.'))+`
<section class="sec tight"><div class="wrap" style="max-width:46rem"><h2>${L('Demana el teu ticket','Pide tu ticket')}</h2><p>${L('Amb aquest formulari et pots donar d’alta en el nostre servei d’enviament de tickets per email per a que els puguis rebre periòdicament al teu email.','Con este formulario te puedes dar de alta en nuestro servicio de envío de tickets por email para que los puedas recibir periódicamente en tu email.')}</p>${formShell(`<div class="two">${inp('t1',L('Nom','Nombre'))}${inp('t2',L('Cognom','Apellido'))}</div>${inp('t3','E-mail','email')}<div class="two">${inp('t4',L('Telèfon contacte','Teléfono contacto'),'tel',false)}${inp('t5',L('Número de client','Número de cliente'),'text',false)}</div>`)}</div></section>`;
TITLES.ticket=()=>L('Ticket per email','Ticket por email');

/* ---------- stores: list + one page per store with its own phone ---------- */
const SVC_ICONS=['shield','card','truck','clock','hands','mail','cart','pack','basket','tag','forn','vins','fruita','cong'];
ROUTES.establiments=()=>head('',L('Els nostres establiments','Nuestros establecimientos'),L('Cerca la tenda de Jespac més propera a casa teva i podràs gaudir de tots els serveis que t’oferim, perquè el servei va inclòs a la teva compra.','Busca la tienda de Jespac más próxima a tu casa y podrás disfrutar de todos los servicios que te ofrecemos, porque el servicio va incluido en tu compra.'))+`
<section class="sec tight"><div class="wrap"><ul class="list svcs">${SERVICES.map((s,i)=>`<li>${svg(SVC_ICONS[i]||'check')}${L(s[0],s[1])}</li>`).join('')}</ul>
<div class="shead" style="margin-top:4.5rem;margin-bottom:1.2rem"><h2>${L('On ens pots trobar?','¿Dónde encontrarnos?')}</h2></div>
<p class="lead">${L('Estem a Barcelona. Treballem perquè puguis tenir un establiment de Jespac a prop teu.','Estamos en Barcelona. Trabajamos para que puedas tener un establecimiento de Jespac cerca de ti.')}</p>
<p>${L('Ens pots trobar a Barcelona on, progressivament, anem ampliant la nostra xarxa d’establiments per donar servei als diferents barris de la ciutat. Totes les nostres tendes mantenen la mateixa qualitat en el servei, en els productes de primeres marques, de les nostres pròpies marques exclusives i de les parades de mercat tradicional, amb seccions de fruiteria, carnisseria, xarcuteria i peixateria.','Nos puedes encontrar en Barcelona donde, progresivamente, vamos ampliando nuestra red de establecimientos para dar servicio a los diferentes barrios de la ciudad. Todas nuestras tiendas mantienen la misma calidad en el servicio, en los productos de primeras marcas, de nuestras propias marcas exclusivas y de los puestos de mercado tradicional, con secciones de frutería, carnicería, charcutería y pescadería.')}</p>
<div class="grid3" style="margin-top:2.5rem">${STORES.map(s=>`<article class="card store"><span class="pill leaf" style="align-self:flex-start">${L('Obert 9–21 h','Abierto 9–21 h')}</span><h3>${esc(s.short)}</h3><a class="tel" href="tel:${telHref(s.tel)}">${svg('phone')}${s.tel}</a><div class="acts"><a class="btn green sm" href="#tenda-${s.slug}">${L('Veure la botiga','Ver la tienda')}</a><button class="btn sm" data-act="store" data-v="${s.id}">${L('Prepara aquí la comanda','Prepara aquí el pedido')}</button></div></article>`).join('')}</div></div></section>`;
TITLES.establiments=()=>L('Els nostres establiments','Nuestros establecimientos');

function storePage(s){
  const phc=k=>`<figure class="phcard"><img class="f" src="img/cat/${k}.jpg" alt="" loading="lazy"><figcaption>${svg(k)}${k==='carn'?L('Carnisseria','Carnicería'):k==='xarc'?L('Xarcuteria','Charcutería'):L('Fruiteria','Frutería')}</figcaption></figure>`;
  return head('',esc(s.short),L('Repartiment gratuït a domicili','Reparto gratuito a domicilio'))+`
<section class="sec tight"><div class="wrap"><div class="grid2" style="align-items:start">
 <div class="card store"><span class="pill leaf" style="align-self:flex-start">${L('Obert 9–21 h','Abierto 9–21 h')}</span><h3>${L('Telèfons de contacte','Teléfonos de contacto')}</h3><a class="tel" href="tel:${telHref(s.tel)}">${svg('phone')}${s.tel}</a><p class="addr" style="margin:0">${esc(s.full)}, Barcelona</p>
  <div class="acts"><a class="btn green sm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.full+', Barcelona')}">${svg('pin')}${L('Com arribar-hi','Cómo llegar')}</a><button class="btn sm" data-act="store" data-v="${s.id}">${L('Prepara aquí la comanda','Prepara aquí el pedido')}</button></div></div>
 <div><h2>${L('Treballem per ser la millor proposta de supermercat del teu barri','Trabajamos para ser la mejor propuesta de supermercado de tu barrio')}</h2><p class="lead">${L('En aquesta tenda trobaràs la millor qualitat en el servei, podràs comparar i triar entre les principals i més reconegudes marques del mercat i un ampli assortiment de les nostres pròpies marques exclusives, també gaudiràs dels productes més frescos a les parades de mercat tradicional.','En esta tienda encontrarás la mejor calidad en el servicio, podrás comparar y elegir entre las principales y más reconocidas marcas del mercado y un amplio surtido de nuestras propias marcas exclusivas, también disfrutarás de los productos más frescos en los puestos de mercado tradicional.')}</p></div></div>
 <div class="shead" style="margin-top:4rem"><h2>${L('Les parades fresques de mercat que hi trobaràs','Los puestos frescos de mercado que encontrarás')}</h2></div><div class="grid3">${['carn','xarc','fruita'].map(phc).join('')}</div>
 <div class="shead" style="margin-top:4rem"><h2>${L('Altres botigues','Otras tiendas')}</h2></div><ul class="list svcs">${STORES.filter(o=>o.id!==s.id).map(o=>`<li><a href="#tenda-${o.slug}" style="color:var(--fg);font-weight:700">${esc(o.short)}</a> <span style="color:var(--mut)">· ${o.tel}</span></li>`).join('')}</ul></div></section>`;
}
STORES.forEach(s=>{ROUTES['tenda-'+s.slug]=()=>storePage(s);TITLES['tenda-'+s.slug]=()=>s.short});

/* ---------- legal pages: verbatim text of the current site ---------- */
const MORE_DOCS=()=>`<div class="morelinks">${[['Bases concurs Instagram','https://www.jespac.com/bases-concurs-instagram-3/'],[L('Clàusules de protecció de dades','Cláusulas de protección de datos'),'https://www.jespac.com/clausules-proteccio-dades-f2/']].map(l=>`<a class="btn green sm" href="${l[1]}">${l[0]}${svg('arrow')}</a>`).join('')}</div>`;
const legalPage=(key,fallbackTitle)=>()=>{const p=docParts(key),d=docOf(key);return head('',esc((d.t||fallbackTitle).replace(/:$/,'')),'')+`<section class="sec tight"><div class="wrap"><div class="docs legaldoc">${secsHTML([{h:'',p:p.lead},...p.secs])}</div>${MORE_DOCS()}</div></section>`};
ROUTES.legal=legalPage('legal','Avís legal');TITLES.legal=()=>L('Avís legal','Aviso legal');
ROUTES.privacitat=legalPage('privacitat','Política de privacitat');TITLES.privacitat=()=>L('Política de privacitat','Política de privacidad');
ROUTES.cookies=legalPage('cookies','Política de cookies');TITLES.cookies=()=>L('Política de cookies','Política de cookies');

/* ---------- site map ---------- */
ROUTES.mapa=()=>head('',L('Mapa del web','Mapa del sitio'),L('Totes les pàgines del web, ordenades per temes.','Todas las páginas del sitio, ordenadas por temas.'))+`
<section class="sec tight"><div class="wrap"><div class="smap">${SITE.map(g=>`<div class="card"><h3>${svg(g.ic)}${L(g.t[0],g.t[1])}</h3><ul>${g.items.map(i=>`<li><a href="#${i[0]}">${L(i[1][0],i[1][1])}<small>${L(i[2][0],i[2][1])}</small></a></li>`).join('')}</ul></div>`).join('')}</div></div></section>`;
TITLES.mapa=()=>L('Mapa del web','Mapa del sitio');

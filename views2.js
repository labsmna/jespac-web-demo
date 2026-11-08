/* ---------- CHECKOUT ---------- */
const DAYS=()=>{const out=[];const d=new Date();let i=0;while(out.length<6){d.setDate(d.getDate()+1);if(d.getDay()!==0)out.push(new Date(d));if(++i>14)break}return out};
const SLOTS=['9–11','11–13','13–15','15–17','17–19','19–21'];
const fld=(id,label,type='text',extra='')=>`<label for="${id}">${label}<input id="${id}" name="${id}" type="${type}" value="${esc(co.f[id]||'')}" ${extra}><small class="e">${L('Revisa aquest camp.','Revisa este campo.')}</small></label>`;

ROUTES.comanda=()=>{
  if(!cnt())return head('',L('Finalitzar la comanda','Finalizar el pedido'),'',stepbar(2))+`<div class="wrap sec"><div class="empty">${svg('cart','width="72" height="72"')}<p style="margin-inline:auto">${L('La cistella és buida.','La cesta está vacía.')}</p><a class="btn" href="#botiga">${L('Anar a la botiga','Ir a la tienda')}</a></div></div>`;
  const prev=store.get('jp-orders',[]);
  return head('',L('Finalitzar la comanda','Finalizar el pedido'),'',stepbar(2))+`
<div class="wrap sec" style="padding-top:0"><div class="co"><form class="form" id="coform" novalidate>
 <div class="card form"><h3>1 · ${L('Com la vols rebre?','¿Cómo la quieres recibir?')}</h3>
  <label class="opt"><input type="radio" name="mode" ${co.mode==='delivery'?'checked':''} onchange="co.mode='delivery';render(true)"><div><b>${L('Repartiment a domicili','Reparto a domicilio')}</b><span>${L(`Gratuït des de ${FREE_FROM} €, sinó ${eur(FEE)}. Màx. ${PACK_BAND} packs d'aigua, llet o garrafes; cada franja de ${PACK_BAND} packs addicionals +${eur(PACK_FEE)}. Només Barcelona ciutat.`,`Gratis desde ${FREE_FROM} €, si no ${eur(FEE)}. Máx. ${PACK_BAND} packs de agua, leche o garrafas; cada franja de ${PACK_BAND} packs adicionales +${eur(PACK_FEE)}. Solo Barcelona ciudad.`)}</span></div></label>
  <label class="opt"><input type="radio" name="mode" ${co.mode==='pickup'?'checked':''} onchange="co.mode='pickup';render(true)"><div><b>${L('Recollir a la botiga','Recoger en tienda')}</b><span>${L('Sense cost. T’avisem quan estigui preparada.','Sin coste. Te avisamos cuando esté preparada.')}</span></div></label>
  <label for="storesel">${L('Botiga que prepara la comanda','Tienda que prepara el pedido')}<select id="storesel">${STORES.map(s=>`<option value="${s.id}" ${co.store===s.id?'selected':''}>${esc(s.short)}</option>`).join('')}</select></label></div>
 <div class="card form"><h3>2 · ${L('Les teves dades','Tus datos')}</h3>
  <div class="two">${fld('nom',L('Nom','Nombre'),'text','autocomplete="given-name" required')}${fld('cognom',L('Cognom','Apellido'),'text','autocomplete="family-name" required')}</div>
  <div class="two">${fld('email','E-mail','email','autocomplete="email" required')}${fld('tel',L('Telèfon','Teléfono'),'tel','autocomplete="tel" required')}</div>
  ${co.mode==='delivery'?`${fld('adreca',L('Adreça','Dirección'),'text','autocomplete="street-address" required')}<div class="two">${fld('pis',L('Pis / porta','Piso / puerta'),'text')}${fld('cp',L('Codi postal','Código postal'),'text','inputmode="numeric" maxlength="5" placeholder="080XX" required')}</div>`:''}
  <label for="coment">${L('Comentaris per al repartidor o la botiga','Comentarios para el repartidor o la tienda')}<textarea id="coment" rows="2">${esc(co.f.coment||'')}</textarea></label>
  <div><b style="font-family:var(--ui);font-size:.88rem">${L('Si falta algun producte','Si falta algún producto')}</b>
   <div class="tagrow" style="margin-top:8px">${[['sub',L('Substituir per un de similar','Sustituir por uno similar')],['rem',L('Treure’l de la comanda','Quitarlo del pedido')],['call',L('Truqueu-me','Llamadme')]].map(o=>`<label class="opt" style="padding:8px 14px"><input type="radio" name="sub" value="${o[0]}" ${co.sub===o[0]?'checked':''}>${o[1]}</label>`).join('')}</div></div></div>
 <div class="card"><h3>3 · ${co.mode==='delivery'?L('Franja d’entrega','Franja de entrega'):L('Franja de recollida','Franja de recogida')}</h3><div class="days" id="days"></div><div class="slots" id="slots"></div><small class="e" id="sloterr" style="color:var(--red-ink);font-weight:600;display:none;font-family:var(--ui)">${L('Escull un dia i una franja.','Elige un día y una franja.')}</small></div>
 <div class="card form"><h3>4 · ${L('Pagament','Pago')}</h3>
  <label class="opt"><input type="radio" name="pay" value="card" ${co.pay==='card'?'checked':''}><div><b>${L('Targeta online','Tarjeta online')}</b><span>${L('Pagament segur amb Stripe.','Pago seguro con Stripe.')}</span></div></label>
  <label class="opt"><input type="radio" name="pay" value="door" ${co.pay==='door'?'checked':''}><div><b>${co.mode==='delivery'?L('Targeta o efectiu en el lliurament','Tarjeta o efectivo en la entrega'):L('Pagar a la botiga','Pagar en tienda')}</b><span>${L('Pagues quan reps o recull la comanda.','Pagas cuando recibes o recoges el pedido.')}</span></div></label>
  ${co.pay==='card'?`<div class="stripebox"><b>${L('Aquí es carregarà el formulari segur de Stripe','Aquí se cargará el formulario seguro de Stripe')}</b><i></i><div style="display:flex;gap:8px"><i style="flex:1"></i><i style="flex:1"></i></div>${L('Prototip: no es cobra res ni es guarda cap dada de targeta.','Prototipo: no se cobra nada ni se guarda ningún dato de tarjeta.')}</div>`:''}
 </div>
 </form>
 <aside><div class="card"><h3>${L('Resum','Resumen')}</h3><div id="summary"></div>
  <button class="btn" style="width:100%;justify-content:center;margin-top:14px" data-act="place" id="placebtn"></button>
  <p style="font-family:var(--ui);font-size:.78rem;color:var(--mut);margin:12px 0 0">${L('Demo: la comanda no s’envia a cap servidor fins que es connecti el backend.','Demo: el pedido no se envía a ningún servidor hasta que se conecte el backend.')}</p></div>
  ${prev.length?`<div class="card" style="margin-top:14px"><h4>${L('Repeteix l’última comanda','Repite el último pedido')}</h4><p style="font-size:.9rem;margin-bottom:10px">${prev[0].id} · ${eur(prev[0].total)}</p><button class="btn green sm" data-act="reorder">${L('Afegeix-ho a la cistella','Añadir a la cesta')}</button></div>`:''}
 </aside></div></div>`};
TITLES.comanda=()=>L('Finalitzar la comanda','Finalizar el pedido');

function paintSummary(){
  const el=$('#summary');if(!el)return;const st=subtotal(),bf=baseFee(),pf=packFee(),tot=st+bf+pf;
  el.innerHTML=lines().map(l=>`<div class="match"><span>${fmtQ(l.p)(l.q)} · ${esc(pname(l.p))}</span><b>${eur(unitPrice(l.p)*l.q)}</b></div>`).join('')+
  `<div class="sum" style="margin-top:12px"><div><span>${L('Subtotal','Subtotal')}</span><span>${eur(st)}</span></div><div><span>${co.mode==='pickup'?L('Recollida','Recogida'):L('Repartiment','Reparto')}</span><span>${bf?eur(bf):L('Gratuït','Gratis')}</span></div>${pf?`<div><span>${L('Packs addicionals','Packs adicionales')} (${heavyCount()})</span><span>${eur(pf)}</span></div>`:''}<div class="tot"><span>Total</span><span>${eur(tot)}</span></div></div>`;
  $('#placebtn').textContent=(co.pay==='card'?L('Paga ','Paga '):L('Confirma ','Confirma '))+eur(tot);
}
function paintSlots(){
  const days=DAYS(),dEl=$('#days'),sEl=$('#slots');if(!dEl)return;
  const fmt=new Intl.DateTimeFormat(lang==='es'?'es-ES':'ca-ES',{weekday:'short'}),fm2=new Intl.DateTimeFormat(lang==='es'?'es-ES':'ca-ES',{day:'numeric',month:'short'});
  dEl.innerHTML=days.map((d,i)=>`<button type="button" class="day" data-act="day" data-v="${i}" aria-pressed="${co.day===i}">${fmt.format(d)}<small>${fm2.format(d)}</small></button>`).join('');
  sEl.innerHTML=SLOTS.map((s,i)=>{const full=(co.day*7+i*3)%11===4;return `<button type="button" class="slot" data-act="slot" data-v="${i}" aria-pressed="${co.slot===i}" ${full?'disabled':''}>${s} h${full?` · ${L('Plena','Llena')}`:''}</button>`}).join('');
}
function readForm(){$$('#coform input[type=text],#coform input[type=email],#coform input[type=tel],#coform textarea').forEach(i=>co.f[i.id||i.name]=i.value)}
function placeOrder(){
  readForm();const req=['nom','cognom','email','tel'].concat(co.mode==='delivery'?['adreca','cp']:[]);let bad=null;
  req.forEach(id=>{const el=$('#'+id);let ok=!!co.f[id]?.trim();
    if(id==='email')ok=/^\S+@\S+\.\S+$/.test(co.f[id]||'');if(id==='tel')ok=(co.f[id]||'').replace(/\D/g,'').length>=9;if(id==='cp')ok=/^080\d{2}$/.test((co.f[id]||'').trim());
    el.classList.toggle('err',!ok);if(!ok&&!bad)bad=el});
  const slotBad=co.slot<0;$('#sloterr').style.display=slotBad?'block':'none';
  if(bad){bad.focus();if($('#cp')===bad)toast(L('De moment només repartim a Barcelona ciutat (080XX).','De momento solo repartimos en Barcelona ciudad (080XX).'));return}
  if(slotBad){$('#days').scrollIntoView({behavior:'smooth',block:'center'});return}
  const d=DAYS()[co.day];
  lastOrder={id:'JSP-'+String(Date.now()).slice(-6),total:subtotal()+fee(),mode:co.mode,store:STORES[co.store],day:d.toISOString(),slot:SLOTS[co.slot],email:co.f.email,items:lines().map(l=>({id:l.p.id,q:l.q,note:l.note}))};
  const prev=store.get('jp-orders',[]);prev.unshift(lastOrder);store.set('jp-orders',prev.slice(0,5));
  cart={};saveCart();location.hash='gracies';
}
function reorder(){const o=store.get('jp-orders',[])[0];if(!o)return;o.items.forEach(i=>{cart[i.id]={q:i.q,note:i.note||''}});saveCart();refreshCart();render(true);toast(L('Comanda anterior afegida','Pedido anterior añadido'))}
ROUTES.gracies=()=>{
  const o=lastOrder||store.get('jp-orders',[])[0];if(!o)return ROUTES.botiga();
  const when=new Intl.DateTimeFormat(lang==='es'?'es-ES':'ca-ES',{weekday:'long',day:'numeric',month:'long'}).format(new Date(o.day));
  return `<div class="wrap sec" style="max-width:720px">${stepbar(3)}<div class="check" style="margin-top:1.6rem"><svg viewBox="0 0 52 52"><path d="M12 27l10 10 18-20"/></svg></div>
  <h1 style="font-size:2.4rem">${L('Comanda rebuda','Pedido recibido')}</h1>
  <p class="lead">${L(`Gràcies. Hem registrat la comanda ${o.id}. T’enviarem la confirmació a ${esc(o.email)}.`,`Gracias. Hemos registrado el pedido ${o.id}. Te enviaremos la confirmación a ${esc(o.email)}.`)}</p>
  <div class="card"><div class="sum"><div><span>${o.mode==='pickup'?L('Recollida a','Recogida en'):L('Preparada a','Preparado en')}</span><b>${esc(o.store.short)}</b></div><div><span>${L('Quan','Cuándo')}</span><b>${when}, ${o.slot} h</b></div><div class="tot"><span>Total</span><span>${eur(o.total)}</span></div></div></div>
  <p class="note" style="margin-top:16px">${L('Aquesta és una demo: no s’ha enviat cap comanda real ni s’ha fet cap cobrament.','Esto es una demo: no se ha enviado ningún pedido real ni se ha realizado ningún cobro.')}</p>
  <a class="btn" href="#inici">${L('Tornar a l’inici','Volver al inicio')}</a></div>`};


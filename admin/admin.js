/* Jespac · Administració — PROTOTIP amb dades inventades. Res no està connectat a cap base de dades. */
const $=(s,r=document)=>r.querySelector(s);
const eur=n=>n.toLocaleString('ca-ES',{style:'currency',currency:'EUR'});
const fmt=n=>Math.round(n).toLocaleString('ca-ES');
const hs=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)};
const rnd=(seed)=>{let s=hs(String(seed))||1;return()=>{s=(Math.imul(s,1103515245)+12345)>>>0;return s/4294967296}};
const img=id=>`<img class="th" src="../img/p/${id}.jpg" alt="" onerror="this.style.visibility='hidden'">`;
const PR=id=>PRODUCTS.find(p=>p.id===id)||PRODUCTS[0];
const stock=(p,i)=>{const r=rnd(p.id+'#'+i);let v=Math.round(r()*110)+4;if(p.id==='c1'&&i<5)v=Math.round(r()*4);if(p.id==='f11'||p.id==='x9')v=Math.round(r()*7);return v};
const totalStock=p=>STORES.reduce((s,_,i)=>s+stock(p,i),0);
const ST={new:['Nova','st-new'],prep:['En preparació','st-prep'],ready:['Llesta','st-ready'],ship:['En repartiment','st-ship'],done:['Lliurada','st-done']};
const pill=k=>`<span class="pill ${ST[k][1]}">${ST[k][0]}</span>`;
const tagHTML=p=>p.tags.map(t=>`<span class="tag">${(TAGS[t]||[t])[0]}</span>`).join('')+(p.o?'<span class="tag red">Oferta</span>':'');

/* ---------- charts (inline SVG) ---------- */
function bars(vals,{w=640,h=220,color='#8CC63F',hi=-1}={}){
  const m=Math.max(...vals)*1.1,bw=w/vals.length;
  return `<svg viewBox="0 0 ${w} ${h+26}" style="width:100%;height:auto">${[0,.25,.5,.75,1].map(t=>`<line x1="0" x2="${w}" y1="${h*t}" y2="${h*t}" stroke="#E6DFCE"/>`).join('')}${vals.map((v,i)=>{const bh=v/m*h;return `<rect x="${i*bw+bw*.15}" y="${h-bh}" width="${bw*.7}" height="${bh}" rx="4" fill="${i===hi?'#F7403A':color}"/>`}).join('')}${[0,7,14,21,28].map(i=>`<text x="${i===0?0:i*bw+bw/2}" y="${h+18}" font-size="11" fill="#6A655A" text-anchor="${i===0?'start':'middle'}">${(i+1)} nov</text>`).join('')}</svg>`;
}
function line2(a,b,{w=640,h=220}={}){
  const m=Math.max(...a,...b)*1.1,st=w/(a.length-1);
  const path=v=>v.map((y,i)=>`${i?'L':'M'}${(i*st).toFixed(1)} ${(h-y/m*h).toFixed(1)}`).join('');
  return `<svg viewBox="0 0 ${w} ${h+26}" style="width:100%;height:auto">${[0,.25,.5,.75,1].map(t=>`<line x1="0" x2="${w}" y1="${h*t}" y2="${h*t}" stroke="#E6DFCE"/>`).join('')}<path d="${path(a)}L${w} ${h}L0 ${h}Z" fill="#8CC63F" opacity=".18"/><path d="${path(b)}" fill="none" stroke="#B9B2A0" stroke-width="2.5" stroke-dasharray="5 5"/><path d="${path(a)}" fill="none" stroke="#2F6B0F" stroke-width="3"/><circle cx="${(a.length-1)*st}" cy="${h-a[a.length-1]/m*h}" r="5" fill="#2F6B0F"/>${['setm. 1','setm. 2','setm. 3','setm. 4'].map((t,i)=>`<text x="${i*w/3}" y="${h+18}" font-size="11" fill="#6A655A" text-anchor="${i?i===3?'end':'middle':'start'}">${t}</text>`).join('')}</svg>`;
}
function donut(items,{size=170}={}){
  const tot=items.reduce((s,i)=>s+i[1],0);let acc=0,r=62,c=2*Math.PI*r;
  return `<svg viewBox="0 0 170 170" style="width:${size}px;height:${size}px">${items.map(it=>{const f=it[1]/tot,seg=`<circle cx="85" cy="85" r="${r}" fill="none" stroke="${it[2]}" stroke-width="26" stroke-dasharray="${(f*c).toFixed(1)} ${(c-f*c).toFixed(1)}" stroke-dashoffset="${(-acc*c).toFixed(1)}" transform="rotate(-90 85 85)"/>`;acc+=f;return seg}).join('')}<text x="85" y="82" text-anchor="middle" font-size="22" font-weight="700" font-family="DejaVu Sans Condensed">${fmt(tot)}</text><text x="85" y="102" text-anchor="middle" font-size="11" fill="#6A655A">total</text></svg>`;
}
const legend=items=>`<div style="display:grid;gap:.45rem;font-size:.85rem">${items.map(i=>`<div style="display:flex;align-items:center;gap:.5rem"><i style="width:.7rem;height:.7rem;border-radius:.2rem;background:${i[2]}"></i>${i[0]}<b style="margin-left:auto;padding-left:1rem;white-space:nowrap">${i[3]||fmt(i[1])}</b></div>`).join('')}</div>`;

/* ---------- invented data ---------- */
const sales30=(()=>{const r=rnd('sales');return Array.from({length:30},(_,i)=>3800+i*55+(i%7>4?900:0)+r()*900)})();
const sales30b=sales30.map((v,i)=>v*(.82+((i*7)%5)/60));
const ORD=[
 ['JSP-248613','Maria Puig','Mallorca, 214','dl 11/11 · 9–11 h',7,86.40,'Targeta','prep','C'],
 ['JSP-248612','Jordi Serra','Muntaner, 187','dl 11/11 · 9–11 h',12,142.15,'Targeta','new','R'],
 ['JSP-248611','Carme Vidal','Arimon, 11','dl 11/11 · 11–13 h',5,38.20,'Efectiu','new','R'],
 ['JSP-248610','Pere Soler','Av. dels Quinze, 64-67','dl 11/11 · 11–13 h',18,203.90,'Targeta','prep','C'],
 ['JSP-248609','Montserrat Roca','Consell de Cent, 246','dl 11/11 · 13–15 h',9,64.75,'Targeta','ready','C'],
 ['JSP-248608','Josep Ferrer','Floridablanca, 133','dl 11/11 · 9–11 h',4,27.60,'Recollida','ready','C'],
 ['JSP-248607','Núria Costa','Paral·lel, 106','dl 11/11 · 9–11 h',14,118.30,'Targeta','ship','R'],
 ['JSP-248606','Antoni Mas','Jaume Fabra, 7-9','dl 11/11 · 9–11 h',6,52.45,'Efectiu','ship','R'],
 ['JSP-248605','Rosa Vila','Rep. Argentina, 179','dg 10/11 · 17–19 h',11,96.05,'Targeta','done','C'],
 ['JSP-248604','Joan Pons','Mallorca, 214','dg 10/11 · 15–17 h',3,18.90,'Targeta','done','C'],
 ['JSP-248603','Dolors Casals','Muntaner, 187','dg 10/11 · 13–15 h',16,171.20,'Targeta','done','C'],
 ['JSP-248602','Francesc Bosch','Arimon, 11','dg 10/11 · 11–13 h',8,70.35,'Efectiu','done','R']
];
const NAV=[['resum','Resum','home'],['comandes','Comandes','pack',14],['productes','Productes i estoc','basket'],['ofertes','Ofertes','tag'],['portada','Portada','star'],['estadistiques','Estadístiques','chart'],['franges','Repartiment i franges','truck']];

/* ---------- pages ---------- */
const PAGES={};
PAGES.resum=()=>`
<div class="ph"><div><h1>Bon dia, Marta</h1><p>Dilluns 11 de novembre · resum de totes les botigues</p></div><div class="acts"><button class="btn line">${svg('dl')}Exporta l'informe</button><button class="btn">${svg('plus')}Nova oferta</button></div></div>
<div class="grid g4">
 <div class="card kpi"><div class="l">${svg('pack')}Comandes d'avui</div><div class="v">86</div><span class="up">▲ 12 % respecte ahir</span></div>
 <div class="card kpi"><div class="l">${svg('coin')}Vendes d'avui</div><div class="v">${eur(6482)}</div><span class="up">▲ 8 % respecte ahir</span></div>
 <div class="card kpi"><div class="l">${svg('cart')}Tiquet mitjà</div><div class="v">${eur(75.37)}</div><span class="down">▼ 2 % respecte ahir</span></div>
 <div class="card kpi alert"><div class="l" style="color:var(--red-ink)">${svg('warn')}Pendents de preparar</div><div class="v" style="color:var(--red-ink)">14</div><span class="down">3 amb franja a punt de vèncer</span></div>
</div>
<div class="grid g21" style="margin-top:1rem">
 <div class="card"><div class="hd"><h2>${svg('chart')}Vendes dels últims 30 dies</h2><div class="leg"><span><i style="background:#8CC63F"></i>Aquest mes</span><span><i style="background:#B9B2A0"></i>Mes anterior</span></div></div>${line2(sales30.slice(-28),sales30b.slice(-28))}</div>
 <div class="card"><div class="hd"><h2>${svg('bell')}Cal fer</h2><small>5 avisos</small></div><ul class="todo">
  <li>${svg('warn').replace('<svg','<svg class="w"')}<div><b>12 productes amb estoc baix</b><small>Entrecot de vedella, Pernil ibèric… <a href="#productes" style="color:var(--red-ink);font-weight:700">Veure</a></small></div></li>
  <li>${svg('clock').replace('<svg','<svg class="a"')}<div><b>3 comandes a punt de vèncer la franja</b><small>Franja 9–11 h · Mallorca i Muntaner</small></div></li>
  <li>${svg('tag').replace('<svg','<svg class="a"')}<div><b>L'oferta «Cava de Nadal» acaba demà</b><small>Renovar o retirar el preu rebaixat</small></div></li>
  <li>${svg('refresh').replace('<svg','<svg class="i"')}<div><b>2 devolucions pendents</b><small>Garantia de devolució · revisar</small></div></li>
  <li>${svg('mail').replace('<svg','<svg class="i"')}<div><b>6 missatges de clients</b><small>Targeta client i suggeriments</small></div></li></ul></div>
</div>
<div class="grid g21" style="margin-top:1rem">
 <div class="card"><div class="hd"><h2>${svg('pack')}Comandes recents</h2><a href="#comandes" class="btn green sm">Veure totes</a></div>${ordersTable(ORD.slice(0,6))}</div>
 <div class="card"><div class="hd"><h2>${svg('clock')}Franges d'avui</h2><small>capacitat</small></div><div style="display:grid;gap:.85rem">${[['9–11 h',16,16],['11–13 h',14,16],['13–15 h',9,16],['15–17 h',6,16],['17–19 h',4,16],['19–21 h',2,16]].map(s=>`<div><div style="display:flex;justify-content:space-between;font-weight:700"><span>${s[0]}</span><span>${s[1]}/${s[2]}</span></div><div class="bar ${s[1]>=s[2]?'r':s[1]>=12?'a':''}"><i style="width:${s[1]/s[2]*100}%"></i></div></div>`).join('')}</div></div>
</div>`;

function ordersTable(rows,selId){
  return `<table class="tbl ord"><thead><tr><th>Comanda</th><th>Client</th><th>Botiga</th><th>Entrega</th><th class="num">Total</th><th>Estat</th></tr></thead><tbody>${rows.map(o=>`<tr data-o="${o[0]}" class="${o[0]===selId?'rowsel':''}"><td><b>${o[0]}</b></td><td>${o[1]}</td><td>${o[2]}</td><td>${o[3]}</td><td class="num"><b>${eur(o[5])}</b></td><td>${pill(o[7])}</td></tr>`).join('')}</tbody></table>`;
}

PAGES.comandes=()=>{
  const items=[['c1','Entrecot de vedella','0,75 kg',16.43,'Talla\'l fi, per a planxa'],['f3','Tomàquet de penjar','1 kg',3.29,''],['l3','Ous de gallines lliures L','2 dotzenes',5.90,''],['r3','Cafè en gra','1 u',5.95,''],['b10','Pa de pasta mare','1 u',3.20,''],['r5','Oli d\'oliva verge extra','2 u',15.90,'']];
  return `<div class="ph"><div><h1>Comandes</h1><p>Prepara, revisa i fes el seguiment de cada comanda</p></div><div class="acts"><button class="btn line">${svg('print')}Imprimeix albarans</button><button class="btn line">${svg('dl')}Exporta CSV</button></div></div>
<div class="chips"><span class="chip on">Totes <b>142</b></span><span class="chip">Noves <b>14</b></span><span class="chip">En preparació <b>22</b></span><span class="chip">Llestes <b>9</b></span><span class="chip">En repartiment <b>17</b></span><span class="chip">Lliurades <b>80</b></span></div>
<div class="grid" style="grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);align-items:start">
 <div class="card"><div class="toolbar"><div class="search">${svg('search')}<input placeholder="Cerca per número, client o telèfon"></div><span class="sel">${svg('store')}Totes les botigues</span><span class="sel">${svg('calendar')}Avui</span></div>${ordersTable(ORD,'JSP-248613')}</div>
 <div class="card drawer"><div class="hd"><div><small>COMANDA</small><h2>JSP-248613</h2></div>${pill('prep')}</div>
  <div class="step"><i class="on"></i><i class="on"></i><i></i><i></i><i></i></div><div class="stepl"><span>Rebuda</span><span>Preparació</span><span>Llesta</span><span>Repartiment</span><span>Lliurada</span></div>
  <dl class="kv" style="margin:1rem 0"><dt>Client</dt><dd>Maria Puig · 612 34 56 78</dd><dt>Entrega</dt><dd>dl 11/11, 9–11 h · a domicili</dd><dt>Adreça</dt><dd>C/ Mallorca 214, 3r 2a · 08036</dd><dt>Botiga</dt><dd>C/ Mallorca, 214</dd><dt>Pagament</dt><dd>Targeta (Stripe) · pagat</dd><dt>Si falta algun producte</dt><dd>Substituir per un de similar</dd></dl>
  <h3 style="margin:1rem 0 .3rem">7 articles</h3>${items.map(i=>`<div class="line">${img(i[0])}<div><b>${i[1]}</b>${i[4]?`<div class="note">${i[4]}</div>`:''}</div><div class="q"><b>${eur(i[3])}</b><br><small style="color:var(--mut)">${i[2]}</small></div></div>`).join('')}
  <div class="kv" style="margin-top:.9rem;grid-template-columns:1fr auto"><dt>Subtotal</dt><dd>${eur(51.92)}</dd><dt>Repartiment</dt><dd>${eur(3)}</dd><dt>Packs addicionals (3)</dt><dd>${eur(0)}</dd><dt style="font-weight:800;color:var(--fg)">Total</dt><dd style="font-size:1.1rem">${eur(54.92)}</dd></div>
  <div class="acts" style="margin-top:1rem"><button class="btn">${svg('check2')}Marca com a llesta</button><button class="btn green">${svg('print')}Albarà</button></div></div>
</div>`;
};

PAGES.productes=()=>{
  const rows=['c1','f1','f3','l3','x9','b10','r5','p1','f11','r3','v3','r1'].map(id=>PR(id)).filter(Boolean);
  return `<div class="ph"><div><h1>Productes i estoc</h1><p>${PRODUCTS.length} productes · 9 botigues</p></div><div class="acts"><button class="btn line">${svg('upload')}Importa CSV</button><button class="btn line">${svg('dl')}Exporta</button><button class="btn">${svg('plus')}Nou producte</button></div></div>
<div class="card"><div class="toolbar"><div class="search">${svg('search')}<input placeholder="Cerca per nom o codi"></div><span class="sel">${svg('basket')}Totes les seccions</span><span class="sel">${svg('store')}Totes les botigues</span><span class="chip on" style="height:2.5rem">${svg('warn')}Només estoc baix <b>12</b></span><span class="sp" style="flex:1"></span>
 <span class="pill st-ready" style="background:var(--leaf);color:#1d2a0a">3 seleccionats</span><button class="btn green sm">${svg('percent')}Aplica oferta</button><button class="btn line sm">${svg('coin')}Canvia el preu</button><button class="btn line sm">${svg('eyeoff')}Amaga</button></div>
<table class="tbl"><thead><tr><th></th><th>Producte</th><th>Codi</th><th>Secció</th><th class="num">Preu</th><th class="num">Estoc total</th><th>Estoc per botiga</th><th>Estat</th><th>Visible</th><th></th></tr></thead><tbody>${rows.map((p,i)=>{const tot=totalStock(p),low=tot<60;const cat=CAT[p.c];return `<tr class="${i<3?'rowsel':''}"><td><span style="display:inline-block;width:1.1rem;height:1.1rem;border-radius:.3rem;border:2px solid ${i<3?'#2F6B0F':'#CFC7B4'};background:${i<3?'#8CC63F':'#fff'}"></span></td><td><div class="pn">${img(p.id)}<div><b>${p.ca}</b><small>${p.size||(p.u==='kg'?'Preu per quilo':'')}</small></div></div></td><td style="color:var(--mut)">JSP-${String(hs(p.id)%90000+10000)}</td><td>${cat.ca}</td><td class="num"><b>${eur(p.o??p.p)}</b>${p.o?`<br><s style="color:var(--mut)">${eur(p.p)}</s>`:''}<small style="color:var(--mut)">${p.u==='kg'?' /kg':''}</small></td><td class="num"><b style="color:${low?'var(--red-ink)':'inherit'}">${tot}</b></td><td><div style="display:flex;gap:2px;align-items:flex-end;height:1.6rem">${STORES.map((_,k)=>{const v=stock(p,k);return `<i title="${STORES[k].short}: ${v}" style="width:.55rem;height:${Math.max(12,Math.min(100,v))}%;border-radius:2px;background:${v<10?'#F7403A':'#8CC63F'}"></i>`}).join('')}</div></td><td>${low?'<span class="pill st-low">Estoc baix</span>':'<span class="pill st-ok">Correcte</span>'}</td><td><span class="toggle on"></span></td><td>${svg('edit')}</td></tr>`}).join('')}</tbody></table>
<div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;color:var(--mut)"><span>1–12 de ${PRODUCTS.length}</span><div class="acts"><button class="btn line sm">${svg('back')}</button><button class="btn green sm">1</button><button class="btn line sm">2</button><button class="btn line sm">3</button><button class="btn line sm">${svg('arrow')}</button></div></div></div>`;
};

PAGES.producte=()=>{
  const p=PR('c1');
  return `<div class="ph"><div><small style="color:var(--mut)"><a href="#productes">← Productes</a></small><h1>${p.ca}</h1><p>Codi JSP-${String(hs(p.id)%90000+10000)} · Carnisseria</p></div><div class="acts"><button class="btn line">${svg('eye')}Veure a la botiga</button><button class="btn line">${svg('copy')}Duplica</button></div></div>
<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,2fr);align-items:start">
 <div style="display:grid;gap:1rem"><div class="card"><h3 style="margin-bottom:.8rem">Foto principal</h3><img src="../img/p/${p.id}.jpg" alt="" style="width:100%;border-radius:.9rem;aspect-ratio:4/3;object-fit:cover"><div class="dz" style="margin-top:.8rem">${svg('upload')}<b>Arrossega una foto o fes clic</b><small>JPG o PNG, mínim 800 × 600 px</small></div></div>
 <div class="card"><h3 style="margin-bottom:.8rem">Visibilitat</h3><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem"><span>Visible a la botiga online</span><span class="toggle on"></span></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem"><span>Producte fresc (nota de tall)</span><span class="toggle on"></span></div><div style="display:flex;justify-content:space-between;align-items:center"><span>Compta com a pack pesat</span><span class="toggle"></span></div></div></div>
 <div style="display:grid;gap:1rem"><div class="card"><h3 style="margin-bottom:.9rem">Informació</h3><div class="row2"><div class="field"><label>Nom (català)</label><input class="input" value="${p.ca}"></div><div class="field"><label>Nom (castellà)</label><input class="input" value="${p.es}"></div></div><div class="field"><label>Descripció</label><textarea class="input">Entrecot de vedella femella de primera qualitat, madurat 4–5 dies. Demana'l al gruix que vulguis.</textarea></div>
  <div class="row3"><div class="field"><label>Secció</label><span class="input" style="display:flex;align-items:center">Carnisseria</span></div><div class="field"><label>Venda per</label><span class="input" style="display:flex;align-items:center">Quilo (kg)</span></div><div class="field"><label>Pas de quantitat</label><input class="input" value="0,25 kg"></div></div>
  <div class="field"><label>Etiquetes</label><div>${['Premium','Local','Eco','Nou','Alteza','Selex'].map((t,i)=>`<span class="chip ${i===0?'on':''}" style="margin:0 .4rem .4rem 0;height:2rem">${t}</span>`).join('')}</div></div></div>
 <div class="card"><h3 style="margin-bottom:.9rem">Preu i oferta</h3><div class="row3"><div class="field"><label>Preu (€/kg)</label><input class="input" value="21,90"></div><div class="field"><label>Preu d'oferta</label><input class="input" placeholder="—"></div><div class="field"><label>Oferta vàlida fins</label><input class="input" placeholder="dd/mm/aaaa"></div></div></div>
 <div class="card"><div class="hd"><h3>Estoc per botiga</h3><small>Total: ${totalStock(p)} kg</small></div><table class="tbl"><thead><tr><th>Botiga</th><th class="num">Estoc (kg)</th><th>Avís a</th><th>Estat</th></tr></thead><tbody>${STORES.slice(0,6).map((s,i)=>{const v=stock(p,i);return `<tr><td><b>${s.short}</b></td><td class="num"><input class="input sm" value="${v}"></td><td><input class="input sm" style="width:4.5rem" value="10"></td><td>${v<10?'<span class="pill st-low">Estoc baix</span>':'<span class="pill st-ok">Correcte</span>'}</td></tr>`}).join('')}</tbody></table></div></div>
</div>
<div class="save"><span>${svg('warn')}Tens canvis sense desar</span><div class="acts"><button class="btn line sm" style="background:transparent;color:#fff;border-color:#555">Descarta</button><button class="btn sm">${svg('check2')}Desa els canvis</button></div></div>`;
};

PAGES.ofertes=()=>{
  const offs=[['2,95','Ametlles crues','r7','Preu rebaixat · 15 nov – 24 nov','Totes les botigues','g'],['−20 %','Hortalisses de temporada','f3','Descompte · fins al 17 nov','9 botigues',''],['2x1','Iogurt natural (4 u)','l2','2 × 1 · 11 nov – 13 nov','Només online','g'],['4,95','Cava brut nature','v3','Preu rebaixat · fins al 12 nov','Totes les botigues','']];
  const p=PR('r5');
  return `<div class="ph"><div><h1>Ofertes i promocions</h1><p>Crea preus rebaixats, descomptes i el fullet de la setmana</p></div><div class="acts"><button class="btn line">${svg('upload')}Puja el fullet (PDF)</button><button class="btn">${svg('plus')}Nova oferta</button></div></div>
<div class="grid" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:start">
 <div style="display:grid;gap:1rem"><div class="card"><div class="hd"><h2>${svg('tag')}Ofertes actives i programades</h2><small>4 ofertes</small></div>${offs.map(o=>`<div class="offer ${o[5]}"><div class="big">${o[0]}</div><div style="min-width:0"><b>${o[1]}</b><div style="color:var(--mut);font-size:.85rem">${o[3]} · ${o[4]}</div></div><span class="pill st-ready" style="margin-left:auto">Activa</span></div>`).join('')}</div>
 <div class="card"><div class="hd"><h2>${svg('calendar')}Calendari</h2><small>novembre – desembre</small></div><div class="tl"><span></span>${['1 nov','8','15','22','29','6 des','13','20','27','3','10','17'].map(m=>`<span class="m">${m}</span>`).join('')}
  ${[['Ametlles crues',3,2],['Hortalisses −20 %',2,2],['Iogurt 2x1',1,1],['Cava brut nature',1,3],['Cistella de Nadal',6,4]].map(r=>`<span style="font-weight:700">${r[0]}</span><span class="bar2" style="grid-column:${r[1]+1}/span ${r[2]};${r[0]==='Cistella de Nadal'?'background:var(--red)':''}"></span><span style="grid-column:span ${12-r[1]-r[2]+1}"></span>`).join('')}</div></div></div>
 <div class="card"><h2 style="margin-bottom:1rem">Nova oferta</h2><div class="field"><label>Tipus</label><div>${['Preu rebaixat','Descompte %','2 × 1','Pack'].map((t,i)=>`<span class="chip ${i===0?'on':''}" style="margin:0 .4rem .4rem 0;height:2.1rem">${t}</span>`).join('')}</div></div>
  <div class="field"><label>Producte</label><span class="input" style="display:flex;align-items:center;gap:.6rem">${img(p.id).replace('class="th"','style="width:1.6rem;height:1.6rem;border-radius:.4rem;object-fit:cover"')}${p.ca}</span></div>
  <div class="row2"><div class="field"><label>Preu habitual</label><input class="input" value="${p.p.toFixed(2).replace('.',',')}"></div><div class="field"><label>Preu d'oferta</label><input class="input" value="7,95"></div></div>
  <div class="row2"><div class="field"><label>Des de</label><input class="input" value="11/11/2024"></div><div class="field"><label>Fins a</label><input class="input" value="24/11/2024"></div></div>
  <div class="field"><label>Botigues</label><span class="input" style="display:flex;align-items:center">Totes les botigues (9)</span></div>
  <div class="field"><label>Previsualització a la botiga</label><div class="pcard"><img src="../img/p/${p.id}.jpg" alt="" onerror="this.style.visibility='hidden'"><div><b>${p.ca}</b><div style="color:var(--mut);font-size:.8rem">${p.size}</div><div class="pr">${eur(7.95)}<s>${eur(p.p)}</s></div><div class="ad">Afegir</div></div></div></div>
  <div class="acts"><button class="btn">${svg('check2')}Programa l'oferta</button><button class="btn line">Desa com a esborrany</button></div></div>
</div>`;
};

PAGES.portada=()=>{
  const sl=[['fruita','Cada dia treballem per tu','Perquè puguis fer una compra completa, ara també des de casa.','Fes la compra online','#botiga','Sempre'],['forn','Pa acabat de fer, tot el dia','A les nostres botigues, cada dia.','Troba la teva botiga','#establiments','Sempre'],['peix','El tall que tu vulguis','Demana la quantitat, el gruix i el tall que vulguis.','Descobreix el fresc','#fresc','Sempre'],['xarc','El racó de l\'ibèric','Pernil de Guijuelo, Huelva, Dehesa de Extremadura i Teruel.','Veure xarcuteria','#fresc','Sempre'],['eco','Fruita i verdura de la nostra terra','El 80 % de l\'oferta és de proximitat.','Veure fruita i verdura','#botiga','Fins al 30 nov']];
  return `<div class="ph"><div><h1>Portada</h1><p>Canvia les fotos i els textos del carrusel de la pàgina d'inici</p></div><div class="acts"><button class="btn line">${svg('eye')}Previsualitza</button><button class="btn">${svg('upload')}Publica els canvis</button></div></div>
<div class="grid" style="grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);align-items:start">
 <div class="card"><div class="hd"><h2>${svg('image')}Diapositives</h2><button class="btn green sm">${svg('plus')}Afegeix diapositiva</button></div>
  ${sl.map((s,i)=>`<div class="slide ${i===0?'on':''}"><span class="gr">${svg('grip')}</span><img src="../img/hero/${s[0]}.jpg" alt=""><div style="min-width:0"><b>${s[1]}</b><small>${s[2]}</small><div style="margin-top:.3rem"><span class="tag gray">Botó: ${s[3]}</span> <span class="tag">${s[5]}</span></div></div><div style="display:flex;gap:.4rem;align-items:center"><span class="toggle on"></span>${svg('edit')}</div></div>`).join('')}
  <small style="color:var(--mut)">Arrossega les diapositives per canviar-ne l'ordre. Mida recomanada: 1920 × 1080 px.</small></div>
 <div style="display:grid;gap:1rem"><div class="card"><div class="hd"><h2>Previsualització</h2><div class="acts"><span class="chip on" style="height:2rem">Escriptori</span><span class="chip" style="height:2rem">Mòbil</span></div></div>
   <div class="prev"><img src="../img/hero/fruita.jpg" alt=""><div><small>Supermercats de Barcelona des de 1981</small><h3>Cada dia treballem per tu</h3><p>Perquè puguis fer una compra completa, ara també des de casa.</p><span class="b">Fes la compra online</span></div></div></div>
  <div class="card"><h3 style="margin-bottom:.9rem">Diapositiva 1 · edició</h3><div class="field"><label>Títol</label><input class="input" value="Cada dia treballem per tu"></div><div class="field"><label>Text</label><input class="input" value="Perquè puguis fer una compra completa, ara també des de casa."></div><div class="row2"><div class="field"><label>Text del botó</label><input class="input" value="Fes la compra online"></div><div class="field"><label>Enllaç</label><span class="input" style="display:flex;align-items:center">Botiga online</span></div></div><div class="row2"><div class="field"><label>Visible des de</label><input class="input" value="Sempre"></div><div class="field"><label>Idioma</label><span class="input" style="display:flex;align-items:center">Català · Castellano</span></div></div><div class="dz">${svg('upload')}<b>Canvia la foto</b><small>Arrossega una imatge o fes clic</small></div></div></div>
</div>`;
};

PAGES.estadistiques=()=>{
  const cats=[['Fruita i verdura',24,'#8CC63F','24 %'],['Carnisseria',17,'#F7403A','17 %'],['Rebost',16,'#2F6B0F','16 %'],['Begudes',11,'#E8A317','11 %'],['Làctics i ous',10,'#1863DC','10 %'],['Altres',22,'#B9B2A0','22 %']];
  const r=rnd('heat');const days=['dl','dm','dc','dj','dv','ds','dg'];
  const heat=`<div class="heat"><span></span>${Array.from({length:14},(_,i)=>`<span style="text-align:center">${8+i}</span>`).join('')}${days.map((d,di)=>`<div class="lb">${d}</div>${Array.from({length:14},(_,h)=>{const v=Math.max(0,Math.sin((h-1)/13*Math.PI)*(di>4?.7:1)*(.55+r()*.45));return `<div style="background:rgba(47,107,15,${(.08+v*.85).toFixed(2)})"></div>`}).join('')}`).join('')}</div>`;
  return `<div class="ph"><div><h1>Estadístiques</h1><p>Com va la botiga online · novembre</p></div><div class="acts"><span class="chip">7 dies</span><span class="chip on">30 dies</span><span class="chip">Any</span><button class="btn line">${svg('dl')}Exporta</button></div></div>
<div class="grid g4"><div class="card kpi"><div class="l">${svg('coin')}Vendes</div><div class="v">${eur(168420)}</div><span class="up">▲ 14 %</span></div><div class="card kpi"><div class="l">${svg('pack')}Comandes</div><div class="v">2.234</div><span class="up">▲ 9 %</span></div><div class="card kpi"><div class="l">${svg('users')}Clients nous</div><div class="v">318</div><span class="up">▲ 21 %</span></div><div class="card kpi"><div class="l">${svg('truck')}Repartiment</div><div class="v">71 %</div><span class="down">29 % recollida</span></div></div>
<div class="grid g21" style="margin-top:1rem"><div class="card"><div class="hd"><h2>Vendes per dia</h2><small>€ · últims 30 dies</small></div>${bars(sales30,{hi:29})}</div>
 <div class="card"><div class="hd"><h2>Vendes per secció</h2></div><div style="display:flex;gap:1.2rem;align-items:center;flex-wrap:wrap">${donut(cats.map(c=>[c[0],c[1],c[2]]),{size:150})}<div style="flex:1;min-width:10rem">${legend(cats)}</div></div></div></div>
<div class="grid g3" style="margin-top:1rem"><div class="card"><div class="hd"><h2>Comandes per hora</h2><small>dia × hora</small></div>${heat}</div>
 <div class="card"><div class="hd"><h2>Botigues</h2><small>vendes</small></div><div style="display:grid;gap:.8rem">${STORES.slice(0,6).map((s,i)=>{const v=[100,86,74,66,52,41][i];return `<div><div style="display:flex;justify-content:space-between;font-weight:600"><span>${s.short}</span><b>${eur(v*310)}</b></div><div class="bar"><i style="width:${v}%"></i></div></div>`}).join('')}</div></div>
 <div class="card"><div class="hd"><h2>Cerques sense resultat</h2><small>idees de catàleg</small></div><table class="tbl"><tbody>${[['xocolata sense sucre',48],['llet de civada',37],['pa sense gluten',31],['tofu',24],['quinoa',19]].map(s=>`<tr><td>${s[0]}</td><td class="num"><b>${s[1]}</b></td></tr>`).join('')}</tbody></table></div></div>
<div class="card" style="margin-top:1rem"><div class="hd"><h2>Els 5 productes més venuts</h2></div><table class="tbl"><tbody>${['f2','l1','b10','f1','r3'].map((id,i)=>{const p=PR(id);return `<tr><td style="width:2rem;color:var(--mut)">${i+1}</td><td><div class="pn">${img(p.id)}<b>${p.ca}</b></div></td><td class="num">${fmt(1480-i*190)} unitats</td><td style="width:30%"><div class="bar"><i style="width:${100-i*17}%"></i></div></td><td class="num"><b>${eur((1480-i*190)*(p.o??p.p))}</b></td></tr>`}).join('')}</tbody></table></div>`;
};

PAGES.franges=()=>{
  const days=['dl 11','dm 12','dc 13','dj 14','dv 15','ds 16'],slots=['9–11','11–13','13–15','15–17','17–19','19–21'];
  const r=rnd('slots');
  return `<div class="ph"><div><h1>Repartiment i franges</h1><p>Capacitat per franja, tarifes i zones de repartiment</p></div><div class="acts"><button class="btn line">${svg('copy')}Copia la setmana</button><button class="btn">${svg('check2')}Desa</button></div></div>
<div class="grid g21" style="align-items:start"><div class="card"><div class="hd"><h2>${svg('calendar')}Franges de la setmana</h2><div class="leg"><span><i style="background:#EAF3D6"></i>Lliure</span><span><i style="background:#FFF6D9"></i>Quasi plena</span><span><i style="background:#FFE9E3"></i>Plena</span></div></div>
  <div class="slots"><span></span>${days.map(d=>`<span class="h">${d}</span>`).join('')}${slots.map((t,si)=>`<span class="t">${t} h</span>${days.map((d,di)=>{const cap=16,u=Math.min(cap,Math.round((cap*(.35+r()*.7))*(si>3?.55:1)));const k=u>=cap?'full':u>=12?'mid':'free';return `<div class="cell ${k}"><b>${u}/${cap}</b>${k==='full'?'Plena':k==='mid'?'Quasi plena':'Lliure'}</div>`}).join('')}`).join('')}</div></div>
 <div style="display:grid;gap:1rem"><div class="card"><h3 style="margin-bottom:.9rem">Tarifes de repartiment</h3><div class="row2"><div class="field"><label>Gratuït a partir de</label><input class="input" value="60,00 €"></div><div class="field"><label>Tarifa per sota</label><input class="input" value="3,00 €"></div></div><div class="row2"><div class="field"><label>Packs sense recàrrec</label><input class="input" value="4"></div><div class="field"><label>Recàrrec cada 4 packs</label><input class="input" value="3,00 €"></div></div><small style="color:var(--mut)">Packs pesats: aigua, llet i garrafes. De 5 a 8 packs, 3 €; de 9 a 12, 6 €.</small></div>
 <div class="card"><h3 style="margin-bottom:.9rem">Zones i repartidors</h3><div style="display:grid;gap:.6rem">${[['Eixample dret','08009 · 08010 · 08013'],['Eixample esquerre','08011 · 08015 · 08036'],['Sants-Montjuïc','08014 · 08004']].map(z=>`<div style="display:flex;align-items:center;gap:.7rem;padding:.6rem;border:1px solid var(--line);border-radius:.8rem;background:#fff">${svg('pin')}<div><b>${z[0]}</b><div style="font-size:.8rem;color:var(--mut)">${z[1]}</div></div><span class="toggle on" style="margin-left:auto"></span></div>`).join('')}</div>
  <div style="display:flex;gap:.5rem;margin-top:1rem;flex-wrap:wrap">${['Oriol','Laia','Marc','Aina'].map(n=>`<span class="chip" style="height:2.2rem"><span class="avatar" style="width:1.5rem;height:1.5rem;font-size:.7rem">${n[0]}</span>${n}</span>`).join('')}</div></div></div></div>`;
};

/* ---------- shell + router ---------- */
function shell(route,html){
  const cur=route==='producte'?'productes':route;
  return `<header class="top"><div class="in"><a class="brand" href="#resum"><img src="../img/jespac/logo_jespac.png" alt="Jespac"><small>Administració</small></a>
  <nav class="nav" aria-label="Administració">${NAV.map(n=>`<a href="#${n[0]}" class="${n[0]===cur?'on':''}"${n[0]===cur?' aria-current="page"':''}>${svg(n[2])}<span>${n[1]}</span>${n[3]?`<i class="n">${n[3]}</i>`:''}</a>`).join('')}</nav>
  <div class="tools"><span class="sel">${svg('store')}Totes les botigues ${svg('chev')}</span><span class="ib" title="Avisos">${svg('bell')}<i></i></span><span class="avatar" title="Marta Vidal · Cap de botiga">M</span></div></div></header>
  <main>${html}</main><div id="toast" role="status" aria-live="polite"></div>`;
}
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function countUp(el){
  const t=el.textContent,m=t.match(/[\d.,]+/);if(!m)return;
  const num=parseFloat(m[0].replace(/\./g,'').replace(',','.'));if(!isFinite(num))return;
  const dec=(m[0].split(',')[1]||'').length,pre=t.slice(0,m.index),post=t.slice(m.index+m[0].length);
  const t0=performance.now(),D=900;
  (function f(n){const p=Math.min(1,(n-t0)/D),e=1-Math.pow(1-p,3);
    el.textContent=pre+(num*e).toLocaleString('ca-ES',{minimumFractionDigits:dec,maximumFractionDigits:dec})+post;
    if(p<1)requestAnimationFrame(f)})(t0);
}
function wrap(sel){$$(sel).forEach(t=>{if(!t.parentElement.classList.contains('tw')){const w=document.createElement('div');w.className='tw';t.replaceWith(w);w.append(t)}})}
function enhance(){
  const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  wrap('main table.tbl');wrap('main .slots');wrap('main .tl');
  $$('main svg[style*="width:100%"]').forEach(s=>{s.classList.add('chart');$$('rect',s).forEach((r,i)=>r.style.setProperty('--i',i))});
  $$('.heat div:not(.lb)').forEach((d,i)=>d.style.setProperty('--i',i));
  $$('.bar i').forEach((b,i)=>b.style.setProperty('--d',(.25+i*.05)+'s'));
  if(rm)return;
  const items=$$('main .grid>*, main>.card, main .slide, main .offer').filter((e,i,a)=>a.indexOf(e)===i);
  items.slice(0,14).forEach((e,i)=>{e.classList.add('rv');e.style.setProperty('--d',(i*70)+'ms')});
  $$('.kpi .v').forEach(countUp);
}
let toastT;
function toast(msg){const t=$('#toast');t.innerHTML=svg('check2')+msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2600)}
function render(){
  const r=(location.hash||'#resum').slice(1);const k=PAGES[r]?r:'resum';
  document.title='Jespac · Administració · '+(NAV.find(n=>n[0]===k)?.[1]||'Producte');
  $('#app').innerHTML=shell(k,PAGES[k]());
  enhance();scrollTo(0,0);
}
/* ---------- interaccions de la mostra ---------- */
document.addEventListener('click',e=>{
  const t=e.target;
  const tog=t.closest('.toggle');if(tog){tog.classList.toggle('on');return}
  const chip=t.closest('.chip');
  if(chip){const g=chip.parentElement;
    if(g.classList.contains('chips')||g.classList.contains('acts'))$$('.chip',g).forEach(c=>c.classList.toggle('on',c===chip));
    else chip.classList.toggle('on');
    return}
  const row=t.closest('tr[data-o]');
  if(row){
    $$('tr[data-o]').forEach(r=>r.classList.toggle('rowsel',r===row));
    const o=ORD.find(x=>x[0]===row.dataset.o),d=$('.drawer');
    if(o&&d){$('h2',d).textContent=o[0];$('.pill',d).outerHTML=pill(o[7]);
      const dd=$$('.kv dd',d);dd[0].textContent=o[1]+' · 612 34 56 78';dd[1].textContent=o[3]+' · '+(o[8]==='C'?'a domicili':'recollida');dd[3].textContent=o[2];dd[4].textContent=o[6]+(o[6]==='Efectiu'?' · cobrar en lliurar':' · pagat');
      const lv={new:1,prep:2,ready:3,ship:4,done:5}[o[7]];$$('.step i',d).forEach((i,k)=>i.classList.toggle('on',k<lv));
      d.animate([{opacity:.4,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:350,easing:'cubic-bezier(.22,1,.36,1)'})}
    return}
  const btn=t.closest('button.btn');
  if(btn){
    const tx=btn.textContent.trim(),sv=btn.closest('.save');
    if(/llesta/i.test(tx)){const d=btn.closest('.drawer');if(d){$$('.step i',d).forEach((i,k)=>i.classList.toggle('on',k<3));$('.pill',d).outerHTML=pill('ready');toast('Comanda '+$('h2',d).textContent+' marcada com a llesta')}return}
    if(/descarta/i.test(tx)){if(sv)sv.style.display='none';toast('Canvis descartats');return}
    if(/desa|programa/i.test(tx)){toast(/programa/i.test(tx)?'Oferta programada':'Canvis desats');if(sv)sv.style.display='none';return}
    toast('Funció de mostra · «'+tx+'»');
  }
});
addEventListener('hashchange',render);render();

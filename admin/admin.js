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
function bars(vals,{w=640,h=220,color='#8CC63F',hi=-1,labels=null}={}){
  labels=labels||[0,7,14,21,28].map(i=>[i,(i+1)+' nov']);
  const m=Math.max(...vals)*1.1,bw=w/vals.length;
  return `<svg viewBox="0 0 ${w} ${h+26}" style="width:100%;height:auto">${[0,.25,.5,.75,1].map(t=>`<line x1="0" x2="${w}" y1="${h*t}" y2="${h*t}" stroke="#E6DFCE"/>`).join('')}${vals.map((v,i)=>{const bh=v/m*h;return `<rect x="${i*bw+bw*.15}" y="${h-bh}" width="${bw*.7}" height="${bh}" rx="4" fill="${i===hi?'#F7403A':color}"/>`}).join('')}${labels.map(([i,t],k)=>`<text x="${k===0?0:i*bw+bw/2}" y="${h+18}" font-size="11" fill="#6A655A" text-anchor="${k===0?'start':k===labels.length-1&&i>vals.length-3?'end':'middle'}">${t}</text>`).join('')}</svg>`;
}
function line2(a,b,{w=640,h=220,labels=null}={}){
  labels=labels||['setm. 1','setm. 2','setm. 3','setm. 4'];
  const m=Math.max(...a,...b)*1.1,st=w/(a.length-1);
  const path=v=>v.map((y,i)=>`${i?'L':'M'}${(i*st).toFixed(1)} ${(h-y/m*h).toFixed(1)}`).join('');
  return `<svg viewBox="0 0 ${w} ${h+26}" style="width:100%;height:auto">${[0,.25,.5,.75,1].map(t=>`<line x1="0" x2="${w}" y1="${h*t}" y2="${h*t}" stroke="#E6DFCE"/>`).join('')}<path d="${path(a)}L${w} ${h}L0 ${h}Z" fill="#8CC63F" opacity=".18"/><path d="${path(b)}" fill="none" stroke="#B9B2A0" stroke-width="2.5" stroke-dasharray="5 5"/><path d="${path(a)}" fill="none" stroke="#2F6B0F" stroke-width="3"/><circle cx="${(a.length-1)*st}" cy="${h-a[a.length-1]/m*h}" r="5" fill="#2F6B0F"/>${labels.map((t,i)=>`<text x="${i*w/(labels.length-1)}" y="${h+18}" font-size="11" fill="#6A655A" text-anchor="${i?i===labels.length-1?'end':'middle':'start'}">${t}</text>`).join('')}</svg>`;
}
function donut(items,{size=170}={}){
  const tot=items.reduce((s,i)=>s+i[1],0);let acc=0,r=62,c=2*Math.PI*r;
  return `<svg viewBox="0 0 170 170" style="width:${size}px;height:${size}px">${items.map(it=>{const f=it[1]/tot,seg=`<circle cx="85" cy="85" r="${r}" fill="none" stroke="${it[2]}" stroke-width="26" stroke-dasharray="${(f*c).toFixed(1)} ${(c-f*c).toFixed(1)}" stroke-dashoffset="${(-acc*c).toFixed(1)}" transform="rotate(-90 85 85)"/>`;acc+=f;return seg}).join('')}<text x="85" y="82" text-anchor="middle" font-size="22" font-weight="700" font-family="DejaVu Sans Condensed">${fmt(tot)}</text><text x="85" y="102" text-anchor="middle" font-size="11" fill="#6A655A">total</text></svg>`;
}
const legend=items=>`<div style="display:grid;gap:.45rem;font-size:.85rem">${items.map(i=>`<div style="display:flex;align-items:center;gap:.5rem"><i style="width:.7rem;height:.7rem;border-radius:.2rem;background:${i[2]}"></i>${i[0]}<b style="margin-left:auto;padding-left:1rem;white-space:nowrap">${i[3]||fmt(i[1])}</b></div>`).join('')}</div>`;

/* ---------- invented data ---------- */
const sales30=(()=>{const r=rnd('sales');return Array.from({length:30},(_,i)=>3800+i*55+(i%7>4?900:0)+r()*900)})();
const sales30b=sales30.map((v,i)=>v*(.82+((i*7)%5)/60));
/* ---------- pages ---------- */
const PAGES={};
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


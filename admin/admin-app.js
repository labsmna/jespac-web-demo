/* Jespac · Administració — estat, pàgines dinàmiques i interaccions. PROTOTIP: dades inventades, res no es desa enlloc. */
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const MON=['gen','febr','març','abr','maig','juny','jul','ag','set','oct','nov','des'];
const DOW=['dg','dl','dm','dc','dj','dv','ds'];
const TODAY=new Date(2024,10,11);
const dAt=off=>{const d=new Date(TODAY);d.setDate(d.getDate()+off);return d};
const dShort=d=>`${d.getDate()} ${MON[d.getMonth()]}`;
const dNum=d=>`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
const dLong=off=>{const d=dAt(off);return `${DOW[d.getDay()]} ${dNum(d)}`};
const SLOTS=['9–11','11–13','13–15','15–17','17–19','19–21'];
const NAV=[['resum','Resum','home'],['comandes','Comandes','pack'],['productes','Productes','basket'],['ofertes','Ofertes','tag'],['portada','Portada','star'],['estadistiques','Estadístiques','chart'],['franges','Franges','clock'],['repartidors','Repartidors','truck'],['botigues','Botigues','store']];
const VEH=['Moto','Furgoneta','Bici elèctrica','Cotxe'];

/* ---------- estat de la mostra (només en memòria) ---------- */
const S={
  store:'all',range:30,menu:null,user:{name:'Marta Vidal',email:'marta.vidal@jespac.com',tel:'612 90 12 34',role:'Cap de botiga',store:4},
  stores:STORES.map(s=>({id:s.id,name:s.short,full:s.full,tel:s.tel,hours:'9–21 h',online:true,active:true})),
  drivers:[
    {id:1,name:'Oriol Ferrer',tel:'612 11 22 33',store:4,zone:'Eixample esquerre',veh:'Moto',active:true},
    {id:2,name:'Laia Serra',tel:'622 33 44 55',store:3,zone:'Eixample esquerre',veh:'Furgoneta',active:true},
    {id:3,name:'Marc Vidal',tel:'633 55 66 77',store:0,zone:'Sant Gervasi',veh:'Moto',active:true},
    {id:4,name:'Aina Costa',tel:'644 77 88 99',store:7,zone:'Sants-Montjuïc',veh:'Bici elèctrica',active:true},
    {id:5,name:'Pau Roca',tel:'655 21 43 65',store:1,zone:'Sant Gervasi',veh:'Furgoneta',active:true},
    {id:6,name:'Jana Puig',tel:'666 98 76 54',store:5,zone:'Eixample dret',veh:'Cotxe',active:false}],
  notif:[
    {id:1,ic:'warn',t:'12 productes amb estoc baix',s:'Entrecot de vedella, Formatge brie…',go:'productes',unread:true},
    {id:2,ic:'clock',t:'3 comandes a punt de vèncer la franja',s:'Franja 9–11 h · Mallorca i Muntaner',go:'comandes',unread:true},
    {id:3,ic:'tag',t:'L\'oferta «Cava de Nadal» acaba demà',s:'Renovar o retirar el preu rebaixat',go:'ofertes',unread:true},
    {id:4,ic:'refresh',t:'2 devolucions pendents',s:'Garantia de devolució · revisar',go:'comandes',unread:false},
    {id:5,ic:'mail',t:'6 missatges de clients',s:'Targeta client i suggeriments',go:'resum',unread:false}],
  of:'all',oq:'',oday:'all',osel:'JSP-248613',
  pq:'',psec:'all',plow:false,ppage:0,psel:new Set(['c1','f1','f3']),pvis:{},anim:true
};
const storeName=i=>S.stores.find(s=>s.id===i)?.name||'—';
const actStores=()=>S.stores.filter(s=>s.active);
const drvName=i=>S.drivers.find(d=>d.id===i)?.name||'—';
const storeLbl=()=>S.store==='all'?'Totes les botigues':storeName(S.store);
const selBox=(act,opts,val,extra='')=>`<select class="selbox" data-chg="${act}" ${extra}>${opts.map(o=>`<option value="${esc(o[0])}"${String(o[0])===String(val)?' selected':''}>${esc(o[1])}</option>`).join('')}</select>`;
const storeOpts=(all=true)=>(all?[['all','Totes les botigues']]:[]).concat(actStores().map(s=>[s.id,s.name]));

/* ---------- comandes inventades (36) ---------- */
const NAMES=['Maria Puig','Jordi Serra','Carme Vidal','Pere Soler','Montserrat Roca','Josep Ferrer','Núria Costa','Antoni Mas','Rosa Vila','Joan Pons','Dolors Casals','Francesc Bosch','Anna Ribas','Miquel Font','Teresa Gil','Jaume Vila','Pilar Moreno','Lluís Camps','Marta Soler','Ramon Torres','Glòria Marín','Albert Sala','Concepció Prat','Xavier Molina','Imma Pujol','Sergi Roig','Neus Arnau','Pol Esteve'];
const STREETS=['Mallorca','Muntaner','Aribau','Balmes','Provença','Rosselló','Girona','Casanova','Còrsega','Urgell'];
function buildOrders(){
  const r=rnd('orders2'),st0=['prep','new','new','prep','ready','ready','ship','ship','new','prep'];
  return Array.from({length:36},(_,i)=>{
    const day=i<10?0:i<19?-1:i<28?-2:-3,status=day===0?st0[i]:'done';
    const prep=i===0?4:Math.floor(r()*9),mode=i===0?'C':r()<.72?'C':'R';
    const dr=S.drivers.filter(d=>d.active&&d.store===prep)[0]||S.drivers[Math.floor(r()*5)];
    return {id:'JSP-'+(248613-i),client:NAMES[i%NAMES.length],tel:'6'+String(10+Math.floor(r()*89))+' '+String(10+Math.floor(r()*89))+' '+String(10+Math.floor(r()*89))+' '+String(10+Math.floor(r()*89)),
      addr:`C/ ${STREETS[i%STREETS.length]} ${20+Math.floor(r()*260)}, ${1+Math.floor(r()*6)}r ${1+Math.floor(r()*3)}a · 080${10+Math.floor(r()*40)}`,
      day,slot:SLOTS[Math.floor(r()*SLOTS.length)],from:prep,prep,mode,status,driver:mode==='C'&&(status==='ship'||status==='done')?dr.id:null,pay:r()<.75?'Targeta (Stripe) · pagat':'Efectiu · cobrar en lliurar'};
  });
}
S.orders=buildOrders();
const OI=new Map();
function oinfo(o){
  if(OI.has(o.id))return OI.get(o.id);
  const r=rnd(o.id);let items=[];
  if(o.id==='JSP-248613'){items=[['c1',.75,'Talla\'l fi, per a planxa'],['f3',1,''],['l3',2,''],['r3',1,''],['b10',1,''],['r5',2,'']].map(a=>({p:PR(a[0]),q:a[1],note:a[2]}))}
  else{const pool=PRODUCTS.slice(),n=3+Math.floor(r()*6);for(let k=0;k<n&&pool.length;k++){const p=pool.splice(Math.floor(r()*pool.length),1)[0];items.push({p,q:p.u==='kg'?(1+Math.floor(r()*6))*.25+.25:1+Math.floor(r()*3),note:p.id==='c1'?'Talla\'l fi':''})}}
  items.forEach(it=>{it.price=Math.round((it.p.o??it.p.p)*it.q*100)/100;it.qt=it.p.u==='kg'?String(it.q).replace('.',',')+' kg':it.q+' u'});
  const sub=items.reduce((s,i)=>s+i.price,0),fee=o.mode==='C'&&sub<60?3:0,info={items,sub,fee,total:sub+fee};
  OI.set(o.id,info);return info;
}
const ST_STEP={new:1,prep:2,ready:3,ship:4,done:5};
const NEXT={new:['prep','Comença a preparar'],prep:['ready','Marca com a llesta'],ready:['ship','Surt a repartiment'],ship:['done','Marca com a lliurada']};
function fOrders(skipStatus){
  const q=S.oq.trim().toLowerCase();
  return S.orders.filter(o=>(S.store==='all'||o.prep===S.store)&&(S.oday==='all'||o.day===+S.oday)&&(skipStatus||S.of==='all'||o.status===S.of)&&(!q||(o.id+' '+o.client+' '+o.tel).toLowerCase().includes(q)));
}

/* ---------- descàrregues: CSV i PDF ---------- */
function download(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
function csv(name,rows){const t=rows.map(r=>r.map(c=>{c=String(c??'');return /[;"\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(';')).join('\r\n');download(name,new Blob(['﻿'+t],{type:'text/csv;charset=utf-8'}))}
const mny=n=>n.toLocaleString('ca-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
async function loadPDF(){
  if(window.jspdf)return window.jspdf;
  await new Promise((ok,ko)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=ok;s.onerror=ko;document.head.append(s)});
  return window.jspdf;
}
function logoData(){return new Promise(ok=>{const i=new Image();i.onload=()=>{try{const k=Math.min(1,300/i.naturalWidth),c=document.createElement('canvas');c.width=Math.round(i.naturalWidth*k);c.height=Math.round(i.naturalHeight*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok({d:c.toDataURL('image/png'),w:c.width,h:c.height})}catch(e){ok(null)}};i.onerror=()=>ok(null);i.src='../img/jespac/logo_jespac.png'})}
const RED=[247,64,58],GREEN=[140,198,63],INK=[38,38,38],MUT=[106,101,90];
async function mkPDF(){const {jsPDF}=await loadPDF();return {doc:new jsPDF({unit:'mm',format:'a4'}),logo:await logoData()}}
function pdfHead(doc,logo,title,sub){
  if(logo){const w=34;doc.addImage(logo.d,'PNG',15,12,w,w*logo.h/logo.w)}
  doc.setTextColor(...INK);doc.setFont('helvetica','bold');doc.setFontSize(17);doc.text(title,195,19,{align:'right'});
  doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(...MUT);doc.text(sub,195,25,{align:'right'});
  doc.setDrawColor(...GREEN);doc.setLineWidth(.8);doc.line(15,31,195,31);
}
function pdfFoot(doc){const n=doc.getNumberOfPages();for(let i=1;i<=n;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(...MUT);doc.text('Jespac supermercats · Prototip amb dades inventades',15,287);doc.text(i+' / '+n,195,287,{align:'right'})}}
async function albaraPDF(list){
  if(!list.length){toast('No hi ha cap comanda per imprimir amb aquests filtres');return}
  toast('Generant el PDF…');
  try{
    const {doc,logo}=await mkPDF();
    list.forEach((o,k)=>{
      if(k)doc.addPage();const inf=oinfo(o);
      pdfHead(doc,logo,'Albarà de preparació',o.id);
      doc.setTextColor(...INK);doc.setFontSize(10.5);
      const rows=[['Client',o.client+' · '+o.tel],['Entrega',dLong(o.day)+', '+o.slot+' h · '+(o.mode==='C'?'a domicili':'recollida a botiga')],['Adreça',o.mode==='C'?o.addr:'Recollida a '+storeName(o.prep)],['Prepara',storeName(o.prep)+(o.from!==o.prep?'  (reassignada des de '+storeName(o.from)+')':'')],['Repartidor',o.mode==='C'?(o.driver?drvName(o.driver):'Per assignar'):'—'],['Pagament',o.pay]];
      let y=42;rows.forEach(r=>{doc.setFont('helvetica','bold');doc.setTextColor(...MUT);doc.text(r[0],15,y);doc.setFont('helvetica','normal');doc.setTextColor(...INK);doc.text(String(r[1]),45,y);y+=6.4});
      y+=4;doc.setFillColor(...GREEN);doc.rect(15,y-5,180,8,'F');doc.setFont('helvetica','bold');doc.setFontSize(9.5);doc.setTextColor(29,42,10);
      doc.text('Producte',18,y);doc.text('Quantitat',120,y);doc.text('Preu/u',152,y,{align:'right'});doc.text('Import',192,y,{align:'right'});y+=8;
      doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(...INK);
      inf.items.forEach(it=>{
        if(y>255){doc.addPage();y=20}
        doc.setFont('helvetica','bold');doc.text(pname(it.p).slice(0,46),18,y);doc.setFont('helvetica','normal');doc.text(it.qt,120,y);doc.text(mny(it.p.o??it.p.p),152,y,{align:'right'});doc.text(mny(it.price),192,y,{align:'right'});
        if(it.note){y+=4.6;doc.setFontSize(8.5);doc.setTextColor(120,90,0);doc.text('Nota: '+it.note,18,y);doc.setFontSize(10);doc.setTextColor(...INK)}
        doc.setDrawColor(230,223,206);doc.setLineWidth(.2);doc.line(15,y+2.6,195,y+2.6);y+=7;
      });
      y+=3;const tot=[['Subtotal',inf.sub],['Repartiment',inf.fee],['Total',inf.total]];
      tot.forEach((t,i)=>{const last=i===2;doc.setFont('helvetica',last?'bold':'normal');doc.setFontSize(last?13:10.5);if(last)doc.setTextColor(...RED);else doc.setTextColor(...INK);doc.text(t[0],140,y);doc.text(mny(t[1]),192,y,{align:'right'});y+=last?0:6.5});
      y=Math.max(y+22,236);doc.setDrawColor(...MUT);doc.setLineWidth(.3);doc.line(15,y,90,y);doc.line(120,y,195,y);doc.setFontSize(8.5);doc.setTextColor(...MUT);doc.setFont('helvetica','normal');doc.text('Preparat per',15,y+4.5);doc.text('Signatura del client',120,y+4.5);
    });
    pdfFoot(doc);
    doc.save(list.length===1?'albara-'+list[0].id+'.pdf':'albarans-'+list.length+'-comandes.pdf');
    toast(list.length===1?'Albarà '+list[0].id+' descarregat (PDF)':list.length+' albarans descarregats en un sol PDF');
  }catch(e){console.error(e);toast('No s\'ha pogut generar el PDF (cal connexió per carregar la llibreria)')}
}
const pname=p=>p.ca;

/* ---------- estadístiques (canvien amb el període i la botiga) ---------- */
const W=[1,.86,.74,.66,.52,.41,.34,.3,.26];
const share=()=>{const act=actStores();const tot=act.reduce((s,x)=>s+(W[x.id]??.2),0)||1;return S.store==='all'?1:(W[S.store]??.2)/tot};
const baseDay=k=>{const r=rnd('d'+k)();return 3000+k*2.2+(((k%7)+7)%7>4?950:0)+r*900};
function series(N,shift=0){
  const T=400-shift*N,sf=share();
  if(N>90){return Array.from({length:12},(_,j)=>{let s=0;for(let k=0;k<30;k++)s+=baseDay(T-359+j*30+k);return s*sf})}
  return Array.from({length:N},(_,i)=>baseDay(T-N+1+i)*sf);
}
function statsFor(){
  const N=S.range,v=series(N),p=series(N,1),sum=a=>a.reduce((x,y)=>x+y,0),sales=sum(v),prev=sum(p),tk=75.4+(N>90?1.8:N<10?-.9:0);
  const lab=N>90?v.map((_,j)=>[j,MON[(dAt(-360+j*30).getMonth())]]).filter((_,j)=>j%3===0):[0,Math.round(N/4),Math.round(N/2),Math.round(N*3/4),N-1].map(i=>[i,dShort(dAt(i-N+1))]);
  const days=N>90?v.map((x,j)=>[MON[dAt(-360+j*30).getMonth()]+' (mes)',x]):v.map((x,i)=>[dNum(dAt(i-N+1)),x]);
  const orders=Math.round(sales/tk);
  return {v,p,sales,orders,tk,newc:Math.round(orders*.14),dsales:(sales/prev-1)*100,days,lab,N};
}
const rangeName=()=>S.range===7?'Últims 7 dies':S.range===30?'Últims 30 dies':'Últims 12 mesos';
const pct=x=>(x>=0?'▲ ':'▼ ')+Math.abs(x).toFixed(0)+' %';

/* ---------- pàgines ---------- */
PAGES.resum=()=>{
  const sf=share(),today=fOrders(true).filter(o=>o.day===0),pend=today.filter(o=>o.status==='new'||o.status==='prep').length;
  const sales=Math.round(6482*sf),ord=Math.round(86*sf);
  return `<div class="ph"><div><h1>Bon dia, ${esc(S.user.name.split(' ')[0])}</h1><p>Dilluns 11 de novembre · ${S.store==='all'?'resum de totes les botigues':esc(storeName(S.store))}</p></div><div class="acts"><button class="btn line" data-act="stats-csv">${svg('dl')}Exporta l'informe</button><a class="btn" href="#ofertes">${svg('plus')}Nova oferta</a></div></div>
<div class="grid g4">
 <div class="card kpi"><div class="l">${svg('pack')}Comandes d'avui</div><div class="v">${ord}</div><span class="up">▲ 12 % respecte ahir</span></div>
 <div class="card kpi"><div class="l">${svg('coin')}Vendes d'avui</div><div class="v">${eur(sales)}</div><span class="up">▲ 8 % respecte ahir</span></div>
 <div class="card kpi"><div class="l">${svg('cart')}Tiquet mitjà</div><div class="v">${eur(75.37)}</div><span class="down">▼ 2 % respecte ahir</span></div>
 <a class="card kpi alert" href="#comandes" data-act="goto-pend"><div class="l" style="color:var(--red-ink)">${svg('warn')}Pendents de preparar</div><div class="v" style="color:var(--red-ink)">${pend}</div><span class="down">${pend?'Veure-les':'Tot al dia'}</span></a>
</div>
<div class="grid g21" style="margin-top:1.2rem">
 <div class="card"><div class="hd"><h2>${svg('chart')}Vendes dels últims 28 dies</h2><div class="leg"><span><i style="background:#8CC63F"></i>Aquest mes</span><span><i style="background:#B9B2A0"></i>Mes anterior</span></div></div>${(()=>{const a=series(28),b=series(28,1);return line2(a,b,{labels:[0,9,18,27].map(i=>dShort(dAt(i-27)))})})()}</div>
 <div class="card"><div class="hd"><h2>${svg('bell')}Cal fer</h2><small>${S.notif.length} avisos</small></div><ul class="todo">${S.notif.map(n=>`<li>${svg(n.ic).replace('<svg','<svg class="'+(n.ic==='warn'?'w':n.ic==='clock'||n.ic==='tag'?'a':'i')+'"')}<div><b>${esc(n.t)}</b><small>${esc(n.s)} <a href="#${n.go}" style="color:var(--red-ink);font-weight:700">Veure</a></small></div></li>`).join('')}</ul></div>
</div>
<div class="grid g21" style="margin-top:1.2rem">
 <div class="card"><div class="hd"><h2>${svg('pack')}Comandes recents</h2><a href="#comandes" class="btn green sm">Veure totes</a></div>${ordersTable(fOrders(true).slice(0,6))}</div>
 <div class="card"><div class="hd"><h2>${svg('clock')}Franges d'avui</h2><small>capacitat</small></div><div style="display:grid;gap:.85rem">${[['9–11 h',16,16],['11–13 h',14,16],['13–15 h',9,16],['15–17 h',6,16],['17–19 h',4,16],['19–21 h',2,16]].map(s=>`<div><div style="display:flex;justify-content:space-between;font-weight:700"><span>${s[0]}</span><span>${s[1]}/${s[2]}</span></div><div class="bar ${s[1]>=s[2]?'r':s[1]>=12?'a':''}"><i style="width:${s[1]/s[2]*100}%"></i></div></div>`).join('')}</div></div>
</div>`;
};

function ordersTable(rows){
  if(!rows.length)return `<div class="empty">${svg('pack')}<b>Cap comanda amb aquests filtres</b><small>Prova de canviar l'estat, el dia o la botiga.</small></div>`;
  return `<table class="tbl ord"><thead><tr><th>Comanda</th><th>Client</th><th>Botiga</th><th>Entrega</th><th class="num">Total</th><th>Estat</th></tr></thead><tbody>${rows.map(o=>`<tr data-o="${o.id}" class="${o.id===S.osel?'rowsel':''}"><td><b>${o.id}</b></td><td>${esc(o.client)}</td><td>${esc(storeName(o.prep))}${o.prep!==o.from?' <span class="tag">reassignada</span>':''}</td><td>${dLong(o.day)} · ${o.slot} h</td><td class="num"><b>${eur(oinfo(o).total)}</b></td><td>${pill(o.status)}</td></tr>`).join('')}</tbody></table>`;
}
function orderDrawer(o){
  if(!o)return `<div class="empty">${svg('pack')}<b>Tria una comanda</b><small>Aquí en veuràs el detall.</small></div>`;
  const inf=oinfo(o),nx=NEXT[o.status],last=o.mode==='R'&&o.status==='ready';
  const drv=S.drivers.filter(d=>d.active||d.id===o.driver);
  return `<div class="hd"><div><small>COMANDA</small><h2>${o.id}</h2></div>${pill(o.status)}</div>
  <div class="step">${[1,2,3,4,5].map(k=>`<i class="${k<=ST_STEP[o.status]?'on':''}"></i>`).join('')}</div><div class="stepl"><span>Rebuda</span><span>Preparació</span><span>Llesta</span><span>Repartiment</span><span>Lliurada</span></div>
  <dl class="kv" style="margin:1.1rem 0"><dt>Client</dt><dd>${esc(o.client)} · ${o.tel}</dd><dt>Entrega</dt><dd>${dLong(o.day)}, ${o.slot} h · ${o.mode==='C'?'a domicili':'recollida'}</dd><dt>Adreça</dt><dd>${o.mode==='C'?esc(o.addr):'Recollida a botiga'}</dd><dt>Pagament</dt><dd>${o.pay}</dd>
   <dt>Prepara</dt><dd>${selBox('o-store',actStores().map(s=>[s.id,s.name]),o.prep,'aria-label="Botiga que prepara la comanda"')}${o.prep!==o.from?`<small class="hint">Feta a ${esc(storeName(o.from))}</small>`:''}</dd>
   ${o.mode==='C'?`<dt>Repartidor</dt><dd>${selBox('o-drv',[['','Sense assignar']].concat(drv.map(d=>[d.id,d.name+' · '+storeName(d.store)])),o.driver??'','id="drvsel" aria-label="Repartidor"')}</dd>`:''}</dl>
  <h3 style="margin:1rem 0 .3rem">${inf.items.length} articles</h3>${inf.items.map(i=>`<div class="line">${img(i.p.id)}<div style="min-width:0"><b>${esc(pname(i.p))}</b>${i.note?`<div class="note">${esc(i.note)}</div>`:''}</div><div class="q"><b>${eur(i.price)}</b><br><small style="color:var(--mut)">${i.qt}</small></div></div>`).join('')}
  <div class="kv" style="margin-top:.9rem;grid-template-columns:1fr auto"><dt>Subtotal</dt><dd>${eur(inf.sub)}</dd><dt>Repartiment</dt><dd>${inf.fee?eur(inf.fee):'Gratuït'}</dd><dt style="font-weight:800;color:var(--fg)">Total</dt><dd style="font-size:1.15rem">${eur(inf.total)}</dd></div>
  <div class="acts" style="margin-top:1.1rem">${nx?`<button class="btn" data-act="advance">${svg('check2')}${last?'Entrega al client':nx[1]}</button>`:'<button class="btn" disabled>Lliurada</button>'}<button class="btn green" data-act="pdf-one">${svg('print')}Albarà (PDF)</button></div>`;
}
const ocounts=()=>{const a=fOrders(true),c={all:a.length};a.forEach(o=>c[o.status]=(c[o.status]||0)+1);return c};
function ochips(){
  const c=ocounts();
  return [['all','Totes'],['new','Noves'],['prep','En preparació'],['ready','Llestes'],['ship','En repartiment'],['done','Lliurades']].map(f=>`<button class="chip ${S.of===f[0]?'on':''}" data-act="ofilter" data-v="${f[0]}">${f[1]} <b>${c[f[0]]||0}</b></button>`).join('');
}
PAGES.comandes=()=>`<div class="ph"><div><h1>Comandes</h1><p>Prepara, revisa i fes el seguiment de cada comanda</p></div><div class="acts"><button class="btn line" data-act="pdf-all">${svg('print')}Imprimeix albarans</button><button class="btn line" data-act="csv-orders">${svg('dl')}Exporta CSV</button></div></div>
<div class="chips" id="ochips">${ochips()}</div>
<div class="grid" style="grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);align-items:start">
 <div class="card"><div class="toolbar"><div class="search">${svg('search')}<input id="oq" placeholder="Cerca per número, client o telèfon" value="${esc(S.oq)}" autocomplete="off"></div>${selBox('o-fstore',storeOpts(),S.store,'aria-label="Botiga"')}${selBox('o-fday',[['all','Tots els dies']].concat([0,-1,-2,-3].map(d=>[d,(d===0?'Avui · ':d===-1?'Ahir · ':'')+dLong(d)])),S.oday,'aria-label="Dia"')}</div><div id="otbl">${ordersTable(fOrders())}</div></div>
 <div class="card drawer" id="odrawer">${orderDrawer(S.orders.find(o=>o.id===S.osel))}</div>
</div>`;
function paintOrders(){
  const ch=$('#ochips'),t=$('#otbl'),d=$('#odrawer');if(!t)return;
  ch.innerHTML=ochips();t.innerHTML=ordersTable(fOrders());
  const w=document.createElement('div');w.className='tw';const tb=$('table',t);if(tb){tb.replaceWith(w);w.append(tb)}
  d.innerHTML=orderDrawer(S.orders.find(o=>o.id===S.osel));
}

/* productes i estoc */
const secOpts=()=>[['all','Totes les seccions']].concat(CATS.map(c=>[c[0],c[1]]));
function pRows(){const q=S.pq.trim().toLowerCase();return PRODUCTS.filter(p=>(S.psec==='all'||p.c===S.psec)&&(!q||(p.ca+' '+p.es+' '+p.id).toLowerCase().includes(q)))
  .filter(p=>!S.plow||(S.store==='all'?tstock(p)<60:stock(p,S.store)<10))}
const tstock=p=>actStores().reduce((s,x)=>s+stock(p,x.id),0);
function pTable(){
  const rows=pRows(),per=10,pages=Math.max(1,Math.ceil(rows.length/per));S.ppage=Math.min(S.ppage,pages-1);
  const vis=rows.slice(S.ppage*per,S.ppage*per+per),allSel=vis.length&&vis.every(p=>S.psel.has(p.id)),sts=S.store==='all'?actStores():actStores().filter(s=>s.id===S.store);
  const stockTxt=S.store==='all'?'Estoc total':'Estoc aquí';
  return `<div class="tw"><table class="tbl"><thead><tr><th><span class="cb ${allSel?'on':''}" data-act="psel-all" role="checkbox" aria-checked="${!!allSel}" tabindex="0" aria-label="Selecciona tots"></span></th><th>Producte</th><th>Codi</th><th>Secció</th><th class="num">Preu</th><th class="num">${stockTxt}</th><th>Estoc per botiga</th><th>Estat</th><th>Visible</th></tr></thead><tbody>
  ${vis.map(p=>{const tot=S.store==='all'?tstock(p):stock(p,S.store),low=S.store==='all'?tot<60:tot<10,sel=S.psel.has(p.id),on=S.pvis[p.id]!==false;
  return `<tr class="${sel?'rowsel':''}"><td><span class="cb ${sel?'on':''}" data-act="psel" data-id="${p.id}" role="checkbox" aria-checked="${sel}" tabindex="0" aria-label="Selecciona ${esc(p.ca)}"></span></td><td><div class="pn">${img(p.id)}<div><b>${esc(p.ca)}</b><small>${esc(p.size||(p.u==='kg'?'Preu per quilo':''))}</small></div></div></td><td style="color:var(--mut)">JSP-${String(hs(p.id)%90000+10000)}</td><td>${CAT[p.c].ca}</td><td class="num"><b>${eur(p.o??p.p)}</b>${p.o?`<br><s style="color:var(--mut)">${eur(p.p)}</s>`:''}<small style="color:var(--mut)">${p.u==='kg'?' /kg':''}</small></td><td class="num"><b style="color:${low?'var(--red-ink)':'inherit'}">${tot}</b></td>
  <td><div class="sbars">${sts.map(s=>{const v=stock(p,s.id);return `<span class="sb ${v<10?'lo':''}" tabindex="0" data-tip="${esc(s.name)}: ${v} ${p.u==='kg'?'kg':'u'}"><i style="height:${Math.max(10,Math.min(100,v/1.1))}%"></i><em>${s.id+1}</em></span>`}).join('')}</div></td>
  <td>${low?'<span class="pill st-low">Estoc baix</span>':'<span class="pill st-ok">Correcte</span>'}</td><td><span class="toggle ${on?'on':''}" data-act="pvis" data-id="${p.id}" role="switch" aria-checked="${on}" tabindex="0" aria-label="Visible a la botiga"></span></td></tr>`}).join('')||`<tr><td colspan="9"><div class="empty">${svg('basket')}<b>Cap producte</b><small>Prova una altra cerca o secció.</small></div></td></tr>`}</tbody></table></div>
  <div class="pager"><span>${rows.length?`${S.ppage*per+1}–${Math.min(rows.length,S.ppage*per+per)} de ${rows.length}`:'0 resultats'}</span><div class="acts"><button class="btn line sm" data-act="ppage" data-v="-1" ${S.ppage===0?'disabled':''}>${svg('back')}</button>${Array.from({length:pages},(_,i)=>`<button class="btn ${i===S.ppage?'green':'line'} sm" data-act="ppage" data-v="${i}" data-abs="1">${i+1}</button>`).join('')}<button class="btn line sm" data-act="ppage" data-v="1" ${S.ppage>=pages-1?'disabled':''}>${svg('arrow')}</button></div></div>`;
}
PAGES.productes=()=>{
  const lowN=PRODUCTS.filter(p=>S.store==='all'?tstock(p)<60:stock(p,S.store)<10).length,n=S.psel.size;
  return `<div class="ph"><div><h1>Productes i estoc</h1><p>${PRODUCTS.length} productes · ${actStores().length} botigues${S.store==='all'?'':' · veient '+esc(storeName(S.store))}</p></div><div class="acts"><button class="btn line" data-act="toast" data-m="Importació de mostra: arrossega un CSV amb codi, nom, preu i estoc">${svg('upload')}Importa CSV</button><button class="btn line" data-act="csv-prod">${svg('dl')}Exporta</button><button class="btn" data-act="toast" data-m="Formulari de producte nou (mostra)">${svg('plus')}Nou producte</button></div></div>
<div class="card"><div class="toolbar"><div class="search">${svg('search')}<input id="pq" placeholder="Cerca per nom o codi" value="${esc(S.pq)}" autocomplete="off"></div>${selBox('p-sec',secOpts(),S.psec,'aria-label="Secció"')}${selBox('o-fstore',storeOpts(),S.store,'aria-label="Botiga"')}<button class="chip ${S.plow?'on':''}" data-act="plow">${svg('warn')}Només estoc baix <b>${lowN}</b></button></div>
<div class="skey" aria-label="Llegenda de botigues"><b>Cada barra és una botiga:</b>${actStores().map(s=>`<span><em>${s.id+1}</em>${esc(s.name)}</span>`).join('')}</div>
<div class="bulk ${n?'on':''}" id="bulk"><span class="pill st-ready" style="background:var(--leaf);color:#1d2a0a">${n} seleccionats</span><button class="btn green sm" data-act="pbulk" data-v="offer">${svg('percent')}Aplica oferta −15 %</button><button class="btn line sm" data-act="pbulk" data-v="clear">${svg('coin')}Treu l'oferta</button><button class="btn line sm" data-act="pbulk" data-v="hide">${svg('eyeoff')}Amaga</button></div>
<div id="ptbl">${pTable()}</div></div>`;
};
function paintProducts(){const t=$('#ptbl');if(!t)return;t.innerHTML=pTable();const n=S.psel.size,b=$('#bulk');b.classList.toggle('on',n>0);$('.pill',b).textContent=n+' seleccionats'}

/* estadístiques */
PAGES.estadistiques=()=>{
  const st=statsFor(),sf=share(),cats=[['Fruita i verdura',24,'#8CC63F'],['Carnisseria',17,'#F7403A'],['Rebost',16,'#2F6B0F'],['Begudes',11,'#E8A317'],['Làctics i ous',10,'#1863DC'],['Altres',22,'#B9B2A0']].map((c,i)=>{const v=Math.max(4,c[1]+Math.round((rnd('c'+S.range+i)()-.5)*6));return [c[0],v,c[2]]});
  const tot=cats.reduce((s,c)=>s+c[1],0);cats.forEach(c=>{c[1]=Math.round(c[1]/tot*100);c[3]=c[1]+' %'});
  const r=rnd('heat'+S.range+S.store),days=['dl','dm','dc','dj','dv','ds','dg'];
  const heat=`<div class="heat"><span></span>${Array.from({length:14},(_,i)=>`<span style="text-align:center">${8+i}</span>`).join('')}${days.map((d,di)=>`<div class="lb">${d}</div>${Array.from({length:14},(_,h)=>{const v=Math.max(0,Math.sin((h-1)/13*Math.PI)*(di>4?.7:1)*(.55+r()*.45));return `<div style="background:rgba(47,107,15,${(.08+v*.85).toFixed(2)})"></div>`}).join('')}`).join('')}</div>`;
  const stores=actStores().map(s=>[s,(W[s.id]??.2)]).sort((a,b)=>b[1]-a[1]).slice(0,6),mx=stores[0][1];
  const sub=S.store==='all'?'Com va la botiga online':'Botiga: '+storeName(S.store);
  return `<div class="ph"><div><h1>Estadístiques</h1><p>${sub} · ${rangeName().toLowerCase()}</p></div><div class="acts">${[[7,'7 dies'],[30,'30 dies'],[365,'Any']].map(a=>`<button class="chip ${S.range===a[0]?'on':''}" data-act="range" data-v="${a[0]}">${a[1]}</button>`).join('')}${selBox('o-fstore',storeOpts(),S.store,'aria-label="Botiga"')}<button class="btn line" data-act="stats-csv">${svg('dl')}CSV</button><button class="btn line" data-act="stats-pdf">${svg('print')}PDF</button></div></div>
<div class="grid g4"><div class="card kpi"><div class="l">${svg('coin')}Vendes</div><div class="v">${eur(Math.round(st.sales))}</div><span class="${st.dsales>=0?'up':'down'}">${pct(st.dsales)} vs període anterior</span></div>
<div class="card kpi"><div class="l">${svg('pack')}Comandes</div><div class="v">${fmt(st.orders)}</div><span class="up">▲ ${Math.round(6+rnd('o'+S.range)()*6)} %</span></div>
<div class="card kpi"><div class="l">${svg('users')}Clients nous</div><div class="v">${fmt(st.newc)}</div><span class="up">▲ ${Math.round(12+rnd('n'+S.range)()*14)} %</span></div>
<div class="card kpi"><div class="l">${svg('truck')}Repartiment</div><div class="v">71 %</div><span class="down">29 % recollida</span></div></div>
<div class="grid g21" style="margin-top:1.2rem"><div class="card"><div class="hd"><h2>${S.range>90?'Vendes per mes':'Vendes per dia'}</h2><small>€ · ${rangeName().toLowerCase()}</small></div>${bars(st.v,{hi:st.v.length-1,labels:st.lab})}</div>
 <div class="card"><div class="hd"><h2>Vendes per secció</h2></div><div style="display:flex;gap:1.2rem;align-items:center;flex-wrap:wrap">${donut(cats.map(c=>[c[0],c[1],c[2]]),{size:150})}<div style="flex:1;min-width:10rem">${legend(cats)}</div></div></div></div>
<div class="grid g3" style="margin-top:1.2rem"><div class="card"><div class="hd"><h2>Comandes per hora</h2><small>dia × hora</small></div><div class="tw">${heat}</div></div>
 <div class="card"><div class="hd"><h2>Botigues</h2><small>vendes</small></div><div style="display:grid;gap:.8rem">${stores.map(([s,w])=>`<div><div style="display:flex;justify-content:space-between;gap:.6rem;font-weight:600"><span>${esc(s.name)}</span><b>${eur(Math.round(st.sales/sf*w/actStores().reduce((a,x)=>a+(W[x.id]??.2),0)))}</b></div><div class="bar"><i style="width:${w/mx*100}%"></i></div></div>`).join('')}</div></div>
 <div class="card"><div class="hd"><h2>Cerques sense resultat</h2><small>idees de catàleg</small></div><div class="tw"><table class="tbl"><tbody>${[['xocolata sense sucre',48],['llet de civada',37],['pa sense gluten',31],['tofu',24],['quinoa',19]].map(s=>`<tr><td>${s[0]}</td><td class="num"><b>${Math.round(s[1]*S.range/30*Math.max(.3,sf))||1}</b></td></tr>`).join('')}</tbody></table></div></div></div>
<div class="card" style="margin-top:1.2rem"><div class="hd"><h2>Els 5 productes més venuts</h2></div><div class="tw"><table class="tbl"><tbody>${['f2','l1','b10','f1','r3'].map((id,i)=>{const p=PR(id),u=Math.round((1480-i*190)*S.range/30*sf);return `<tr><td style="width:2rem;color:var(--mut)">${i+1}</td><td><div class="pn">${img(p.id)}<b>${esc(p.ca)}</b></div></td><td class="num">${fmt(u)} unitats</td><td style="width:30%"><div class="bar"><i style="width:${100-i*17}%"></i></div></td></tr>`}).join('')}</tbody></table></div></div>`;
};
function statsCSV(){const st=statsFor();csv(`vendes-${S.range===365?'12-mesos':S.range+'-dies'}${S.store==='all'?'':'-'+storeName(S.store).replace(/\W+/g,'-')}.csv`,[['Període',st.N>90?'Mes':'Dia','Vendes (€)','Comandes','Tiquet mitjà (€)'],...st.days.map(d=>[rangeName(),d[0],d[1].toFixed(2).replace('.',','),Math.round(d[1]/st.tk),st.tk.toFixed(2).replace('.',',')]),[],['Total','',st.sales.toFixed(2).replace('.',','),st.orders,st.tk.toFixed(2).replace('.',',')]]);toast('CSV descarregat')}
async function statsPDF(){
  toast('Generant el PDF…');
  try{const {doc,logo}=await mkPDF(),st=statsFor();
    pdfHead(doc,logo,'Informe de vendes',rangeName()+' · '+(S.store==='all'?'Totes les botigues':storeName(S.store)));
    let y=44;doc.setFontSize(11);[['Vendes',mny(st.sales)],['Comandes',fmt(st.orders)],['Tiquet mitjà',mny(st.tk)],['Clients nous',fmt(st.newc)],['Variació vs període anterior',st.dsales.toFixed(1).replace('.',',')+' %']].forEach(r=>{doc.setFont('helvetica','bold');doc.setTextColor(...MUT);doc.text(r[0],15,y);doc.setFont('helvetica','normal');doc.setTextColor(...INK);doc.text(r[1],85,y);y+=7});
    y+=6;doc.setFillColor(...GREEN);doc.rect(15,y-5,180,8,'F');doc.setFont('helvetica','bold');doc.setFontSize(9.5);doc.setTextColor(29,42,10);doc.text(st.N>90?'Mes':'Dia',18,y);doc.text('Vendes',120,y,{align:'right'});doc.text('Comandes',192,y,{align:'right'});y+=8;
    doc.setFont('helvetica','normal');doc.setTextColor(...INK);st.days.forEach(d=>{if(y>270){doc.addPage();y=20}doc.text(d[0],18,y);doc.text(mny(d[1]),120,y,{align:'right'});doc.text(String(Math.round(d[1]/st.tk)),192,y,{align:'right'});doc.setDrawColor(230,223,206);doc.setLineWidth(.2);doc.line(15,y+2,195,y+2);y+=6.2});
    pdfFoot(doc);doc.save('informe-vendes.pdf');toast('Informe descarregat (PDF)')}
  catch(e){console.error(e);toast('No s\'ha pogut generar el PDF (cal connexió per carregar la llibreria)')}
}

/* repartidors */
PAGES.repartidors=()=>{
  const cnt=id=>S.orders.filter(o=>o.driver===id&&o.status!=='done').length;
  return `<div class="ph"><div><h1>Repartidors</h1><p>${S.drivers.filter(d=>d.active).length} actius de ${S.drivers.length} · assigna'ls a cada comanda des de Comandes</p></div><div class="acts"><button class="btn" data-act="drv-add">${svg('plus')}Afegeix repartidor</button></div></div>
<div class="card"><div class="tw"><table class="tbl"><thead><tr><th>Repartidor</th><th>Telèfon</th><th>Botiga base</th><th>Zona</th><th>Vehicle</th><th class="num">Comandes en curs</th><th>Actiu</th><th></th></tr></thead><tbody>
${S.drivers.map(d=>`<tr><td><div class="pn"><span class="avatar sm">${esc(d.name[0])}</span><b>${esc(d.name)}</b></div></td><td>${esc(d.tel)}</td><td>${esc(storeName(d.store))}</td><td>${esc(d.zone)}</td><td>${esc(d.veh)}</td><td class="num"><b>${cnt(d.id)}</b></td><td><span class="toggle ${d.active?'on':''}" data-act="drv-tog" data-id="${d.id}" role="switch" aria-checked="${d.active}" tabindex="0" aria-label="Actiu"></span></td><td class="rowact"><button class="ib sm" data-act="drv-edit" data-id="${d.id}" aria-label="Edita ${esc(d.name)}">${svg('edit')}</button><button class="ib sm" data-act="drv-del" data-id="${d.id}" aria-label="Elimina ${esc(d.name)}">${svg('trash')}</button></td></tr>`).join('')||`<tr><td colspan="8"><div class="empty">${svg('truck')}<b>Cap repartidor</b><small>Afegeix-ne un per poder assignar comandes.</small></div></td></tr>`}</tbody></table></div></div>`;
};
function fld(l,k,v,t='text'){return `<div class="field"><label>${l}</label><input class="input" data-f="${k}" type="${t}" value="${esc(v)}" autocomplete="off"></div>`}
function drvModal(id){
  const d=S.drivers.find(x=>x.id===id)||{name:'',tel:'',store:S.store==='all'?actStores()[0].id:S.store,zone:'',veh:'Moto',active:true};
  modal(id?'Edita el repartidor':'Afegeix un repartidor',`${fld('Nom i cognoms','name',d.name)}<div class="row2">${fld('Telèfon','tel',d.tel,'tel')}<div class="field"><label>Botiga base</label>${selBox('x',actStores().map(s=>[s.id,s.name]),d.store,'data-f="store"')}</div></div><div class="row2">${fld('Zona de repartiment','zone',d.zone)}<div class="field"><label>Vehicle</label>${selBox('x',VEH.map(v=>[v,v]),d.veh,'data-f="veh"')}</div></div>`,{ok:id?'Desa els canvis':'Afegeix',onOk(f){
    if(!f.name.trim())return 'Cal posar-hi el nom';
    if(id){Object.assign(d,{name:f.name.trim(),tel:f.tel,store:+f.store,zone:f.zone,veh:f.veh});toast('Repartidor actualitzat')}
    else{S.drivers.push({id:Math.max(0,...S.drivers.map(x=>x.id))+1,name:f.name.trim(),tel:f.tel,store:+f.store,zone:f.zone,veh:f.veh,active:true});toast(f.name.trim()+' afegit als repartidors')}
    paint(false)}});
}

/* botigues */
PAGES.botigues=()=>{
  const st=id=>S.orders.filter(o=>o.prep===id&&o.status!=='done').length,low=id=>PRODUCTS.filter(p=>stock(p,id)<10).length;
  return `<div class="ph"><div><h1>Botigues</h1><p>${actStores().length} actives de ${S.stores.length} · decideix quines preparen comandes online</p></div><div class="acts"><button class="btn" data-act="st-add">${svg('plus')}Afegeix botiga</button></div></div>
<div class="card"><div class="tw"><table class="tbl"><thead><tr><th>#</th><th>Botiga</th><th>Telèfon</th><th>Horari</th><th class="num">Comandes en curs</th><th class="num">Estoc baix</th><th>Prepara online</th><th>Oberta</th><th></th></tr></thead><tbody>
${S.stores.map(s=>`<tr class="${s.active?'':'off'}"><td><span class="num-dot">${s.id+1}</span></td><td><div class="pn"><div><b>${esc(s.name)}</b><small>${esc(s.full)}</small></div></div></td><td>${esc(s.tel)}</td><td>${esc(s.hours)}</td><td class="num"><b>${st(s.id)}</b></td><td class="num"><b style="color:${low(s.id)?'var(--red-ink)':'inherit'}">${low(s.id)}</b></td><td><span class="toggle ${s.online?'on':''}" data-act="st-online" data-id="${s.id}" role="switch" aria-checked="${s.online}" tabindex="0" aria-label="Prepara comandes online"></span></td><td><span class="toggle ${s.active?'on':''}" data-act="st-tog" data-id="${s.id}" role="switch" aria-checked="${s.active}" tabindex="0" aria-label="Botiga oberta"></span></td><td class="rowact"><button class="ib sm" data-act="st-edit" data-id="${s.id}" aria-label="Edita ${esc(s.name)}">${svg('edit')}</button><button class="ib sm" data-act="st-del" data-id="${s.id}" aria-label="Elimina ${esc(s.name)}">${svg('trash')}</button></td></tr>`).join('')}</tbody></table></div></div>`;
};
function stModal(id){
  const s=S.stores.find(x=>x.id===id)||{name:'',full:'',tel:'',hours:'9–21 h',online:true,active:true};
  modal(id!=null?'Edita la botiga':'Afegeix una botiga',`${fld('Nom curt (adreça)','name',s.name)}${fld('Adreça completa','full',s.full)}<div class="row2">${fld('Telèfon','tel',s.tel,'tel')}${fld('Horari','hours',s.hours)}</div>`,{ok:id!=null?'Desa els canvis':'Afegeix',onOk(f){
    if(!f.name.trim())return 'Cal posar-hi el nom';
    if(id!=null){Object.assign(s,{name:f.name.trim(),full:f.full,tel:f.tel,hours:f.hours});toast('Botiga actualitzada')}
    else{S.stores.push({id:Math.max(-1,...S.stores.map(x=>x.id))+1,name:f.name.trim(),full:f.full||f.name.trim(),tel:f.tel,hours:f.hours,online:true,active:true});toast(f.name.trim()+' afegida (botiga núm. '+S.stores.length+')')}
    paint(false);paintHeader()}});
}

/* ---------- finestra modal ---------- */
let MODAL=null,LASTF=null;
function modal(title,body,{ok='Desa',danger=false,onOk}){
  closeModal(true);LASTF=document.activeElement;
  const ov=document.createElement('div');ov.className='ov';ov.id='ov';
  ov.innerHTML=`<div class="md" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="mh"><h2 id="mt">${title}</h2><button class="ib" data-act="mclose" aria-label="Tanca">${svg('close')}</button></div><div class="mb">${body}</div><div class="mf"><button class="btn line" data-act="mclose">Cancel·la</button><button class="btn ${danger?'':'green'}" data-act="mok">${ok}</button></div></div>`;
  document.body.append(ov);MODAL={onOk};requestAnimationFrame(()=>{ov.classList.add('show');($('[data-f],select,.mf .btn:last-child',ov))?.focus()});
}
function closeModal(now){const ov=$('#ov');if(!ov)return;MODAL=null;if(now){ov.remove();return}ov.classList.remove('show');setTimeout(()=>ov.remove(),250);LASTF?.focus?.()}
function confirmBox(title,msg,ok,fn){modal(title,`<p style="margin:0">${msg}</p>`,{ok,danger:true,onOk(){fn();}})}
function modalOk(){
  if(!MODAL)return;const f={};$$('#ov [data-f]').forEach(e=>f[e.dataset.f]=e.value);
  const err=MODAL.onOk(f);if(err){toast(err,true);const e=$('#ov [data-f]');e?.classList.add('bad');e?.focus();return}
  closeModal();
}

/* ---------- capçalera amb menús ---------- */
function headerHTML(){
  const un=S.notif.filter(n=>n.unread).length,cur=S.cur==='producte'?'productes':S.cur;
  const open=m=>S.menu===m;
  return `<div class="in"><a class="brand" href="#resum"><img src="../img/jespac/logo_jespac.png" alt="Jespac"><small>Administració</small></a>
  <nav class="nav" aria-label="Administració">${NAV.map(n=>`<a href="#${n[0]}" class="${n[0]===cur?'on':''}"${n[0]===cur?' aria-current="page"':''}>${svg(n[2])}<span>${n[1]}</span>${n[0]==='comandes'?`<i class="n">${S.orders.filter(o=>o.status==='new').length}</i>`:''}</a>`).join('')}</nav>
  <div class="tools">
   <div class="pw"><button class="sel" data-act="menu" data-m="store" aria-haspopup="true" aria-expanded="${open('store')}">${svg('store')}<span class="lbl">${esc(storeLbl())}</span>${svg('chev')}</button>
    ${open('store')?`<div class="pop" role="menu"><div class="ph2">Veure dades de…</div>${[['all','Totes les botigues']].concat(actStores().map(s=>[s.id,s.name])).map(o=>`<button class="pi ${String(o[0])===String(S.store)?'on':''}" role="menuitemradio" aria-checked="${String(o[0])===String(S.store)}" data-act="pickstore" data-v="${o[0]}">${o[0]==='all'?svg('store'):`<span class="num-dot">${+o[0]+1}</span>`}<span>${esc(o[1])}</span>${String(o[0])===String(S.store)?svg('check2'):''}</button>`).join('')}</div>`:''}</div>
   <div class="pw"><button class="ib" data-act="menu" data-m="notif" aria-haspopup="true" aria-expanded="${open('notif')}" aria-label="Avisos${un?' ('+un+' sense llegir)':''}">${svg('bell')}${un?`<i></i>`:''}</button>
    ${open('notif')?`<div class="pop wide" role="menu"><div class="ph2">Avisos <button class="lnk" data-act="notif-all">Marca-ho tot com a llegit</button></div>${S.notif.map(n=>`<button class="pi nt ${n.unread?'unread':''}" data-act="notif-go" data-id="${n.id}">${svg(n.ic)}<span><b>${esc(n.t)}</b><small>${esc(n.s)}</small></span>${n.unread?'<i class="dot"></i>':''}</button>`).join('')||'<div class="empty"><small>Cap avís</small></div>'}</div>`:''}</div>
   <div class="pw"><button class="avatar" data-act="menu" data-m="user" aria-haspopup="true" aria-expanded="${open('user')}" aria-label="Perfil de ${esc(S.user.name)}">${esc(S.user.name[0])}</button>
    ${open('user')?`<div class="pop" role="menu"><div class="me"><span class="avatar">${esc(S.user.name[0])}</span><div><b>${esc(S.user.name)}</b><small>${esc(S.user.role)} · ${esc(storeName(S.user.store))}</small></div></div>
     <button class="pi" data-act="profile">${svg('user')}<span>El meu perfil</span></button><button class="pi" data-act="goto" data-v="repartidors">${svg('truck')}<span>Repartidors</span></button><button class="pi" data-act="goto" data-v="botigues">${svg('store')}<span>Botigues</span></button><button class="pi out" data-act="logout">${svg('back')}<span>Tanca la sessió</span></button></div>`:''}</div>
  </div></div>`;
}
function paintHeader(){const h=$('header.top');if(h)h.innerHTML=headerHTML()}

/* ---------- avís, animacions i router ---------- */
let toastT;
function toast(msg,bad){const t=$('#toast');if(!t)return;t.innerHTML=svg(bad?'warn':'check2')+esc(msg);t.classList.toggle('bad',!!bad);t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2800)}
function countUp(el){
  const t=el.textContent,m=t.match(/[\d.,]+/);if(!m)return;
  const num=parseFloat(m[0].replace(/\./g,'').replace(',','.'));if(!isFinite(num))return;
  const dec=(m[0].split(',')[1]||'').length,pre=t.slice(0,m.index),post=t.slice(m.index+m[0].length),t0=performance.now(),D=900;
  (function f(n){const p=Math.min(1,(n-t0)/D),e=1-Math.pow(1-p,3);el.textContent=pre+(num*e).toLocaleString('ca-ES',{minimumFractionDigits:dec,maximumFractionDigits:dec})+post;if(p<1)requestAnimationFrame(f)})(t0);
}
function wrap(sel){$$(sel).forEach(t=>{if(!t.parentElement.classList.contains('tw')){const w=document.createElement('div');w.className='tw';t.replaceWith(w);w.append(t)}})}
function enhance(anim){
  const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  wrap('main table.tbl');wrap('main .slots');wrap('main .tl');
  $$('main svg[style*="width:100%"]').forEach(s=>{s.classList.add('chart');$$('rect',s).forEach((r,i)=>r.style.setProperty('--i',i))});
  $$('.heat div:not(.lb)').forEach((d,i)=>d.style.setProperty('--i',i));
  $$('.bar i').forEach((b,i)=>b.style.setProperty('--d',(.25+i*.05)+'s'));
  if(rm||!anim)return;
  const items=$$('main .grid>*, main>.card, main .slide, main .offer').filter((e,i,a)=>a.indexOf(e)===i);
  items.slice(0,14).forEach((e,i)=>{e.classList.add('rv');e.style.setProperty('--d',(i*70)+'ms')});
  $$('.kpi .v').forEach(countUp);
}
function paint(anim=true){
  const k=S.cur;$('main').innerHTML=PAGES[k]();enhance(anim);
  if(!anim){$$('.bar i,.tl .bar2,.chart rect,.chart path,.heat div').forEach(e=>e.style.animation='none')}
}
function render(){
  const r=(location.hash||'#resum').slice(1);const k=PAGES[r]?r:'resum';S.cur=k;S.menu=null;
  document.title='Jespac · Administració · '+(NAV.find(n=>n[0]===k)?.[1]||'Producte');
  $('#app').innerHTML=`<header class="top"></header><main></main><div id="toast" role="status" aria-live="polite"></div>`;
  paintHeader();paint(true);scrollTo(0,0);
}
function setStore(v){S.store=v==='all'?'all':+v;S.menu=null;S.ppage=0;paintHeader();paint(false)}

/* ---------- esdeveniments ---------- */
document.addEventListener('click',e=>{
  const t=e.target;
  if(S.menu&&!t.closest('.pw')){S.menu=null;paintHeader()}
  const row=t.closest('tr[data-o]');
  if(row&&!t.closest('select')){S.osel=row.dataset.o;paintOrders();return}
  const a=t.closest('[data-act]');if(!a){const tog=t.closest('.toggle,.chip');if(tog&&!a)return;return}
  const act=a.dataset.act,v=a.dataset.v,id=a.dataset.id;
  const ord=()=>S.orders.find(o=>o.id===S.osel);
  switch(act){
    case 'menu':S.menu=S.menu===a.dataset.m?null:a.dataset.m;paintHeader();if(S.menu)$('.pop .pi',document)?.focus?.({preventScroll:true});break;
    case 'pickstore':setStore(v);toast(v==='all'?'Veient totes les botigues':'Veient '+storeName(+v));break;
    case 'notif-go':{const n=S.notif.find(x=>x.id===+id);if(n){n.unread=false;S.menu=null;paintHeader();if(location.hash==='#'+n.go)paint(false);else location.hash=n.go}break}
    case 'notif-all':S.notif.forEach(n=>n.unread=false);paintHeader();toast('Tots els avisos marcats com a llegits');break;
    case 'profile':S.menu=null;paintHeader();modal('El meu perfil',`<div class="me big"><span class="avatar">${esc(S.user.name[0])}</span><div><b>${esc(S.user.name)}</b><small>${esc(S.user.role)}</small></div></div>${fld('Nom i cognoms','name',S.user.name)}${fld('Correu','email',S.user.email,'email')}<div class="row2">${fld('Telèfon','tel',S.user.tel,'tel')}<div class="field"><label>Rol</label>${selBox('x',['Cap de botiga','Encarregada de comandes','Administració','Direcció'].map(x=>[x,x]),S.user.role,'data-f="role"')}</div></div><div class="field"><label>Botiga habitual</label>${selBox('x',actStores().map(s=>[s.id,s.name]),S.user.store,'data-f="store"')}</div>`,{ok:'Desa el perfil',onOk(f){if(!f.name.trim())return 'Cal posar-hi el nom';Object.assign(S.user,{name:f.name.trim(),email:f.email,tel:f.tel,role:f.role,store:+f.store});paintHeader();paint(false);toast('Perfil actualitzat')}});break;
    case 'logout':S.menu=null;paintHeader();toast('Sessió tancada (és una mostra: no hi ha cap sessió real)');break;
    case 'goto':S.menu=null;location.hash=v;break;
    case 'goto-pend':S.of='prep';S.oday=0;break;
    case 'ofilter':S.of=v;paintOrders();break;
    case 'advance':{const o=ord();if(!o)break;const nx=NEXT[o.status];if(!nx)break;
      if(o.status==='ready'&&o.mode==='C'&&!o.driver){toast('Assigna un repartidor abans de la sortida',true);const s=$('#drvsel');s?.focus();s?.classList.add('bad');break}
      o.status=o.mode==='R'&&o.status==='ready'?'done':nx[0];toast(o.id+' · '+({prep:'en preparació',ready:'llesta',ship:'en repartiment',done:'lliurada'}[o.status]));paintOrders();paintHeader();break}
    case 'pdf-one':{const o=ord();if(o)albaraPDF([o]);break}
    case 'pdf-all':albaraPDF(fOrders());break;
    case 'csv-orders':{const l=fOrders();csv('comandes.csv',[['Comanda','Client','Telèfon','Dia','Franja','Botiga que prepara','Repartidor','Estat','Total (€)'],...l.map(o=>[o.id,o.client,o.tel,dLong(o.day),o.slot,storeName(o.prep),o.driver?drvName(o.driver):'',o.status,oinfo(o).total.toFixed(2).replace('.',',')])]);toast(l.length+' comandes exportades (CSV)');break}
    case 'range':S.range=+v;paint(true);break;
    case 'stats-csv':statsCSV();break;
    case 'stats-pdf':statsPDF();break;
    case 'plow':S.plow=!S.plow;S.ppage=0;paint(false);break;
    case 'psel':S.psel.has(id)?S.psel.delete(id):S.psel.add(id);paintProducts();break;
    case 'psel-all':{const rows=pRows().slice(S.ppage*10,S.ppage*10+10),all=rows.every(p=>S.psel.has(p.id));rows.forEach(p=>all?S.psel.delete(p.id):S.psel.add(p.id));paintProducts();break}
    case 'pvis':S.pvis[id]=S.pvis[id]===false;a.classList.toggle('on',S.pvis[id]!==false);a.setAttribute('aria-checked',S.pvis[id]!==false);toast(S.pvis[id]===false?'Producte amagat de la botiga online':'Producte visible a la botiga online');break;
    case 'ppage':S.ppage=a.dataset.abs?+v:S.ppage+ +v;paintProducts();break;
    case 'pbulk':{const sel=PRODUCTS.filter(p=>S.psel.has(p.id));if(!sel.length){toast('Selecciona algun producte primer',true);break}
      if(v==='offer'){sel.forEach(p=>{p.o=Math.round(p.p*.85*100)/100});toast('Oferta −15 % aplicada a '+sel.length+' productes')}
      else if(v==='clear'){sel.forEach(p=>{p.o=null});toast('Oferta retirada de '+sel.length+' productes')}
      else{sel.forEach(p=>S.pvis[p.id]=false);toast(sel.length+' productes amagats de la botiga online')}paintProducts();break}
    case 'csv-prod':csv('productes.csv',[['Codi','Producte','Secció','Preu (€)','Oferta (€)','Estoc '+(S.store==='all'?'total':storeName(S.store)),...actStores().map(s=>'Estoc '+(s.id+1)+' '+s.name)],...pRows().map(p=>['JSP-'+(hs(p.id)%90000+10000),p.ca,CAT[p.c].ca,p.p.toFixed(2).replace('.',','),p.o?p.o.toFixed(2).replace('.',','):'',S.store==='all'?tstock(p):stock(p,S.store),...actStores().map(s=>stock(p,s.id))])]);toast('Productes exportats (CSV)');break;
    case 'drv-add':drvModal();break;
    case 'drv-edit':drvModal(+id);break;
    case 'drv-tog':{const d=S.drivers.find(x=>x.id===+id);d.active=!d.active;paint(false);toast(d.name+(d.active?' activat':' desactivat'));break}
    case 'drv-del':{const d=S.drivers.find(x=>x.id===+id);confirmBox('Eliminar repartidor',`Vols eliminar <b>${esc(d.name)}</b>? Les comandes en curs que té assignades quedaran sense repartidor.`,'Elimina',()=>{S.orders.forEach(o=>{if(o.driver===d.id&&o.status!=='done')o.driver=null});S.drivers=S.drivers.filter(x=>x!==d);paint(false);toast('Repartidor eliminat')});break}
    case 'st-add':stModal();break;
    case 'st-edit':stModal(+id);break;
    case 'st-online':{const s=S.stores.find(x=>x.id===+id);s.online=!s.online;a.classList.toggle('on',s.online);toast(s.name+(s.online?' prepara comandes online':' ja no prepara comandes online'));break}
    case 'st-tog':{const s=S.stores.find(x=>x.id===+id);const pend=S.orders.filter(o=>o.prep===s.id&&o.status!=='done').length;
      if(s.active&&pend){toast('Té '+pend+' comandes en curs: reassigna-les abans de tancar-la',true);break}
      if(s.active&&actStores().length===1){toast('Ha de quedar almenys una botiga oberta',true);break}
      s.active=!s.active;if(!s.active&&S.store===s.id)S.store='all';paint(false);paintHeader();toast(s.name+(s.active?' oberta':' tancada'));break}
    case 'st-del':{const s=S.stores.find(x=>x.id===+id);
      if(S.orders.some(o=>o.prep===s.id||o.from===s.id)||S.drivers.some(d=>d.store===s.id)){toast('Té comandes o repartidors associats: tanca-la en lloc d\'eliminar-la',true);break}
      confirmBox('Eliminar botiga',`Vols eliminar <b>${esc(s.name)}</b>? No es pot desfer.`,'Elimina',()=>{S.stores=S.stores.filter(x=>x!==s);if(S.store===s.id)S.store='all';paint(false);paintHeader();toast('Botiga eliminada')});break}
    case 'toast':toast(a.dataset.m);break;
    case 'mclose':closeModal();break;
    case 'mok':modalOk();break;
  }
  if(act==='goto-pend')return;
});
document.addEventListener('change',e=>{
  const a=e.target.closest('[data-chg]');if(!a)return;const v=a.value;a.classList.remove('bad');
  switch(a.dataset.chg){
    case 'o-fstore':setStore(v);break;
    case 'o-fday':S.oday=v==='all'?'all':+v;paintOrders();break;
    case 'p-sec':S.psec=v;S.ppage=0;paintProducts();break;
    case 'o-store':{const o=S.orders.find(x=>x.id===S.osel);o.prep=+v;toast(o.id+' reassignada a '+storeName(o.prep));paintOrders();break}
    case 'o-drv':{const o=S.orders.find(x=>x.id===S.osel);o.driver=v?+v:null;toast(v?'Assignada a '+drvName(o.driver):'Repartidor retirat');paintOrders();break}
  }
});
document.addEventListener('input',e=>{
  if(e.target.id==='oq'){S.oq=e.target.value;paintOrders();const i=$('#oq');i.focus();i.setSelectionRange(i.value.length,i.value.length)}
  if(e.target.id==='pq'){S.pq=e.target.value;S.ppage=0;paintProducts()}
  e.target.classList?.remove('bad');
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if($('#ov'))closeModal();else if(S.menu){S.menu=null;paintHeader()}}
  if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('[role=checkbox],[role=switch]')){e.preventDefault();e.target.click()}
  if(e.key==='Enter'&&e.target.closest?.('#ov')&&e.target.tagName==='INPUT')modalOk();
});
/* interruptors i filtres decoratius que ja existien a les pàgines de mostra */
document.addEventListener('click',e=>{
  const tog=e.target.closest('.toggle:not([data-act])');if(tog){tog.classList.toggle('on');return}
  const chip=e.target.closest('.chip:not([data-act])');
  if(chip){const g=chip.parentElement;if(g.classList.contains('acts'))$$('.chip',g).forEach(c=>c.classList.toggle('on',c===chip));else chip.classList.toggle('on')}
  const btn=e.target.closest('button.btn:not([data-act])');
  if(btn){const tx=btn.textContent.trim(),sv=btn.closest('.save');
    if(/descarta/i.test(tx)){if(sv)sv.style.display='none';toast('Canvis descartats')}
    else if(/desa|programa|publica/i.test(tx)){toast(/programa/i.test(tx)?'Oferta programada':/publica/i.test(tx)?'Portada publicada':'Canvis desats');if(sv)sv.style.display='none'}
    else toast('Funció de mostra · «'+tx+'»')}
});
addEventListener('hashchange',render);render();
document.addEventListener('touchstart',()=>{},{passive:true});

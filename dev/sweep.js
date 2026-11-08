/* Dev-only layout sweep (not part of the site). Load in the browser console:
     eval(await (await fetch('dev/sweep.js')).text()); await __sweep(['inici','botiga',...])
   Reports, per route, for the current window width: horizontal overflow, elements outside the viewport,
   icons overlapping their text, overlapping siblings in rows/grids, big numbers that wrap, and clipped text. */
window.__sweep=async function(routes){
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));const issues=[];const W=innerWidth;
  const vis=e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'};
  const inv=e=>e.closest('.slide>img,.slides,.c3,.ring3d,.drawer,.mnav,.cartbar,.toast,.modal,#herolink,.disk,.sr,.skip,svg:not(:root)');
  const inter=(a,b)=>{const x=Math.min(a.right,b.right)-Math.max(a.left,b.left),y=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);return x>3&&y>3?x*y:0};
  const nm=e=>(e.tagName.toLowerCase()+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/).slice(0,2).join('.'):''));
  for(const r of routes){
    location.hash=r;await sleep(420);
    document.querySelectorAll('.rv').forEach(e=>e.classList.add('in','now'));await sleep(60);
    const de=document.documentElement,tag=s=>issues.push(W+'px #'+r+' '+s);
    if(de.scrollWidth-de.clientWidth>1)tag('H-OVERFLOW '+(de.scrollWidth-de.clientWidth));
    document.querySelectorAll('#view *,#hbar *,#footer *').forEach(e=>{if(!vis(e)||inv(e)||e.closest('.pimg'))return;const b=e.getBoundingClientRect();if((b.right>W+1||b.left<-1)&&e.children.length===0)tag('OUT '+nm(e)+' '+Math.round(b.left)+'..'+Math.round(b.right))});
    document.querySelectorAll('.btn,.acttile .go,.soc,.store .tel,nav.main a,.langs button,.sbox .big,.sbox li,.svcs li,.phcard figcaption,.side button,.crumbs a,.link,.opt,footer .ftel,footer .fsoc a,.stepper,.addbtn').forEach(e=>{
      if(!vis(e)||inv(e))return;const sv=[...e.querySelectorAll('svg')].filter(s=>s.getBoundingClientRect().width>0);if(!sv.length)return;
      const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('svg')||!n.textContent.trim()?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});let n;
      while(n=w.nextNode()){const rg=document.createRange();rg.selectNodeContents(n);[...rg.getClientRects()].forEach(tr=>{sv.forEach(s=>{const sr=s.getBoundingClientRect();const a={left:sr.left+3,right:sr.right-3,top:sr.top+3,bottom:sr.bottom-3};if(inter(a,tr)>12)tag('ICON/TEXT '+nm(e)+' "'+n.textContent.trim().slice(0,22)+'"')})})}
    });
    document.querySelectorAll('.hbar>*,.hactions>*,.acts4>*,.stats>*,.grid3>*,.grid4>*,.socials>*,.fee>*,.sbox>*,.shead>*,.hnav>*,.hcta>*,.toolbar>*,.store .acts>*,.subnav>*,.stepbar>*,.values>*,.steps>*,.cols>*').forEach(e=>{
      if(!vis(e)||inv(e))return;const p=e.parentElement;[...p.children].forEach(o=>{if(o===e||!vis(o)||o.compareDocumentPosition(e)&2)return;if(getComputedStyle(o).position==='absolute'||getComputedStyle(e).position==='absolute')return;if(inter(e.getBoundingClientRect(),o.getBoundingClientRect())>40)tag('SIBLINGS '+nm(e)+' x '+nm(o))})});
    document.querySelectorAll('.num').forEach(e=>{if(!vis(e))return;const lh=parseFloat(getComputedStyle(e).fontSize)*1.3;if(e.getBoundingClientRect().height>lh*1.25)tag('WRAPPED '+nm(e)+' "'+e.textContent.trim().slice(0,12)+'"')});
    document.querySelectorAll('.btn,.pill,.tagrow button,.subnav a,.acttile strong,.stat p,.stext h3').forEach(e=>{if(!vis(e)||inv(e))return;if(e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflowX!=='visible')tag('CLIPPED '+nm(e))});
  }
  const hb=document.querySelector('#hbar');return {W,compact:hb.classList.contains('compact'),issues:[...new Set(issues)]};
};

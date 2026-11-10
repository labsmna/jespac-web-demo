/* ---------- BOOT (always the last script) ---------- */
document.documentElement.lang=lang;
paintFooter();render(true);refreshCart();booted=true;

/* iOS Safari només aplica :active si hi ha algun listener de touch */
document.addEventListener('touchstart',()=>{},{passive:true});

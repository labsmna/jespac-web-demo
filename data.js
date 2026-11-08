/* ---------- DATA ---------- */

const CATS=[
['fruita','Fruita i verdura','Fruta y verdura','#262626'],
['carn','Carnisseria','Carnicería','#262626'],
['xarc','Xarcuteria i formatges','Charcutería y quesos','#262626'],
['peix','Peixateria','Pescadería','#262626'],
['forn','Forn i pa fresc','Horno y pan fresco','#262626'],
['lact','Làctics i ous','Lácteos y huevos','#262626'],
['sec','Rebost i conserves','Despensa y conservas','#262626'],
['beg','Begudes','Bebidas','#262626'],
['vins','Vins i caves','Vinos y cavas','#262626'],
['cong','Congelats','Congelados','#262626'],
['eco','Ecològics','Ecológicos','#262626'],
['neteja','Neteja i llar','Limpieza y hogar','#262626'],
['higiene','Higiene personal','Higiene personal','#262626']
];
const CAT=Object.fromEntries(CATS.map(c=>[c[0],{id:c[0],ca:c[1],es:c[2],col:c[3]}]));

/* id,cat,ca,es,price,unit,size,tags,offer,step */
const P=(id,c,ca,es,p,u,size,tags=[],o=null,step=null)=>({id,c,ca,es,p,u,size,tags,o,step:step||(u==='kg'?0.5:1)});
const PRODUCTS=[
P("f1","fruita","Pomes Fuji","Manzanas Fuji",2.45,"kg","",[],1.95,0.5),
P("f2","fruita","Plàtans de Canàries","Plátanos de Canarias",2.19,"kg","",[],null,0.5),
P("f3","fruita","Tomàquet de penjar","Tomate de colgar",3.29,"kg","",['local'],null,0.5),
P("f4","fruita","Enciam romà","Lechuga romana",1.15,"u","1 unitat",[],null,1),
P("f5","fruita","Patata per fregir","Patata para freír",1.39,"kg","",[],null,0.5),
P("f7","fruita","Pastanaga","Zanahoria",2.10,"kg","",['eco'],null,0.5),
P("f9","fruita","Pera Conference","Pera Conference",2.35,"kg","",[],null,0.5),
P("f11","fruita","Maduixes del Maresme","Fresas del Maresme",3.95,"u","500 g",['local'],2.95,1),
P("f14","fruita","Llimones","Limones",2.29,"kg","",[],null,0.5),
P("f16","fruita","Alvocat","Aguacate",1.49,"u","1 unitat",[],null,1),
P("f18","fruita","Pebrot vermell","Pimiento rojo",2.99,"kg","",[],null,0.5),
P("f21","fruita","Bròquil","Brócoli",2.79,"kg","",[],null,0.5),
P("f30","fruita","Xampinyons","Champiñones",3.49,"u","500 g",[],null,1),
P("c1","carn","Entrecot de vedella","Entrecot de ternera",21.90,"kg","Talla'l al gruix que vulguis",['premium'],null,0.25),
P("p1","peix","Salmó fresc","Salmón fresco",14.90,"kg","",[],null,0.25),
P("x9","xarc","Formatge brie","Queso brie",2.99,"u","200 g",[],null,1),
P("b2","forn","Barra de pa","Barra de pan",0.65,"u","1 unitat",[],null,1),
P("b10","forn","Pa de pasta mare","Pan de masa madre",3.20,"u","600 g",['nou'],null,1),
P("l1","lact","Llet entera Alteza","Leche entera Alteza",0.89,"u","1 L",['alteza'],null,1),
P("l2","lact","Iogurt natural (4 u)","Yogur natural (4 u)",1.35,"u","4 x 125 g",['alteza'],null,1),
P("l3","lact","Ous de gallines lliures L","Huevos camperos L",2.95,"u","Dotzena",['local'],2.49,1),
P("r1","sec","Arròs rod","Arroz redondo",1.85,"u","1 kg",[],null,1),
P("r2","sec","Espaguetis","Espaguetis",1.15,"u","500 g",[],0.95,1),
P("r3","sec","Cafè en gra","Café en grano",5.95,"u","500 g",[],null,1),
P("r4","sec","Mel de flors","Miel de flores",4.90,"u","500 g",['local'],null,1),
P("r5","sec","Oli d'oliva verge extra","Aceite de oliva virgen extra",8.95,"u","1 L",['local'],null,1),
P("r6","sec","Llenties vermelles","Lentejas rojas",1.95,"u","500 g",[],null,1),
P("r7","sec","Ametlles crues","Almendras crudas",3.95,"u","250 g",[],null,1),
P("q1","beg","Suc de taronja","Zumo de naranja",1.95,"u","1 L",[],null,1),
P("v3","vins","Vi negre de criança","Vino tinto crianza",6.90,"u","75 cl",['premium'],null,1)
];
const TAGS={
 local:['Local','Local','leaf'],eco:['Eco','Eco','leaf'],nou:['Nou','Nuevo','blue'],
 premium:['Premium','Premium','dark'],alteza:['Alteza','Alteza','pill'],selex:['Selex','Selex','pill']
};
const FRESH=new Set(['fruita','carn','xarc','peix','forn']);

const STORES=[
['Av. República Argentina, 179','Avinguda de la República Argentina, 179'],
['C/ Arimon, 11','Carrer d\'Arimon, 11'],
['Av. dels Quinze, 64-67','Avinguda dels Quinze, 64'],
['C/ Muntaner, 187','Carrer de Muntaner, 187'],
['C/ Mallorca, 214','Carrer de Mallorca, 214'],
['C/ Consell de Cent, 246','Carrer del Consell de Cent, 246'],
['C/ Floridablanca, 133','Carrer de Floridablanca, 133'],
['Av. Paral·lel, 106','Avinguda del Paral·lel, 106'],
['C/ Jaume Fabra, 7-9','Carrer de Jaume Fabra, 7-9']
].map((s,i)=>({id:i,short:s[0],full:s[1],tel:['932 113 816','932 540 086','933 528 453','934 192 666','934 519 800','933 236 696','937 687 305','934 427 966','934 427 308'][i],slug:['republica-argentina','arimon','avda-quinze','muntaner','mallorca','consell-de-cent','floridablanca','paralel','jaume-fabra'][i]}));

const SERVICES=[
['Garantia de devolució','Garantía de devolución'],['Pagament amb targeta de crèdit','Pago con tarjeta de crédito'],['Repartiment gratuït a domicili','Reparto gratuito a domicilio'],
['Horari continuat de 9\'00 a 21\'00 h','Horario continuado de 9\'00 a 21\'00 h'],['Atenció personalitzada','Atención personalizada'],['Comanda per email','Pedido por email'],
['Caixa ràpida per evitar cues','Caja de cobro rápida (evitar colas)'],['Consigna','Taquillas'],['Autoservei','Autoservicio'],
['Ofertes periòdiques','Ofertas periódicas'],['Pa acabat de fer tot el dia','Pan recién hecho durante todo el día'],['Vinoteca','Vinacoteca'],
['Secció de frescos','Sección de frescos'],['Secció de congelats','Sección de congelados']
];
/* delivery (from the leaflet): free from 60 EUR, otherwise 3 EUR; max 4 packs of water/milk/jugs, each extra band of 4 packs +3 EUR */
const FREE_FROM=60, FEE=3, PACK_BAND=4, PACK_FEE=3;
const HEAVY=new Set(['d1','l1','d5']);
const TEL='932 539 041', TEL_HREF='932539041', WA='696 937 589', WA_HREF='34696937589', MAIL='clients@jespac.com', ORDERS_MAIL='comandes@jespac.com';

/* ---------- SITE MAP (single source for nav, sub-nav, footer and #mapa) ---------- */
const SITE=[
 {id:'comprar',t:['Comprar','Comprar'],ic:'cart',items:[
  ['botiga',['Botiga online','Tienda online'],['Fes la compra des de casa','Haz la compra desde casa'],'cart'],
  ['ofertes',['Ofertes','Ofertas'],['Els preus especials del mes','Los precios especiales del mes'],'tag'],
  ['fresc',['Fresc de mercat','Fresco de mercado'],['Carnisseria, xarcuteria i fruiteria','Carnicería, charcutería y frutería'],'fruita'],
  ['oferim',['Serveis','Servicios'],["Què t'oferim a Jespac",'Qué te ofrecemos en Jespac'],'hands']]},
 {id:'jespac',t:['Coneix Jespac','Conoce Jespac'],ic:'store',items:[
  ['empresa',['Qui som','Quiénes somos'],['La nostra història i valors','Nuestra historia y valores'],'users'],
  ['compra360',['La compra rodona','La compra redonda'],["Un nou concepte d'autoservei",'Un nuevo concepto de autoservicio'],'basket'],
  ['establiments',['Les nostres botigues','Nuestras tiendas'],['Adreça i telèfon de cada botiga','Dirección y teléfono de cada tienda'],'pin'],
  ['igualtat',["Pla d'igualtat",'Plan de igualdad'],['El nostre compromís','Nuestro compromiso'],'scales'],
  ['solidaritat',["Mulla't per l'Esclerosi Múltiple",'Mójate por la Esclerosis Múltiple'],['La nostra acció solidària','Nuestra acción solidaria'],'heart'],
  ['treballa',['Treballa amb nosaltres','Trabaja con nosotros'],["Envia'ns el teu currículum",'Envíanos tu currículum'],'job'],
  ['feina',['Ofertes de treball','Ofertas de trabajo'],['Vacants obertes','Vacantes abiertas'],'job']]},
 {id:'ajuda',t:['Ajuda i contacte','Ayuda y contacto'],ic:'help',items:[
  ['contacte',['Contacta amb nosaltres','Contacta con nosotros'],['Telèfon, correu i formulari','Teléfono, correo y formulario'],'phone'],
  ['ticket',['Ticket per email','Ticket por email'],['Rep el ticket al teu correu','Recibe el ticket en tu correo'],'mail']]},
 {id:'legal',t:['Informació legal','Información legal'],ic:'shield',items:[
  ['legal',['Avís legal','Aviso legal'],['Condicions d\'ús del web','Condiciones de uso de la web'],'shield'],
  ['privacitat',['Política de privacitat','Política de privacidad'],['Com tractem les teves dades','Cómo tratamos tus datos'],'shield'],
  ['cookies',['Política de cookies','Política de cookies'],['Quines cookies fem servir','Qué cookies usamos'],'shield']]}
];
const SUBNAV={comprar:['botiga','ofertes','fresc','oferim'],jespac:['empresa','compra360','establiments','igualtat','solidaritat','treballa'],ajuda:['contacte','ticket'],legal:['legal','privacitat','cookies']};
const baseRoute=r=>r.startsWith('tenda-')?'establiments':r;
const groupOf=r=>SITE.find(g=>g.items.some(i=>i[0]===baseRoute(r)));
const itemOf=r=>{for(const g of SITE){const i=g.items.find(i=>i[0]===baseRoute(r));if(i)return i}};

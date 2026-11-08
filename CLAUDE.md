# Jespac · web 2027 (prototip)

Redisseny de https://www.jespac.com (supermercats a Barcelona) amb botiga online. Català + castellà.

## Estructura
- `style.css` tokens, components i animacions (placeholders `{{FONT_REG}}`/`{{FONT_BOLD}}` per a les fonts en base64)
- `data.js` icones SVG, categories, catàleg demo (61 productes), botigues, serveis, constants `FREE_FROM=60` i `FEE=3.90`
- `app.js` estat, cistella, capçalera/peu, router per hash, esdeveniments
- `views1.js` portada, botiga, "enganxa la teva llista"
- `views2.js` checkout, confirmació i pàgines de contingut
- `shell.html` + `build.py` generen `index.html` (fitxer únic). Fonts a `fonts/` (DejaVu Sans Condensed subset .woff)

## Marca (respectar)
Vermell #F7403A, gris fosc #262626, verd #8CC63F, blau enllaços #1863DC. Tipografia: DejaVu Sans Condensed (títols/text) + Open Sans (menú/UI).

## Pendent
- Backend: guardar comandes, validar franges, enviar emails de confirmació
- Stripe real (ara només un marc visual a `#comanda`)
- Catàleg real (substituir `PRODUCTS` a data.js per JSON/CSV del client)
- Logotip original (ara una recreació SVG a `logo()` d'app.js) i fotos de producte
- Textos de les pàgines reescrits a partir de resums: substituir pels originals
- Confirmar: tarifa < 60 € (3,90 € suposada), dies de repartiment (dl–ds suposat), número de WhatsApp, mapa de botigues
- Formularis de contacte/ticket/feina són demo (no envien res)

## Redisseny v2 (nov 2026)
- `icons.js` (generat): icones Phosphor duotone + logos Simple Icons (WhatsApp, Instagram, Facebook) incrustats. `svg('clau')` a tot arreu.
- `data.js` conté `SITE` (grups Comprar / Coneix Jespac / Ajuda amb rutes i textos CA/ES): única font per a menú, subnavegació, peu i `#mapa`.
- Pàgines (hash): inici, botiga, ofertes, fresc, oferim (Serveis), empresa (Qui som), compra360, establiments (Botigues), igualtat, treballa, feina, contacte, ticket, mapa, comanda, gracies.
- Portada: **carrusel de fotos a pantalla completa** (`initHero()` a app.js; 5 diapositives a `HERO_SLIDES()` de views1.js, fotos a `img/hero/`): autoplay 6,5 s, es pausa amb el ratolí/focus/pestanya amagada, punts de progrés, fletxes, pausa/play, lliscar amb el dit i fletxes del teclat; sense autoplay amb `prefers-reduced-motion`. La roda 3D s'ha eliminat.
- Carro: el botó "Afegir" es converteix al lloc en selector −/+; barra inferior fixa (`#cartbar`); el calaix només s'obre a petició i es pot arrossegar per tancar-lo.
- Accessibilitat per a gent gran: text base 18 px, botons ≥ 3,4 rem, alt contrast, nav pla sense desplegables.
- Sense vidre (`backdrop-filter`) ni degradats. Sense mode fosc.
- Build: `PYTHONUTF8=1 python build.py` (a Windows cal UTF-8). Previsualització: `python -m http.server 5173 --directory jespac-site` (vegeu `../.claude/launch.json`).
- Botiga real: recomanació WooCommerce (el web actual és WordPress + WPML). Aquest prototip és la referència de disseny/UX per a un tema propi.

## Imatges (nov 2026)
- `img/cat/*.jpg`: 13 fotos de mostra (Pexels, lliures, sense marca d'aigua), una per secció; es retallen amb zoom/posició diferent per producte (`ph()` a app.js). Provisional: substituir per fotos pròpies. Crèdits a `img/CREDITS.md`.
- `img/jespac/`: logotip oficial (`logo_jespac.png`, ja usat a `logo()`) i la imatge "Fresc de mercat", baixats del jespac.com actual. Demanar els originals en alta resolució al client.
- `index.html` ara ja no és un sol fitxer: referencia `img/` amb rutes relatives (cal servir la carpeta sencera).
- Barra de cistella (`#cartbar`): confirmació transitòria de ~3 s (`pingBar()`); el total és sempre visible al botó "Cistella" de la capçalera.

## Decisions v3 (nov 2026)
- Menú: una sola fila horitzontal amb els noms de totes les pàgines (Botiga online, Ofertes, Fresc de mercat, Serveis, Botigues, Qui som, Contacte); només sota 1100 px passa a botó "Menú". Barra superior fina amb telèfon i CA/ES petits. Sense selector de mida de lletra.
- Un sol color per a totes les seccions (`CATS[...][3]` = #262626; icones de secció en vermell de marca): no tornar a posar un color per secció.
- Cap foto de la pàgina Serveis (el cartell de qualitats s'ha eliminat; no es mostra enlloc).
- Animacions: barra de progrés de repartiment persistent (només canvia `width`), línia de la cistella que es plega en treure-la, check amb ressort en passar de 60 €, fosa de fotos en carregar (`img.f`/`.ld`), desplegable "Seccions" al mòbil (`#sidewrap`, `grid-template-rows`), errors del formulari amb fosa de 160 ms.
- Més aire: seccions amb 4–8 rem de padding vertical, graelles amb 1,5 rem de buit; a la botiga sense nota ni comptador de productes; portada sense "Per què Jespac".

## v4 (nov 2026)
- **Textos originals**: `content.js` es genera des del text de jespac.com (CA + ES) amb `gen_content.py` (scratchpad de la sessió; torna a llegir el sitemap `wp-sitemap-posts-page-1.xml`). Pàgines: empresa, compra360, oferim, fresc, igualtat, solidaritat (Mulla't), ofertes, feina i legals (avís legal, privacitat, cookies). Cada botiga té pàgina pròpia `#tenda-<slug>` amb el seu telèfon (a `STORES[].tel`). Els buits de l'original (p. ex. "amp Jespac") s'han corregit només al títol de Mulla't.
- **Peu de pàgina**: telèfon, comandes per WhatsApp (696 937 589, dl–dv 9–14 h), correus, idioma (Català/Castellano), Instagram, Facebook i WhatsApp. Ja no hi ha barra superior.
- **Menú**: només és hamburguesa si el menú escrit no hi cap (`fitNav()` a app.js mesura `scrollWidth`; classe `.compact`). A 1280 px hi cap sencer.
- **Paleta**: fons crema #FAF5EA; botons vermell (acció principal) i verd del logo (la resta); accents verds (traç sota títols, punts de llista, subratllats).
- **Repartiment (foto del client)**: gratuït des de 60 €, per sota **3 €**; màx. 4 packs d'aigua/llet/garrafes, cada franja de 4 packs addicionals **+3 €** (5–8 → 3 €, 9–12 → 6 €…). Constants `FEE`, `PACK_BAND`, `PACK_FEE`, `HEAVY` (data.js); `packFee()`/`baseFee()` (app.js). Targeta a `#oferim` (`feeBox()`) i resum al checkout.
- **A confirmar amb el client**: el bàner de comandes de jespac.com diu "3 € per a compres superiors a 60 € / 5 € per a inferiors" (sembla antic), mentre que la foto diu gratuït >60 € i 3 € <60 €. S'ha seguit la foto. Servei de comandes per WhatsApp: àrea de repartiment de 5 illes (500 m), entrega el mateix dia o abans de 24 h (comandes abans de les 19 h).
- **Qui som a la portada**: `aboutHTML()` (pages.js): estadístiques + 5 punts forts amb foto. Fotos noves: `img/story/` (Pexels 137602 energia, 7363085 repartiment).
- **Animació d'aparició**: `.rv` + `autoReveal()` (IntersectionObserver); els elements salten de sota i rebotan un cop (`--bounce`, ~1 s, esglaonat 80 ms). No s'aplica a la graella de productes, checkout ni confirmació; amb `prefers-reduced-motion` no es mou. Nota: al navegador del panell de Claude els observadors només s'activen quan es pinta un fotograma.
- **Proves de maquetació**: `dev/sweep.js` (només desenvolupament) revisa a cada amplada: desbordament, lletres fora de pantalla, icones sobre el text, elements que se solapen i números que es parteixen. Passat a 320–1440 px a les 18 pàgines.
- Pendent: legals en castellà només per a avís legal/privacitat/cookies; les bases dels concursos d'Instagram i les clàusules de protecció de dades continuen com a enllaços al web original.

## v5 (nov 2026)
- Icones petites de la interfície (menú, tancar, +, −, fletxes, cerca, pausa/play) en pes "bold" nítid: el duotone feia una ombra translúcida. Les icones de seccions i serveis segueixen duotone. `icons.js` es regenera des del scratchpad (`icons.mjs`).
- Els botons en forma de píndola sota el títol (subnav) s'han tret de les pàgines de **Comprar** (ja són tots a la capçalera); es mantenen a Qui som, Ajuda i Legal perquè Ticket per email, Pla d'igualtat, Mulla't, Treballa, La compra rodona i els textos legals només són accessibles per aquí i pel peu.
- "Parlem?" és ara només tres logos rodons (WhatsApp, Instagram, Facebook) a `.follow`.
- Comprovat: 0 enllaços interns trencats, 0 imatges trencades, 1 `h1` per pàgina, flux de comanda complet i `dev/sweep.js` net de 320 a 1440 px.

## v6 (nov 2026)
- **Catàleg**: 30 productes, tots amb foto professional d'estoc de Pexels (fons net/estudi, mai en plat ni de mòbil), `img/p/<id>.jpg` 640x480; IDs de Pexels a `img/CREDITS.md`. Qualitat abans que quantitat. Sense categoria/filtre "1 €". Sense pàgina de crèdits (Pexels no ho requereix). Per ampliar: escollir fotos netes, copiar a `img/p/` i afegir `P(...)` a `data.js`.
- **Panell d'admin (prototip clicable amb dades inventades)**: `admin/index.html` (rutes #resum, #comandes, #productes, #producte, #ofertes, #portada, #estadistiques, #franges). Captures: scratchpad `shots/admin_*.png`.
- **Admin redissenyat (nov 2026)**: mateix estil que el web (crema, botons vermell + verd, lletra gran, cantonades arrodonides). Capçalera amb logo + pestanyes a una segona fila (sense barra lateral), taules amb desplaçament propi i columna "Botiga" amagada per container query, animacions (`.rv` bounce esglaonat, comptadors, barres/gràfics que creixen, toggles amb ressort, avís `#toast`), fila de comanda clicable, `prefers-reduced-motion` respectat. `.line` s'aplica només a `div.line` (col·lisionava amb `.btn.line`). Captures amb `--force-prefers-reduced-motion` perquè no surtin a mig animar.
- **Admin interactiu (nov 2026)**: `admin/admin-app.js` (estat `S` en memòria, pàgines dinàmiques, menús, modals, exportacions). Selector de botiga global (filtra comandes, productes, estadístiques), avisos amb llegit/no llegit, menú de perfil (modal d'edició), 36 comandes inventades amb filtres reals (estat, dia, botiga, cerca), canvi d'estat, reassignació de la botiga que prepara i assignació de repartidor, **albarà en PDF** (jsPDF 2.5.1 des de cdnjs; un per comanda o tots els filtrats), CSV de comandes/productes/vendes i informe PDF, estadístiques que canvien amb 7 dies/30 dies/Any i botiga, pàgines **Repartidors** i **Botigues** (afegir, editar, activar, eliminar), estoc per botiga amb barres numerades + llegenda + tooltip. Res no persisteix en recarregar.

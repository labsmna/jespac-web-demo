import base64, sys
d='./'
rd=lambda p:open(d+p,encoding='utf-8').read()
b=lambda p:base64.b64encode(open(p,'rb').read()).decode()
css=rd('style.css').replace('{{FONT_REG}}',b('fonts/DejaVuSansCondensed.woff')).replace('{{FONT_BOLD}}',b('fonts/DejaVuSansCondensed-Bold.woff'))
js='\n'.join(rd(f) for f in ['icons.js','data.js','content.js','app.js','views1.js','views2.js','pages.js','boot.js'])
open(d+'JS_ALL.js','w',encoding='utf-8').write(js)
html=rd('shell.html').replace('/*CSS*/',css).replace('/*JS*/',js)
open(d+'index.html','w',encoding='utf-8').write(html)
print(len(html))

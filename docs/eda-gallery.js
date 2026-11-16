'use strict';
/* ENDICEX · Galería del análisis exploratorio, sin nombres de entidades. */
(function(){
 const FIGURES=[{"file":"01_01_individual_renta_media_persona","title":"Renta media por persona","description":"Distribución y observaciones de renta media por persona.","group":"social-ind","n":"111"},{"file":"01_02_individual_gini","title":"Índice de Gini","description":"Distribución del indicador de desigualdad.","group":"social-ind","n":"111"},{"file":"01_03_individual_pobreza_total_60","title":"Pobreza total (umbral del 60 %)","description":"Distribución del indicador de pobreza relativa.","group":"social-ind","n":"111"},{"file":"02_01_estratos_renta_media_persona","title":"Renta por estratos poblacionales","description":"Comparación descriptiva de renta media por estratos.","group":"social-strata","n":"111"},{"file":"02_02_estratos_gini","title":"Desigualdad por estratos","description":"Comparación del índice de Gini entre tamaños de población.","group":"social-strata","n":"111"},{"file":"02_03_estratos_pobreza_total_60","title":"Pobreza por estratos","description":"Comparación de pobreza relativa entre estratos.","group":"social-strata","n":"111"},{"file":"03_01_individual_gasto_municipal","title":"Gasto municipal","description":"Distribución del gasto municipal (escala logarítmica en la figura).","group":"finance-ind","n":"101"},{"file":"03_02_individual_gto_hab","title":"Gasto por habitante","description":"Distribución del gasto municipal por habitante.","group":"finance-ind","n":"101"},{"file":"03_03_individual_end_hab","title":"Endeudamiento por habitante","description":"Distribución del endeudamiento; se señalan valores imputados.","group":"finance-ind","n":"101"},{"file":"03_04_individual_inv_por_hab","title":"Inversión por habitante","description":"Distribución de la inversión municipal por habitante.","group":"finance-ind","n":"101"},{"file":"04_01_estratos_gasto_municipal","title":"Gasto municipal por estratos","description":"Comparación de gasto municipal entre estratos.","group":"finance-strata","n":"101"},{"file":"04_02_estratos_gto_hab","title":"Gasto por habitante según estrato","description":"Comparación descriptiva del gasto por habitante.","group":"finance-strata","n":"101"},{"file":"04_03_estratos_end_hab","title":"Endeudamiento por estratos","description":"Endeudamiento por habitante; valores imputados identificados en la figura.","group":"finance-strata","n":"101"},{"file":"04_04_estratos_inv_por_hab","title":"Inversión por estratos","description":"Comparación descriptiva de inversión por habitante.","group":"finance-strata","n":"101"}];
 const FILTERS=[
   ['all','Todos los gráficos'],
   ['social-ind','01 · Sociales individuales'],
   ['social-strata','02 · Sociales por estratos'],
   ['finance-ind','03 · Financieros individuales'],
   ['finance-strata','04 · Financieros por estratos']
 ];
 const ASSET='./eda_figuras/';
 const $=id=>document.getElementById(id);
 let current=0,visible=FIGURES.map((_,i)=>i),priorFocus=null;
 function asset(figure,extension){return ASSET+figure.file+'.'+extension;}
 function node(tag,cls,text){
   const el=document.createElement(tag);
   if(cls)el.className=cls;
   if(text!==undefined)el.textContent=text;
   return el;
 }
 function link(label,href,downloadName){
   const a=node('a','eda-file-link',label);
   a.href=href;
   a.download=downloadName;
   a.setAttribute('aria-label','Descargar '+label+': '+downloadName);
   return a;
 }
 function card(figure,index){
   const article=node('article','eda-figure');
   const trigger=node('button','eda-image-button');
   trigger.type='button';
   trigger.setAttribute('aria-label','Ampliar gráfico: '+figure.title);
   const img=node('img','eda-thumbnail');
   img.src=asset(figure,'png');
   img.alt='Gráfico exploratorio: '+figure.title;
   img.loading='lazy';img.decoding='async';img.width=1000;img.height=600;
   trigger.append(img,node('span','eda-zoom-label','Ampliar gráfico'));
   trigger.addEventListener('click',()=>open(index));
   const body=node('div','eda-card-body');
   const meta=node('p','eda-card-meta',String(figure.n)+' entidades · '+(figure.group.includes('strata')?'Por estratos':'Análisis individual'));
   const title=node('h3','eda-card-title',figure.title);
   const description=node('p','eda-card-description',figure.description);
   const foot=node('div','eda-card-links');
   foot.append(link('PNG',asset(figure,'png'),figure.file+'.png'),link('SVG',asset(figure,'svg'),figure.file+'.svg'));
   body.append(meta,title,description,foot);article.append(trigger,body);
   return article;
 }
 function render(filter){
   visible=FIGURES.map((f,i)=>filter==='all'||f.group===filter?i:null).filter(i=>i!==null);
   const holder=$('eda-gallery-grid');
   holder.replaceChildren(...visible.map(i=>card(FIGURES[i],i)));
   $('eda-gallery-count').textContent=visible.length+' gráficos';
   $('eda-gallery-filters').querySelectorAll('[data-eda-filter]').forEach(b=>{
     const selected=b.dataset.edaFilter===filter;
     b.setAttribute('aria-pressed',String(selected));
     b.classList.toggle('is-active',selected);
   });
 }
 function updateDialog(){
   const figure=FIGURES[current], pos=visible.indexOf(current);
   $('eda-dialog-title').textContent=figure.title;
   $('eda-dialog-summary').textContent=figure.description+' · '+figure.n+' entidades.';
   const pic=$('eda-dialog-image');pic.src=asset(figure,'png');pic.alt='Gráfico ampliado: '+figure.title;
   $('eda-dialog-count').textContent=(pos+1)+' de '+visible.length;
   const downloads=$('eda-dialog-downloads');downloads.replaceChildren(
      link('Descargar PNG',asset(figure,'png'),figure.file+'.png'),
      link('Descargar SVG',asset(figure,'svg'),figure.file+'.svg')
   );
   $('eda-dialog-prev').disabled=visible.length<=1;
   $('eda-dialog-next').disabled=visible.length<=1;
 }
 function open(index){
   current=index;priorFocus=document.activeElement;updateDialog();
   const dialog=$('eda-gallery-dialog');
   if(typeof dialog.showModal==='function'){dialog.showModal();}
   else {dialog.setAttribute('open','');dialog.classList.add('eda-dialog-fallback');}
 }
 function close(){
   const dialog=$('eda-gallery-dialog');
   if(typeof dialog.close==='function')dialog.close();
   else {dialog.removeAttribute('open');dialog.classList.remove('eda-dialog-fallback');priorFocus?.focus();}
 }
 function step(n){const i=visible.indexOf(current);current=visible[(i+n+visible.length)%visible.length];updateDialog();}
 function init(){
   const toolbar=$('eda-gallery-filters');if(!toolbar)return;
   FILTERS.forEach(([key,text])=>{
     const btn=node('button','eda-filter',text);
     btn.type='button';btn.dataset.edaFilter=key;btn.setAttribute('aria-pressed',String(key==='all'));
     btn.addEventListener('click',()=>render(key));toolbar.append(btn);
   });
   $('eda-dialog-close').addEventListener('click',close);
   $('eda-dialog-prev').addEventListener('click',()=>step(-1));
   $('eda-dialog-next').addEventListener('click',()=>step(1));
   const dialog=$('eda-gallery-dialog');
   dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
   dialog.addEventListener('close',()=>{priorFocus?.focus();});
   document.addEventListener('keydown',e=>{
     if(!dialog.open)return;
     if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}
     if(e.key==='ArrowRight'){e.preventDefault();step(1);}
   });
   render('all');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
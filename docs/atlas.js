'use strict';
/* ENDICEX · Atlas regional sin identificadores + comparador de perfiles
   Visualizaciones agregadas. No se muestran nombres ni posiciones municipales. */
(function(){
const REGION={
'Andalucía':'AND','Aragón':'ARA','Principado de Asturias':'AST','Illes Balears':'BAL',
'Cantabria':'CNT','Castilla y León':'CYL','Castilla-La Mancha':'CLM',
'Cataluña':'CAT','Comunitat Valenciana':'VAL','Extremadura':'EXT',
'Galicia':'GAL','Comunidad de Madrid':'MAD','Región de Murcia':'MUR',
'Comunidad Foral de Navarra':'NAV','País Vasco':'PVA','La Rioja':'RIO',
'Ceuta':'CEU','Melilla':'MEL','Canarias':'CAN'
};
const COLORS={K1:'#2d9cdb',K2:'#409a8a',K3:'#f4ac55',K4:'#a48ce5',K5:'#e77592'};
const METRICS=[
 {key:'pobreza',label:'Pobreza relativa',unit:'%'},
 {key:'renta',label:'Renta',unit:'€'},
 {key:'gini',label:'Desigualdad (Gini)',unit:''},
 {key:'deuda_hab',label:'Deuda por habitante',unit:'€'},
 {key:'inversion_hab',label:'Inversión por habitante',unit:'€'},
 {key:'gasto_hab',label:'Gasto por habitante',unit:'€'}
];
const THRESHOLD=5;
const byId=id=>document.getElementById(id);
const valid=x=>x!==null&&x!==undefined&&x!==''&&Number.isFinite(Number(x));
const median=a=>{const s=a.filter(valid).map(Number).sort((x,y)=>x-y);if(!s.length)return null;const m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;};
const format=(x,d=1)=>x==null||!Number.isFinite(x)?'Sin dato':new Intl.NumberFormat('es-ES',{maximumFractionDigits:d,minimumFractionDigits:0}).format(x);
const active=new Set(Object.keys(COLORS));
let records=[],selectedMetric='pobreza',chartMode='radar';
let regionCounts=new Map(),regionCodesShown=0;
function init(){
 Promise.all([
  fetch('./endicex_k5.json').then(r=>{if(!r.ok)throw new Error('Datos no disponibles');return r.json();}),
  fetch('./atlas-map.svg').then(r=>{if(!r.ok)throw new Error('Geometría no disponible');return r.text();})
 ]).then(([dataset,markup])=>{
   if(!Array.isArray(dataset.entidades))throw new Error('Formato de datos inesperado');
   records=dataset.entidades;
   for(const row of records){const code=REGION[row.comunidad];if(code)regionCounts.set(code,(regionCounts.get(code)||0)+1);}
   buildMap(markup);
   buildControls();
   updateComparison();
 }).catch(err=>{
   console.error('Atlas ENDICEX:',err);
   byId('atlas-map-message').textContent='No se ha podido cargar el mapa. Comprueba que atlas-map.svg y endicex_k5.json están publicados.';
   byId('atlas-compare-note').textContent='No se han podido cargar los datos comparativos.';
 });
}
function buildMap(markup){
 const parser=new DOMParser();
 const doc=parser.parseFromString(markup,'image/svg+xml');
 if(doc.querySelector('parsererror'))throw new Error('Mapa SVG no válido');
 const svg=document.importNode(doc.documentElement,true);
 svg.setAttribute('class','atlas-map-svg');
 const host=byId('atlas-map-host');
 host.replaceChildren(svg);
 const areas=svg.querySelectorAll('[data-region]');
 let covered=0,visibleAreas=0;
 areas.forEach(path=>{
   const code=path.getAttribute('data-region'),n=regionCounts.get(code)||0;
   const available=n>=THRESHOLD;
   if(available){covered+=n;visibleAreas++;}
   path.style.fill=available?shade(n):'#e7edf3';
   path.style.stroke='#fff';
   path.style.cursor=available?'pointer':'default';
   if(available)path.classList.add('atlas-region-active');
   const description=available?'Área territorial agregada: '+n+' entidades':'Área territorial: recuento suprimido (inferior al umbral)';
   path.setAttribute('aria-label',description);
   if(available){path.setAttribute('tabindex','0');path.setAttribute('role','button');}
   const tip=document.createElementNS('http://www.w3.org/2000/svg','title');
   tip.textContent=description;
   path.appendChild(tip);
   if(available){
     const show=()=>{byId('atlas-map-message').textContent='Área agregada seleccionada: '+n+' entidades clasificadas. No se muestran nombres ni ubicaciones individuales.';};
     path.addEventListener('click',show);
     path.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();show();}});
   }
 });
 regionCodesShown=visibleAreas;
 byId('atlas-covered').textContent=format(covered,0);
 byId('atlas-areas').textContent=format(visibleAreas,0);
 byId('atlas-total').textContent=format(records.length,0);
 byId('atlas-map-message').textContent='Pasa el cursor por un área coloreada o tócala para ver exclusivamente su recuento agregado. Se ocultan los recuentos inferiores a cinco.';
}
function shade(n){
 // Escala secuencial, misma definición para todas las áreas.
 const q=Math.min(1,Math.max(0,(n-THRESHOLD)/15));
 const light=78-Math.round(q*32);
 return 'hsl(172, 48%, '+light+'%)';
}
function buildControls(){
 const chips=byId('atlas-profile-chips');
 chips.innerHTML=Object.keys(COLORS).map(key=>
  '<button type="button" class="atlas-chip is-selected" data-profile="'+key+'" aria-pressed="true" style="--profile-color:'+COLORS[key]+'"><span class="atlas-dot"></span>'+key+'</button>'
 ).join('');
 chips.addEventListener('click',event=>{
   const el=event.target.closest('[data-profile]');
   if(!el)return;
   const c=el.getAttribute('data-profile');
   if(active.has(c))active.delete(c); else active.add(c);
   el.classList.toggle('is-selected',active.has(c));
   el.setAttribute('aria-pressed',String(active.has(c)));
   updateComparison();
 });
 const sel=byId('atlas-metric');
 sel.innerHTML=METRICS.map(m=>'<option value="'+m.key+'">'+m.label+'</option>').join('');
 sel.addEventListener('change',()=>{selectedMetric=sel.value;updateComparison();});
 const view=byId('atlas-chart-mode');
 view.addEventListener('change',()=>{chartMode=view.value;byId('atlas-metric-wrap').hidden=chartMode!=='bars';updateComparison();});
 byId('atlas-export').addEventListener('click',()=>{
   if(typeof Plotly==='undefined')return;
   Plotly.downloadImage(byId('atlas-compare-plot'),{format:'png',filename:'ENDICEX_comparador_perfiles',width:1200,height:720,scale:2});
 });
}
function filteredProfiles(){return Object.keys(COLORS).filter(c=>active.has(c)).map(cluster=>({cluster,rows:records.filter(r=>r.cluster===cluster)}));}
function scoresFor(metric,rows){
 const base=records.map(r=>r[metric]).filter(valid).map(Number);
 const value=median(rows.map(r=>r[metric]));
 if(!base.length||value===null)return null;
 return 100*(base.filter(x=>x<=value).length/base.length);
}
function updateComparison(){
 const groups=filteredProfiles();
 const metric=METRICS.find(m=>m.key===selectedMetric);
 byId('atlas-compare-note').textContent=chartMode==='radar'
 ?'Cada eje muestra el percentil de la mediana del conglomerado respecto a las 101 entidades (0–100). Valores altos indican mayor magnitud, no necesariamente mejor gestión o mayor riesgo.'
 :'Mediana observada por conglomerado en la unidad original. Interpretación descriptiva; no implica hallazgos de fiscalización.';
 byId('atlas-compare-table').innerHTML=groups.map(g=>{
  const val=median(g.rows.map(r=>r[selectedMetric]));
  return '<tr><th scope="row"><span class="atlas-table-dot" style="background:'+COLORS[g.cluster]+'"></span>'+g.cluster+'</th><td>'+g.rows.length+'</td><td>'+format(val,2)+(val==null?'':' '+metric.unit)+'</td></tr>';
 }).join('')||'<tr><td colspan="3">Selecciona al menos un perfil.</td></tr>';
 byId('atlas-table-metric').textContent=metric.label;
 if(typeof Plotly==='undefined'){
  byId('atlas-chart-fallback').hidden=false;
  return;
 }
 byId('atlas-chart-fallback').hidden=true;
 const d=chartMode==='radar'?radarData(groups):barData(groups,metric);
 const layout=chartMode==='radar'?radarLayout():barLayout(metric);
 Plotly.react(byId('atlas-compare-plot'),d,layout,{responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d']}).catch(err=>{
   console.error(err);byId('atlas-chart-fallback').hidden=false;
 });
}
function radarData(groups){
 const labels=METRICS.map(m=>m.label);
 return groups.map(g=>{
  const r=METRICS.map(m=>scoresFor(m.key,g.rows));
  return {type:'scatterpolar',mode:'lines+markers',name:g.cluster+' · n='+g.rows.length,
   r:[...r,r[0]],theta:[...labels,labels[0]],connectgaps:false,
   line:{color:COLORS[g.cluster],width:2.5},marker:{color:COLORS[g.cluster],size:5},
   fill:'toself',fillcolor:COLORS[g.cluster]+'24',hovertemplate:'%{theta}<br>Percentil: %{r:.1f}<extra>%{fullData.name}</extra>'};
 });
}
function radarLayout(){
 return {paper_bgcolor:'white',font:{family:'DM Sans, sans-serif',size:12,color:'#41566c'},
  margin:{l:62,r:62,t:34,b:60},polar:{bgcolor:'#fff',radialaxis:{visible:true,range:[0,100],tickvals:[0,25,50,75,100],gridcolor:'#dbe5ed'},
  angularaxis:{gridcolor:'#e4ecf2'}},showlegend:true,legend:{orientation:'h',y:-.14,x:.5,xanchor:'center'}};
}
function barData(groups,metric){
 return [{type:'bar',orientation:'v',x:groups.map(g=>g.cluster),
  y:groups.map(g=>median(g.rows.map(r=>r[metric.key]))),marker:{color:groups.map(g=>COLORS[g.cluster])},
  text:groups.map(g=>format(median(g.rows.map(r=>r[metric.key])),1)),textposition:'outside',
  hovertemplate:'Perfil %{x}<br>Mediana: %{y:,.2f} '+metric.unit+'<extra></extra>'}];
}
function barLayout(metric){
 return {paper_bgcolor:'#fff',plot_bgcolor:'#fff',font:{family:'DM Sans, sans-serif',size:12,color:'#41566c'},
 margin:{l:70,r:24,t:36,b:55},showlegend:false,xaxis:{title:'Conglomerado',gridcolor:'#edf1f5'},
 yaxis:{title:metric.label+(metric.unit?' ('+metric.unit+')':''),gridcolor:'#e4ecf2',rangemode:'tozero'}};
}
document.addEventListener('DOMContentLoaded',init);
})();
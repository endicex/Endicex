'use strict';
/* ENDICEX: portada de gráficos interactivos con fuentes verificables y datos agregados. */
(function(){
  const COLORS={K1:'#4ebfe8',K2:'#43c8ac',K3:'#f1ae61',K4:'#ad91f4',K5:'#ee87a0'};
  const AXES={
    social:{x:'pc_social',y:'pc_fin1',xtitle:'Componente social',ytitle:'Componente financiero 1'},
    financial:{x:'pc_fin1',y:'pc_fin2',xtitle:'Componente financiero 1',ytitle:'Componente financiero 2'}
  };
  const STRATA=['<5.000','5.000–19.999','20.000–99.999','100.000 o más'];
  const CATEGORY={Social:'Indicadores sociales',Financiero:'Indicadores financieros'};
  const $=id=>document.getElementById(id);
  let points=[],kept=new Set(Object.keys(COLORS)),projection='social',stats=null,metric=null,category='Social';
  function ready(){return typeof Plotly!=='undefined';}
  function format(x,decimals=1){return Number.isFinite(x)?new Intl.NumberFormat('es-ES',{maximumFractionDigits:decimals}).format(x):'—';}
  function showError(id,msg){const e=$(id);if(e){e.textContent=msg;e.hidden=false;}}
  function profilePicker(){
    const group=$('home-pca-filters');
    for(const key of Object.keys(COLORS)){
      const button=document.createElement('button');
      button.type='button';button.dataset.homeProfile=key;button.className='home-profile-btn selected';
      button.style.setProperty('--home-profile',COLORS[key]);
      button.textContent=key;
      button.setAttribute('aria-pressed','true');
      button.addEventListener('click',()=>{
        if(kept.has(key))kept.delete(key); else kept.add(key);
        button.classList.toggle('selected',kept.has(key));
        button.setAttribute('aria-pressed',String(kept.has(key)));
        renderPca();
      });
      group.append(button);
    }
    $('home-pca-projection').addEventListener('change',event=>{projection=event.target.value;renderPca();});
    $('home-pca-reset').addEventListener('click',()=>{
      kept=new Set(Object.keys(COLORS));
      group.querySelectorAll('button[data-home-profile]').forEach(button=>{
        button.classList.add('selected');button.setAttribute('aria-pressed','true');
      });
      renderPca();
    });
  }
  function renderPca(){
    const container=$('home-pca-chart');if(!ready())return;
    const dim=AXES[projection];
    const data=[];
    for(const key of Object.keys(COLORS)){
      if(!kept.has(key))continue;
      const group=points.filter(x=>x.cluster===key);
      data.push({
        type:'scattergl',mode:'markers',name:key,
        x:group.map(x=>Number(x[dim.x])),y:group.map(x=>Number(x[dim.y])),
        marker:{size:8,opacity:.85,color:COLORS[key],line:{color:'#11243b',width:.4}},
        hovertemplate:'Perfil '+key+'<br>'+dim.xtitle+': %{x:.2f}<br>'+dim.ytitle+': %{y:.2f}<extra></extra>'
      });
    }
    const layout={
      autosize:true,paper_bgcolor:'#112239',plot_bgcolor:'#112239',
      margin:{l:44,r:13,t:8,b:48},
      font:{family:'DM Sans, sans-serif',color:'#c5dae8',size:10},
      showlegend:false,hovermode:'closest',
      xaxis:{title:{text:dim.xtitle,standoff:6},gridcolor:'#2b4359',zerolinecolor:'#547287',tickfont:{size:9}},
      yaxis:{title:{text:dim.ytitle,standoff:1},gridcolor:'#2b4359',zerolinecolor:'#547287',tickfont:{size:9}},
      hoverlabel:{bgcolor:'#182e46',bordercolor:'#6b90a6',font:{color:'#fff'}},
      dragmode:'pan'
    };
    Plotly.react(container,data,layout,{responsive:true,displaylogo:false,scrollZoom:false,modeBarButtonsToRemove:['select2d','lasso2d','toImage']})
      .catch(()=>showError('home-pca-status','No ha sido posible dibujar el gráfico.'));
    const n=points.filter(x=>kept.has(x.cluster)).length;
    $('home-pca-status').textContent=n+' entidades representadas. Puedes seleccionar un perfil, mover el gráfico o acercarte con las herramientas.';
  }
  async function initPca(){
    try{
      const response=await fetch('./endicex_k5.json');if(!response.ok)throw Error('No disponible');
      const data=await response.json();
      points=(data.entidades||[]).filter(x=>x&&COLORS[x.cluster]&&Number.isFinite(Number(x.pc_social))&&Number.isFinite(Number(x.pc_fin1))&&Number.isFinite(Number(x.pc_fin2)));
      if(!points.length)throw Error('Sin datos válidos');
      renderPca();
    }catch(err){showError('home-pca-status','La visualización no está disponible. Puedes consultar los gráficos en el explorador.');}
  }
  function unit(key){
    if(key==='gini')return '';
    if(key==='pobreza_total_60')return '%';
    return key==='renta_media_persona'?'€':key==='GASTO MUNICIPAL'?'€':'€/hab.';
  }
  function formatValue(value,key){
    const decimals=key==='gini'||key==='pobreza_total_60'?2:0;
    return format(value,decimals)+(unit(key)?' '+unit(key):'');
  }
  function buildMetricPicker(){
    const area=$('home-eda-metrics');
    area.replaceChildren();
    const list=stats.metrics.filter(m=>m.category===category);
    if(!list.some(m=>m.key===metric))metric=list[0]?.key;
    for(const item of list){
      const btn=document.createElement('button');
      btn.type='button';btn.className='home-metric-btn';
      btn.textContent=item.title.replace(/\s*\([^)]*\)\s*$/,'');
      btn.setAttribute('aria-pressed',String(item.key===metric));
      if(item.key===metric)btn.classList.add('selected');
      btn.addEventListener('click',()=>{metric=item.key;buildMetricPicker();renderEda();});
      area.append(btn);
    }
    $('home-eda-category').querySelectorAll('button[data-home-category]').forEach(btn=>{
      btn.classList.toggle('selected',btn.dataset.homeCategory===category);
      btn.setAttribute('aria-pressed',String(btn.dataset.homeCategory===category));
    });
  }
  function renderEda(){
    const entry=stats?.metrics?.find(m=>m.key===metric);
    if(!entry||!ready())return;
    const rows=STRATA.map(s=>entry.rows.find(x=>x.estrato===s)).filter(Boolean);
    const title=entry.title;
    $('home-eda-metric-title').textContent=title;
    $('home-eda-global').textContent=formatValue(entry.globalMedian,entry.key);
    $('home-eda-n').textContent=entry.n+' entidades';
    $('home-eda-range-label').textContent='La línea horizontal representa del percentil 25 al 75. El punto representa la mediana.';
    const difPlus=rows.map(x=>Math.max(0,x.p75-x.mediana));
    const difMinus=rows.map(x=>Math.max(0,x.mediana-x.p25));
    const labels=rows.map(x=>x.estrato);
    const medians=rows.map(x=>x.mediana);
    const traces=[{
      type:'scatter',mode:'markers',name:'Mediana e IQR',
      x:medians,y:labels,
      marker:{size:13,color:'#218d85',line:{color:'#fff',width:1.5}},
      error_x:{type:'data',symmetric:false,array:difPlus,arrayminus:difMinus,visible:true,color:'#2cae9d',thickness:3,width:7},
      customdata:rows.map(x=>[x.n,x.p25,x.p75]),
      hovertemplate:'Estrato: %{y}<br>Mediana: %{x:,.2f}<br>P25: %{customdata[1]:,.2f}<br>P75: %{customdata[2]:,.2f}<br>n=%{customdata[0]}<extra></extra>'
    }];
    const isLog=entry.key==='GASTO MUNICIPAL';
    const layout={
      paper_bgcolor:'#fff',plot_bgcolor:'#fff',height:315,
      margin:{l:125,r:30,t:15,b:56},
      font:{family:'DM Sans, sans-serif',size:11,color:'#41566c'},
      xaxis:{title:{text:isLog?title+' · escala logarítmica':title,standoff:12},gridcolor:'#e5edf2',zerolinecolor:'#d1dee7',type:isLog?'log':'linear',rangemode:isLog?undefined:'tozero'},
      yaxis:{type:'category',categoryorder:'array',categoryarray:STRATA,autorange:'reversed',gridcolor:'#edf2f5',automargin:true},
      showlegend:false,hovermode:'closest'
    };
    Plotly.react($('home-eda-chart'),traces,layout,{responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d']})
      .catch(()=>showError('home-eda-warning','No se ha podido representar este indicador.'));
    $('home-eda-table-body').replaceChildren();
    for(const x of rows){
      const tr=document.createElement('tr');
      for(const text of [x.estrato,String(x.n),formatValue(x.mediana,entry.key)]){
        const td=document.createElement('td');td.textContent=text;tr.append(td);
      }
      $('home-eda-table-body').append(tr);
    }
  }
  async function initEda(){
    try{
      const res=await fetch('./eda-summary.json');
      if(!res.ok)throw Error('Archivo de estadísticos no disponible');
      const json=await res.json();
      if(!Array.isArray(json.metrics)||json.metrics.length!==7)throw Error('Datos incompletos');
      stats=json;metric='renta_media_persona';
      const categories=$('home-eda-category');
      categories.querySelectorAll('button[data-home-category]').forEach(button=>button.addEventListener('click',()=>{
        category=button.dataset.homeCategory;
        buildMetricPicker();renderEda();
      }));
      buildMetricPicker();renderEda();
    }catch(err){showError('home-eda-warning','Los estadísticos de EDA no están disponibles en este momento. Consulta la galería completa.');}
  }
  function boot(){
    if(!$('home-pca-chart')||!$('home-eda-chart'))return;
    if(!ready()){
      showError('home-pca-status','El explorador interactivo no puede cargarse en este navegador.');
      showError('home-eda-warning','El gráfico interactivo requiere Plotly.');
      return;
    }
    profilePicker();
    initPca();
    initEda();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
'use strict';
/* ENDICEX · No rendición 2024 · bloque 5, PCS1 observado. No contiene nombres ni códigos. */
(function(){
  const chart=document.getElementById('nr-chart');
  const status=document.getElementById('nr-status');
  const exportBtn=document.getElementById('nr-export');
  if(!chart||!status||!exportBtn)return;
  const fmt=n=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:3}).format(n);
  function error(msg){status.textContent=msg;exportBtn.disabled=true;}
  if(typeof Plotly==='undefined'){
    error('El gráfico interactivo no está disponible en este navegador. La tabla descriptiva permanece accesible.');
    return;
  }
  fetch('./no-rendicion-2024.json',{cache:'no-cache'})
    .then(r=>{if(!r.ok)throw Error('Datos no disponibles');return r.json();})
    .then(data=>{
      const groups=data.grupos;
      if(!Array.isArray(groups)||groups.length!==2||data.muestraInicial!==111||data.clasificados!==101||data.sinRendicion2024!==10
        ||groups[0].n!==4||groups[1].n!==6
        ||groups.some(g=>!Array.isArray(g.scores)||g.scores.length!==g.n||!g.scores.every(Number.isFinite))){
        throw Error('Los datos del bloque 5 no superaron la validación.');
      }
      const jitter=[-.037,.028,-.015,.04,.007,-.025];
      const traces=groups.map((g,i)=>({
        type:'scatter',mode:'markers',name:i===0?'Solo 2023 · n=4':'Ni 2023 ni 2024 · n=6',
        x:g.scores,y:g.scores.map((_,j)=> (i===0?1:0)+jitter[j]),
        marker:{symbol:'diamond',size:15,color:g.color,line:{color:'#fff',width:1.5}},
        hovertemplate:'PCS1 observado: %{x:.3f}<extra>%{fullData.name}</extra>',
        showlegend:true
      }));
      const mobile=window.matchMedia?.('(max-width: 600px)').matches;
      const layout={
        paper_bgcolor:'#ffffff',plot_bgcolor:'#fcfdfe',autosize:true,
        height:mobile?370:420,
        font:{family:'DM Sans, sans-serif',color:'#425568',size:mobile?10:12},
        margin:{l:mobile?102:150,r:22,t:62,b:68},
        xaxis:{title:{text:'PCS1 · componente social tipificada',standoff:14,font:{size:mobile?10:12}},
          range:[-0.87,2.74],zeroline:false,gridcolor:'#e8edf1',tickformat:'.1f',
          linecolor:'#b6c4cd',mirror:false},
        yaxis:{tickmode:'array',tickvals:[0,1],
          ticktext:mobile?['Ni 2023 ni 2024','Solo 2023']:['Sin rendición en 2023 ni 2024','Rendición solo en 2023'],
          range:[-.38,1.42],showgrid:true,gridcolor:'#ebf0f3',zeroline:false,
          tickfont:{size:mobile?10:11},fixedrange:true},
        shapes:[{type:'line',xref:'x',yref:'paper',x0:0,x1:0,y0:0,y1:1,line:{color:'#8296a7',width:1.1,dash:'dash'}}],
        legend:{orientation:'h',x:0,y:1.2,font:{size:mobile?10:11},bgcolor:'rgba(255,255,255,0)'},
        showlegend:true,hovermode:'closest',dragmode:'pan'
      };
      return Plotly.newPlot(chart,traces,layout,{responsive:true,displayModeBar:false,scrollZoom:false})
        .then(()=>{
          status.textContent='Cada rombo representa una entidad. El desplazamiento vertical mínimo facilita la lectura y no es una variable estadística.';
          exportBtn.disabled=false;
          exportBtn.addEventListener('click',()=>{
            Plotly.downloadImage(chart,{format:'png',filename:'ENDICEX_No_rendicion_2024_PCS1',width:1250,height:720,scale:2})
              .catch(()=>{status.textContent='No se pudo descargar el gráfico. Comprueba los permisos de descarga del navegador.';});
          });
        });
    })
    .catch(()=>error('No se ha podido cargar la representación de PCS1. Consulta la tabla de resultados y el notebook de referencia.'));
})();

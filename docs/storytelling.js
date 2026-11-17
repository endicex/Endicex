'use strict';
/*
 * ENDICEX · Recorrido multimedia
 * Relato audiovisual activado por el usuario, sin audio automático ni datos identificativos.
 * Fuentes: docs/endicex_k5.json y docs/eda-summary.json.
 */
(() => {
  const CHAPTERS = [
    {
      label:'La muestra',
      index:'01 / ORIGEN',
      title:'De los datos a las preguntas.',
      text:'La investigación parte de 111 entidades locales. Diez no habían rendido sus cuentas de 2024: el análisis financiero y los perfiles se realizan sobre las 101 restantes. Los indicadores sociales se exploran en las 111.',
      speech:'El recorrido comienza con ciento once entidades locales. Diez no habían rendido cuentas de dos mil veinticuatro. Por eso, el análisis financiero y la segmentación se realizan sobre ciento una entidades. Los indicadores sociales se exploran sobre las ciento once.',
      hint:'111 entidades iniciales · 101 en el análisis multivariante'
    },
    {
      label:'Tres dimensiones',
      index:'02 / REDUCCIÓN DIMENSIONAL',
      title:'Convertir variables en patrones.',
      text:'El análisis de componentes principales sintetiza los indicadores en tres coordenadas: una dimensión social y dos financieras. Esta constelación representa las 101 observaciones en ese espacio; gira para apreciar su estructura tridimensional.',
      speech:'El análisis de componentes principales permite estudiar relaciones multivariantes. El modelo utiliza tres dimensiones: una social y dos financieras. Cada punto representa una de las ciento una entidades analizadas. Puedes girar la constelación para explorar su estructura.',
      hint:'Arrastra sobre la constelación para girarla · 101 puntos reales'
    },
    {
      label:'Siete indicadores',
      index:'03 / EXPLORACIÓN DESCRIPTIVA',
      title:'Lo que cuentan las distribuciones.',
      text:'El análisis exploratorio compara siete indicadores sociales y financieros entre cuatro estratos de población. Los intervalos reflejan los percentiles 25 y 75; las medianas se calculan dentro de cada estrato. No se trata de una muestra representativa.',
      speech:'Antes de interpretar los perfiles, el análisis exploratorio examina siete indicadores por estratos de población. Las medianas y los percentiles muestran diferencias descriptivas entre tamaños de entidad. No son resultados extrapolables al conjunto de municipios.',
      hint:'Selecciona un indicador para comparar medianas y rangos intercuartílicos'
    },
    {
      label:'Cinco perfiles',
      index:'04 / SEGMENTACIÓN',
      title:'Cinco maneras de agruparse.',
      text:'K-means organiza las 101 entidades en cinco conglomerados según sus características multivariantes. Sus tamaños son diferentes y los grupos K4 y K5 contienen solo cuatro entidades cada uno: la interpretación exige prudencia.',
      speech:'Por último, K-means agrupa las ciento una entidades en cinco perfiles exploratorios. Los tamaños varían mucho entre los conglomerados. Los perfiles cuatro y cinco solo tienen cuatro entidades cada uno. Esta clasificación no acredita irregularidades ni supone resultados de auditoría.',
      hint:'Una agrupación estadística no constituye una calificación de auditoría'
    }
  ];
  const COLORS={K1:'#60c7f2',K2:'#50d7b4',K3:'#f8b968',K4:'#ad99ed',K5:'#f18caa'};
  const STRATA=['<5.000','5.000–19.999','20.000–99.999','100.000 o más'];
  const $=id=>document.getElementById(id);
  const ns='http://www.w3.org/2000/svg';
  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let chapter=0,playing=false,timer=null,frame=null,points=[],profileCounts={},stats=null,speechEnabled=false,voiceUtterance=null,lastFocus=null,sceneCleanup=null;
  let pitch=.18,yaw=.3,dragged=false;
  const integer=n=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:0}).format(n);
  const numeric=(n,d=0)=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:d}).format(n);
  function element(tag,className,value){
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(value!==undefined)el.textContent=String(value);
    return el;
  }
  function button(label,className,handler){
    const b=element('button',className,label);b.type='button';b.addEventListener('click',handler);return b;
  }
  function clearTimer(){if(timer!==null){clearTimeout(timer);timer=null;}}
  function stopSpeech(){
    if('speechSynthesis' in window)window.speechSynthesis.cancel();
    voiceUtterance=null;
    $('story-speak').setAttribute('aria-pressed','false');
    $('story-speak').textContent='Escuchar narración';
  }
  function setPlaying(on){
    playing=Boolean(on)&&!reduceMotion?.matches;
    clearTimer();
    $('story-play').textContent=playing?'Pausar recorrido':'Reproducir recorrido';
    $('story-play').setAttribute('aria-pressed',String(playing));
    if(playing && chapter<CHAPTERS.length-1){
      timer=setTimeout(()=>go(chapter+1),14500);
    }else if(chapter>=CHAPTERS.length-1){
      playing=false;
      $('story-play').textContent='Repetir recorrido';
      $('story-play').setAttribute('aria-pressed','false');
    }
  }
  function say(){
    if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window))return;
    if(voiceUtterance){stopSpeech();return;}
    setPlaying(false);
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(CHAPTERS[chapter].speech);
    u.lang='es-ES';u.rate=.95;u.pitch=1;u.volume=.9;
    const voices=window.speechSynthesis.getVoices?.()||[];
    const spanish=voices.find(v=>v.lang?.toLowerCase()==='es-es')||voices.find(v=>v.lang?.toLowerCase().startsWith('es'));
    if(spanish)u.voice=spanish;
    voiceUtterance=u;
    $('story-speak').textContent='Detener narración';
    $('story-speak').setAttribute('aria-pressed','true');
    const finish=()=>{if(voiceUtterance===u){voiceUtterance=null;$('story-speak').textContent='Escuchar narración';$('story-speak').setAttribute('aria-pressed','false');}};
    u.onend=finish;u.onerror=finish;
    window.speechSynthesis.speak(u);
  }
  function buildSample(){
    const wrap=element('div','story-sample-visual');
    const top=element('div','story-sample-giant');
    const a=element('div','story-number-panel');a.append(element('strong','','111'),element('span','','Entidades de partida'));
    const arrow=element('span','story-number-arrow','→');arrow.setAttribute('aria-hidden','true');
    const b=element('div','story-number-panel is-lime');b.append(element('strong','','101'),element('span','','Entidades con cuentas rendidas'));
    top.append(a,arrow,b);wrap.append(top);
    const track=element('div','story-sample-track');
    const active=element('span','story-track-active');
    active.style.width=(101/111*100).toFixed(2)+'%';
    track.append(active);
    wrap.append(track);
    const bottom=element('div','story-sample-explain');
    bottom.append(element('span','','101 analizadas'),element('span','','10 sin rendición 2024'));
    wrap.append(bottom);
    const note=element('p','story-small-note','Cobertura exploratoria: las 111 observaciones integran el análisis de indicadores sociales.');
    wrap.append(note);
    return wrap;
  }
  function buildPca(){
    const wrap=element('div','story-constellation');
    const canvas=document.createElement('canvas');
    canvas.id='story-pca-canvas';canvas.className='story-pca-canvas';
    canvas.setAttribute('aria-label','Proyección tridimensional animada de las 101 entidades, coloreadas según cinco conglomerados');
    canvas.setAttribute('role','img');
    wrap.append(canvas);
    const corner=element('div','story-canvas-corner','PC social · PC financiero 1 · PC financiero 2');
    wrap.append(corner);
    const legend=element('div','story-constellation-legend');
    for(const k of Object.keys(COLORS)){
      const pill=element('span','','');
      pill.style.setProperty('--cluster-color',COLORS[k]);
      const dot=element('i');dot.setAttribute('aria-hidden','true');
      pill.append(dot,document.createTextNode(k+' · '+(profileCounts[k]??'—')));
      legend.append(pill);
    }
    wrap.append(legend);
    const data=points.map(p=>({
      cluster:p.cluster,x:Number(p.pc_social),y:Number(p.pc_fin1),z:Number(p.pc_fin2)
    })).filter(p=>Object.hasOwn(COLORS,p.cluster)&&[p.x,p.y,p.z].every(Number.isFinite));
    if(data.length===0){
      wrap.replaceChildren(element('p','story-no-data','No se ha podido cargar la constelación. El explorador PCA sigue disponible en la web.'));
      return wrap;
    }
    const percentile90=arr=>{
      const a=arr.map(Math.abs).sort((a,b)=>a-b);
      return Math.max(.1,a[Math.floor((a.length-1)*.90)]||1);
    };
    const scale={x:percentile90(data.map(p=>p.x)),y:percentile90(data.map(p=>p.y)),z:percentile90(data.map(p=>p.z))};
    let width=800,height=480,ratio=1;
    function resize(){
      const rect=canvas.getBoundingClientRect();
      width=Math.max(260,rect.width||700);height=Math.max(230,rect.height||420);
      ratio=Math.min(2,window.devicePixelRatio||1);
      canvas.width=Math.ceil(width*ratio);canvas.height=Math.ceil(height*ratio);
    }
    function paint(){
      const ctx=canvas.getContext('2d');if(!ctx)return;
      ctx.setTransform(ratio,0,0,ratio,0,0);
      ctx.clearRect(0,0,width,height);
      const cx=width*.5,cy=height*.49,radius=Math.min(width*.31,height*.40);
      const background=ctx.createRadialGradient(cx,cy,18,cx,cy,width*.55);
      background.addColorStop(0,'rgba(40,117,141,.20)');
      background.addColorStop(1,'rgba(5,17,33,0)');
      ctx.fillStyle=background;ctx.fillRect(0,0,width,height);
      ctx.lineWidth=1;
      for(let i=1;i<=3;i++){
        const r=radius*(.47+.24*i);
        ctx.beginPath();ctx.ellipse(cx,cy,r,r*.37,-.20,0,Math.PI*2);
        ctx.strokeStyle='rgba(134,215,219,'+(.08+i*.015)+')';ctx.stroke();
      }
      const a=yaw,c=Math.cos(a),s=Math.sin(a),cp=Math.cos(pitch),sp=Math.sin(pitch);
      const visible=[];
      for(const p of data){
        const x=Math.max(-1.6,Math.min(1.6,p.x/scale.x));
        const y=Math.max(-1.6,Math.min(1.6,p.y/scale.y));
        const z=Math.max(-1.6,Math.min(1.6,p.z/scale.z));
        const rx=x*c-z*s,rz=x*s+z*c,ry=y*cp-rz*sp,depth=y*sp+rz*cp;
        const k=2.9/(2.9+depth*.31);
        visible.push({x:cx+rx*radius*.76*k,y:cy-ry*radius*.73*k,depth:depth,color:COLORS[p.cluster],r:Math.max(2.6,Math.min(5.8,4.0*k))});
      }
      visible.sort((a,b)=>b.depth-a.depth);
      for(const p of visible){
        ctx.beginPath();ctx.arc(p.x,p.y,p.r*2.5,0,Math.PI*2);
        ctx.fillStyle=p.color+'19';ctx.fill();
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.color;ctx.fill();
        ctx.lineWidth=.65;ctx.strokeStyle='#f0fbff90';ctx.stroke();
      }
      if(document.visibilityState!=='hidden'&&!reduceMotion?.matches&&!dragged)yaw+=.0028;
      if($('story-dialog')?.open&&chapter===1&&!reduceMotion?.matches){
        frame=requestAnimationFrame(paint);
      }
    }
    let px=0,py=0;
    const down=e=>{dragged=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture?.(e.pointerId);};
    const move=e=>{
      if(!dragged)return;
      yaw+=(e.clientX-px)*.008;pitch=Math.max(-.9,Math.min(.9,pitch+(e.clientY-py)*.006));
      px=e.clientX;py=e.clientY;
      if(reduceMotion?.matches)paint();
    };
    const up=()=>{dragged=false;};
    canvas.addEventListener('pointerdown',down);
    canvas.addEventListener('pointermove',move);
    canvas.addEventListener('pointerup',up);
    canvas.addEventListener('pointercancel',up);
    const observer=typeof ResizeObserver==='function'?new ResizeObserver(()=>{resize();if(reduceMotion?.matches)paint();}):null;
    if(observer)observer.observe(canvas);
    else window.addEventListener('resize',resize);
    sceneCleanup=()=>{
      if(frame!==null){cancelAnimationFrame(frame);frame=null;}
      observer?.disconnect();
      if(!observer)window.removeEventListener('resize',resize);
    };
    requestAnimationFrame(()=>{
      if(!$('story-dialog')?.open||chapter!==1)return;
      resize();paint();
    });
    return wrap;
  }
  function storyColor(index){return ['#78dfc5','#64bff0','#f4ba71','#a997ec'][index]||'#78dfc5';}
  function buildMetrics(){
    const wrap=element('div','story-metrics');
    if(!stats?.metrics?.length){
      wrap.append(element('p','story-no-data','No se ha podido cargar el resumen estadístico. Las figuras completas siguen disponibles en la galería EDA.'));
      return wrap;
    }
    const picker=element('div','story-metric-picker');
    const plot=element('div','story-metric-plot');
    const foot=element('div','story-metric-foot');
    const valid=stats.metrics.filter(m=>Array.isArray(m.rows)&&m.rows.length===4);
    let choice=valid[0]?.key;
    function fmt(v,key){
      const d=key==='gini'||key==='pobreza_total_60'?1:0;
      return numeric(v,d)+(key==='gini'?'':key==='pobreza_total_60'?' %':key==='renta_media_persona'||key==='GASTO MUNICIPAL'?' €':' €/hab.');
    }
    function plotMetric(){
      const m=valid.find(x=>x.key===choice);if(!m)return;
      plot.replaceChildren();
      const rows=STRATA.map(s=>m.rows.find(x=>x.estrato===s)).filter(Boolean);
      const max=Math.max(...rows.map(x=>x.p75));
      const minPos=Math.min(...rows.map(x=>x.p25).filter(x=>x>0));
      const log=m.key==='GASTO MUNICIPAL';
      const normalized=v=>{
        if(!log)return Math.max(0,v/max)*100;
        return Math.max(0,(Math.log(Math.max(v,minPos/2))-Math.log(minPos/2))/(Math.log(max)-Math.log(minPos/2)))*100;
      };
      for(const r of rows){
        const item=element('div','story-metric-row');
        const heading=element('div','story-metric-heading');
        heading.append(element('span','',r.estrato+' hab.'),element('strong','',fmt(r.mediana,m.key)));
        const bar=element('div','story-metric-track');
        const band=element('div','story-metric-band');
        band.style.left=normalized(r.p25)+'%';
        band.style.width=Math.max(1,normalized(r.p75)-normalized(r.p25))+'%';
        const dot=element('span','story-metric-dot');dot.style.left=normalized(r.mediana)+'%';
        bar.append(band,dot);
        item.append(heading,bar);
        plot.append(item);
      }
      foot.textContent='Mediana global: '+fmt(m.globalMedian,m.key)+' · '+m.n+' entidades'+(log?' · eje en escala logarítmica':'')+'.';
      picker.querySelectorAll('button').forEach(b=>{
        const selected=b.dataset.metric===choice;b.classList.toggle('is-active',selected);b.setAttribute('aria-pressed',String(selected));
      });
    }
    for(const m of valid){
      const b=button(m.key==='GASTO MUNICIPAL'?'Gasto total':m.key==='renta_media_persona'?'Renta':m.key==='pobreza_total_60'?'Pobreza':m.key==='gini'?'Gini':m.key==='GTO HAB'?'Gasto / hab.':m.key==='END HAB'?'Deuda / hab.':'Inversión / hab.','story-metric-choice',()=>{
        choice=m.key;plotMetric();setPlaying(false);
      });
      b.dataset.metric=m.key;picker.append(b);
    }
    wrap.append(picker,plot,foot);
    plotMetric();
    return wrap;
  }
  function buildProfiles(){
    const root=element('div','story-profiles');
    const ordered=Object.keys(COLORS);
    const max=Math.max(1,...ordered.map(k=>profileCounts[k]||0));
    for(const k of ordered){
      const n=profileCounts[k]||0;
      const row=element('div','story-profile-row');
      row.style.setProperty('--profile-color',COLORS[k]);
      const label=element('div','story-profile-label');
      label.append(element('strong','',k),element('span','',n+' entidades'));
      const track=element('div','story-profile-track');
      const bar=element('span','story-profile-fill');bar.style.width=(n/max*100)+'%';track.append(bar);
      const p=element('span','story-profile-pct',Math.round(n/Math.max(1,points.length)*100)+' %');
      row.append(label,track,p);root.append(row);
    }
    root.append(element('p','story-profile-disclaimer','K4 y K5: n = 4 cada uno. Segmentación exploratoria, no resultados de auditoría.'));
    return root;
  }
  const creators=[buildSample,buildPca,buildMetrics,buildProfiles];
  function render(){
    if(sceneCleanup){sceneCleanup();sceneCleanup=null;}
    if(frame!==null){cancelAnimationFrame(frame);frame=null;}
    const c=CHAPTERS[chapter],total=CHAPTERS.length;
    $('story-index').textContent=c.index;
    $('story-title').textContent=c.title;
    $('story-description').textContent=c.text;
    $('story-hint').textContent=c.hint;
    $('story-position').textContent=String(chapter+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
    $('story-progress-fill').style.width=((chapter+1)/total*100)+'%';
    $('story-stage').replaceChildren(creators[chapter]());
    $('story-prev').disabled=chapter===0;
    $('story-next').textContent=chapter===total-1?'Volver al inicio':'Siguiente capítulo →';
    $('story-next').setAttribute('aria-label',chapter===total-1?'Reiniciar recorrido':'Ir al capítulo siguiente');
    $('story-chapters').querySelectorAll('[data-story-chapter]').forEach((b,i)=>{
      const current=i===chapter;
      b.classList.toggle('is-active',current);b.setAttribute('aria-current',current?'step':'false');
      b.setAttribute('aria-pressed',String(current));
    });
    stopSpeech();
  }
  function go(i){
    if(!$('story-dialog')?.open)return;
    chapter=(i+CHAPTERS.length)%CHAPTERS.length;
    render();
    if(playing)setPlaying(chapter!==CHAPTERS.length-1);
  }
  function open(){
    const d=$('story-dialog');
    if(!d||d.open)return;
    lastFocus=document.activeElement;
    chapter=0;
    if(typeof d.showModal==='function')d.showModal();else {d.setAttribute('open','');d.classList.add('story-dialog-fallback');}
    render();
    setPlaying(!reduceMotion?.matches);
    $('story-close').focus();
  }
  function close(){
    const d=$('story-dialog');if(!d?.open)return;
    setPlaying(false);stopSpeech();
    if(sceneCleanup){sceneCleanup();sceneCleanup=null;}
    if(frame!==null){cancelAnimationFrame(frame);frame=null;}
    if(typeof d.close==='function')d.close();else{d.removeAttribute('open');d.classList.remove('story-dialog-fallback');}
  }
  function init(){
    const d=$('story-dialog');if(!d)return;
    for(const id of ['story-open','story-open-teaser']){
      $(id)?.addEventListener('click',open);
    }
    $('story-close').addEventListener('click',close);
    $('story-method-link')?.addEventListener('click',()=>close());
    $('story-prev').addEventListener('click',()=>go(chapter-1));
    $('story-next').addEventListener('click',()=>go(chapter===CHAPTERS.length-1?0:chapter+1));
    $('story-play').addEventListener('click',()=>{
      if(chapter===CHAPTERS.length-1)go(0);
      stopSpeech();setPlaying(!playing);
    });
    if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){
      $('story-speak').disabled=true;
      $('story-speak').title='La narración no está disponible en este navegador';
    }else $('story-speak').addEventListener('click',say);
    $('story-chapters').querySelectorAll('[data-story-chapter]').forEach(b=>{
      b.addEventListener('click',()=>go(Number(b.dataset.storyChapter)));
    });
    d.addEventListener('click',e=>{if(e.target===d)close();});
    d.addEventListener('close',()=>{
      setPlaying(false);stopSpeech();
      if(sceneCleanup){sceneCleanup();sceneCleanup=null;}
      if(frame!==null){cancelAnimationFrame(frame);frame=null;}
      lastFocus?.focus();
    });
    d.addEventListener('keydown',e=>{
      const target=e.target;
      if(/INPUT|SELECT|TEXTAREA/.test(target?.tagName||''))return;
      if(e.key==='ArrowRight'){e.preventDefault();go(chapter+1);}
      if(e.key==='ArrowLeft'){e.preventDefault();go(chapter-1);}
    });
    Promise.all([
      fetch('./endicex_k5.json').then(r=>{if(!r.ok)throw Error('PCA no disponible');return r.json();}).catch(()=>null),
      fetch('./eda-summary.json').then(r=>{if(!r.ok)throw Error('EDA no disponible');return r.json();}).catch(()=>null)
    ]).then(([pca,eda])=>{
      points=Array.isArray(pca?.entidades)?pca.entidades:[];
      const counts=Object.fromEntries(Object.keys(COLORS).map(k=>[k,points.filter(p=>p.cluster===k).length]));
      profileCounts=counts;
      stats=eda&&Array.isArray(eda.metrics)?eda:null;
      if(d.open)render();
      else if(new URLSearchParams(window.location.search).get('tour')==='1')open();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
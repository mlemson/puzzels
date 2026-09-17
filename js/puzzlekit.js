(function(){
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const fmt=s=>`${String(Math.floor((s||0)/60)).padStart(2,'0')}:${String((s||0)%60).padStart(2,'0')}`;
  function modal(title,body,buttons=[{label:'Sluiten',primary:true}]){
    document.querySelector('.modal-backdrop')?.remove();
    const back=document.createElement('div');back.className='modal-backdrop';
    back.innerHTML=`<div class="modal" role="dialog" aria-modal="true"><button class="modal-x" aria-label="Sluiten">×</button><h2>${esc(title)}</h2>${body}<div class="modal-actions"></div></div>`;
    back.querySelector('.modal-x').onclick=()=>back.remove();
    const acts=back.querySelector('.modal-actions');
    buttons.forEach(x=>{const b=document.createElement('button');b.className=x.primary?'primary':'ghost';b.textContent=x.label;b.onclick=()=>{back.remove();x.action?.();};acts.appendChild(b);});
    document.body.appendChild(back);
  }
  function timer(onTick){
    let handle=null,start=0,seconds=0;
    return {start(){start=Date.now();handle=setInterval(()=>{seconds=Math.floor((Date.now()-start)/1000);onTick?.(seconds);},1000);},stop(){if(handle)clearInterval(handle);handle=null;seconds=Math.floor((Date.now()-start)/1000);return seconds;},get(){return seconds;}};
  }
  function rulesBody(items){return `<div class="rules">${items.map((x,i)=>`<p><b>${i+1}.</b> ${x}</p>`).join('')}</div>`;}
  function launcher(def,levels,play){
    window.dispatchEvent(new Event('puzzlehub:navigate'));document.title=`${def.name} · Puzzelhub`;
    const g=PuzzleStore.game(def.id),unlocked=Math.min(levels.length,Math.max(1,g.unlocked));
    const next=levels.find(l=>!g.completed.includes(l.id)&&l.id<=unlocked)||levels[Math.min(unlocked-1,levels.length-1)]||levels[0];
    PuzzleHub.app.innerHTML=`
      <section class="game-header"><button class="text-button" id="pkBack">← Alle puzzels</button>
      <div class="game-title-row"><div class="game-icon large">${def.icon}</div><div><span class="eyebrow">${esc(def.tag.toUpperCase())}</span><h1>${esc(def.name)}</h1><p>${esc(def.longDesc||def.desc)}</p></div></div>
      <div class="continue-panel"><div><span class="eyebrow">GA VERDER</span><strong>Level ${next.id}</strong><small>${esc(next.difficulty||'Normaal')} · ${esc(next.sizeLabel||'')}</small></div><button class="primary" id="pkContinue">Spelen →</button></div></section>
      <section class="section-head compact"><div><h2>Levels</h2><p>${g.completed.length} van ${levels.length} opgelost</p></div><button class="ghost" id="pkRules">? Spelregels</button></section><div id="pkGroups"></div>`;
    document.getElementById('pkBack').onclick=PuzzleHub.home;document.getElementById('pkContinue').onclick=()=>play(next.id);document.getElementById('pkRules').onclick=()=>modal(`Zo werkt ${def.name}`,rulesBody(def.rules));
    const host=document.getElementById('pkGroups'),groups=[...new Set(levels.map(l=>l.difficulty||'Normaal'))];
    groups.forEach(name=>{const ls=levels.filter(l=>(l.difficulty||'Normaal')===name),sec=document.createElement('section');sec.className='level-section';sec.innerHTML=`<div class="level-section-title"><h3>${esc(name)}</h3><span>${ls.filter(l=>g.completed.includes(l.id)).length}/${ls.length}</span></div><div class="level-grid"></div>`;const grid=sec.querySelector('.level-grid');
      ls.forEach(l=>{const done=g.completed.includes(l.id),locked=l.id>g.unlocked,b=document.createElement('button');b.type='button';b.className=`level-tile ${done?'done':''} ${locked?'locked':''}`;b.disabled=locked;b.innerHTML=`<span class="level-num">${done?'✓':locked?'·':l.id}</span><span class="level-meta">${locked?'vergrendeld':done?(g.bestTimes[l.id]?fmt(g.bestTimes[l.id]):'opgelost'):(l.sizeLabel||'spelen')}</span>`;if(!locked)b.onclick=()=>play(l.id);grid.appendChild(b);});host.appendChild(sec);});
  }
  function playHeader(level,back,label='Levels'){
    return `<div class="play-top"><button class="text-button" id="pkBackPlay">← ${esc(label)}</button><div class="play-title"><span>Level ${level.id}</span><strong>${esc(level.difficulty||'Normaal')}</strong></div><div class="timer" id="timer">00:00</div></div>`;
  }
  function finish(def,level,seconds,hints,daily,launcher,play){
    if(daily){PuzzleStore.completeDaily(daily.dateKey,daily.slot,def.id,level.id,seconds);}else{PuzzleStore.complete(def.id,level.id,seconds,hints||0);}
    PuzzleHub.updateProgress();
    const title=`${def.name} opgelost!`,body=`<div class="win"><div class="win-mark">✓</div><h3>${daily?'Dagpuzzel':`Level ${level.id}`} voltooid</h3><div class="win-stats"><span><b>${fmt(seconds)}</b>Tijd</span>${hints!==undefined?`<span><b>${hints}</b>Hints</span>`:''}</div><p>${daily?'Deze telt mee voor je dagelijkse reeks.':level.id===def.levelCount?'Alle huidige levels zijn voltooid.':'Het volgende level is ontgrendeld.'}</p></div>`;
    if(daily){modal(title,body,[{label:'Terug naar vandaag',action:()=>window.PuzzleDaily?.open(),primary:true}]);return;}
    const last=level.id===def.levelCount;modal(title,body,last?[{label:'Naar levels',action:launcher,primary:true}]:[{label:'Naar levels',action:launcher},{label:`Level ${level.id+1} →`,action:()=>play(level.id+1),primary:true}]);
  }
  function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
  function rng(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
  window.PuzzleKit={esc,fmt,modal,timer,rulesBody,launcher,playHeader,finish,hash,rng};
})();

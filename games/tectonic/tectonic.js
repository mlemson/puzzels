(function(){
  const GAME='tectonic';
  const levels=window.TECTONIC_LEVELS||[];
  let timer=null;
  let session=null;
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  function launcher(){
    stopTimer();
    document.title='Tectonic · Puzzelhub';
    const g=PuzzleStore.game(GAME);
    const unlocked=Math.min(levels.length,Math.max(1,g.unlocked));
    const next=levels.find(l=>!g.completed.includes(l.id) && l.id<=unlocked) || levels[Math.min(unlocked-1,levels.length-1)];
    PuzzleHub.app.innerHTML=`
      <section class="game-header">
        <button class="text-button" id="backHome">← Alle puzzels</button>
        <div class="game-title-row"><div class="game-icon large">T</div><div><span class="eyebrow">CIJFERLOGICA</span><h1>Tectonic</h1><p>Vul ieder gebied met 1 t/m de grootte van het gebied. Gelijke cijfers mogen elkaar nergens raken, ook niet diagonaal.</p></div></div>
        <div class="continue-panel"><div><span class="eyebrow">GA VERDER</span><strong>Level ${next.id}</strong><small>${next.difficulty} · ${next.rows}×${next.cols}</small></div><button class="primary" id="continueBtn">Spelen →</button></div>
      </section>
      <section class="section-head compact"><div><h2>Levels</h2><p>${g.completed.length} van ${levels.length} opgelost</p></div><button class="ghost" id="rulesBtn">? Spelregels</button></section>
      <div id="levelGroups"></div>`;
    document.getElementById('backHome').onclick=PuzzleHub.home;
    document.getElementById('continueBtn').onclick=()=>play(next.id);
    document.getElementById('rulesBtn').onclick=showRules;
    renderLevels(g);
  }

  function renderLevels(g){
    const host=document.getElementById('levelGroups');
    host.innerHTML='';
    const groups=[...new Set(levels.map(l=>l.difficulty))];
    groups.forEach(name=>{
      const group=levels.filter(l=>l.difficulty===name);
      const sec=document.createElement('section'); sec.className='level-section';
      sec.innerHTML=`<div class="level-section-title"><h3>${esc(name)}</h3><span>${group.filter(l=>g.completed.includes(l.id)).length}/${group.length}</span></div><div class="level-grid"></div>`;
      const grid=sec.querySelector('.level-grid');
      group.forEach(l=>{
        const done=g.completed.includes(l.id); const locked=l.id>g.unlocked;
        const b=document.createElement('button'); b.type='button'; b.className=`level-tile ${done?'done':''} ${locked?'locked':''}`; b.disabled=locked;
        b.innerHTML=`<span class="level-num">${done?'✓':locked?'·':l.id}</span><span class="level-meta">${locked?'vergrendeld':done?(g.bestTimes[l.id]?fmt(g.bestTimes[l.id]):'opgelost'):`${l.rows}×${l.cols}`}</span>`;
        if(!locked) b.onclick=()=>play(l.id);
        grid.appendChild(b);
      });
      host.appendChild(sec);
    });
  }

  function showRules(){
    modal('Zo werkt Tectonic',`<div class="rules"><p><b>1.</b> Elk dik omlijnd gebied van <i>N</i> vakjes bevat precies de cijfers 1 t/m <i>N</i>.</p><p><b>2.</b> Twee gelijke cijfers mogen elkaar niet raken: niet horizontaal, verticaal én niet diagonaal.</p><p><b>3.</b> De voorgedrukte cijfers staan vast. Gebruik potloodnotities als je nog twijfelt.</p></div>`,[{label:'Begrepen',primary:true}]);
  }

  function play(id,opts={}){
    stopTimer();
    const level=levels.find(l=>l.id===id); if(!level) return launcher();
    const clueMap=level.clues;
    const board=Array(level.rows*level.cols).fill(null);
    Object.entries(clueMap).forEach(([key,v])=>{ const [r,c]=key.split(',').map(Number); board[r*level.cols+c]=v; });
    session={level,board,notes:Array.from({length:board.length},()=>new Set()),selected:null,pencil:false,history:[],seconds:0,hints:0,started:Date.now(),daily:opts.daily||null};
    renderGame(); startTimer();
  }

  function renderGame(){
    const s=session,l=s.level;
    PuzzleHub.app.innerHTML=`
      <section class="play-shell">
        <div class="play-top"><button class="text-button" id="backLevels">← Levels</button><div class="play-title"><span>Level ${l.id}</span><strong>${l.difficulty}</strong></div><div class="timer" id="timer">00:00</div></div>
        <div class="board-wrap"><div class="board" id="board" style="--cols:${l.cols};--rows:${l.rows}"></div></div>
        <div class="input-panel">
          <div class="digit-row" id="digits"></div>
          <div class="tool-row">
            <button class="tool" id="pencilBtn">✎ <span>Notities</span></button>
            <button class="tool" id="eraseBtn">⌫ <span>Wissen</span></button>
            <button class="tool" id="undoBtn">↶ <span>Ongedaan</span></button>
            <button class="tool" id="hintBtn">✦ <span>Hint</span></button>
          </div>
        </div>
      </section>`;
    document.getElementById('backLevels').onclick=()=>session?.daily?window.PuzzleDaily?.open():launcher();
    document.getElementById('pencilBtn').onclick=()=>{s.pencil=!s.pencil; document.getElementById('pencilBtn').classList.toggle('active',s.pencil);};
    document.getElementById('eraseBtn').onclick=()=>inputValue(null);
    document.getElementById('undoBtn').onclick=undo;
    document.getElementById('hintBtn').onclick=hint;
    const digits=document.getElementById('digits');
    for(let n=1;n<=5;n++){const b=document.createElement('button');b.className='digit';b.textContent=n;b.onclick=()=>inputValue(n);digits.appendChild(b);}
    renderBoard();
    window.onkeydown=keyHandler;
  }

  function keyHandler(e){
    if(!session) return;
    if(e.key>='1'&&e.key<='5') inputValue(Number(e.key));
    else if(e.key==='Backspace'||e.key==='Delete'||e.key==='0') inputValue(null);
    else if(e.key.toLowerCase()==='p'){session.pencil=!session.pencil; document.getElementById('pencilBtn')?.classList.toggle('active',session.pencil);}
    else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo();}
  }

  function regionIndexMap(l){
    const map=Array(l.rows*l.cols).fill(-1);
    l.regions.forEach((reg,ri)=>reg.forEach(([r,c])=>map[r*l.cols+c]=ri)); return map;
  }
  function isClue(idx){ const l=session.level,r=Math.floor(idx/l.cols),c=idx%l.cols; return Object.prototype.hasOwnProperty.call(l.clues,`${r},${c}`); }
  function conflicts(){
    const s=session,l=s.level,rm=regionIndexMap(l),bad=new Set();
    for(let i=0;i<s.board.length;i++){
      const v=s.board[i]; if(!v) continue;
      const r=Math.floor(i/l.cols),c=i%l.cols;
      const max=l.regions[rm[i]].length; if(v>max) bad.add(i);
      for(let rr=Math.max(0,r-1);rr<=Math.min(l.rows-1,r+1);rr++) for(let cc=Math.max(0,c-1);cc<=Math.min(l.cols-1,c+1);cc++){
        const j=rr*l.cols+cc; if(j!==i&&s.board[j]===v){bad.add(i);bad.add(j);}
      }
      l.regions[rm[i]].forEach(([rr,cc])=>{const j=rr*l.cols+cc;if(j!==i&&s.board[j]===v){bad.add(i);bad.add(j);}});
    }
    return bad;
  }

  function renderBoard(){
    const s=session,l=s.level,board=document.getElementById('board'); if(!board)return;
    board.innerHTML=''; const rm=regionIndexMap(l),bad=conflicts();
    for(let i=0;i<s.board.length;i++){
      const r=Math.floor(i/l.cols),c=i%l.cols,cell=document.createElement('button');
      cell.type='button'; cell.className='cell'; cell.dataset.idx=i;
      if(isClue(i)) cell.classList.add('clue');
      if(s.selected===i) cell.classList.add('selected');
      if(bad.has(i)) cell.classList.add('conflict');
      const same=(rr,cc)=>rr>=0&&cc>=0&&rr<l.rows&&cc<l.cols&&rm[rr*l.cols+cc]===rm[i];
      cell.classList.toggle('edge-top',!same(r-1,c)); cell.classList.toggle('edge-bottom',!same(r+1,c)); cell.classList.toggle('edge-left',!same(r,c-1)); cell.classList.toggle('edge-right',!same(r,c+1));
      if(s.board[i]) cell.innerHTML=`<span class="cell-value">${s.board[i]}</span>`;
      else if(s.notes[i].size) cell.innerHTML=`<span class="notes">${[1,2,3,4,5].map(n=>`<i>${s.notes[i].has(n)?n:''}</i>`).join('')}</span>`;
      cell.onclick=()=>{s.selected=i;renderBoard();};
      board.appendChild(cell);
    }
  }

  function pushHistory(idx){ session.history.push({idx,value:session.board[idx],notes:[...session.notes[idx]]}); if(session.history.length>100) session.history.shift(); }
  function inputValue(v){
    const s=session;if(!s||s.selected===null||isClue(s.selected))return;
    const idx=s.selected;pushHistory(idx);
    if(s.pencil&&v){ if(s.notes[idx].has(v))s.notes[idx].delete(v);else s.notes[idx].add(v); s.board[idx]=null; }
    else { s.board[idx]=v; s.notes[idx].clear(); }
    renderBoard(); checkComplete();
  }
  function undo(){const s=session;if(!s||!s.history.length)return;const h=s.history.pop();s.board[h.idx]=h.value;s.notes[h.idx]=new Set(h.notes);s.selected=h.idx;renderBoard();}
  function hint(){
    const s=session,l=s.level;if(!s)return;
    let idx=s.selected;
    if(idx===null||isClue(idx)||s.board[idx]===l.solution[idx]) idx=s.board.findIndex((v,i)=>!isClue(i)&&v!==l.solution[i]);
    if(idx<0)return;
    pushHistory(idx);s.board[idx]=l.solution[idx];s.notes[idx].clear();s.selected=idx;s.hints++;renderBoard();checkComplete();
  }
  function checkComplete(){
    const s=session;if(!s.board.every(Boolean)||conflicts().size)return;
    if(!s.board.every((v,i)=>v===s.level.solution[i]))return;
    stopTimer();
    if(s.daily){PuzzleStore.completeDaily(s.daily.dateKey,s.daily.slot,GAME,s.level.id,s.seconds);PuzzleHub.updateProgress();modal('Tectonic opgelost!',`<div class="win"><div class="win-mark">✓</div><h3>Dagpuzzel voltooid</h3><div class="win-stats"><span><b>${fmt(s.seconds)}</b>Tijd</span><span><b>${s.hints}</b>Hints</span></div><p>Deze telt mee voor je dagelijkse reeks.</p></div>`,[{label:'Terug naar vandaag',action:()=>window.PuzzleDaily?.open(),primary:true}]);return;}
    PuzzleStore.complete(GAME,s.level.id,s.seconds,s.hints); PuzzleHub.updateProgress();
    const last=s.level.id===levels.length;
    modal('Tectonic opgelost!',`<div class="win"><div class="win-mark">✓</div><h3>Level ${s.level.id} voltooid</h3><div class="win-stats"><span><b>${fmt(s.seconds)}</b>Tijd</span><span><b>${s.hints}</b>Hints</span></div><p>${last?'Je hebt alle huidige Tectonics opgelost.':'Het volgende level is ontgrendeld.'}</p></div>`,last?[{label:'Naar levels',action:launcher,primary:true}]:[{label:'Naar levels',action:launcher},{label:`Level ${s.level.id+1} →`,action:()=>play(s.level.id+1),primary:true}]);
  }
  function startTimer(){timer=setInterval(()=>{if(!session)return;session.seconds=Math.floor((Date.now()-session.started)/1000);const el=document.getElementById('timer');if(el)el.textContent=fmt(session.seconds);},1000);}
  function stopTimer(){if(timer){clearInterval(timer);timer=null;}window.onkeydown=null;}

  function modal(title,body,buttons){
    document.querySelector('.modal-backdrop')?.remove();
    const back=document.createElement('div');back.className='modal-backdrop';back.innerHTML=`<div class="modal" role="dialog" aria-modal="true"><button class="modal-x" aria-label="Sluiten">×</button><h2>${title}</h2>${body}<div class="modal-actions"></div></div>`;
    back.querySelector('.modal-x').onclick=()=>back.remove();
    const acts=back.querySelector('.modal-actions');
    buttons.forEach(x=>{const b=document.createElement('button');b.className=x.primary?'primary':'ghost';b.textContent=x.label;b.onclick=()=>{back.remove();x.action?.();};acts.appendChild(b);});
    document.body.appendChild(back);
  }

  window.addEventListener('puzzlehub:navigate',stopTimer);

  PuzzleHub.registerGame({id:GAME,name:'Tectonic',tag:'Cijferlogica',desc:'Gebieden, cijfers en één simpele regel die verrassend diep gaat.',icon:'T',levelCount:levels.length,open:launcher,play});
})();

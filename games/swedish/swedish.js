(function(){
  const GAME='swedish';
  const levels=window.SWEDISH_LEVELS||[];
  let session=null,timer=null;
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  function launcher(){
    stopTimer(); session=null;
    document.title='Zweedse puzzel · Puzzelhub';
    const g=PuzzleStore.game(GAME);
    g.unlocked=Math.min(g.unlocked,levels.length);
    const next=levels.find(l=>!g.completed.includes(l.id) && l.id<=g.unlocked) || levels[Math.min(g.unlocked,levels.length)-1] || levels[0];
    PuzzleHub.app.innerHTML=`
      <section class="game-header">
        <button class="text-button" id="backHome">← Puzzelhub</button>
        <div class="game-title-row"><div class="game-icon large">↘</div><div><span class="game-tag">WOORDPUZZEL</span><h1>Zweedse puzzel</h1><p>Omschrijvingen staan in het raster en wijzen direct naar hun antwoord. De woordenmix is bewust hedendaags: gewone Nederlandse woorden naast internet, cultuur, games en dagelijks leven.</p></div></div>
        <div class="continue-panel"><div><small>Verder met</small><strong>Level ${next.id}</strong><small>${esc(next.difficulty)} · ${next.words.length} woorden</small></div><button class="primary" id="continueBtn">Spelen →</button></div>
      </section>
      <section class="section-head compact"><div><h2>Puzzels</h2><p>${g.completed.length} van ${levels.length} opgelost</p></div><button class="ghost" id="rulesBtn">? Spelregels</button></section>
      <div id="levelGroups"></div>`;
    document.getElementById('backHome').onclick=PuzzleHub.home;
    document.getElementById('continueBtn').onclick=()=>play(next.id);
    document.getElementById('rulesBtn').onclick=showRules;
    renderLevels(g);
  }

  function renderLevels(g){
    const host=document.getElementById('levelGroups'); host.innerHTML='';
    [...new Set(levels.map(l=>l.difficulty))].forEach(name=>{
      const group=levels.filter(l=>l.difficulty===name);
      const sec=document.createElement('section'); sec.className='level-section';
      sec.innerHTML=`<div class="level-section-title"><h3>${esc(name)}</h3><span>${group.filter(l=>g.completed.includes(l.id)).length}/${group.length}</span></div><div class="level-grid"></div>`;
      const grid=sec.querySelector('.level-grid');
      group.forEach(l=>{
        const done=g.completed.includes(l.id),locked=l.id>g.unlocked;
        const b=document.createElement('button'); b.type='button'; b.disabled=locked; b.className=`level-tile ${done?'done':''} ${locked?'locked':''}`;
        b.innerHTML=`<span class="level-num">${done?'✓':locked?'·':l.id}</span><span class="level-meta">${locked?'vergrendeld':done?(g.bestTimes[l.id]?fmt(g.bestTimes[l.id]):'opgelost'):`${l.words.length} woorden`}</span>`;
        if(!locked)b.onclick=()=>play(l.id); grid.appendChild(b);
      });
      host.appendChild(sec);
    });
  }

  function showRules(){
    modal('Zo werkt een Zweedse puzzel',`<div class="rules"><p><b>1.</b> Een omschrijving staat in een gekleurd vakje. Het pijltje geeft aan of het antwoord naar rechts of naar beneden loopt.</p><p><b>2.</b> Kruisende woorden delen dezelfde letter.</p><p><b>3.</b> Tik op een lettervak om te typen. Tik nogmaals op een kruising om tussen de twee woorden te wisselen.</p><p>Deze reeks gebruikt bewust een mix van gewone en moderne Nederlandse woorden, zonder afhankelijk te zijn van ouderwetse puzzelwoorden.</p></div>`,[{label:'Begrepen',primary:true}]);
  }

  function buildLevel(l){
    const size=l.rows*l.cols;
    const solution=Array(size).fill(null),clueAt=new Map(),wordCells=[];
    l.words.forEach((w,wi)=>{
      clueAt.set(w.clueCell.join(','),wi);
      const cells=[]; const [sr,sc]=w.start; const dr=w.dir==='V'?1:0,dc=w.dir==='H'?1:0;
      [...w.answer].forEach((ch,i)=>{const r=sr+dr*i,c=sc+dc*i,idx=r*l.cols+c;solution[idx]=ch;cells.push(idx);});
      wordCells.push(cells);
    });
    return {solution,clueAt,wordCells};
  }

  function play(id,opts={}){
    stopTimer();
    const level=levels.find(l=>l.id===id); if(!level)return launcher();
    const meta=buildLevel(level);
    session={level,...meta,board:Array(meta.solution.length).fill(''),selected:null,activeWord:0,history:[],seconds:0,hints:0,started:Date.now(),wrong:new Set(),daily:opts.daily||null};
    renderGame(); selectWord(0,false); startTimer();
  }

  function renderGame(){
    const l=session.level;
    PuzzleHub.app.innerHTML=`
      <section class="play-shell wide">
        <div class="play-top"><button class="text-button" id="backLevels">← Puzzels</button><div class="play-title"><span>Level ${l.id}</span><strong>${esc(l.difficulty)}</strong></div><div class="timer" id="timer">00:00</div></div>
        <div class="board-wrap swedish-board-wrap"><div class="swedish-board" id="swBoard" style="--cols:${l.cols};--rows:${l.rows}"></div></div>
        <div class="sw-cluebar" id="swCluebar"></div>
        <p class="sw-helper">Typ met je toetsenbord. Op telefoon opent het toetsenbord zodra je een vakje kiest.</p>
        <div class="tool-row swedish-tools">
          <button class="tool" id="eraseBtn">⌫ <span>Wissen</span></button>
          <button class="tool" id="undoBtn">↶ <span>Ongedaan</span></button>
          <button class="tool" id="checkBtn">✓ <span>Controleer</span></button>
          <button class="tool" id="hintBtn">✦ <span>Hint</span></button>
        </div>
        <input class="sw-keyboard-capture" id="swKeyboard" autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="text" aria-label="Letter invoeren" />
      </section>`;
    document.getElementById('backLevels').onclick=()=>session?.daily?window.PuzzleDaily?.open():launcher();
    document.getElementById('eraseBtn').onclick=erase;
    document.getElementById('undoBtn').onclick=undo;
    document.getElementById('checkBtn').onclick=check;
    document.getElementById('hintBtn').onclick=hint;
    document.getElementById('swKeyboard').addEventListener('input',e=>{const ch=(e.target.value||'').toUpperCase().replace(/[^A-Z]/g,'').slice(-1);e.target.value='';if(ch)inputLetter(ch);});
    renderBoard(); window.addEventListener('keydown',keyHandler);
  }

  function cellWords(idx){
    const out=[]; session.wordCells.forEach((cells,wi)=>{if(cells.includes(idx))out.push(wi);}); return out;
  }
  function selectWord(wi,focus=true){
    const s=session;if(!s)return;s.activeWord=wi;
    const cells=s.wordCells[wi]||[];
    let idx=cells.find(i=>!s.board[i]); if(idx===undefined)idx=cells[0];
    if(idx!==undefined)s.selected=idx;
    renderBoard(); if(focus)focusKeyboard();
  }
  function selectCell(idx){
    const s=session,words=cellWords(idx);if(!words.length)return;
    if(s.selected===idx && words.length>1){const pos=words.indexOf(s.activeWord);s.activeWord=words[(pos+1)%words.length];}
    else if(!words.includes(s.activeWord))s.activeWord=words[0];
    s.selected=idx;s.wrong.delete(idx);renderBoard();focusKeyboard();
  }
  function focusKeyboard(){setTimeout(()=>document.getElementById('swKeyboard')?.focus({preventScroll:true}),0);}

  function renderBoard(){
    const s=session;if(!s)return;const l=s.level,host=document.getElementById('swBoard');if(!host)return;
    host.innerHTML='';const active=new Set(s.wordCells[s.activeWord]||[]);
    for(let r=0;r<l.rows;r++)for(let c=0;c<l.cols;c++){
      const idx=r*l.cols+c,key=`${r},${c}`,cell=document.createElement('button');cell.type='button';cell.className='sw-cell';
      if(s.clueAt.has(key)){
        const wi=s.clueAt.get(key),w=l.words[wi];cell.classList.add('clue-cell');
        cell.innerHTML=`<span class="sw-clue-mini">${esc(w.clue)}</span><span class="sw-arrow">${w.dir==='H'?'→':'↓'}</span>`;cell.onclick=()=>selectWord(wi);
      }else if(s.solution[idx]){
        cell.classList.add('answer');if(active.has(idx))cell.classList.add('active-word');if(s.selected===idx)cell.classList.add('selected');if(s.wrong.has(idx))cell.classList.add('wrong');
        cell.innerHTML=`<span class="sw-letter">${esc(s.board[idx]||'')}</span>`;cell.onclick=()=>selectCell(idx);
      }else{cell.classList.add('block');cell.disabled=true;}
      host.appendChild(cell);
    }
    const w=l.words[s.activeWord]; const bar=document.getElementById('swCluebar');
    if(w)bar.innerHTML=`<span class="direction">${w.dir==='H'?'→':'↓'}</span><div><strong>${esc(w.clue)}</strong><small>${w.answer.length} letters</small></div>`;
  }

  function nextCell(step=1){
    const s=session,cells=s.wordCells[s.activeWord]||[],p=cells.indexOf(s.selected);if(p<0)return;
    const n=p+step;if(n>=0&&n<cells.length)s.selected=cells[n];
  }
  function pushHistory(idx){session.history.push({idx,value:session.board[idx]});if(session.history.length>150)session.history.shift();}
  function inputLetter(ch){
    const s=session;if(!s||s.selected===null)return;pushHistory(s.selected);s.board[s.selected]=ch;s.wrong.delete(s.selected);nextCell(1);renderBoard();checkComplete();focusKeyboard();
  }
  function erase(){
    const s=session;if(!s||s.selected===null)return;const idx=s.selected;pushHistory(idx);
    if(s.board[idx])s.board[idx]='';else{nextCell(-1);if(s.selected!==null){pushHistory(s.selected);s.board[s.selected]='';}}
    s.wrong.delete(idx);renderBoard();focusKeyboard();
  }
  function undo(){const s=session;if(!s||!s.history.length)return;const h=s.history.pop();s.board[h.idx]=h.value;s.selected=h.idx;s.wrong.delete(h.idx);const words=cellWords(h.idx);if(words.length&&!words.includes(s.activeWord))s.activeWord=words[0];renderBoard();focusKeyboard();}
  function hint(){
    const s=session;if(!s)return;let idx=s.selected;
    if(idx===null||!s.solution[idx]||s.board[idx]===s.solution[idx])idx=s.solution.findIndex((v,i)=>v&&s.board[i]!==v);
    if(idx<0)return;pushHistory(idx);s.board[idx]=s.solution[idx];s.selected=idx;s.hints++;s.wrong.delete(idx);const words=cellWords(idx);if(words.length)s.activeWord=words[0];renderBoard();checkComplete();focusKeyboard();
  }
  function check(){
    const s=session;if(!s)return;s.wrong.clear();s.solution.forEach((v,i)=>{if(v&&s.board[i]&&s.board[i]!==v)s.wrong.add(i);});renderBoard();
    if(!s.wrong.size && s.solution.every((v,i)=>!v||s.board[i]===v))checkComplete();
  }
  function checkComplete(){
    const s=session;if(!s)return;if(!s.solution.every((v,i)=>!v||s.board[i]===v))return;
    stopTimer();
    if(s.daily){PuzzleStore.completeDaily(s.daily.dateKey,s.daily.slot,GAME,s.level.id,s.seconds);PuzzleHub.updateProgress();modal('Zweedse puzzel opgelost!',`<div class="win"><div class="win-mark">✓</div><h3>Dagpuzzel voltooid</h3><div class="win-stats"><span><b>${fmt(s.seconds)}</b>Tijd</span><span><b>${s.hints}</b>Hints</span></div><p>Deze telt mee voor je dagelijkse reeks.</p></div>`,[{label:'Terug naar vandaag',action:()=>window.PuzzleDaily?.open(),primary:true}]);return;}
    PuzzleStore.complete(GAME,s.level.id,s.seconds,s.hints);PuzzleHub.updateProgress();const last=s.level.id===levels.length;
    modal('Zweedse puzzel opgelost!',`<div class="win"><div class="win-mark">✓</div><h3>Level ${s.level.id} voltooid</h3><div class="win-stats"><span><b>${fmt(s.seconds)}</b>Tijd</span><span><b>${s.hints}</b>Hints</span></div><p>${last?'Je hebt alle huidige Zweedse puzzels opgelost.':'De volgende puzzel is ontgrendeld.'}</p></div>`,last?[{label:'Naar puzzels',action:launcher,primary:true}]:[{label:'Naar puzzels',action:launcher},{label:`Level ${s.level.id+1} →`,action:()=>play(s.level.id+1),primary:true}]);
  }

  function keyHandler(e){
    if(!session)return;const tag=document.activeElement?.tagName;if(tag==='INPUT'&&e.key.length===1)return;
    if(/^[a-zA-Z]$/.test(e.key)){e.preventDefault();inputLetter(e.key.toUpperCase());}
    else if(e.key==='Backspace'||e.key==='Delete'){e.preventDefault();erase();}
    else if(e.key==='Enter'){const words=cellWords(session.selected);if(words.length>1){const p=words.indexOf(session.activeWord);session.activeWord=words[(p+1)%words.length];renderBoard();}}
    else if(['ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();nextCell(1);renderBoard();}
    else if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();nextCell(-1);renderBoard();}
  }
  function startTimer(){timer=setInterval(()=>{if(!session)return;session.seconds=Math.floor((Date.now()-session.started)/1000);const el=document.getElementById('timer');if(el)el.textContent=fmt(session.seconds);},1000);}
  function stopTimer(){if(timer){clearInterval(timer);timer=null;}window.removeEventListener('keydown',keyHandler);}
  function modal(title,body,buttons){
    document.querySelector('.modal-backdrop')?.remove();const back=document.createElement('div');back.className='modal-backdrop';back.innerHTML=`<div class="modal" role="dialog" aria-modal="true"><button class="modal-x" aria-label="Sluiten">×</button><h2>${title}</h2>${body}<div class="modal-actions"></div></div>`;back.querySelector('.modal-x').onclick=()=>back.remove();const acts=back.querySelector('.modal-actions');buttons.forEach(x=>{const b=document.createElement('button');b.className=x.primary?'primary':'ghost';b.textContent=x.label;b.onclick=()=>{back.remove();x.action?.();};acts.appendChild(b);});document.body.appendChild(back);
  }

  window.addEventListener('puzzlehub:navigate',stopTimer);
  PuzzleHub.registerGame({id:GAME,name:'Zweedse puzzel',tag:'Woorden',desc:'Kruisende woorden met aanwijzingen ín het raster, met een frisse Nederlandse woordenmix.',icon:'↘',levelCount:levels.length,open:launcher,play});
})();

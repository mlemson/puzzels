(function(){
  const rotating=['nonogram','hashi','slitherlink','binairo','kakuro','mines','sudoku','nurikabe'];
  function labelDate(key){const [y,m,d]=key.split('-').map(Number);return new Intl.DateTimeFormat('nl-NL',{weekday:'long',day:'numeric',month:'long'}).format(new Date(y,m-1,d));}
  function challenges(dateKey){
    const h=PuzzleKit.hash(dateKey),t=PuzzleHub.getGame('tectonic'),s=PuzzleHub.getGame('swedish'),thirdId=rotating[h%rotating.length],third=PuzzleHub.getGame(thirdId);
    return [
      {slot:0,game:t,levelId:1+(h%(t?.levelCount||1)),subtitle:'Cijferlogica'},
      {slot:1,game:s,levelId:1+((h>>>5)%(s?.levelCount||1)),subtitle:'Woordpuzzel'},
      {slot:2,game:third,levelId:1+((h>>>11)%(third?.levelCount||1)),subtitle:'Wisselende logica'}
    ].filter(x=>x.game);
  }
  function open(dateKey=PuzzleHub.todayKey()){
    window.dispatchEvent(new Event('puzzlehub:navigate'));document.title='Dagelijks · Puzzelhub';
    const cs=challenges(dateKey),count=PuzzleStore.dailyCount(dateKey),streak=PuzzleStore.dailyStreak();
    PuzzleHub.app.innerHTML=`
      <section class="game-header"><button class="text-button" id="dailyBack">← Alle puzzels</button>
        <div class="game-title-row"><div class="game-icon large">☀</div><div><span class="eyebrow">DAGELIJKSE SET</span><h1>Vandaag</h1><p>Drie vaste puzzels voor ${PuzzleKit.esc(labelDate(dateKey))}. Iedereen met deze versie van de hub krijgt op dezelfde datum dezelfde set.</p></div></div>
        <div class="continue-panel"><div><span class="eyebrow">VOORTGANG</span><strong>${count}/3 voltooid</strong><small>${count===3?'Dag compleet ✓':'Los ze alle drie op voor je dagreeks'}</small></div><div class="daily-num">${count}/3</div></div>
      </section>
      <section class="section-head compact"><div><h2>Dagpuzzels</h2><p>Een mix van vertrouwd en wisselend.</p></div></section>
      <div class="daily-grid" id="dailyGrid"></div>
      <div class="daily-streak">🔥 <strong>${streak}</strong> volledige dag${streak===1?'':'en'} op rij <span>· Een dag telt zodra alle drie puzzels klaar zijn.</span></div>`;
    document.getElementById('dailyBack').onclick=PuzzleHub.home;const grid=document.getElementById('dailyGrid');
    cs.forEach((c,i)=>{const done=PuzzleStore.dailyDone(dateKey,c.slot),card=document.createElement('button');card.type='button';card.className='daily-card'+(done?' done':'');card.innerHTML=`<div class="daily-card-top"><div class="daily-num">${done?'✓':i+1}</div><span class="game-tag">${PuzzleKit.esc(c.subtitle)}</span></div><h3>${PuzzleKit.esc(c.game.name)}</h3><p>${PuzzleKit.esc(c.game.desc)}</p><div class="daily-meta"><span>Level ${c.levelId}</span><span>${done?'Voltooid':'Spelen →'}</span></div>`;card.onclick=()=>c.game.play(c.levelId,{daily:{dateKey,slot:c.slot}});grid.appendChild(card);});
  }
  window.PuzzleDaily={open,challenges};
})();

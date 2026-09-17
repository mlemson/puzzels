(function(){
  const games=[]; const gameMap={};
  const app=document.getElementById('app');
  const progress=document.getElementById('globalProgress');
  const themeToggle=document.getElementById('themeToggle');
  const themeMeta=document.querySelector('meta[name="theme-color"]');
  function currentTheme(){return document.documentElement.dataset.theme||'light';}
  function applyTheme(theme,persist=true){
    document.documentElement.dataset.theme=theme;
    if(persist){try{localStorage.setItem('puzzelhub.theme',theme);}catch(e){}}
    themeToggle.textContent=theme==='dark'?'☀':'☾';
    themeToggle.setAttribute('aria-label',theme==='dark'?'Lichte modus inschakelen':'Donkere modus inschakelen');
    themeToggle.title=themeToggle.getAttribute('aria-label');
    if(themeMeta)themeMeta.content=theme==='dark'?'#171b19':'#f3f0e8';
  }
  applyTheme(currentTheme(),false);
  themeToggle.addEventListener('click',()=>applyTheme(currentTheme()==='dark'?'light':'dark'));
  function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function updateProgress(){progress.textContent=`${PuzzleStore.totalCompleted()} opgelost`;}
  function registerGame(game){
    if(gameMap[game.id])return; games.push(game); gameMap[game.id]=game;
  }
  function getGame(id){return gameMap[id];}
  function home(){
    window.dispatchEvent(new Event('puzzlehub:navigate')); document.title='Puzzelhub';
    const date=todayKey(),done=PuzzleStore.dailyCount(date),streak=PuzzleStore.dailyStreak();
    app.innerHTML=`
      <section class="hero">
        <div><span class="eyebrow">PUZZELCOLLECTIE</span><h1>Eén plek voor kleine, slimme puzzels.</h1><p>Woord-, cijfer-, patroon-, lijn- en netwerklogica. Alles werkt lokaal in je browser, met eigen voortgang en een dagelijkse set.</p></div>
        <div class="hero-orbit" aria-hidden="true"><span>1</span><span>↘</span><span>3</span><span>◫</span><span>∞</span></div>
      </section>
      <button class="daily-banner" id="dailyOpen" type="button">
        <div class="daily-calendar"><b>${new Date().getDate()}</b><span>vandaag</span></div>
        <div class="daily-copy"><span class="eyebrow">DAGELIJKS</span><h2>Drie puzzels. Eén dagreeks.</h2><p>${done}/3 vandaag voltooid${streak?` · 🔥 ${streak} dag${streak===1?'':'en'} reeks`:''}</p></div>
        <div class="daily-arrow">→</div>
      </button>
      <section class="section-head"><div><h2>Spellen</h2><p>${games.length} speelbare puzzeltypes.</p></div></section>
      <div class="game-grid" id="gameGrid"></div>`;
    document.getElementById('dailyOpen').onclick=()=>window.PuzzleDaily?.open();
    const grid=document.getElementById('gameGrid');
    games.forEach(g=>{
      const gs=PuzzleStore.game(g.id),card=document.createElement('button');card.className='game-card';card.type='button';
      card.innerHTML=`<div class="game-icon">${g.icon}</div><div class="game-copy"><span class="game-tag">${g.tag}</span><h3>${g.name}</h3><p>${g.desc}</p><div class="game-progress"><span>${gs.completed.length}/${g.levelCount} levels</span><span>→</span></div></div>`;
      card.onclick=()=>g.open();grid.appendChild(card);
    }); updateProgress();
  }
  document.getElementById('brandButton').addEventListener('click',home);
  window.PuzzleHub={registerGame,getGame,games,home,updateProgress,app,applyTheme,todayKey};
  setTimeout(home,0);
})();

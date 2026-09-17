(function(){
  const KEY='puzzelhub.v2';
  const LEGACY='puzzelhub.v1';
  const defaults={games:{},daily:{}};
  function load(){
    try{
      const raw=localStorage.getItem(KEY)||localStorage.getItem(LEGACY)||'{}';
      const parsed=JSON.parse(raw);
      return {games:parsed.games||{},daily:parsed.daily||{}};
    }catch(e){return JSON.parse(JSON.stringify(defaults));}
  }
  let state=load();
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
  function game(id){
    if(!state.games[id]) state.games[id]={completed:[],unlocked:1,bestTimes:{},hints:{}};
    return state.games[id];
  }
  function daily(dateKey){
    if(!state.daily[dateKey]) state.daily[dateKey]={completed:[],entries:{}};
    return state.daily[dateKey];
  }
  function isoDaysAgo(n){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  window.PuzzleStore={
    game,
    complete(id,level,time,hints){
      const g=game(id);
      if(!g.completed.includes(level))g.completed.push(level);
      g.completed.sort((a,b)=>a-b);
      g.unlocked=Math.max(g.unlocked,level+1);
      const old=g.bestTimes[level]; if(!old||time<old)g.bestTimes[level]=time;
      g.hints[level]=Math.min(g.hints[level]??999,hints??0); save();
    },
    resetGame(id){state.games[id]={completed:[],unlocked:1,bestTimes:{},hints:{}};save();},
    totalCompleted(){return Object.values(state.games).reduce((n,g)=>n+(g.completed?.length||0),0);},
    daily,
    completeDaily(dateKey,slot,gameId,levelId,time){
      const d=daily(dateKey); if(!d.completed.includes(slot))d.completed.push(slot);
      d.completed.sort((a,b)=>a-b); d.entries[slot]={gameId,levelId,time,at:Date.now()}; save();
    },
    dailyCount(dateKey){return daily(dateKey).completed.length;},
    dailyDone(dateKey,slot){return daily(dateKey).completed.includes(slot);},
    dailyStreak(){
      let streak=0;
      for(let i=0;i<366;i++){
        const key=isoDaysAgo(i),d=state.daily[key];
        if(d&&d.completed?.length>=3)streak++;
        else if(i===0)continue;
        else break;
      }
      return streak;
    }
  };
})();

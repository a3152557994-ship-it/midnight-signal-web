(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./engine.js'):root.SignalEngine);if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SignalStorage=api;}(typeof window!=='undefined'?window:globalThis,function(E){
  'use strict';
  function blank(levels){return {version:1,active:levels[0].id,levels:{}};}
  function normalize(raw,levels){const clean=blank(levels);if(!raw||raw.version!==1||typeof raw.levels!=='object'||!raw.levels||Array.isArray(raw.levels))return clean;if(levels.some(l=>l.id===raw.active))clean.active=raw.active;
    for(const level of levels){const entry=raw.levels[level.id];if(!entry||typeof entry!=='object')continue;try{E.validate(level,entry.state);const state=JSON.parse(JSON.stringify(entry.state));let best=null;if(entry.best&&Number.isSafeInteger(entry.best.moves)&&entry.best.moves>=0&&entry.best.moves<=100000&&Number.isSafeInteger(entry.best.hints)&&entry.best.hints>=0&&entry.best.hints<=100000)best={moves:entry.best.moves,hints:entry.best.hints};clean.levels[level.id]={state,best};}catch(_){}}
    return clean;
  }
  function read(provider,levels,key){try{const store=provider(),text=store.getItem(key);if(text&&text.length>2000000)throw Error('Save too large');return {data:text?normalize(JSON.parse(text),levels):blank(levels),available:true};}catch(_){return {data:blank(levels),available:false};}}
  function write(provider,key,data){try{provider().setItem(key,JSON.stringify(data));return true;}catch(_){return false;}}
  return {blank,normalize,read,write};
}));

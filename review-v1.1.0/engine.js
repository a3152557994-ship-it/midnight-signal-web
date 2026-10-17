(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SignalEngine=api;}(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const DIRS=[[-1,0],[0,1],[1,0],[0,-1]];
  const rotate=mask=>((mask<<1)&15)|(mask>>3);
  function rotations(mask){const values=[];for(let i=0;i<4;i++){if(!values.includes(mask))values.push(mask);mask=rotate(mask);}return values;}
  function neighbor(level,index,d){const row=Math.floor(index/level.cols)+DIRS[d][0],col=index%level.cols+DIRS[d][1];return row>=0&&row<level.rows&&col>=0&&col<level.cols?row*level.cols+col:-1;}
  function analyze(level,masks){
    const powered=Array(masks.length).fill(false),open=Array(masks.length).fill(0),stack=[level.source];powered[level.source]=true;
    for(let i=0;i<masks.length;i++)for(let d=0;d<4;d++)if(masks[i]&(1<<d)){const j=neighbor(level,i,d);if(j<0||!(masks[j]&(1<<((d+2)%4))))open[i]|=1<<d;}
    while(stack.length){const i=stack.pop();for(let d=0;d<4;d++){const j=neighbor(level,i,d);if(j>=0&&(masks[i]&(1<<d))&&(masks[j]&(1<<((d+2)%4)))&&!powered[j]){powered[j]=true;stack.push(j);}}}
    const active=masks.filter(Boolean).length,lit=powered.filter((p,i)=>p&&masks[i]).length,received=level.receivers.filter(i=>powered[i]).length,leaks=open.reduce((n,m)=>n+popcount(m),0);
    return {powered,open,active,lit,received,receivers:level.receivers.length,leaks,solved:lit===active&&received===level.receivers.length&&leaks===0};
  }
  function popcount(mask){let n=0;while(mask){n+=mask&1;mask>>=1;}return n;}
  function create(level){return {version:1,levelId:level.id,masks:level.start.slice(),moves:0,hints:0,undo:[]};}
  function validate(level,state){
    if(!state||state.version!==1||state.levelId!==level.id||!Array.isArray(state.masks)||state.masks.length!==level.start.length||!Number.isSafeInteger(state.moves)||state.moves<0||state.moves>100000||!Number.isSafeInteger(state.hints)||state.hints<0||state.hints>100000||!Array.isArray(state.undo)||state.undo.length>120)throw Error('Invalid signal save');
    function validMasks(m){return Array.isArray(m)&&m.length===level.start.length&&m.every((mask,i)=>Number.isInteger(mask)&&rotations(level.solution[i]).includes(mask)&&(!level.locked.includes(i)||mask===level.solution[i]));}
    if(!validMasks(state.masks)||state.undo.some(u=>!u||!validMasks(u.masks)||!Number.isSafeInteger(u.moves)||u.moves<0||u.moves>100000||!Number.isSafeInteger(u.hints)||u.hints<0||u.hints>100000))throw Error('Invalid signal save');
    return true;
  }
  function snapshot(state){return {masks:state.masks.slice(),moves:state.moves,hints:state.hints};}
  function push(state){const next=JSON.parse(JSON.stringify(state));next.undo.push(snapshot(state));if(next.undo.length>120)next.undo.shift();return next;}
  function turn(level,state,index,reverse){validate(level,state);if(!Number.isInteger(index)||index<0||index>=state.masks.length||!state.masks[index]||level.locked.includes(index)||rotations(state.masks[index]).length===1)return state;const next=push(state);for(let n=0;n<(reverse?3:1);n++)next.masks[index]=rotate(next.masks[index]);next.moves=Math.min(100000,next.moves+1);return next;}
  function undo(level,state){validate(level,state);if(!state.undo.length)return state;const next=JSON.parse(JSON.stringify(state)),last=next.undo.pop();next.masks=last.masks;next.moves=last.moves;next.hints=last.hints;return next;}
  function hint(level,state){validate(level,state);if(analyze(level,state.masks).solved)return {state,index:-1};const index=state.masks.findIndex((mask,i)=>mask!==level.solution[i]&&!level.locked.includes(i));if(index<0)return {state,index:-1};const next=push(state);next.masks[index]=level.solution[index];next.hints=Math.min(100000,next.hints+1);return {state:next,index};}
  // Constraint solver: every port must have a reciprocal neighbor, and every
  // active tile must belong to the component containing the transmitter.
  function solve(level,{limit=2,maxNodes=200000}={}){
    let nodes=0,deadEnds=0,propagations=0,aborted=false;const solutions=[];
    const initial=level.solution.map((mask,i)=>level.locked.includes(i)?[mask]:rotations(mask));
    for(let i=0;i<initial.length;i++)initial[i]=initial[i].filter(mask=>DIRS.every((_,d)=>{const j=neighbor(level,i,d);return !(mask&(1<<d))||(j>=0&&level.solution[j]!==0);}));
    function propagate(domains){let changed=true;while(changed){changed=false;for(let i=0;i<domains.length;i++){if(!domains[i].length)return false;for(let d=0;d<4;d++){const j=neighbor(level,i,d);if(j<0)continue;const allowed=domains[i].filter(a=>domains[j].some(b=>Boolean(a&(1<<d))===Boolean(b&(1<<((d+2)%4)))));if(!allowed.length)return false;if(allowed.length!==domains[i].length){domains[i]=allowed;changed=true;propagations++;}}}}return true;}
    function search(domains){if(solutions.length>=limit||aborted)return;if(++nodes>maxNodes){aborted=true;return;}if(!propagate(domains)){deadEnds++;return;}let index=-1;for(let i=0;i<domains.length;i++)if(domains[i].length>1&&(index<0||domains[i].length<domains[index].length))index=i;
      if(index<0){const masks=domains.map(d=>d[0]);if(analyze(level,masks).solved)solutions.push(masks);else deadEnds++;return;}
      for(const mask of domains[index]){const branch=domains.map(d=>d.slice());branch[index]=[mask];search(branch);if(solutions.length>=limit||aborted)return;}
    }
    search(initial.map(d=>d.slice()));return {solutions,nodes,deadEnds,propagations,aborted};
  }
  return {rotate,rotations,neighbor,popcount,analyze,create,validate,turn,undo,hint,solve};
}));

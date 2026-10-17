(async function(){
  'use strict';
  const $=s=>document.querySelector(s),E=window.SignalEngine,S=window.SignalStorage,levels=window.SignalLevels,C=window.SignalConfig;
  // Standalone review edition. This path does not initialise or emulate CrazyGames SDK.
  document.querySelector('#platform-loading').remove(); document.querySelector('main').inert=false;
  const platformStore=window.localStorage;
  function trackPlaying(){}
  const UI={
    title:['午夜信号','Midnight Signal'],subtitle:['让夜里的每一条线路重新接通','Bring the night back on air'],channels:['选关','Channels'],help:['玩法','How to play'],language:['语言','Language'],auto:['自动','Auto'],soundOff:['声音关','Sound off'],soundOn:['声音开','Sound on'],channel:['频道','Channel'],
    edition:['完整篇 · {n} 个频道','Full edition · {n} channels'],demoEdition:['免费试玩 · {n} 个频道','Free demo · {n} channels'],goalTitle:['接通整张线网','Connect the whole network'],goal:['转动线路，让每一格通电、所有接收点亮起，并消除琥珀色断口。','Rotate the wires to power every tile, light every receiver and close all amber open ends.'],receivers:['接收点','Receivers'],powered:['通电线路','Powered wires'],openPorts:['断口','Open ends'],moves:['次旋转','rotations'],hints:['次提示','hints'],best:['最佳：{moves} 次旋转，{hints} 次提示','Best: {moves} rotations, {hints} hints'],noBest:['本频道尚未接通','This channel has not been cleared yet'],saved:['评审版 · 进度保存在此浏览器','Review build · saved in this browser'],sessionOnly:['仅本次打开有效，关闭可能丢失进度','Session only; closing may lose progress'],storageWarning:['平台暂未保存进度。本次仍可完整游玩，关闭后可能丢失进度。','This browser could not save progress. You can keep playing, but closing may lose it.'],
    boardLabel:['可旋转线路面板','Rotating wire panel'],transmitterOnline:['电源已就绪','Transmitter ready'],completed:['已接通 {n} / {total}','Cleared {n} / {total}'],source:['电源','Transmitter'],receiver:['接收点','Receiver'],wire:['线路','Wire'],openPort:['断口','Open end'],fixed:['固定','Fixed'],undo:['撤销','Undo'],reset:['重置本关','Reset channel'],hint:['提示一格','Hint one tile'],controls:['点按顺时针旋转。右键或 Shift＋点按可反转；键盘方向键移动，空格旋转。','Tap to turn clockwise. Right-click or Shift-click to reverse. Arrow keys move; Space turns.'],next:['下一频道','Next channel'],chooseAgain:['选择频道继续','Choose another channel'],footer:['没有倒计时。慢慢把信号送到。','No countdown. Take your time with the signal.'],
    waiting:['让蓝色线路覆盖整个面板，并消除断口。','Power the whole panel and close every open end.'],cleared:['信号接通。即将进入下一频道。','Signal received. Moving to the next channel shortly.'],clearedPaused:['信号已接通。可进入下一频道，或在选关里重玩。','Signal received. Continue to the next channel or choose one to replay.'],hintResult:['已调整第 {row} 行、第 {col} 列。琥珀框标出提示位置。','Adjusted row {row}, column {col}. The amber frame marks the hint.'],lastSignal:['这个频道已经接通。','This channel is connected.'],
    demoDone:['试玩的五个频道，到这里结束','The five-channel demo ends here'],demoDoneCopy:['你已接通 {n} / {total} 个试玩频道。可以自由重玩。完整版包含 24 个逐步递进的频道。','You have cleared {n} / {total} demo channels. Replay them freely. The full game has 24 progressively larger channels.'],allDone:['整座城市重新有了声音','The city is back on air'],allDoneCopy:['24 个频道全部接通。夜班结束了。你仍可以重玩任意频道，尝试更少的旋转或不用提示。','All 24 channels are connected. Your shift is complete. Replay any channel with fewer rotations or without hints.'],lastDone:['最后一个频道已接通','The final channel is connected'],lastDoneCopy:['已接通 {n} / {total} 个频道。其他频道的进度仍在，可以继续完成它们。','You have cleared {n} / {total} channels. Progress on the others is saved; return to finish them.'],fullGame:['查看完整游戏','View the full game'],
    channelsTitle:['选择频道','Choose a channel'],channelsNote:['每关单独保存进度；可以自由切换。','Each channel saves separately. Switch freely.'],levelLegend:['✓ 已接通　• 有进度','✓ Cleared　• In progress'],close:['关闭','Close'],helpTitle:['夜班接线指南','The night operator’s guide'],
    help1:['圆形电源固定不动。点按其他线路，每次顺时针旋转 90°，让相邻接口相接。','The circular transmitter is fixed. Tap other wires to rotate them 90° clockwise and match adjacent ports.'],help2:['蓝色线路已经通电，菱形是接收点。所有有线路的格子都要接入同一个电源。','Blue wires have power. Diamonds are receivers. Every wired tile must connect to the same transmitter.'],help3:['琥珀小圆点表示断口。全部接收点亮起且没有断口，才算完成。独立的小圈不能过关。','Amber dots are open ends. Light every receiver and close every end. An isolated loop does not count.'],help4:['提示会把一格调到正确方向，并记录一次提示。撤销能退回旋转或提示。重置只影响当前关卡。','A hint turns one tile to its correct orientation and counts as one hint. Undo reverses rotations or hints. Reset affects only this channel.'],help5:['键盘：方向键选择格子，空格或 Enter 旋转，Q 反转。Ctrl/⌘＋Z 撤销。触摸直接点按。','Keyboard: arrows select a tile, Space or Enter rotates it, Q reverses it. Ctrl/⌘+Z undoes. On touchscreens, tap a tile.'],help6:['接通后会自动进入下一关。完成记录会保留；可随时在选关里重玩。','A solved channel advances automatically. Your completion record stays; use Channels to replay at any time.'],credits:['原创线路与界面，使用 AI 辅助编程和中英文文案。图形由代码绘制；独立评审版本，无广告；存档保存在此浏览器，不调用 AI。','Original networks and interface, made with AI-assisted programming and bilingual writing. Graphics are drawn in code. Standalone review build; no ads or live AI. Saves stay in this browser.'],understood:['开始接线','Start connecting'],resetTitle:['重置这个频道？','Reset this channel?'],resetNote:['当前关卡的线路、旋转和提示次数会重置。已完成记录和其他关卡不变。','Reset this channel’s wires, rotations and hints. Completion records and other channels remain.'],cancel:['取消','Cancel'],
    north:['上','north'],east:['右','east'],south:['下','south'],west:['左','west'],poweredWord:['已通电','powered'],unpoweredWord:['未通电','unpowered'],tileLabel:['第 {row} 行，第 {col} 列，{role}，接口朝{ports}，{power}{fixed}。','Row {row}, column {col}, {role}, ports {ports}, {power}{fixed}.'],fixedSuffix:['，固定不可旋转',', fixed'],soundFailed:['此浏览器无法播放音效，游戏仍可继续。','Sound is unavailable in this browser. You can keep playing.'],loadFailed:['游戏文件未能完整加载，请完整解压后重新打开 index.html。','Some game files did not load. Extract the full archive and reopen index.html.']
  };
  UI["districts"]=["城市电台", "City stations"];
  UI["chapter"]=["第 {n} 片街区", "District {n}"];
  UI["district1"]=["河岸", "Riverside"];
  UI["district2"]=["老城", "Old town"];
  UI["district3"]=["车站", "Railway"];
  UI["district4"]=["山顶", "Hilltop"];
  UI["restored"]=["信号已送达", "Signal delivered"];
  UI["continueChannel"]=["继续接线", "Continue"];
  UI["oneMore"]=["再试一次", "Replay"];
  UI["firstGuide"]=["点亮的圆点是电源。点一下闪烁的线路，把信号送到菱形。", "The bright circle is your power source. Tap the pulsing wire to reach the diamond."];
  UI["secondGuide"]=["蓝色表示已经接通。沿着电源向外，把剩下的线路连起来。", "Blue wires carry power. Work outwards from the source to connect the rest."];
  UI["openGuide"]=["琥珀色圆点是断口。把它转向相邻线路，让整个线网闭合。", "Amber dots are open ends. Turn them towards a matching wire to close the network."];
  UI["replayGuide"]=["试试更少的旋转。撤销不会惩罚你。", "Try fewer rotations. Undo has no penalty."];
  UI["badge1"]=["已接通", "Connected"];
  UI["badge2"]=["独立完成", "Unassisted"];
  UI["badge3"]=["高效接线", "Efficient"];
  UI["badgeHelp"]=["一枚：接通；两枚：不用提示；三枚：不用提示且旋转不超过目标。", "One: connect. Two: no hints. Three: no hints and meet the rotation target."];
  UI["rotationTarget"]=["三星目标：{n} 次旋转", "Rotation target for three stars: {n}"];
  UI["chapterDone"]=["这片街区重新响起了广播。", "Another district is back on air."];
  UI["heard1"]=["河边的夜班船工，听到了今晚第一条广播。", "A night ferry catches the first broadcast from the river."];
  UI["heard2"]=["老城的收音机亮了。还有人和你一起醒着。", "A radio glows in the old town. Someone else is still awake."];
  UI["heard3"]=["末班车进站前，月台重新收到了信号。", "The platform receives a signal before the last train arrives."];
  UI["heard4"]=["山顶的天线亮起了。整座城都能听到你。", "The hilltop antenna lights up. The whole city can hear you."];
  UI["help6"]=["接通后会显示本关结果。点“继续接线”进入下一关，或在选关里重玩。", "After connecting, review your result and press Continue. Use Channels to replay at any time."];
  UI.levelLegend=['★ 已接通　★★ 不用提示　★★★ 达成旋转目标','★ Connected　★★ No hints　★★★ Rotation target'];
  function browserLocale(){const tag=navigator.language;return typeof tag==='string'&&/^zh(?:[-_]|$)/i.test(tag)?'zh':'en';}
  const LANGUAGE='midnight-signal-crazygames-language-v1';let mode='auto';try{const v=platformStore.getItem(LANGUAGE);if(['auto','zh','en'].includes(v))mode=v;}catch(_){}let locale=mode==='auto'?browserLocale():mode;
  function t(key,values={}){return (UI[key]||[key,key])[locale==='en'?1:0].replace(/\{(\w+)\}/g,(_,k)=>String(values[k]??''));}
  function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function notify(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('#toast').hidden=true,6000);}
  if(!E||!S||!C||!Array.isArray(levels)||!levels.length){$('#signal-status').textContent=t('loadFailed');return;}
  const KEY='midnight-signal-review-v1.1.0',provider=()=>platformStore,loaded=S.read(provider,levels,KEY);let progress=loaded.data,storageOK=loaded.available,warned=false,level,state,selected=-1,hintIndex=-1,advanceTimer=null,statusMessage=null,sound=false,audioContext=null;
  function persist(){progress.active=level.id;const old=progress.levels[level.id];progress.levels[level.id]={state,best:old?.best||null};storageOK=S.write(provider,KEY,progress);if(!storageOK&&!warned){warned=true;notify(t('storageWarning'));}}
  function stopAdvance(){if(advanceTimer!==null)clearTimeout(advanceTimer);advanceTimer=null;}
  function canTurn(index){return Boolean(level.solution[index])&&!level.locked.includes(index)&&E.rotations(level.solution[index]).length>1;}
  function openLevel(id){stopAdvance();level=levels.find(l=>l.id===id)||levels[0];state=progress.levels[level.id]?.state||E.create(level);selected=state.masks.findIndex((_,i)=>canTurn(i));hintIndex=-1;statusMessage=null;persist();render();}
  function staticText(){document.documentElement.lang=locale==='en'?'en':'zh-CN';document.title=t('title')+(C.edition==='demo'?' · '+(locale==='en'?'Demo':'试玩'):'');document.querySelectorAll('[data-msg]').forEach(el=>el.textContent=t(el.dataset.msg));document.querySelectorAll('[data-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.aria)));$('#language-select').value=mode;$('#sound-button').textContent=t(sound?'soundOn':'soundOff');$('#version-label').textContent='v'+C.version;}
  function tileSvg(mask,index,analysis){
    const positions=[[50,0],[100,50],[50,100],[0,50]],dirs=[0,1,2,3].filter(d=>mask&(1<<d));let path='';
    if(dirs.length===2){const [a,b]=dirs;path='M'+positions[a].join(' ')+(Math.abs(a-b)===2?' L':' Q50 50 ')+positions[b].join(' ');}else path=dirs.map(d=>'M50 50 L'+positions[d].join(' ')).join(' ');
    const role=index===level.source?'source':level.receivers.includes(index)?'receiver':'wire',fixed=level.locked.includes(index);
    let centre=role==='source'?'<circle class="role-background" cx="50" cy="50" r="17"/><circle class="source-core" cx="50" cy="50" r="8"/>':role==='receiver'?'<path class="role-background" d="M50 29L71 50L50 71L29 50Z"/><path class="receiver-core" d="M50 39L61 50L50 61L39 50Z"/>':dirs.length>=3?'<circle class="joint" cx="50" cy="50" r="7"/>':'';
    const dots=dirs.filter(d=>analysis.open[index]&(1<<d)).map(d=>{const p=positions[d].map(n=>n===0?9:n===100?91:n);return '<circle class="open-port" cx="'+p[0]+'" cy="'+p[1]+'" r="4.4"/>';}).join('');
    if(fixed)centre+='<path class="fixed-mark" d="M79 76h11v11H79z M82 76v-3a2.5 2.5 0 0 1 5 0v3"/>';
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><path class="wire-shadow" d="'+path+'"/><path class="wire" d="'+path+'"/>'+centre+dots+'</svg>';
  }
  function targetMoves(l){return l.start.reduce((n,m,i)=>{if(l.locked.includes(i))return n;let d=0;while(m!==l.solution[i]&&d<4){m=E.rotate(m);d++;}return n+Math.min(d,4-d);},0);}
  function starsFor(record,l){return !record?0:record.hints?1:record.moves<=targetMoves(l)?3:2;}
  function district(){return Math.min(4,Math.ceil(level.id/6));}
  function renderJourney(a,cleared){
    const n=district();$('#district-name').textContent=t('chapter',{n})+' · '+t('district'+n);
    $('#journey-stations').innerHTML=[1,2,3,4].map(d=>{const done=levels.filter(l=>Math.ceil(l.id/6)===d&&progress.levels[l.id]?.best).length;return '<div class="journey-stop '+(d===n?'is-active ':'')+(done===6?'is-restored':'')+'"><svg viewBox="0 0 100 45" aria-hidden="true"><path d="M2 43V30h13V20h12v23h6V10h15v33h6V25h12v18h5V5h15v38h12"/><path class="city-light" d="M7 34h3m10-8h3m16-9h4m14 14h4m16-18h4"/></svg><span>'+esc(t('district'+d))+'</span><b>'+done+'/6</b></div>';}).join('');
    $('#journey-fill').style.width=(cleared/levels.length*100)+'%';
    const tutorial=level.id<=3&&!progress.levels[level.id]?.best&&!a.solved;
    $('#field-guide').hidden=!tutorial;$('#field-guide').textContent=t(level.id===1?'firstGuide':level.id===2?'secondGuide':'openGuide');
    const first=state.masks.findIndex((m,i)=>canTurn(i)&&m!==level.solution[i]);
    if(tutorial&&first>=0){const tile=$('[data-tile="'+first+'"]');if(tile)tile.classList.add('guide-tile');}
    const record={moves:state.moves,hints:state.hints},stars=starsFor(record,level);
    $('#result-panel').hidden=!a.solved||level.id===levels.at(-1).id;$('#result-title').textContent=t('restored');
    $('#result-stars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);$('#result-stars').setAttribute('aria-label',stars+' / 3');
    $('#result-badge').textContent=t('badge'+Math.max(1,stars));
    $('#result-story').textContent=t(level.id%6===0?'chapterDone':'heard'+n);
    $('#target-note').textContent=t('rotationTarget',{n:targetMoves(level)});
    $('#continue-channel').hidden=level.id===levels.at(-1).id;
    $('#result-panel').classList.toggle('final-channel',level.id===levels.at(-1).id);
    $('#result-help').textContent=t('badgeHelp');
  }
  function renderLevels(){ $('#level-list').innerHTML=levels.map(l=>{const saved=progress.levels[l.id],cleared=Boolean(saved?.best),started=Boolean(saved&&(saved.state.moves||saved.state.hints));return '<button class="level-choice '+(l.id===level.id?'is-current ':'')+(cleared?'is-cleared':'')+'" data-level="'+l.id+'"'+(l.id===level.id?' aria-current="true"':'')+'><strong>'+String(l.id).padStart(2,'0')+'<i>'+(cleared?'★'.repeat(starsFor(saved.best,l)):started?'•':'')+'</i></strong><span>'+esc(l.name[locale])+'</span></button>';}).join(''); }
  function render(){
    staticText();const a=E.analyze(level,state.masks),cleared=levels.filter(l=>progress.levels[l.id]?.best).length,best=progress.levels[level.id]?.best;
    $('#channel-number').textContent=String(level.id).padStart(2,'0');$('#edition-label').textContent=t(C.edition==='demo'?'demoEdition':'edition',{n:levels.length});$('#level-title').textContent=level.name[locale];$('#level-brief').textContent=level.brief[locale];$('#receiver-count').textContent=a.received+' / '+a.receivers;$('#powered-count').textContent=a.lit+' / '+a.active;$('#leak-count').textContent=a.leaks;$('#move-count').textContent=state.moves;$('#hint-count').textContent=state.hints;$('#best-score').textContent=best?t('best',best):t('noBest');$('#completed-count').textContent=t('completed',{n:cleared,total:levels.length});$('#save-status').textContent=t(storageOK?'saved':'sessionOnly');
    const board=$('#board');board.style.setProperty('--cols',level.cols);board.innerHTML=state.masks.map((mask,i)=>{if(!mask)return '<div class="tile is-empty" aria-hidden="true"></div>';const role=i===level.source?'source':level.receivers.includes(i)?'receiver':'wire',fixed=!canTurn(i),ports=['north','east','south','west'].filter((_,d)=>mask&(1<<d)).map(key=>t(key)).join(locale==='zh'?'、':', '),label=t('tileLabel',{row:Math.floor(i/level.cols)+1,col:i%level.cols+1,role:t(role),ports,power:t(a.powered[i]?'poweredWord':'unpoweredWord'),fixed:fixed?t('fixedSuffix'):''});return '<button class="tile '+(a.powered[i]?'is-powered ':'')+(i===selected?'is-selected ':'')+(i===hintIndex?'is-hint':'')+'" data-tile="'+i+'" aria-label="'+esc(label)+'" tabindex="'+(i===selected?'0':'-1')+'"'+(fixed?' disabled':'')+'>'+tileSvg(mask,i,a)+'</button>';}).join('');
    $('.board-frame').classList.toggle('is-solved',a.solved);$('#undo-button').disabled=!state.undo.length;$('#hint-button').disabled=a.solved;$('#reset-button').disabled=state.moves===0&&state.hints===0&&state.masks.every((m,i)=>m===level.start[i]);
    $('#signal-status').classList.toggle('is-waiting',!a.solved&&!statusMessage);$('#signal-status').textContent=statusMessage?t(statusMessage.key,statusMessage.values):a.solved?t(level.id===levels.at(-1).id?'lastSignal':advanceTimer!==null?'cleared':'clearedPaused'):t('waiting');
    $('#next-button').hidden=!a.solved||level.id===levels.at(-1).id;const finished=a.solved&&level.id===levels.at(-1).id;$('#completion').hidden=!finished;
    if(finished){const demo=C.edition==='demo',all=cleared===levels.length;$('#completion-title').textContent=t(demo?'demoDone':all?'allDone':'lastDone');$('#completion-copy').textContent=t(demo?'demoDoneCopy':all?'allDoneCopy':'lastDoneCopy',{n:cleared,total:levels.length});}
    const purchase=$('#purchase-link');purchase.hidden=!(finished&&C.edition==='demo'&&typeof C.purchase_url==='string'&&/^https:\/\/[^\s]+$/.test(C.purchase_url));if(!purchase.hidden){purchase.href=C.purchase_url;purchase.target='_blank';purchase.rel='noopener noreferrer';purchase.textContent=t('fullGame');}else purchase.removeAttribute('href');
    renderJourney(a,cleared);if($('#levels-dialog').open)renderLevels();trackPlaying(!a.solved&&!document.hidden&&!document.querySelector('dialog[open]'));
  }
  function beep(complete){if(!sound)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error();audioContext=audioContext||new Audio();audioContext.resume().catch(()=>{});const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.setValueAtTime(complete?660:330,now);if(complete)osc.frequency.setValueAtTime(880,now+.11);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.035,now+.012);gain.gain.exponentialRampToValueAtTime(.001,now+(complete?.32:.09));osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+(complete?.35:.11));}catch(_){sound=false;$('#sound-button').setAttribute('aria-pressed','false');notify(t('soundFailed'));}}
  function focusTile(){if(!$('#result-panel').hidden){$('#continue-channel').focus({preventScroll:true});return;}const tile=$('[data-tile="'+selected+'"]');if(tile)tile.focus({preventScroll:true});}
  function finishAction(){const a=E.analyze(level,state.masks);if(a.solved){statusMessage=null;const previous=progress.levels[level.id]?.best,candidate={moves:state.moves,hints:state.hints};if(!previous||candidate.hints<previous.hints||(candidate.hints===previous.hints&&candidate.moves<previous.moves))progress.levels[level.id]={state,best:candidate};beep(true);}else beep(false);persist();render();$('.board-frame').classList.remove('action-pulse');void $('.board-frame').offsetWidth;$('.board-frame').classList.add('action-pulse');focusTile();}
  function turn(index,reverse){if(E.analyze(level,state.masks).solved||!canTurn(index))return;stopAdvance();selected=index;hintIndex=-1;statusMessage=null;state=E.turn(level,state,index,reverse);finishAction();}
  function doUndo(){stopAdvance();state=E.undo(level,state);hintIndex=-1;statusMessage=null;persist();render();focusTile();}
  function openDialog(id){stopAdvance();render();if(id==='levels-dialog')renderLevels();$('#'+id).showModal();trackPlaying(false);}
  $('#board').addEventListener('click',event=>{const tile=event.target.closest('[data-tile]');if(tile&&!tile.disabled)turn(Number(tile.dataset.tile),event.shiftKey);});
  $('#board').addEventListener('contextmenu',event=>{const tile=event.target.closest('[data-tile]');if(tile&&!tile.disabled){event.preventDefault();turn(Number(tile.dataset.tile),true);}});
  $('#board').addEventListener('keydown',event=>{const tile=event.target.closest('[data-tile]');if(!tile)return;const index=Number(tile.dataset.tile),direction={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3}[event.key];if(direction!==undefined){event.preventDefault();let next=E.neighbor(level,index,direction);while(next>=0&&!canTurn(next))next=E.neighbor(level,next,direction);if(next>=0){selected=next;render();focusTile();}}else if([' ','Enter','q','Q','e','E'].includes(event.key)){event.preventDefault();turn(index,event.shiftKey||event.key.toLowerCase()==='q');}});
  document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'&&!document.querySelector('dialog[open]')&&!/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)){event.preventDefault();doUndo();}});
  $('#undo-button').onclick=doUndo;$('#reset-button').onclick=()=>openDialog('reset-dialog');$('#confirm-reset').onclick=()=>{stopAdvance();state=E.create(level);hintIndex=-1;statusMessage=null;$('#reset-dialog').close();persist();render();focusTile();};
  $('#hint-button').onclick=()=>{stopAdvance();const h=E.hint(level,state);state=h.state;hintIndex=h.index;selected=h.index>=0?h.index:selected;statusMessage=h.index>=0?{key:'hintResult',values:{row:Math.floor(h.index/level.cols)+1,col:h.index%level.cols+1}}:null;finishAction();};
  $('#next-button').onclick=()=>{const next=levels.find(l=>l.id>level.id);if(next){openLevel(next.id);focusTile();}};$('#levels-button').onclick=()=>openDialog('levels-dialog');$('#completion-channels').onclick=()=>openDialog('levels-dialog');$('#help-button').onclick=()=>openDialog('help-dialog');
  $('#level-list').addEventListener('click',event=>{const button=event.target.closest('[data-level]');if(button){$('#levels-dialog').close();openLevel(Number(button.dataset.level));focusTile();}});
  document.querySelectorAll('.close-dialog').forEach(button=>button.onclick=()=>button.closest('dialog').close());
  $('#sound-button').onclick=()=>{sound=!sound;beep(false);$('#sound-button').textContent=t(sound?'soundOn':'soundOff');$('#sound-button').setAttribute('aria-pressed',String(sound));};
  $('#language-select').addEventListener('change',event=>{if(!['auto','zh','en'].includes(event.target.value))return;mode=event.target.value;try{platformStore.setItem(LANGUAGE,mode);}catch(_){}locale=mode==='auto'?browserLocale():mode;render();});window.addEventListener('languagechange',()=>{if(mode==='auto'){locale=browserLocale();render();}});
  $('#continue-channel').onclick=()=>$('#next-button').click();
  $('#replay-channel').onclick=()=>{state=E.create(level);hintIndex=-1;statusMessage=null;persist();render();focusTile();};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)trackPlaying(false);else render();});
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>render()));
  openLevel(progress.active);
}());

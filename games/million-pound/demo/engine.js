(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.MillionDemo = api;
}(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  // Standalone two-day edition. No later-day story or full-game ending data.
  var KEYS = ['cash','debt','reputation','trust','energy','income'];
  var LABELS = {cash:'现金',debt:'欠债',reputation:'名声',trust:'信任',energy:'体力',income:'每日收益'};
  var LOCATIONS = [
    {id:'restaurant',name:'牡蛎餐馆',subtitle:'吃一顿饭，或挣一顿饭'},
    {id:'tailor',name:'针线裁缝铺',subtitle:'衣服比名字更早被看见'},
    {id:'hotel',name:'雾港旅馆',subtitle:'屋檐、消息与临时工作'},
    {id:'exchange',name:'皇家交易所',subtitle:'名声与人脉，可以换来合伙生意'},
    {id:'club',name:'白鹿俱乐部',subtitle:'名声 35 或信任 55，解锁引荐委托'}
  ];
  var DAY_TITLES = ['找不开的午餐','一身新身份'];
  function copy(v){return JSON.parse(JSON.stringify(v));}
  function valid(s){
    if(!s || s.edition!=='two-day-demo' || s.version!==1 || !Number.isInteger(s.seed) || !Number.isInteger(s.turn) || s.turn<0 || s.turn>4 || s.day!==Math.min(2,Math.floor(s.turn/2)+1) || s.actionsLeft!==(s.turn===4?0:2-s.turn%2) || s.completed!==(s.turn===4) || !s.flags || !Array.isArray(s.history) || s.history.length!==s.turn)throw Error('试玩存档无效。');
    KEYS.forEach(function(k){if(!Number.isInteger(s[k]) || s[k]<0 || s[k]>100000 || (['reputation','trust','energy'].indexOf(k)>=0 && s[k]>100))throw Error('试玩存档无效。');});
    if(!Array.isArray(s.flags.stories) || !Number.isInteger(s.flags.noteShows) || !Number.isInteger(s.flags.connections) || s.flags.noteShows<0 || s.flags.connections<0)throw Error('试玩存档无效。');
  }
  function createGame(seed){
    if(seed===undefined)seed=Date.now();
    if(typeof seed!=='number'||!Number.isFinite(seed))throw Error('种子必须是有限数字。');
    return {edition:'two-day-demo',version:1,seed:Math.trunc(seed)>>>0,turn:0,day:1,actionsLeft:2,completed:false,cash:3,debt:0,reputation:15,trust:45,energy:70,income:0,flags:{noteShows:0,connections:0,commissionDay:0,partnerships:0,meal:false,room:false,stories:[]},history:[]};
  }
  function localize(v,locale){if(locale!=='en')return v;if(typeof v==='string')return translate(v,locale);if(Array.isArray(v))return v.map(function(x){return localize(x,locale);});if(v&&typeof v==='object'){var o={};Object.keys(v).forEach(function(k){o[k]=localize(v[k],locale);});return o;}return v;}
  function hint(s,d){var p=[];KEYS.forEach(function(k){if(d[k])p.push(LABELS[k]+(k==='income'?'永久':'')+(d[k]>0?' +':' −')+(['cash','debt','income'].indexOf(k)>=0?'£':'')+Math.abs(d[k]));});if(d.meal)p.push(s.flags.meal?'今日餐食已安排，不重复抵扣':'今夜餐费 −£2');if(d.room)p.push(s.flags.room?'今日床位已安排，不重复抵扣':'今夜房费 −£2');if(d.connections)p.push('结识一位商人');return p.join(' · ');}
  function c(s,id,label,text,delta,reason,extraHint){reason=reason||'';if(!reason&&delta.cash<0&&s.cash<-delta.cash)reason='需要 £'+(-delta.cash)+' 现金';if(!reason&&delta.energy<0&&s.energy<-delta.energy)reason='需要 '+(-delta.energy)+' 体力';return {id:id,label:label,text:text,delta:delta,available:!reason,reason:reason,hint:(extraHint?extraHint+' · ':'')+hint(s,delta)};}
  function note(s,label,text,delta){var d=Object.assign({reputation:24,trust:-6,debt:6,noteShows:1},delta||{});d.reputation=Math.min(d.reputation,Math.max(8,24-s.flags.noteShows*3));d.trust=Math.min(d.trust,-6-s.flags.noteShows*2);d.debt=Math.max(d.debt,6+s.flags.noteShows*3);return c(s,'show',label,text,d);}
  function scene(key,title,speaker,text,choices){return {key:key,title:title,speaker:speaker,text:text,choices:choices};}
  function repay(s){var n=Math.min(16,s.cash,s.debt);return c(s,'repay','兑现承诺，偿还 £'+n,'你把真钱压在账单上。柜台后的人这次叫的是你的名字，而不是“先生”。',{cash:-n,debt:-n,trust:Math.min(8,Math.ceil(n/2)),reputation:n>=5?2:0},s.debt===0?'目前没有欠债':n<1?'至少需要 £1 现金':'');}
  function build(s,location){
    valid(s);if(s.completed)throw Error('两日试玩已结束。');
    if(!LOCATIONS.some(function(l){return l.id===location;}))throw Error('地点不存在。');
    var event,isStory=(s.day===1?location==='restaurant':location==='tailor')&&s.flags.stories.indexOf(s.day)<0;
    if(isStory&&s.day===1)event=scene('story1','一张找不开的钞票','餐馆老板 · 贝克太太','你已两顿没吃。老板先看你的磨破的袖口，再看门口的价目牌。口袋里的钞票足以买下整条街，偏偏没人找得开。',[
      c(s,'work','挽起袖子，洗碗换饭','热水泡白了手指。老板给了你一碗浓汤和工钱：“明天缺人，你可以再来。”',{cash:5,trust:7,reputation:-1,energy:-12,meal:true}),
      note(s,'展开百万钞票，点一桌好菜','餐馆突然安静。老板改口称您为贵客，并把整桌菜记在你的账上。窗边的记者合上了笔记本。',{meal:true,energy:12}),
      c(s,'pay','付 £2，吃最简单的午餐','黑面包也有黄油。没人记住你，这让你能够安静地想一想明天。',{cash:-2,energy:14,trust:3,meal:true})
    ]);
    else if(isStory)event=scene('story2','衣服替谁说话','裁缝 · 费恩先生','橱窗里是一套体面的深蓝礼服。裁缝的眼睛很毒：“您是来改旧衣，还是来换一个身份？”',[
      c(s,'mend','花 £4，把旧衣修合身','针脚藏住了磨损。你仍是你，只是肩背能挺得更直一些。',{cash:-4,reputation:8,trust:5}),
      note(s,'用钞票担保，赊走整套礼服','新礼服非常合身，账单同样合身。裁缝将你的姓名写得格外工整。',{debt:12,reputation:23}),
      c(s,'work','帮忙送货，挣一件旧外套','你跑了四条街。学徒送你一件客人不要的外套，口袋虽小，工钱却是真实的。',{cash:7,trust:5,reputation:3,energy:-16})
    ]);
    else if(location==='restaurant')event=scene('rush','午市缺了一双手','贝克太太','锅里翻滚着浓汤，门口又来了三辆马车。老板看见你，露出一个疲惫的笑：“会端盘子吗？”',[
      c(s,'work','帮忙招待客人','你没有碰倒一个杯子。老板付钱时，又多塞了一块面包。',{cash:8,trust:5,energy:-16,meal:true}),
      c(s,'eat','花 £2 吃饭，恢复体力','你选择坐下来，好好吃完眼前这一餐。',{cash:-2,energy:22,meal:true}),
      note(s,'用百万钞票请全桌客人','碰杯声此起彼伏。人们赞美你的慷慨，而老板把账记得一分不差。',{debt:9,meal:true,energy:8})
    ]);
    else if(location==='tailor')event=scene('buttons','一盒黄铜纽扣','裁缝学徒 · 汤姆','汤姆接到一批制服的急单。你也许不懂做衣服，但总能分清黄铜和银色纽扣。',[
      c(s,'work','帮学徒赶工，挣 £9','桌上的纽扣一颗颗减少。汤姆说，以后愿意替你作担保。',{cash:9,trust:6,energy:-18}),
      c(s,'mend','花 £3 换一条领带','一条干净领带使你看起来更像账上有钱的人，但并没有让账上真的多钱。',{cash:-3,reputation:9,energy:3}),
      c(s,'rest','陪学徒喝茶，歇一歇','汤姆讲起家乡。谈话里没有钞票，只有两个人。',{trust:5,energy:14})
    ]);
    else if(location==='hotel')event=scene('porter','最后一班马车','旅馆管家 · 摩尔','雨里来了一车旅客，行李比人还多。搬运工请假了，柜台后还剩一把备用房钥匙。',[
      c(s,'work','搬完行李，换工钱与住宿','你把最后一个箱子送上楼，得到工钱和阁楼钥匙。窗外的伦敦终于安静了。',{cash:8,energy:-18,trust:5,room:true}),
      c(s,'rest','花 £3 租房休息','你把湿衣服挂在炉边。睡眠不会解决账单，但会使明天更容易一些。',{cash:-3,energy:28,room:true}),
      c(s,'chat','在大厅交换消息','你记住了两个名字和一家正在招人的商行。管家也记住了你的耐心。',{trust:6,reputation:3,energy:10})
    ]);
    else if(location==='exchange')event=scene('delivery','货单上的墨迹','商人 · 里德','里德正在找一个肯把小事做完的人。另一边，报摊的艾达仍愿意出售一小份生意。',[
      c(s,'work','核对货单，领取 £10 佣金','每个箱子的去处都对上了。里德留下你的名字，工钱当天付清。',{cash:10,trust:6,energy:-16}),
      c(s,'invest','花 £12 入股，每日多收 £3','你买下的不是一夜暴富，是每天清晨有人认真做事的收益。',{cash:-12,income:3,trust:4}),repay(s),
      c(s,'watch','旁听交易，免费休息','叫价声像潮水。你没有下注，只记下几家商行的名字。',{energy:10,trust:3})
    ]);
    else event=scene('invitation','请柬背面的小字','俱乐部门童','一场小型商谈正在里面举行。请柬写着“欢迎贵客”，背面小字写着“茶点另计”。',[
      c(s,'social','付 £4 茶点费，认真结识同行','你先问了别人在做什么，最后才说起自己。一张名片被认真收下。',{cash:-4,reputation:9,trust:6,connections:1}),
      c(s,'truth','在门外与旧识谈谈近况','你没有走进最亮的厅堂。这段实话却让一位旧识愿意继续相信你。',{trust:9,reputation:-3,energy:10}),
      note(s,'拿钞票当请柬，赊下茶点','门童立刻侧身。你身后的账本也同时翻开了新一页。',{debt:7})
    ]);
    if(location==='club')event.choices.push(c(s,'commission','接引荐委托，赚 £12 并结识商人','你的名字让对方愿意见面，清楚的条款让合作真正落地。£12 佣金当天到账，这位商人愿意为下一桩生意介绍伙伴。',{cash:12,trust:4,reputation:2,energy:-10,connections:1,commission:true},s.flags.commissionDay===s.day?'今日引荐委托已完成，明日再来':s.trust<30?'信任低于 30，对方不敢托付业务':s.reputation<35&&s.trust<55?'需要名声 35 或信任 55':'','门槛：名声 35 或信任 55，且信任至少 30'));
    if(location==='exchange'){var shares=s.flags.partnerships;event.choices.push(c(s,'partnership','经人脉合伙：£10 换每日 £5 分红','熟人带你见到一位手上有订单的印刷商。你出本金，他负责履约；名声带来客户，白纸黑字的合约把收益留给你。',{cash:-10,income:5,trust:3,energy:-8,partnerships:1},shares>=2?'已持有两份合伙生意':s.flags.connections<shares+1?'需要人脉介绍':s.reputation<35?'需要名声 35，让商行相信你能带来客源':s.trust<40?'需要信任 40，合伙人才能与你长期合作':'','门槛：名声 35、信任 40、人脉 '+(shares+1)));}
    event.locationId=location;event.isStory=isStory;event.id='demo:'+s.seed+':'+s.turn+':'+location+':'+event.key+':'+KEYS.map(function(k){return s[k];}).join('-')+':'+JSON.stringify(s.flags);
    return event;
  }
  function getLocations(s,locale){valid(s);return localize(LOCATIONS.map(function(l){var x=copy(l);x.available=!s.completed;if(s.completed)x.reason='两日试玩已结束。';else if((s.day===1?l.id==='restaurant':l.id==='tailor')&&s.flags.stories.indexOf(s.day)<0)x.subtitle='今日故事 · '+DAY_TITLES[s.day-1];return x;}),locale);}
  function getEvent(s,location,locale){var e=build(s,location);return localize({id:e.id,locationId:e.locationId,title:e.title,speaker:e.speaker,text:e.text,isStory:e.isStory,choices:e.choices.map(function(x){return {id:x.id,label:x.label,hint:x.hint,available:x.available,reason:x.reason};})},locale);}
  function choose(input,eventId,choiceId,locale){
    valid(input);if(input.completed)throw Error('两日试玩已结束。');
    var location=String(eventId).split(':')[3],e=build(input,location);if(e.id!==eventId)throw Error('这个事件已过期，请重新查看当前地点。');
    var option=e.choices.find(function(x){return x.id===choiceId;});if(!option)throw Error('这个选项不存在。');if(!option.available)throw Error(option.reason);
    var s=copy(input),changes=[],day=s.day;
    KEYS.forEach(function(k){if(!option.delta[k])return;var old=s[k];s[k]=Math.max(0,Math.min(['reputation','trust','energy'].indexOf(k)>=0?100:100000,s[k]+option.delta[k]));if(s[k]!==old)changes.push(LABELS[k]+(s[k]>old?' +':' −')+(['cash','debt','income'].indexOf(k)>=0?'£':'')+Math.abs(s[k]-old));});
    ['meal','room'].forEach(function(k){if(option.delta[k]&&!s.flags[k]){s.flags[k]=true;changes.push(k==='meal'?'今日餐食已安排，夜间餐费减 £2':'今日床位已安排，夜间房费减 £2');}});
    ['noteShows','connections','partnerships'].forEach(function(k){if(option.delta[k])s.flags[k]+=option.delta[k];});if(option.delta.connections)changes.push('结识一位生意伙伴');if(option.delta.commission)s.flags.commissionDay=s.day;if(e.isStory)s.flags.stories.push(s.day);
    s.turn++;s.actionsLeft--;
    if(s.actionsLeft===0){
      if(s.income){s.cash+=s.income;changes.push('第 '+day+' 日结算：收到分红 +£'+s.income);}
      var living=4-(s.flags.meal?2:0)-(s.flags.room?2:0),paid=Math.min(living,s.cash),shortfall=living-paid;s.cash-=paid;s.debt+=shortfall;
      changes.push('夜间食宿 £'+living+(shortfall?'：支付 £'+paid+'，欠账增加 £'+shortfall:living?'，已用现金支付':'，已由今日安排抵扣'));
      if(s.debt){var interest=Math.ceil(s.debt*.05);s.debt+=interest;changes.push('欠债夜间利息 +£'+interest+'（5%，向上取整）');}
      var rest=Math.min(20,100-s.energy);s.energy+=rest;if(rest)changes.push('夜间休息：体力 +'+rest);s.flags.meal=false;s.flags.room=false;
      if(s.turn===4){s.completed=true;changes.push('两日试玩已结束。');}else{s.day=2;s.actionsLeft=2;}
    }
    s.history.push({day:day,title:e.title,choiceLabel:option.label,text:option.text,changes:copy(changes)});valid(s);
    return {state:s,result:localize({title:e.title,text:option.text,changes:changes},locale)};
  }
  function getDayTitle(day,locale){return translate(DAY_TITLES[Math.max(0,Math.min(1,day-1))],locale);}
  function translate(text,locale){
    if(locale!=='en'||typeof text!=='string'||!/[\u3400-\u9fff]/.test(text))return text;if(EN[text])return EN[text];var m;
    if((m=text.match(/^今日故事 · (.+)$/)))return "Today's story · "+translate(m[1],'en');
    if((m=text.match(/^(现金|欠债|名声|信任|体力|每日收益)(永久)? ([+−])([£\d]+)$/)))return EN[m[1]]+(m[2]?' (permanent)':'')+' '+m[3]+m[4];
    if((m=text.match(/^需要 £(\d+) 现金$/)))return 'Requires £'+m[1]+' cash';if((m=text.match(/^需要 (\d+) 体力$/)))return 'Requires '+m[1]+' Energy';
    if((m=text.match(/^兑现承诺，偿还 £(\d+)$/)))return 'Keep your word: repay £'+m[1];
    if((m=text.match(/^门槛：名声 35、信任 40、人脉 (\d+)$/)))return 'Requires 35 Reputation, 40 Trust and '+m[1]+' contact(s)';
    if((m=text.match(/^第 (\d+) 日结算：收到分红 \+£(\d+)$/)))return 'Day '+m[1]+' close: dividends +£'+m[2];
    if((m=text.match(/^夜间食宿 £(\d+)：支付 £(\d+)，欠账增加 £(\d+)$/)))return 'Overnight food and lodging £'+m[1]+': paid £'+m[2]+'; debt +£'+m[3];
    if((m=text.match(/^夜间食宿 £(\d+)，已用现金支付$/)))return 'Overnight food and lodging £'+m[1]+', paid in cash';if((m=text.match(/^夜间食宿 £(\d+)，已由今日安排抵扣$/)))return 'Overnight food and lodging £'+m[1]+', already covered today';
    if((m=text.match(/^欠债夜间利息 \+£(\d+)（5%，向上取整）$/)))return 'Overnight debt interest +£'+m[1]+' (5%, rounded up)';if((m=text.match(/^夜间休息：体力 \+(\d+)$/)))return 'Overnight rest: Energy +'+m[1];
    if(text.indexOf(' · ')>=0)return text.split(' · ').map(function(x){return translate(x,'en');}).join(' · ');return text;
  }
  var EN = {
  "现金": "Cash",
  "欠债": "Debt",
  "名声": "Reputation",
  "信任": "Trust",
  "体力": "Energy",
  "每日收益": "Daily income",
  "牡蛎餐馆": "The Oyster House",
  "吃一顿饭，或挣一顿饭": "Buy a meal, or earn one",
  "针线裁缝铺": "Needle & Thread",
  "衣服比名字更早被看见": "Your coat arrives before your name",
  "雾港旅馆": "The Fogbound Inn",
  "屋檐、消息与临时工作": "A bed, a rumour, an honest day's work",
  "皇家交易所": "The Royal Exchange",
  "名声与人脉，可以换来合伙生意": "Turn your name and contacts into a business",
  "白鹿俱乐部": "The White Hart Club",
  "名声 35 或信任 55，解锁引荐委托": "Introductions: 35 Reputation or 55 Trust",
  "找不开的午餐": "A Lunch Without Change",
  "一身新身份": "Dressed for a New Life",
  "试玩存档无效。": "Invalid demo save.",
  "种子必须是有限数字。": "The seed must be a finite number.",
  "今日餐食已安排，不重复抵扣": "Food is already covered today; no extra discount",
  "今夜餐费 −£2": "Tonight's food cost −£2",
  "今日床位已安排，不重复抵扣": "Lodging is already covered today; no extra discount",
  "今夜房费 −£2": "Tonight's lodging cost −£2",
  "结识一位商人": "Gain one business contact",
  "你把真钱压在账单上。柜台后的人这次叫的是你的名字，而不是“先生”。": "You place real money on the bill. This time, the person behind the counter uses your name, not 'sir'.",
  "目前没有欠债": "You have no debt to repay",
  "至少需要 £1 现金": "Requires at least £1 cash",
  "两日试玩已结束。": "The two-day demo has ended.",
  "地点不存在。": "This location does not exist.",
  "一张找不开的钞票": "A Note Nobody Can Change",
  "餐馆老板 · 贝克太太": "Mrs Baker · Restaurant owner",
  "你已两顿没吃。老板先看你的磨破的袖口，再看门口的价目牌。口袋里的钞票足以买下整条街，偏偏没人找得开。": "You have missed two meals. The owner glances from your frayed cuffs to the price board. The note in your pocket could buy the whole street. Nobody can give you change.",
  "挽起袖子，洗碗换饭": "Roll up your sleeves and wash dishes",
  "热水泡白了手指。老板给了你一碗浓汤和工钱：“明天缺人，你可以再来。”": "Hot water wrinkles your fingers. The owner gives you a bowl of soup and your wages. 'Come back tomorrow if you need work.'",
  "展开百万钞票，点一桌好菜": "Unfold the note and order a feast",
  "餐馆突然安静。老板改口称您为贵客，并把整桌菜记在你的账上。窗边的记者合上了笔记本。": "The room falls silent. Suddenly you are an honoured guest, and the whole feast goes on your account. A reporter by the window closes his notebook.",
  "付 £2，吃最简单的午餐": "Pay £2 for a plain lunch",
  "黑面包也有黄油。没人记住你，这让你能够安静地想一想明天。": "Even the dark bread comes with butter. Nobody remembers you. It leaves you in peace to think about tomorrow.",
  "衣服替谁说话": "What the Coat Says",
  "裁缝 · 费恩先生": "Mr Fenn · Tailor",
  "橱窗里是一套体面的深蓝礼服。裁缝的眼睛很毒：“您是来改旧衣，还是来换一个身份？”": "A respectable dark-blue suit fills the window. The tailor has a sharp eye. 'Are we repairing a coat, sir, or making a new man?'",
  "花 £4，把旧衣修合身": "Pay £4 to mend your old clothes",
  "针脚藏住了磨损。你仍是你，只是肩背能挺得更直一些。": "Neat stitches conceal the wear. You are still yourself, but you stand a little straighter.",
  "用钞票担保，赊走整套礼服": "Use the note to take a suit on credit",
  "新礼服非常合身，账单同样合身。裁缝将你的姓名写得格外工整。": "The suit fits perfectly. So does the bill. The tailor writes your name with particular care.",
  "帮忙送货，挣一件旧外套": "Make deliveries and earn an old coat",
  "你跑了四条街。学徒送你一件客人不要的外套，口袋虽小，工钱却是真实的。": "You hurry through four streets. The apprentice gives you a discarded coat. Its pockets are small, but the wages inside are real.",
  "午市缺了一双手": "One Pair of Hands Short",
  "贝克太太": "Mrs Baker",
  "锅里翻滚着浓汤，门口又来了三辆马车。老板看见你，露出一个疲惫的笑：“会端盘子吗？”": "Soup bubbles on the stove. Three more carriages pull up outside. The owner gives you a tired smile. 'Can you carry a plate?'",
  "帮忙招待客人": "Help serve the lunchtime crowd",
  "你没有碰倒一个杯子。老板付钱时，又多塞了一块面包。": "You do not spill a single glass. The owner slips an extra piece of bread in with your pay.",
  "花 £2 吃饭，恢复体力": "Pay £2 for a meal and some rest",
  "你选择坐下来，好好吃完眼前这一餐。": "You sit down and give this one meal your full attention.",
  "用百万钞票请全桌客人": "Show the note and treat the entire table",
  "碰杯声此起彼伏。人们赞美你的慷慨，而老板把账记得一分不差。": "Glasses clink. Everyone praises your generosity. The owner records every penny.",
  "一盒黄铜纽扣": "A Box of Brass Buttons",
  "裁缝学徒 · 汤姆": "Tom · Tailor's apprentice",
  "汤姆接到一批制服的急单。你也许不懂做衣服，但总能分清黄铜和银色纽扣。": "Tom has an urgent uniform order. You may not know tailoring, but you can tell brass buttons from silver ones.",
  "帮学徒赶工，挣 £9": "Help finish the order for £9",
  "桌上的纽扣一颗颗减少。汤姆说，以后愿意替你作担保。": "The buttons disappear from the table, one by one. Tom says he would vouch for you any day.",
  "花 £3 换一条领带": "Buy a fresh tie for £3",
  "一条干净领带使你看起来更像账上有钱的人，但并没有让账上真的多钱。": "A clean tie makes you look like a man with money in the bank. It puts none there.",
  "陪学徒喝茶，歇一歇": "Rest over tea with the apprentice",
  "汤姆讲起家乡。谈话里没有钞票，只有两个人。": "Tom talks about home. There is no banknote in this conversation. Just two people.",
  "最后一班马车": "The Last Carriage",
  "旅馆管家 · 摩尔": "Moore · Innkeeper",
  "雨里来了一车旅客，行李比人还多。搬运工请假了，柜台后还剩一把备用房钥匙。": "A carriage arrives through the rain with more luggage than passengers. The porter is away. A spare room key hangs behind the desk.",
  "搬完行李，换工钱与住宿": "Carry the luggage for pay and a room",
  "你把最后一个箱子送上楼，得到工钱和阁楼钥匙。窗外的伦敦终于安静了。": "You take the last trunk upstairs and receive your pay and an attic key. Outside, London finally falls quiet.",
  "花 £3 租房休息": "Pay £3 for a room and rest",
  "你把湿衣服挂在炉边。睡眠不会解决账单，但会使明天更容易一些。": "You hang your wet clothes by the stove. Sleep will not settle your bills, but it will make tomorrow easier.",
  "在大厅交换消息": "Exchange news in the lobby",
  "你记住了两个名字和一家正在招人的商行。管家也记住了你的耐心。": "You learn two names and hear of a firm hiring workers. The innkeeper remembers your patience.",
  "货单上的墨迹": "Ink on an Invoice",
  "商人 · 里德": "Reed · Merchant",
  "里德正在找一个肯把小事做完的人。另一边，报摊的艾达仍愿意出售一小份生意。": "Reed needs someone who finishes small jobs properly. Across the street, Ada still has a share of her newsstand to sell.",
  "核对货单，领取 £10 佣金": "Check the invoices for a £10 fee",
  "每个箱子的去处都对上了。里德留下你的名字，工钱当天付清。": "Every crate reaches the right destination. Reed keeps your name and pays you that day.",
  "花 £12 入股，每日多收 £3": "Invest £12 for £3 more daily income",
  "你买下的不是一夜暴富，是每天清晨有人认真做事的收益。": "You have not bought overnight riches. You have bought a share in someone's honest work each morning.",
  "旁听交易，免费休息": "Listen to the trading and rest for free",
  "叫价声像潮水。你没有下注，只记下几家商行的名字。": "Bids rise and fall like the tide. You risk nothing, and write down a few firms' names.",
  "请柬背面的小字": "The Invitation's Small Print",
  "俱乐部门童": "The club's doorman",
  "一场小型商谈正在里面举行。请柬写着“欢迎贵客”，背面小字写着“茶点另计”。": "A business gathering is under way. The invitation welcomes 'distinguished guests'. The small print says refreshments cost extra.",
  "付 £4 茶点费，认真结识同行": "Pay £4 for tea and meet your peers",
  "你先问了别人在做什么，最后才说起自己。一张名片被认真收下。": "You ask about their work before mentioning your own. Someone pockets your card with care.",
  "在门外与旧识谈谈近况": "Catch up with an acquaintance outside",
  "你没有走进最亮的厅堂。这段实话却让一位旧识愿意继续相信你。": "You never enter the brightest room. But a little honesty gives an old acquaintance reason to keep believing in you.",
  "拿钞票当请柬，赊下茶点": "Let the note be your invitation; charge the tea",
  "门童立刻侧身。你身后的账本也同时翻开了新一页。": "The doorman steps aside at once. Behind you, the ledger opens to a fresh page.",
  "接引荐委托，赚 £12 并结识商人": "Arrange an introduction: earn £12 and a contact",
  "你的名字让对方愿意见面，清楚的条款让合作真正落地。£12 佣金当天到账，这位商人愿意为下一桩生意介绍伙伴。": "Your name gets the meeting. Clear terms make the deal happen. The £12 fee arrives that day, and the merchant offers to introduce you to a future partner.",
  "今日引荐委托已完成，明日再来": "Today's introduction is complete; return tomorrow",
  "信任低于 30，对方不敢托付业务": "Below 30 Trust: nobody will entrust you with the job",
  "需要名声 35 或信任 55": "Requires 35 Reputation or 55 Trust",
  "门槛：名声 35 或信任 55，且信任至少 30": "Requires 35 Reputation or 55 Trust, plus at least 30 Trust",
  "经人脉合伙：£10 换每日 £5 分红": "Invest through a contact: £10 for £5 daily income",
  "熟人带你见到一位手上有订单的印刷商。你出本金，他负责履约；名声带来客户，白纸黑字的合约把收益留给你。": "A contact introduces you to a printer with orders to fill. You supply capital; he supplies the work. Your reputation brings customers, and the written contract secures your share.",
  "已持有两份合伙生意": "You already own two partnerships",
  "需要人脉介绍": "Requires a business contact.",
  "需要名声 35，让商行相信你能带来客源": "Requires 35 Reputation to convince the firm you can attract customers",
  "需要信任 40，合伙人才能与你长期合作": "Requires 40 Trust for a lasting partnership",
  "这个事件已过期，请重新查看当前地点。": "This event is out of date. Open the location again.",
  "这个选项不存在。": "This choice does not exist.",
  "今日餐食已安排，夜间餐费减 £2": "Meal arranged: tonight's food cost falls by £2",
  "今日床位已安排，夜间房费减 £2": "Bed arranged: tonight's lodging cost falls by £2",
  "结识一位生意伙伴": "Gained one business contact"
};
  return {createGame:createGame,getLocations:getLocations,getEvent:getEvent,choose:choose,getDayTitle:getDayTitle,translate:translate};
}));

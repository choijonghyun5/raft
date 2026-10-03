['gesturestart','gesturechange','gestureend'].forEach(n=>document.addEventListener(n,e=>e.preventDefault()));
document.addEventListener('touchmove',e=>{if(e.touches.length>1||!e.target.closest('#box,#pk,#fm'))e.preventDefault()},{passive:false});
document.addEventListener('dblclick',e=>e.preventDefault());
const $=id=>document.getElementById(id),cv=$('c'),g=cv.getContext('2d'),W=$('wrap');
let VW=320,VH=180;cv.width=VW;cv.height=VH;
function fit(){const w=innerWidth,h=innerHeight,s=Math.max(1,Math.floor(Math.min(w/300,h/160))),nw=Math.max(240,Math.round(w/s)),nh=Math.max(135,Math.round(h/s));if(nw!==VW||nh!==VH){VW=nw;VH=nh;cv.width=VW;cv.height=VH}W.style.width=w+'px';W.style.height=h+'px';W.style.setProperty('--u',Math.min(s,3)+'px');$('rot').style.display=h>w&&w<800?'grid':'none'}
addEventListener('resize',fit);fit();

const T={wood:{n:'나무'},plastic:{n:'플라스틱'},rope:{n:'밧줄'},scrap:{n:'고철'},cloth:{n:'천'},fish:{n:'생선'},cooked:{n:'구운 생선'},seed:{n:'씨앗'},potato:{n:'감자'},mack:{n:'고등어'},tuna:{n:'참치'},squid:{n:'오징어'},carrot:{n:'당근'},tomato:{n:'토마토'},corn:{n:'옥수수'},berry:{n:'딸기'},metal:{n:'금속괴'},deep:{n:'심해어'},branch:{n:'나뭇가지'},glass:{n:'유리'},junk:{n:'부유물'},herb:{n:'허브'},bpotato:{n:'구운 감자'},bcorn:{n:'구운 옥수수'},stew:{n:'생선 스튜'},hfish:{n:'허브 생선구이'},stone:{n:'돌'},plank:{n:'판자'},clay:{n:'점토'},shard:{n:'금속 조각'},ore:{n:'철광석'},cuore:{n:'구리광석'},copper:{n:'구리'},elec:{n:'전자 부품'},battery:{n:'배터리'},part:{n:'기계 부품'},fuel:{n:'연료'},paper:{n:'종이'},ink:{n:'잉크'}};
const WEIGHT=['wood','wood','wood','plastic','plastic','rope','scrap','cloth','seed','branch','branch','glass','junk','rope','stone','stone','clay','shard'];
const R=[
 {id:'hook',n:'갈고리',d:'멀리 떠 있는 자원을 끌어올 수 있다',c:{wood:3,rope:2}},
 {id:'rod',n:'낚싯대',d:'낚싯대를 선택하고 물가에서 행동 버튼으로 낚시한다',c:{wood:2,rope:1,cloth:1}},
 {id:'purifier',n:'간이 정수기',d:'가까이서 눌러 사용: 바닷물을 식수로',c:{plastic:4,scrap:2,cloth:1}},
 {id:'paddle',n:'노',d:'노 버튼(R)으로 노 젓기. 조이스틱이 항해 방향이 된다 (5초 저을 때마다 내구도 1)',c:{wood:4,rope:1}},
 {id:'spear',n:'창',d:'상어가 가까이 오면 창을 선택하고 행동 버튼으로 쫓아낸다',c:{wood:3,scrap:1,rope:1}},
 {id:'hammer',n:'망치',d:'망치를 선택하고 금간 타일 근처에서 행동: 나무 1개로 수리',c:{wood:2,scrap:2}},
 {id:'collector',n:'빗물 수집기',d:'비가 오는 동안 물이 차고, 가까이서 수집기를 누르면 마신다',c:{plastic:3,cloth:2,rope:1}},
 {id:'radio',n:'무전기',d:'가까이서 눌러 사용: 구조 신호를 수신한다 (등대 일지를 발견하면 해금)',c:{scrap:6,plastic:4,cloth:1}},
 {id:'planter',n:'재배 상자',d:'가까이서 눌러 사용: 씨앗 심기·물 주기(수집기 물 15%)·수확. 비가 오면 자동으로 젖는다',c:{wood:4,cloth:1}},
 {id:'chest',n:'보관 상자',d:'눌러서 열거나 제작 패널에서 자원을 넣고 꺼낸다 (가방은 종류당 20개까지)',c:{wood:5,scrap:1}},
 {id:'furnace',n:'화로',d:'가까이서 눌러 사용: 생선을 구움 (구운 생선 허기 +35)',c:{wood:3,scrap:2}},
 {id:'torch',n:'횃불',d:'밤에 내 주변 시야가 넓어진다',c:{branch:2,cloth:1}},
 {id:'axe',n:'도끼',d:'도끼를 선택하고 나무를 주울 때 1개 더 얻는다 (내구도 20)',c:{wood:3,scrap:2,rope:1}},
 {id:'bottle',n:'물통',d:'정수기·빗물을 담아 두고, 슬롯에서 선택해 행동 버튼으로 마신다',c:{plastic:2,cloth:1}},
 {id:'bench',n:'작업대',d:'설치하면 수집기·재배 상자·보관 상자·물통이 해금된다',c:{wood:5,scrap:2,rope:1}},
 {id:'bed',n:'침대',d:'가까이서 눌러 사용: 잠깐 눈을 붙여 기력·체력 회복 (허기·갈증 소모, 쿨타임 60초)',c:{wood:3,cloth:3,junk:2}},
 {id:'fishnet',n:'낚시 시설',d:'25~35초마다 알아서 생선을 낚는다',c:{rope:3,junk:2,branch:3}},
 {id:'mspear',n:'금속 창',d:'상어를 완전히 쫓고 해파리를 한 번에 물리친다 (내구도 25)',c:{metal:2,wood:2,rope:1}},
 {id:'tank',n:'물 저장 탱크',d:'빗물 수집기가 넘치면 모아 둔다. 가까이서 눌러 사용: 마신다 (최대 200)',c:{plastic:5,scrap:3,wood:2}},
 {id:'maxe',n:'금속 도끼',d:'도끼를 선택하고 나무를 주울 때 2개 더 얻는다 (내구도 40)',c:{metal:3,wood:3,rope:2}},
 {id:'hook2',n:'강화 갈고리',d:'아주 먼 자원도 끌어온다 (내구도 50)',c:{metal:2,rope:3,wood:2}},
 {id:'rod2',n:'고급 낚싯대',d:'입질 시간이 길고 참치와 심해어가 잘 잡힌다',c:{metal:2,rope:2,cloth:2,plastic:1}},
 {id:'solar',n:'태양광 발전기',d:'맑은 낮에 전력을 모은다',c:{metal:3,plastic:4,cloth:1}},
 {id:'purifier2',n:'고급 정수기',d:'가까이서 눌러 사용: 전력 20으로 즉시 갈증 +60',c:{metal:4,plastic:4,scrap:2}},
 {id:'engine',n:'엔진',d:'항해 중 전력을 써서 속도 2배',c:{metal:5,scrap:4,plastic:2}},
 {id:'auto',n:'자동 수집 장치',d:'10초마다 근처 부유물을 알아서 건진다',c:{metal:4,rope:4,wood:6}},
 {id:'scanner',n:'탐색 장비',d:'새로운 섬이 훨씬 자주 발견된다',c:{metal:3,plastic:3,cloth:2}},
 {id:'nav',n:'고급 항해 장비',d:'항해 속도 +30%',c:{metal:4,cloth:4,rope:3}},
 {id:'lantern',n:'랜턴',d:'설치하면 밤에 그 주변이 넓게 밝아진다',c:{glass:2,scrap:1,cloth:1}},
 {id:'anchor',n:'닻',d:'태풍 피해를 줄이고 파도에 휩쓸리는 것을 막는다',c:{wood:4,scrap:4,rope:3}},
 {id:'tile',n:'뗏목 타일',d:'제작 후 빈 칸을 골라 설치 (터치, 또는 방향+행동)',c:{wood:4}}];
const RP=(id,n,d,c)=>{const r=R.find(x=>x.id===id);if(n)r.n=n;if(d)r.d=d;if(c)r.c=c};
RP('hook',0,'가벼운 부유물을 끌어올린다 (무거운 보급품은 가까이서만)',{wood:3,rope:2,plastic:1});
RP('hammer','돌망치','망치를 선택하고 금간 타일 근처에서 행동: 나무 1개로 수리 (가벼운 수리용)',{branch:2,stone:1,rope:1});
RP('axe','돌도끼','도끼를 선택하고 나무를 주울 때 1개 더 얻는다 · 목재 기술의 시작 (내구도 20)',{stone:2,branch:2,rope:1});
RP('spear','돌창','상어가 가까이 오면 창을 선택하고 행동 버튼으로 쫓아낸다',{branch:2,stone:1,rope:1});
RP('bottle',0,0,{wood:2,rope:1});
RP('rod',0,'낚싯대를 선택하고 물가에서 행동 버튼으로 낚시한다 (금속 조각이 필요)',{plank:2,rope:1,shard:1});
RP('furnace',0,'가까이서 눌러 사용: 생선 굽기·요리·연료 만들기',{stone:3,wood:3,clay:2});
RP('bench',0,'설치하면 수집기·재배 상자·보관 상자·화로·낚시 시설이 해금된다. 업그레이드로 Lv.2·3',{plank:3,rope:1});
RP('maxe',0,'도끼를 선택하고 나무를 주울 때 2개 더 얻는다 (내구도 40, 작업대 Lv.2 필요)',{metal:2,plank:2,rope:2});
RP('hook2',0,'더 먼 자원도 끌어온다 (내구도 50)',{plank:2,rope:3,shard:2});
RP('solar',0,0,{glass:2,metal:2,elec:2});
RP('purifier2',0,0,{metal:4,plastic:4,scrap:2,elec:1});
RP('engine',0,'연료통의 연료로 항해 속도 2배 (공구 세트와 연료통 필요)',{metal:3,part:2,elec:1});
RP('scanner',0,'새로운 섬이 훨씬 자주 발견된다',{metal:2,elec:2,battery:1});
RP('nav',0,'항해 속도 +30% (나침반과 엔진 필요)',{metal:2,elec:1,cloth:2});
RP('anchor',0,0,{metal:2,plank:2,rope:3});
RP('radio',0,'가까이서 눌러 사용: 구조 신호를 수신한다 (작업대 Lv.3, 등대 일지 필요)',{battery:1,elec:2,copper:2,metal:1});
R.push(
 {id:'saw',n:'목재 톱',d:'가공 탭에서 통나무를 판자로 가공한다',c:{wood:3,stone:2,rope:1}},
 {id:'smelter',n:'금속 제련로',d:'가까이서 눌러 사용: 고철·광석을 금속괴·구리로 제련',c:{stone:5,clay:3,shard:2}},
 {id:'mhammer',n:'금속 망치',d:'수리 효율 2배, 타일 Lv.2 이상 강화에 필요 (내구도 30)',c:{metal:2,plank:2}},
 {id:'knife',n:'금속 칼',d:'생선을 구울 때 +1, 오징어에서 잉크 추출 (내구도 25)',c:{metal:2,plank:1}},
 {id:'pickaxe',n:'금속 곡괭이',d:'섬 탐사 시 철광석·구리광석 채굴 (내구도 20)',c:{metal:3,stone:2,plank:1}},
 {id:'hook3',n:'금속 갈고리',d:'먼 거리와 무거운 보급품까지 회수 (내구도 70)',c:{metal:2,rope:3,plank:2}},
 {id:'toolset',n:'공구 세트',d:'렌치·드라이버·펜치 묶음. 기계 부품·엔진 제작에 필요',c:{metal:3,plank:1,rope:1}},
 {id:'wrench',n:'렌치',d:'고장난 시설을 재료 없이 수리한다',c:{metal:2,plank:1}},
 {id:'cutter',n:'금속 절단기',d:'폐선·연구 시설·플랫폼·군사 시설에서 전자 부품 회수 (내구도 15)',c:{metal:2,shard:2,plank:1}},
 {id:'compass',n:'나침반',d:'섬 방향과 거리를 상단 상태줄에 표시',c:{metal:1,glass:1}},
 {id:'telescope',n:'망원경',d:'화면 밖 보급 상자를 표시하고 섬 발견이 빨라진다',c:{metal:1,glass:2}},
 {id:'chart',n:'해도',d:'탐사한 장소를 일지에 기록한다 (나침반 필요)',c:{paper:2,ink:1}},
 {id:'fuelt',n:'연료통',d:'가까이서 눌러 사용: 연료 넣기 (엔진·발전기용)',c:{metal:2,plastic:2,plank:1}},
 {id:'gen',n:'발전기',d:'밤에 연료를 써서 전력을 만든다',c:{metal:3,copper:2,part:1}},
 {id:'elamp',n:'전등',d:'전력으로 밤에 주변을 넓게 밝힌다',c:{metal:1,glass:1,elec:1}},
 {id:'hook4',n:'전동 갈고리',d:'매우 먼 거리를 끌어온다 (전력 3 소모, 내구도 90)',c:{metal:2,elec:2,battery:1,part:1}},
 {id:'afarm',n:'자동 재배 시스템',d:'전력으로 재배 상자에 물을 자동 공급',c:{metal:3,elec:2,plastic:2}},
 {id:'bigpow',n:'대형 발전 시설',d:'전력 저장 300, 발전기 출력 2배',c:{metal:6,copper:3,battery:2,part:2}},
 {id:'lrs',n:'장거리 탐색 장치',d:'폭풍에도 신호가 잡히고 섬을 더 빨리 찾는다',c:{metal:3,elec:3,battery:2,glass:2}},
 {id:'lradio',n:'장거리 무전기',d:'마지막 구조 신호를 수신한다 (무전기 설치 필요)',c:{battery:2,elec:3,copper:2,part:2}}
);

const fresh=()=>({hp:100,hu:90,th:85,inv:Object.assign(Object.fromEntries(Object.keys(T).map(k=>[k,0])),{wood:3,rope:2,stone:3,branch:4}),tool:{hook:0,rod:0},tiles:['0,0','1,0','0,1','1,1'],pur:null,fur:null,pl:null,tu:{},chs:null,ch:{},dur:{},tm:10,x:16,y:16,st:100,bw:0,bn:null,qs:[null,null,null,null,null,null,null,null],pw:0});
let S;try{S=Object.assign(fresh(),JSON.parse(localStorage.getItem('raft1')||'{}'))}catch(e){S=fresh()}for(const k in T)if(S.inv[k]==null)S.inv[k]=0;
const idb=()=>new Promise((res,rej)=>{try{const q=indexedDB.open('raftdb',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)}catch(e){rej(e)}}),
idbPut=v=>idb().then(d=>{d.transaction('kv','readwrite').objectStore('kv').put(v,'raft1')}).catch(()=>{}),
idbDel=()=>idb().then(d=>{d.transaction('kv','readwrite').objectStore('kv').delete('raft1')}).catch(()=>{});
const save=()=>{const j=JSON.stringify(S);try{localStorage.setItem('raft1',j)}catch(e){}idbPut(j)};
try{if(!localStorage.getItem('raft1'))idb().then(d=>{const r=d.transaction('kv').objectStore('kv').get('raft1');r.onsuccess=()=>{if(r.result&&!localStorage.getItem('raft1')){localStorage.setItem('raft1',r.result);location.reload()}}}).catch(()=>{})}catch(e){}
let items=[],t=0,dead=false,spawnT=0,purCd=0,face={x:0,y:1},hookFx=null,fs={on:false,t:0},saveT=0,moving=false,panelOn=false;
const cam={x:S.x-VW/2,y:S.y-VH/2};
const has=(a,b)=>S.tiles.includes(a+','+b);
const ok=(x,y)=>has(Math.floor((x-3)/16),Math.floor((y-2)/16))&&has(Math.floor((x+3)/16),Math.floor((y-2)/16))&&has(Math.floor((x-3)/16),Math.floor(y/16))&&has(Math.floor((x+3)/16),Math.floor(y/16));
const center=()=>{let a=0,b=0;S.tiles.forEach(k=>{const[p,q]=k.split(',').map(Number);a+=p*16+8;b+=q*16+8});return[a/S.tiles.length,b/S.tiles.length]};

function spawnR(){return Math.max(170,Math.hypot(VW,VH)/2+14)}
function spawn(near){const[cx,cy]=center(),a=Math.random()*6.283,r=near?40+Math.random()*60:spawnR(),sx=cx+Math.cos(a)*r,sy=cy+Math.sin(a)*r,tx=cx+(Math.random()-.5)*90,ty=cy+(Math.random()-.5)*90,d=Math.hypot(tx-sx,ty-sy)||1,sp=8+Math.random()*14;
 items.push({k:WEIGHT[Math.random()*WEIGHT.length|0],x:sx,y:sy,vx:(tx-sx)/d*sp,vy:(ty-sy)/d*sp,ph:Math.random()*6})}
for(let i=0;i<7;i++)spawn(true);

let tt;function toast(m){const e=$('toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),1800)}
function renderInv(){renderQS();$('inv').innerHTML=Object.keys(T).filter(k=>S.inv[k]>0).map(k=>`<span data-k="${k}" title="${T[k].n}"><b>${ico(k)}</b><em>${S.inv[k]}</em></span>`).join('')||'<span class="emp">비어 있음</span>'}
function renderHud(){$('hud').innerHTML=`<div>${Math.floor((S.tm||0)/240)+1}일차 · ${dark()>.5?'밤':dark()>.05?((S.tm||0)%240<120?'저녁':'새벽'):'낮'}${rowing?' · 항해':''}${tags()}${tyk>.5?' · 태풍':sk>.5?' · 폭풍':fk>.5?' · 안개':rk>.5?' · 비':''}</div>`+[['생명','hp','#e0634f'],['허기','hu','#e8a24a'],['갈증','th','#4fb3e0'],['기력','st','#9ad66a']].map(([n,k,c])=>`<div class="bar ${S[k]<25?'low':''}"><b>${n} ${Math.round(Math.max(0,S[k]))}</b><div><i style="width:${Math.max(0,S[k])}%;background:${c}"></i></div></div>`).join('')}
const day=()=>Math.floor((S.tm||0)/240),dif=()=>1+Math.min(.6,day()*.06),hot=()=>Math.cos(((S.tm||0)%240)/240*6.283)>.85&&rk<.1&&sk<.1&&fk<.1,maxSt=()=>S.hu<20||S.th<20?60:100,cold=()=>dark()>.5&&(rk>.5||sk>.5)&&!(S.fur&&Math.hypot(S.fur[0]-S.x,S.fur[1]-S.y)<40);
function tags(){const a=[];if(S.th<15)a.push('탈수');if(S.hu<15)a.push('굶주림');if(S.st<10)a.push('피로');if(cold())a.push('저체온(화로 곁으로)');if(S.inj>0)a.push('부상');if(S.inf>0)a.push('감염(구운 생선으로 치료)');if(hot())a.push('과열');if(S.tnk)a.push('저장수 '+Math.round(S.tkW||0));if(S.sol||S.gn||S.tool.bigpow)a.push('전력 '+Math.round(S.pw||0)+'%');if(S.ft)a.push('연료 '+Math.round(S.fl||0)+'%');if(S.tool.compass&&isl)a.push('섬 '+dirOf(isl));if(S.tool.bottle)a.push('물통 '+Math.round(S.bw)+'%');return a.length?' · '+a.join(' · '):''}
const O='#1c1410',_ic={};
const ICON={wood:P=>{P(0,3,12,6,O);P(1,4,10,4,'#8a5a33');P(1,4,10,1,'#bd8a52');P(1,7,10,1,'#5c3a1e');P(8,5,2,2,'#d4a470')},
 plastic:P=>{P(4,0,4,3,O);P(3,2,6,10,O);P(4,3,4,8,'#cfe9f2');P(7,4,1,6,'#8ab9c8');P(5,1,2,1,'#e0634f')},
 rope:P=>{P(1,1,10,10,O);P(2,2,8,8,'#d8b878');P(4,4,4,4,O);P(5,5,2,2,'#7a5f33');P(2,8,8,2,'#a8864f')},
 scrap:P=>{P(1,2,10,8,O);P(2,3,8,6,'#8c949c');P(2,8,8,1,'#5d656d');P(3,3,3,1,'#c7ced4');P(7,5,2,2,'#5d656d')},
 cloth:P=>{P(1,1,10,10,O);P(2,2,8,8,'#d9786a');P(2,2,8,2,'#ecb0a4');P(2,6,8,1,'#b95a4e')},
 fish:P=>{P(1,3,9,6,O);P(10,3,2,6,O);P(2,4,7,4,'#8aa9c4');P(2,6,7,2,'#c9d9e4');P(10,4,1,4,'#8aa9c4');P(3,5,1,1,O)},
 cooked:P=>{P(1,3,9,6,O);P(10,3,2,6,O);P(2,4,7,4,'#c9803a');P(2,6,7,2,'#e8b060');P(10,4,1,4,'#c9803a');P(4,4,1,4,'#7a4a1e');P(7,4,1,4,'#7a4a1e')},
 seed:P=>{P(3,2,6,8,O);P(4,3,4,6,'#c9a24a');P(5,3,2,2,'#e8d58a');P(5,8,2,1,'#8a6a2a')},
 potato:P=>{P(1,3,10,7,O);P(2,4,8,5,'#c9a05a');P(3,5,1,1,'#8a6a2a');P(7,6,1,1,'#8a6a2a')}};
const fi=(a,b)=>P=>{P(1,3,9,6,O);P(10,3,2,6,O);P(2,4,7,4,a);P(2,6,7,2,b);P(10,4,1,4,a);P(3,5,1,1,O)};ICON.mack=fi('#4a8a9a','#d5e8e0');ICON.tuna=fi('#3a4a8a','#c0c8e0');ICON.squid=P=>{P(2,1,8,5,O);P(3,2,6,3,'#d9a0b0');P(3,6,1,5,'#d9a0b0');P(5,6,1,5,'#d9a0b0');P(7,6,1,5,'#d9a0b0');P(4,3,1,1,O);P(7,3,1,1,O)};const cr=(a,b)=>P=>{P(2,2,8,8,O);P(3,3,6,6,a);P(4,3,2,1,b);P(5,1,2,2,'#5fae5a')};ICON.carrot=cr('#e8923a','#f4b878');ICON.tomato=cr('#e0434f','#f08088');ICON.corn=cr('#e8d04a','#f6ea96');ICON.berry=cr('#d83a5a','#f08098');ICON.deep=fi('#6a3a8a','#c09ad0');ICON.metal=P=>{P(1,3,10,6,O);P(2,4,8,4,'#aab4bd');P(2,4,8,1,'#e0e6ea');P(2,7,8,1,'#6d7780')};ICON.branch=P=>{P(0,5,12,3,O);P(1,6,10,1,'#8a5a33');P(4,2,2,4,O);P(5,3,1,3,'#8a5a33')};ICON.glass=P=>{P(3,1,6,10,O);P(4,2,4,8,'#bfe8e4');P(4,2,1,7,'#e8fffc')};ICON.junk=P=>{P(1,3,10,7,O);P(2,4,8,5,'#7a7a5a');P(3,5,3,2,'#b0a070');P(7,4,2,4,'#5a5a44')};ICON.herb=cr('#5fae5a','#8fd08a');ICON.bpotato=P=>{P(1,3,10,7,O);P(2,4,8,5,'#d89a4a');P(2,4,8,1,'#f0c27a');P(3,5,2,1,'#7a4a1e');P(7,6,2,1,'#7a4a1e')};ICON.bcorn=P=>{P(2,2,8,8,O);P(3,3,6,6,'#e8b83a');P(4,3,1,6,'#a8741e');P(7,3,1,6,'#a8741e');P(5,1,2,2,'#5fae5a')};ICON.stew=P=>{P(1,5,10,6,O);P(2,6,8,4,'#c9803a');P(2,6,8,1,'#e8b060');P(4,3,1,2,'#cfe9f2');P(7,2,1,3,'#cfe9f2');P(3,8,2,1,'#e0434f')};ICON.hfish=P=>{P(1,3,9,6,O);P(10,3,2,6,O);P(2,4,7,4,'#c9803a');P(2,6,7,2,'#e8b060');P(10,4,1,4,'#c9803a');P(4,4,1,4,'#5fae5a');P(7,4,1,4,'#5fae5a')};
function ico(k){if(!_ic[k]){const c=document.createElement('canvas');c.width=c.height=12;const x=c.getContext('2d');ICON[k]&&ICON[k]((a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)});_ic[k]=c.toDataURL()}return `<img class="ic" src="${_ic[k]}">`}
const D={wood:'뗏목 확장과 제작의 기본 재료',plastic:'정수기·빗물 수집기 재료',rope:'도구 제작과 수리에 쓴다',scrap:'금속 부품. 시설 제작용',cloth:'횃불·수집기 등에 쓰는 천',fish:'날생선. 화로에서 구우면 더 좋다 (허기 +8)',cooked:'구운 생선 (허기 +35)',seed:'재배 상자에 심는다',potato:'수확한 감자 (허기 +15)',mack:'고등어. 구우면 구운 생선 (날것 허기 +12)',tuna:'참치. 구우면 구운 생선 2개 (날것 허기 +18)',squid:'오징어. 구우면 구운 생선 (날것 허기 +10)',carrot:'수확한 당근 (허기 +12)',tomato:'토마토 (허기 +10, 갈증 +6)',corn:'옥수수 (허기 +18)',berry:'딸기 (허기 +8, 갈증 +6)',metal:'고철을 제련한 금속. 고급 도구와 시설의 재료',deep:'어둠 속에서 올라온 희귀한 물고기 (날것 허기 +30)',branch:'횃불·낚시 시설 재료',glass:'랜턴 재료',junk:'침대·낚시 시설 재료',herb:'허브. 먹으면 부상이 낫고 생명력 +10',bpotato:'화로에서 구운 감자 (허기 +25)',bcorn:'화로에서 구운 옥수수 (허기 +30)',stew:'생선과 토마토를 끓인 스튜 (허기 +50, 갈증 +10, 생명력 +10)',hfish:'허브를 곁들인 생선구이 (허기 +40, 부상·감염 치료)'};
function eatK(k){if(dead||panelOn)return;const v=EV[k];if(v&&S.inv[k]>0){S.inv[k]--;if(k==='herb'){S.hp=Math.min(100,S.hp+10);S.inj=0}if(k==='stew'){S.th=Math.min(100,S.th+10);S.hp=Math.min(100,S.hp+10)}if(k==='hfish'){S.inj=0;S.inf=0}if(k==='cooked')S.inf=0;else if(['fish','mack','tuna','squid','deep'].includes(k)&&Math.random()<.2){S.inf=90;toast('날것을 먹고 감염됐다! 구운 생선으로 치료')}S.hu=Math.min(100,S.hu+v);toast(T[k].n+'을(를) 먹었다 허기 +'+v);renderInv();save()}else toast(T[k].n+': '+(D[k]||''))}
const EV={herb:4,cooked:35,potato:15,fish:8,mack:12,tuna:18,squid:10,carrot:12,tomato:10,corn:18,berry:8,deep:30,bpotato:25,bcorn:30,stew:50,hfish:40},USE={wood:'뗏목 확장·제작·수리',plastic:'정수기·수집기·물통',rope:'도구 제작·수리',scrap:'시설 제작 · 화로에서 금속으로 제련',cloth:'횃불·랜턴·수집기',seed:'재배 상자에 심기',metal:'고급 도구·발전·엔진',fish:'먹기·굽기',mack:'먹기·굽기',tuna:'먹기·굽기',squid:'먹기·굽기',deep:'먹기·굽기',bpotato:'먹기',bcorn:'먹기',stew:'먹기',hfish:'먹기'};
function renderQS(){}
function showDet(k){const d=$('det');if(!(S.inv[k]>0)){d.classList.remove('on');return}d.dataset.k=k;const cr=R.filter(r=>r.c[k]).map(r=>r.n+(Object.entries(r.c).every(([a,v])=>S.inv[a]>=v)?'✓':'')).join(', ');d.innerHTML=`<b>${ico(k)}${T[k].n} ×${S.inv[k]}</b><div>${D[k]||''}</div><small>사용처: ${USE[k]||'제작 재료'}${cr?' · 제작: '+cr:''}</small><div style="margin-top:.5em">${EV[k]?'<button data-a="eat">먹기</button><button data-a="eq">슬롯 장착</button>':''}<button data-a="x">닫기</button></div>`;d.classList.add('on')}
const HBN=8,HR={hook:46,hook2:72,hook3:100,hook4:140},
TOOLQ=['hook','hook2','hook3','hook4','axe','maxe','spear','mspear','hammer','mhammer','wrench','rod','rod2','pickaxe','cutter','bottle'],
FACQ=[],OLDFAC=['purifier','purifier2','collector','tank','planter','furnace','radio','bed','fuelt','gen','smelter','elamp'],
QI={hook:['🪝','갈고리'],hook2:['🪝','강화'],hook3:['🪝','금속'],hook4:['⚡','전동'],axe:['🪓','돌도끼'],maxe:['🪓','금속도끼'],spear:['🔱','돌창'],mspear:['🗡️','금속창'],hammer:['🔨','돌망치'],mhammer:['🔨','금속망치'],wrench:['🔧','렌치'],rod:['🎣','낚싯대'],rod2:['🎣','고급낚싯대'],pickaxe:['⛏️','곡괭이'],cutter:['✂️','절단기'],bottle:['🥤','물통'],purifier:['💧','정수기'],purifier2:['💧','고급정수'],collector:['🌧️','수집기'],tank:['🛢️','탱크'],planter:['🌱','재배'],furnace:['🔥','화로'],radio:['📻','무전기'],bed:['🛏️','침대'],fuelt:['⛽','연료통'],gen:['⚡','발전기'],smelter:['⚒️','제련로'],elamp:['💡','전등']},
isTool=k=>TOOLQ.includes(k),isFq=k=>FACQ.includes(k),
hbOwn=k=>isTool(k)?!!S.tool[k]:isFq(k)?!!S[FAC[k]]:(S.inv[k]|0)>0,
hbName=k=>k==='hand'?'맨손':(R.find(r=>r.id===k)||T[k]||{n:k}).n,
hbCur=()=>{const i=S.sel,k=i>=0&&S.qs?S.qs[i]:null;return k||'hand'},
curReach=()=>{const k=hbCur();if(k==='hand')return 18;if(k==='axe'||k==='maxe')return hbOwn(k)?18:0;if(HR[k])return hbOwn(k)?(k==='hook4'&&(S.pw|0)<3?HR.hook3:HR[k]):0;return 0};
function renderQS(){const q=S.qs||[],sel=(S.sel>=0&&q[S.sel])?S.sel:-1;
 let h=`<div class="btn q${sel<0?' sel':''}" data-i="-1"><span class="qi">✋</span><span class="ql">맨손</span></div>`;
 for(let i=0;i<HBN;i++){const k=q[i];let c,cl='btn q'+(i===sel?' sel':'');
  if(!k)c='<span class="ql" style="opacity:.4">＋</span>';
  else if(isTool(k)||isFq(k)){const[e,l]=QI[k];if(!hbOwn(k))cl+=' off';c=`<span class="qi">${e}</span><span class="ql">${l}</span>`+(MAXU[k]&&S.tool[k]?`<b>${dur(k)}</b>`:'')}
  else{if(!(S.inv[k]>0))cl+=' off';c=ico(k)+(S.inv[k]>0?'<b>'+S.inv[k]+'</b>':'')}
  h+=`<div class="${cl}" data-i="${i}">${c}</div>`}
 $('qs').innerHTML=h}
function autoEq(k){if(!isTool(k)&&!isFq(k))return-1;const q=S.qs||(S.qs=[]);while(q.length<HBN)q.push(null);let i=q.indexOf(k);if(i>=0)return i;i=q.indexOf(null);if(i<0)return-1;q[i]=k;return i}
function hbInit(){const q=S.qs=(S.qs||[]).slice(0,HBN);while(q.length<HBN)q.push(null);
 if(!S.hbv){S.hbv=1;S.sel=-1;['hook','rod','axe','spear','hammer','wrench','pickaxe','cutter','bottle','hook2','hook3','hook4','maxe','mspear','mhammer','rod2'].forEach(k=>{if(hbOwn(k))autoEq(k)})}
 if(!S.hbv2){S.hbv2=1;for(let i=0;i<q.length;i++)if(OLDFAC.includes(q[i]))q[i]=null;if(hbOwn('bottle'))autoEq('bottle')}
 if(S.sel==null)S.sel=-1}
function hbSelect(i){if(i>=0&&!(S.qs&&S.qs[i]))i=-1;S.sel=i;fs.on=false;pkClose();renderQS();const k=hbCur();toast('선택: '+hbName(k)+(k!=='hand'&&!hbOwn(k)?' (없음)':''));save()}
function pkClose(){$('pk').classList.remove('on');pkI=-2}
let pkI=-2;
function hbPick(i){pkI=i;const q=S.qs||[],cur=q[i],opts=[...TOOLQ,...FACQ].filter(k=>hbOwn(k)&&k!==cur).concat(Object.keys(EV).filter(k=>(S.inv[k]|0)>0&&k!==cur)),
 lab=k=>isTool(k)||isFq(k)?QI[k][0]+' '+hbName(k):ico(k)+hbName(k);
 $('pk').innerHTML=`<b>슬롯 ${i+1}에 넣을 것을 고르자</b>`+opts.map(k=>`<button data-k="${k}">${lab(k)}</button>`).join('')+(cur?'<button data-k="">비우기</button>':'')+'<button data-k="x">닫기</button>'+(opts.length?'':'<span>넣을 도구·시설·음식이 없다</span>');$('pk').classList.add('on')}
function hbSet(i,k){const q=S.qs;if(k)q.forEach((v,j)=>{if(v===k)q[j]=null});q[i]=k||null;if(k)S.sel=i;renderQS();save()}
function hbTap(i){if(i<0){hbSelect(-1);return}const k=(S.qs||[])[i];if(!k||S.sel===i)hbPick(i);else hbSelect(i)}
function equip(k,i){const q=S.qs||(S.qs=Array(HBN).fill(null));if(i===undefined){i=q.indexOf(k);if(i<0){i=q.indexOf(null);if(i<0)i=0}}q[i]=k;renderInv();save();toast(T[k].n+' 장착')}
let dk=null,dx0=0,dy0=0;
$('inv').addEventListener('pointerdown',e=>{const q=e.target.closest('span[data-k]');if(q){dk=q.dataset.k;dx0=e.clientX;dy0=e.clientY}});
addEventListener('pointerup',e=>{if(!dk)return;const k=dk;dk=null;if(Math.hypot(e.clientX-dx0,e.clientY-dy0)<8){showDet(k);return}const q=document.elementFromPoint(e.clientX,e.clientY)?.closest('.q');if(q&&EV[k]&&+q.dataset.i>=0)equip(k,+q.dataset.i)});
$('qs').addEventListener('pointerdown',e=>{const q=e.target.closest('.q');if(!q)return;e.preventDefault();hbTap(+q.dataset.i)});
$('pk').addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b)return;e.preventDefault();const k=b.dataset.k;if(k==='x'){pkClose();return}hbSet(pkI,k||null);pkClose()});
$('det').addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b)return;const k=$('det').dataset.k,a=b.dataset.a;if(a==='eat'){eatK(k);showDet(k)}else if(a==='eq')equip(k);else $('det').classList.remove('on')});
const GOT=()=>S.got||(S.got={}),got=k=>GOT()[k],made=k=>(S.made||{})[k];
const TN=[{id:'prim',n:'원시 도구',i:'rope',p:[],w:'처음부터',ok:()=>true},
 {id:'wood',n:'목재 기술',i:'plank',p:['prim'],w:'돌도끼 + 돌망치 제작',ok:()=>made('axe')&&made('hammer')},
 {id:'bench',n:'작업대',i:'wood',p:['wood'],w:'판자로 작업대 설치',ok:()=>!!S.bn},
 {id:'fishing',n:'낚시',i:'fish',p:['bench'],w:'작업대 + 금속 조각 확보',ok:()=>!!S.bn&&got('shard')},
 {id:'metal',n:'금속 기술',i:'shard',p:['bench'],w:'화로 설치 + 금속 조각 확보',ok:()=>(made('furnace')||!!S.fur)&&got('shard')},
 {id:'forge',n:'제련',i:'metal',p:['metal'],w:'금속 제련로 설치',ok:()=>!!S.sm},
 {id:'precise',n:'정밀 도구',i:'part',p:['forge'],w:'작업대 Lv.2',ok:()=>(S.bl|0)>=2&&!!S.bn},
 {id:'explore',n:'탐험 도구',i:'glass',p:['forge'],w:'제련로 + 유리 확보',ok:()=>got('glass')},
 {id:'electric',n:'전기 기술',i:'elec',p:['precise'],w:'전자 부품 발견 (절단기로 폐선 탐사)',ok:()=>got('elec')},
 {id:'sea',n:'해양 기술',i:'fuel',p:['electric'],w:'기계 부품 + 배터리 확보',ok:()=>got('part')&&got('battery')},
 {id:'adv',n:'고급 생존',i:'battery',p:['sea'],w:'엔진 + 발전 시설 설치',ok:()=>!!S.eng&&(!!S.sol||!!S.gn)}];
const GT={saw:'wood',bench:'wood',chest:'bench',planter:'bench',collector:'bench',tank:'bench',bed:'bench',furnace:'bench',hook2:'bench',rod:'fishing',fishnet:'fishing',smelter:'metal',mhammer:'forge',knife:'forge',mspear:'forge',maxe:'forge',pickaxe:'forge',hook3:'forge',anchor:'forge',fuelt:'forge',rod2:'forge',toolset:'precise',wrench:'precise',cutter:'precise',compass:'explore',telescope:'explore',chart:'explore',solar:'electric',gen:'electric',elamp:'electric',radio:'electric',purifier2:'electric',scanner:'electric',engine:'sea',nav:'sea',hook4:'sea',auto:'adv',afarm:'adv',bigpow:'adv',lrs:'adv',lradio:'adv'};
const EXC={maxe:()=>(S.bl|0)>=2?'':'작업대 Lv.2',radio:()=>(S.bl|0)>=3?'':'작업대 Lv.3',engine:()=>made('toolset')&&S.ft?'':'공구세트+연료통',nav:()=>S.tool.compass&&S.eng?'':'나침반+엔진',chart:()=>S.tool.compass?'':'나침반 필요',lradio:()=>S.rad?'':'무전기 필요'};
const techOn=id=>{S.tn=S.tn||{};return!!S.tn[id]};
function gate(id){const nid=GT[id];if(nid&&!techOn(nid)){const n=TN.find(x=>x.id===nid);return{ok:false,msg:'🔒 '+n.n}}const f=EXC[id],m=f?f():'';return m?{ok:false,msg:m}:{ok:true}}
let techT=0;
function techTick(){S.tn=S.tn||{};const G=GOT(),M=S.made||(S.made={});for(const k in T)if(S.inv[k]>0)G[k]=1;for(const k in S.tool)if(S.tool[k])M[k]=1;for(const f in FAC)if(S[FAC[f]])M[f]=1;
 TN.forEach(n=>{if(!S.tn[n.id]&&n.p.every(p=>S.tn[p])&&n.ok()){S.tn[n.id]=1;if(n.id!=='prim')setTimeout(()=>{toast('🔓 기술 해금: '+n.n);},600)}})}
const hookId=()=>S.tool.hook4&&(S.pw|0)>=3?'hook4':S.tool.hook3?'hook3':S.tool.hook2?'hook2':'hook',reachOf=()=>S.tool.hook4&&(S.pw|0)>=3?140:S.tool.hook3?100:S.tool.hook2?72:S.tool.hook?46:18,PWM=()=>S.tool.bigpow?300:100,nf=o=>o&&Math.hypot(o[0]-S.x,o[1]-S.y)<22;
Object.assign(ICON,{stone:P=>{P(2,3,8,7,O);P(3,4,6,5,'#8c949c');P(3,4,4,1,'#c7ced4');P(3,8,6,1,'#5d656d');P(7,5,2,2,'#6d7780')},
 plank:P=>{P(1,2,10,8,O);P(2,3,8,6,'#c9955a');P(2,3,8,2,'#e0b078');P(2,8,8,1,'#8a5a33');P(3,5,1,1,'#8a5a33')},
 clay:P=>{P(1,3,10,7,O);P(2,4,8,5,'#b8683a');P(2,4,8,1,'#d98a56');P(3,7,3,1,'#8a4a28')},
 shard:P=>{P(2,2,8,8,O);P(3,3,6,6,'#aab4bd');P(3,3,3,1,'#e0e6ea');P(6,6,3,3,'#6d7780');P(4,7,1,1,'#fff')},
 ore:P=>{P(1,2,10,8,O);P(2,3,8,6,'#5a5a64');P(3,4,2,2,'#a0a4b0');P(7,6,2,2,'#c0a070');P(4,7,1,1,'#8a8f9c')},
 cuore:P=>{P(1,2,10,8,O);P(2,3,8,6,'#5a6a5a');P(3,4,2,2,'#4fb39a');P(7,6,2,2,'#d98a56');P(5,7,2,1,'#2f8a72')},
 copper:P=>{P(1,3,10,6,O);P(2,4,8,4,'#d98a56');P(2,4,8,1,'#f0b080');P(2,7,8,1,'#a0502a')},
 elec:P=>{P(1,2,10,8,O);P(2,3,8,6,'#2f8a5a');P(3,4,2,2,'#e8c76a');P(6,4,3,1,'#9fe0b0');P(3,7,6,1,'#9fe0b0');P(7,6,2,2,'#1c2a24')},
 battery:P=>{P(2,2,8,9,O);P(3,3,6,7,'#4a5660');P(4,1,4,2,O);P(5,1,2,1,'#c7ced4');P(4,5,4,3,'#e8c76a');P(4,5,4,1,'#fff3c4')},
 part:P=>{P(2,2,8,8,O);P(3,3,6,6,'#8c949c');P(5,5,2,2,O);P(5,1,2,2,'#c7ced4');P(5,9,2,2,'#c7ced4');P(1,5,2,2,'#c7ced4');P(9,5,2,2,'#c7ced4')},
 fuel:P=>{P(2,2,8,9,O);P(3,3,6,7,'#c9453a');P(3,3,6,2,'#e8806a');P(7,1,3,2,O);P(8,1,1,1,'#c7ced4');P(5,6,2,2,'#f2d36a')},
 paper:P=>{P(2,1,8,10,O);P(3,2,6,8,'#f2ede0');P(4,4,4,1,'#8aa0b0');P(4,6,4,1,'#8aa0b0');P(4,8,3,1,'#8aa0b0')},
 ink:P=>{P(3,3,6,8,O);P(4,4,4,6,'#1c2a5a');P(4,4,4,2,'#3a4a8a');P(4,1,4,3,O);P(5,2,2,1,'#c7ced4')}});
Object.assign(D,{stone:'돌망치·돌도끼·돌창과 화로·제련로의 재료',plank:'목재 톱으로 가공한 판자. 작업대와 금속 도구의 재료',clay:'화로와 제련로의 재료. 섬에서 얻는다',shard:'부유물과 폐선에서 건진 금속 조각. 낚싯대와 제련로에 필요',ore:'곡괭이로 캔 철광석. 제련로에서 금속괴로',cuore:'곡괭이로 캔 구리광석. 제련로에서 구리로',copper:'제련한 구리. 발전·무전기 재료',elec:'폐선에서 회수한 전자 부품. 전기 기술의 열쇠',battery:'작업대에서 만든 배터리. 전기 장비의 핵심',part:'공구 세트로 만든 기계 부품. 엔진·발전기 재료',fuel:'화로에서 만든 연료. 연료통에 넣는다',paper:'천으로 만든 종이. 해도의 재료',ink:'오징어에서 뽑은 잉크. 해도의 재료'});
Object.assign(USE,{stone:'도구·화로·제련로',plank:'작업대·금속 도구·시설',clay:'화로·제련로',shard:'낚싯대·제련로·갈고리',ore:'제련로에서 금속괴로',cuore:'제련로에서 구리로',copper:'발전·배터리·무전기',elec:'배터리·태양광·전등·탐색기',battery:'전동 장비·발전·무전기',part:'엔진·발전기·작업대 Lv.3',fuel:'연료통·엔진·발전기',paper:'해도',ink:'해도',scrap:'시설 제작 · 제련로에서 금속괴로 제련'});
let tab='도구';
const TABS=['도구','식량','물','건축','보관','항해','농업','고급','가공','TECH TREE','일지'],CAT={hook:'도구',rod:'도구',spear:'도구',hammer:'도구',torch:'도구',furnace:'식량',planter:'농업',purifier:'물',collector:'물',tile:'건축',chest:'건축',paddle:'항해',radio:'항해',axe:'도구',bottle:'물',bench:'건축',lantern:'도구',anchor:'건축',tank:'물',bed:'건축',fishnet:'식량',mspear:'도구',maxe:'도구',hook2:'도구',rod2:'도구',solar:'고급',purifier2:'물',engine:'항해',auto:'고급',scanner:'항해',nav:'항해'},TIER2=['collector','planter','chest','bottle','tank','fishnet'],__c=Object.assign(CAT,{saw:'도구',smelter:'건축',mhammer:'도구',knife:'도구',pickaxe:'도구',hook3:'도구',hook4:'도구',toolset:'도구',wrench:'도구',cutter:'도구',compass:'항해',telescope:'항해',chart:'항해',fuelt:'건축',gen:'고급',elamp:'고급',afarm:'고급',bigpow:'고급',lrs:'항해',lradio:'항해'}),TIERS={mspear:3,maxe:3,hook2:3,rod2:3,solar:3,purifier2:3,engine:4,auto:4,scanner:4,nav:4},LOCK={3:'제련 기술 필요',4:'전기 기술 필요'},tierOk=n=>!n||techOn(n<4?'forge':'electric');
let pmode='hand';
const BENCHQ=id=>!!GT[id]&&GT[id]!=='wood',BPR=['paper','part','battery'],FPR=['ingot','ingot2','copper','fuel'],
recs=(t,m)=>R.filter(r=>CAT[r.id]===t&&(r.id!=='radio'||S.rec>0)&&BENCHQ(r.id)===(m==='bench')),
tabVis=t=>pmode==='chest'?t==='보관':pmode==='info'?(t==='TECH TREE'||t==='일지'):pmode==='bench'?(t==='건축'||t==='가공'||(!['보관','TECH TREE','일지'].includes(t)&&recs(t,'bench').length>0)):(['건축','가공'].includes(t)||recs(t,'hand').length>0);
function renderPanel(){techTick();const vis=TABS.filter(tabVis);if(!vis.includes(tab))tab=vis[0];$('box').querySelector('h2').textContent=pmode==='bench'?'작업대 Lv.'+(S.bl||1):pmode==='chest'?'보관 상자':pmode==='info'?'기록':'제작';
 const tabs=vis.length<2?'':`<div class="tabs">${vis.map(c=>`<button data-tab="${c}" class="${c===tab?'on':''}">${c}</button>`).join('')}</div>`;
 const rows=recs(tab,pmode).map(r=>{const own=S.tool[r.id]||(r.id==='purifier'&&S.pur)||(r.id==='furnace'&&S.fur)||(r.id==='collector'&&S.col)||(r.id==='chest'&&S.chs)||(r.id==='planter'&&S.pl)||(r.id==='radio'&&S.rad)||(r.id==='bench'&&S.bn)||(r.id==='lantern'&&S.lan)||(FAC[r.id]&&S[FAC[r.id]]);const gt=gate(r.id),can=!own&&gt.ok&&Object.entries(r.c).every(([k,v])=>S.inv[k]>=v);
  return `<div class="row"><div><b>${r.n}</b><small>${r.d}${TROLE[r.id]?`<br>⚖ ${LTW.includes(r.id)?'가벼움 · 기력 -1':'무거움 · 기력 -2'} · 수리 ${fixTxt(r.id)} · ${TROLE[r.id]}`:''}${MAXU[r.id]&&own?` <i>내구도 ${dur(r.id)}/${MAXU[r.id]}</i>`:''}</small>${Object.entries(r.c).map(([k,v])=>`<i class="${S.inv[k]>=v?'':'no'}">${ico(k)}${T[k].n} ${S.inv[k]}/${v}</i>`).join('')}</div>${MAXU[r.id]&&own&&dur(r.id)<MAXU[r.id]?`<button data-id="fix:${r.id}" ${Object.entries(FIXC(r.id)).every(([m,v])=>(S.inv[m]|0)>=v)?'':'disabled'}>수리 (${fixTxt(r.id)})</button>`:`<button data-id="${r.id}" ${can?'':'disabled'}>${own?'보유':(gt.ok?'제작':gt.msg)}</button>`}</div>`}).join('');
 let ch='';if(tab==='보관')ch=S.chs?'<div class="row"><b>보관함</b><small>5개씩 이동</small></div>'+['wood','plastic','rope','scrap','cloth','seed','fish','mack','squid','tuna','cooked','potato','carrot','tomato','corn','berry','metal','deep','branch','glass','junk','herb','bpotato','bcorn','stew','hfish','stone','plank','clay','shard','ore','cuore','copper','elec','battery','part','fuel','paper','ink'].map(k=>`<div class="row"><div>${ico(k)}${T[k].n} <small>가방 ${S.inv[k]|0} · 상자 ${S.ch[k]|0}</small></div><span><button data-m="put:${k}" ${S.inv[k]>0?'':'disabled'}>넣기</button> <button data-m="take:${k}" ${S.ch[k]>0&&(S.inv[k]|0)<20?'':'disabled'}>꺼내기</button></span></div>`).join(''):'<div class="row"><small>보관 상자를 만들면 여기서 자원을 넣고 뺄 수 있다</small></div>';
 if(tab==='건축'&&pmode!=='bench')ch='<div class="row"><div><b>시설 이동 / 철거</b><small>시설 가까이에서 행동 버튼. 철거하면 재료 절반 회수</small></div><span><button data-dm="move">이동</button> <button data-dm="del">철거</button></span></div>';
 if(tab==='건축')ch+=pmode==='bench'?buRow():rfRow();if(tab==='TECH TREE')ch=rsRows();if(tab==='가공')ch=prRows(pmode);if(tab==='일지')ch=S.log&&S.log.length?S.log.map(x=>'<div class="row"><small>'+x+'</small></div>').join(''):'<div class="row"><small>아직 발견한 기록이 없다</small></div>';
 const hint=pmode==='hand'&&['도구','물','건축','농업','고급','항해','식량'].includes(tab)?'<div class="row"><small>'+(S.bn?'정교한 도구·시설은 설치한 작업대를 눌러서 만든다':'작업대를 설치하면 정교한 도구·시설을 만들 수 있다')+'</small></div>':'';
 $('list').innerHTML=tabs+hint+rows+ch}
const RF=[{wood:3,rope:2},{scrap:3,wood:2,rope:2},{metal:2,scrap:2,rope:2}],CK=[{id:'bpotato',n:'구운 감자',d:'허기 +25',c:{potato:1}},{id:'bcorn',n:'구운 옥수수',d:'허기 +30',c:{corn:1}},{id:'stew',n:'생선 스튜',d:'허기 +50 · 갈증 +10 · 생명력 +10',c:{cooked:1,tomato:1}},{id:'hfish',n:'허브 생선구이',d:'허기 +40 · 부상·감염 치료',c:{cooked:1,herb:1}}];
const BU=[{metal:4,plank:4},{metal:6,copper:2,part:2}];
const chips=c=>Object.entries(c).map(([m,v])=>`<i class="${(S.inv[m]|0)>=v?'':'no'}">${ico(m)}${T[m].n} ${S.inv[m]|0}/${v}</i>`).join('');
function buRow(){if(!S.bn)return'';const lv=S.bl||1,c=BU[lv-1];let msg='';if(lv===1&&!techOn('forge'))msg='제련 기술 필요';else if(lv===2&&!made('toolset'))msg='공구 세트 필요';const can=lv<3&&!msg&&c&&Object.entries(c).every(([m,v])=>(S.inv[m]|0)>=v);return `<div class="row"><div><b>작업대 업그레이드 (현재 Lv.${lv})</b><small>Lv.2: 금속 도구 제작 · Lv.3 고급 작업대: 무전기 제작</small>${c?chips(c):''}</div><button data-bu="1" ${can?'':'disabled'}>${lv>=3?'최대':msg||'Lv.'+(lv+1)}</button></div>`}
function benchUp(){const lv=S.bl||1,c=BU[lv-1];if(!S.bn||!c||lv>=3)return;if(lv===1&&!techOn('forge'))return;if(lv===2&&!made('toolset'))return;for(const m in c)if((S.inv[m]|0)<c[m])return;for(const m in c)S.inv[m]-=c[m];S.bl=lv+1;toast('작업대 Lv.'+S.bl+'로 업그레이드!');renderInv();renderPanel();save()}
const nearO=(o,d=70)=>o&&Math.hypot(o[0]-S.x,o[1]-S.y)<d,nearSm=()=>!S.sm?'제련로 필요':nearO(S.sm)?'':'제련로 가까이',nearBn=()=>!S.bn?'작업대 필요':nearO(S.bn)?'':'작업대 가까이';
const PR=[{id:'plank',n:'판자',d:'통나무 2개를 톱으로 가공',c:{wood:2},o:{plank:1},need:()=>S.tool.saw?'':'목재 톱 필요'},
 {id:'ingot',n:'금속괴 (고철 제련)',d:'고철 3개를 녹여 금속괴 1개',c:{scrap:3},o:{metal:1},need:nearSm},
 {id:'ingot2',n:'금속괴 (철광석)',d:'철광석 2개를 녹여 금속괴 2개',c:{ore:2},o:{metal:2},need:nearSm},
 {id:'copper',n:'구리',d:'구리광석 2개를 녹여 구리 1개',c:{cuore:2},o:{copper:1},need:nearSm},
 {id:'paper',n:'종이',d:'천 2개로 종이 1장',c:{cloth:2},o:{paper:1},need:nearBn},
 {id:'ink',n:'잉크',d:'오징어 1마리에서 잉크 2개 (금속 칼)',c:{squid:1},o:{ink:2},need:()=>S.tool.knife?'':'금속 칼 필요'},
 {id:'fuel',n:'연료',d:'부유물과 나뭇가지를 화로에서 태워 연료로',c:{junk:2,branch:2},o:{fuel:1},need:()=>!S.fur?'화로 필요':nearO(S.fur)?'':'화로 가까이'},
 {id:'part',n:'기계 부품',d:'금속괴와 고철을 공구 세트로 가공',c:{metal:2,scrap:2},o:{part:1},need:()=>!S.tool.toolset?'공구 세트 필요':nearBn()},
 {id:'battery',n:'배터리',d:'금속·구리·전자 부품을 조립',c:{metal:1,copper:1,elec:1},o:{battery:1},need:()=>!techOn('electric')?'전기 기술 필요':nearBn()}];
function prRows(m){return '<div class="row"><div><b>가공</b><small>도구·시설 가까이에서 재료를 가공한다</small></div></div>'+PR.filter(p=>!FPR.includes(p.id)&&BPR.includes(p.id)===(m==='bench')).map(p=>{const msg=p.need(),out=Object.keys(p.o)[0],can=!msg&&Object.entries(p.c).every(([k,v])=>(S.inv[k]|0)>=v)&&(S.inv[out]|0)<20;return `<div class="row"><div><b>${ico(out)}${p.n}</b><small>${p.d}</small>${chips(p.c)}</div><button data-pr="${p.id}" ${can?'':'disabled'}>${msg||'가공'}</button></div>`}).join('')}
function proc(id){const p=PR.find(x=>x.id===id);if(!p||p.need())return;for(const k in p.c)if((S.inv[k]|0)<p.c[k])return;const out=Object.keys(p.o)[0];if((S.inv[out]|0)>=20){toast('가방이 가득 찼다');return}for(const k in p.c)S.inv[k]-=p.c[k];for(const k in p.o)S.inv[k]=(S.inv[k]|0)+p.o[k];toast(p.n+' 완성! '+T[out].n+' +'+p.o[out]);renderInv();renderPanel();save()}
let tnSel=null;
const hv=id=>!!(S.tool[id]||(FAC[id]&&S[FAC[id]])),PATHS=[['생존',[['낚시','rod'],['요리','furnace'],['농업','planter'],['자동 재배','afarm']]],['탐험',[['갈고리','hook'],['망원경','telescope'],['나침반','compass'],['엔진','engine'],['항해 장비','nav']]],['기술',[['금속 제련','smelter'],['전기','solar'],['발전','gen'],['무전기','radio'],['장거리 무전기','lradio']]]];
function tnNode(id,top){const n=TN.find(x=>x.id===id),on=techOn(id),kids=TN.filter(x=>x.p[0]===id),ic=on?ico(n.i):`<span style="filter:brightness(0);opacity:.55">${ico(n.i)}</span>`;
 return `<div class="${top?'':'tt'}"><button class="tn ${on?'on':''} ${tnSel===id?'sel':''}" data-tn="${id}">${ic}${on?n.n:'■■■'}</button>${kids.map(k=>tnNode(k.id)).join('')}</div>`}
function tnDetail(){if(!tnSel)return'<div class="row"><small>노드를 눌러 해금 조건과 제작 목록을 확인하자. 잠긴 기술은 실루엣으로 보인다.</small></div>';
 const n=TN.find(x=>x.id===tnSel),on=techOn(n.id),rc=R.filter(r=>GT[r.id]===n.id),pre=n.p.map(q=>(techOn(q)?'✓ ':'✗ ')+TN.find(x=>x.id===q).n).join(', ');
 return `<div class="row"><div><b>${on?ico(n.i)+n.n+' <i>해금됨</i>':'■■■ <i class="no">잠김</i>'}</b><small>해금 조건: ${n.w}</small>${n.p.length?`<small>선행 기술: ${pre}</small>`:''}${rc.length?`<small>${on?'제작':'열리면 제작 가능'}: ${rc.map(r=>on?((hv(r.id))?'✓ ':'')+r.n:'???').join(', ')}</small>`:''}</div></div>`}
function rsRows(){const path=PATHS.map(([nm,a])=>`<small><b>${nm}</b> ${a.map(([l,id])=>`<span class="ptag ${hv(id)?'ok':''}">${hv(id)?'✓':'○'}${l}</span>`).join('→ ')}</small>`).join('');
 return tnDetail()+'<div style="padding:calc(var(--u)*2) 0">'+tnNode('prim',true)+'</div><div class="row"><div><b>발전 경로</b>'+path+'<small>세 경로는 후반부에 다시 만난다 — 엔진·발전·자동 재배를 갖추면 고급 생존 기술이 열린다.</small></div></div>'}
function rfTile(){let b=null,bd=1e9;S.tiles.forEach(k=>{const[p,q]=k.split(',').map(Number),d=Math.hypot(p*16+8-S.x,q*16+8-S.y);if(d<bd){bd=d;b=k}});return b}
function rfRow(){const k=rfTile();if(!k)return'';const lv=(S.rf&&S.rf[k])|0,c=RF[lv],can=lv<3&&!(lv===2&&!tierOk(3))&&!(lv>=1&&!S.tool.mhammer)&&Object.entries(c||{}).every(([m,v])=>(S.inv[m]|0)>=v);return `<div class="row"><div><b>뗏목 강화 (서 있는 타일)</b><small>타일을 보강해 상어·폭풍 피해를 줄인다 · 현재 Lv${lv}/3 (피해 -${lv*25}%) · 내구도 +20</small>${c?Object.entries(c).map(([m,v])=>`<i class="${(S.inv[m]|0)>=v?'':'no'}">${ico(m)}${T[m].n} ${S.inv[m]|0}/${v}</i>`).join(''):''}</div><button data-rf="1" ${can?'':'disabled'}>${lv>=3?'최대':lv>=1&&!S.tool.mhammer?'금속 망치 필요':lv===2&&!tierOk(3)?LOCK[3]:'강화 Lv'+(lv+1)}</button></div>`}
function reinforce(){const k=rfTile();if(!k)return;S.rf=S.rf||{};const lv=S.rf[k]|0;if(lv>=3){toast('이미 최대 강화다');return}if(lv>=1&&!S.tool.mhammer){toast('Lv.2 이상은 금속 망치가 필요하다');return}if(lv===2&&!tierOk(3)){toast(LOCK[3]);return}const c=RF[lv];for(const m in c)if((S.inv[m]|0)<c[m]){toast('재료가 부족하다');return}for(const m in c)S.inv[m]-=c[m];S.rf[k]=lv+1;S.dur[k]=Math.min(100,(S.dur[k]??100)+20);toast('타일 강화 Lv'+(lv+1)+'! 상어·파도 피해 -'+25*(lv+1)+'%');renderInv();renderPanel();save()}
function ckRows(){const near=S.fur&&Math.hypot(S.fur[0]-S.x,S.fur[1]-S.y)<60;return '<div class="row"><div><b>요리</b><small>화로 가까이에서 재료를 조합한다</small></div></div>'+CK.map(r=>{const can=near&&Object.entries(r.c).every(([k,v])=>(S.inv[k]|0)>=v)&&(S.inv[r.id]|0)<20;return `<div class="row"><div><b>${ico(r.id)}${r.n}</b><small>${r.d}</small>${Object.entries(r.c).map(([k,v])=>`<i class="${(S.inv[k]|0)>=v?'':'no'}">${ico(k)}${T[k].n} ${S.inv[k]|0}/${v}</i>`).join('')}</div><button data-ck="${r.id}" ${can?'':'disabled'}>${!S.fur?'화로 필요':near?'요리':'화로 가까이'}</button></div>`}).join('')}
function cook(id){const r=CK.find(x=>x.id===id);if(!r||!S.fur||Math.hypot(S.fur[0]-S.x,S.fur[1]-S.y)>=60)return;for(const k in r.c)if((S.inv[k]|0)<r.c[k])return;for(const k in r.c)S.inv[k]-=r.c[k];S.inv[id]=(S.inv[id]|0)+1;toast(r.n+' 완성!');renderInv();renderPanel();save()}
function mv(m){const[d,k]=m.split(':');if(d==='put'){const n=Math.min(5,S.inv[k]|0);S.inv[k]-=n;S.ch[k]=(S.ch[k]|0)+n}else{const n=Math.min(5,S.ch[k]|0,20-(S.inv[k]|0));S.ch[k]-=n;S.inv[k]=(S.inv[k]|0)+n}renderInv();renderPanel();save()}
function setPanel(v,m){panelOn=v;if(v){pmode=m||'hand';build=false;dm=null;if(mvd){S[FAC[mvd.id]]=mvd.d;mvd=null}}$('panel').classList.toggle('on',v);if(v)renderPanel()}

function craft(id){if(id.startsWith('fix:')){fix(id.slice(4));return}
const r=R.find(x=>x.id===id);if(!r)return;for(const k in r.c)if(S.inv[k]<r.c[k])return;
 if(FAC[id]||id==='tile'){startBuild(id);return}
 else{S.tool[id]=1;(S.made=S.made||{})[id]=1}
 for(const k in r.c)S.inv[k]-=r.c[k];const q0=(S.qs||[]).indexOf(id),ai=autoEq(id);toast(r.n+' 완성!'+(ai>=0&&q0<0?' → 슬롯 '+(ai+1):''));renderInv();renderPanel();save()}
$('list').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.tn){tnSel=tnSel===b.dataset.tn?null:b.dataset.tn;renderPanel()}else if(b.dataset.tab){tab=b.dataset.tab;renderPanel()}else if(b.dataset.dm){setPanel(false);dm=b.dataset.dm;toast('시설 가까이에서 행동 버튼 ('+(dm==='del'?'철거':'이동')+'). 취소: 제작/C')}else if(b.dataset.m)mv(b.dataset.m);else if(b.dataset.rf)reinforce();else if(b.dataset.ck)cook(b.dataset.ck);else if(b.dataset.pr)proc(b.dataset.pr);else if(b.dataset.bu)benchUp();else craft(b.dataset.id)});

let build=false,bt=null,dm=null,mvd=null,PF=[];
const FAC={purifier:'pur',furnace:'fur',collector:'col',chest:'chs',planter:'pl',radio:'rad',bench:'bn',lantern:'lan',solar:'sol',purifier2:'pu2',engine:'eng',auto:'aut',tank:'tnk',bed:'bd',fishnet:'fn',smelter:'sm',fuelt:'ft',gen:'gn',elamp:'el'},occ=()=>Object.values(FAC).map(k=>S[k]).filter(Boolean);
function cands(){if(build&&build!=='tile')return S.tiles.filter(k=>{const[p,q]=k.split(',').map(Number);return!occ().some(o=>o[0]===p*16+8&&o[1]===q*16+8)});const c=[];S.tiles.forEach(k=>{const[p,q]=k.split(',').map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const n=(p+a)+','+(q+b);if(!has(p+a,q+b)&&!c.includes(n))c.push(n)})});return c}
function pickC(){const x=bt?bt.x:S.x+face.x*26,y=bt?bt.y:S.y+face.y*26;let b=null,bd=1e9;cands().forEach(k=>{const[p,q]=k.split(',').map(Number),d=Math.hypot(p*16+8-x,q*16+8-y);if(d<bd){bd=d;b=k}});return b}
function startBuild(id){if(id==='tile'&&S.tiles.length>=20){toast('뗏목이 최대 크기입니다');return}build=id||'tile';if(!cands().length){build=false;toast('설치할 빈 타일이 없다');return}setPanel(false);rowing=false;fs.on=false;toast('설치할 칸을 터치하거나 방향+행동 (취소: 제작/C)')}
function place(){const k=pickC();if(!k){build=false;return}const id=build,r=R.find(x=>x.id===id),mv=mvd&&mvd.id===id,c=id==='tile'?{wood:4}:mv?{}:r.c;for(const m in c)if(S.inv[m]<c[m]){build=false;toast('재료가 부족하다');return}for(const m in c)S.inv[m]-=c[m];if(id==='tile')S.tiles.push(k);else{const[p,q]=k.split(',').map(Number),pos=[p*16+8,q*16+8];S[FAC[id]]=id==='planter'?[...pos,...(mv?mvd.d.slice(2):[0,0,0])]:pos;if(id==='collector'&&!mv)S.colW=0}{const[kp,kq]=k.split(',').map(Number);PF.push({x:kp*16+8,y:kq*16+8,t});if(id!=='tile')(S.made=S.made||{})[id]=1}mvd=null;build=false;bt=null;const q0=(S.qs||[]).indexOf(id),ai=autoEq(id);toast(r.n+(mv?' 이동!':' 설치!')+(ai>=0&&q0<0?' → 슬롯 '+(ai+1):''));renderInv();save()}
function doDm(){let bk=null,bd=24;for(const id in FAC){const o=S[FAC[id]];if(!o)continue;const d=Math.hypot(o[0]-S.x,o[1]-S.y);if(d<bd){bd=d;bk=id}}if(!bk){toast('가까이 시설이 없다 (취소: 제작/C)');return}const f=FAC[bk],data=S[f],r=R.find(x=>x.id===bk);
 if(dm==='del'){for(const m in r.c)S.inv[m]=(S.inv[m]|0)+Math.floor(r.c[m]/2);S[f]=null;if(S.brk)delete S.brk[bk];if(bk==='chest'){for(const m in S.ch)S.inv[m]=(S.inv[m]|0)+S.ch[m];S.ch={}}toast(r.n+' 철거 (재료 절반 회수)');renderInv();save()}
 else{S[f]=null;mvd={id:bk,d:data};dm=null;startBuild(bk)}}
cv.addEventListener('pointerdown',e=>{if(!build)return;const r=cv.getBoundingClientRect();bt={x:(e.clientX-r.left)/r.width*VW+ox,y:(e.clientY-r.top)/r.height*VH+oy}});

const FTAP=['purifier','purifier2','collector','tank','planter','furnace','radio','bed','fuelt','gen','smelter','elamp'];
cv.addEventListener('pointerdown',e=>{if(build||dm||panelOn||dead||ex)return;const r=cv.getBoundingClientRect(),wx=(e.clientX-r.left)/r.width*VW+ox,wy=(e.clientY-r.top)/r.height*VH+oy;
 let hit=null,bd=1e9;
 [...FTAP,'chest','bench'].forEach(id=>{const o=S[FAC[id]];if(!o)return;const dx=wx-o[0],dy=wy-o[1];if(Math.abs(dx)<=9&&dy>=-14&&dy<=9){const d=Math.hypot(dx,dy+3);if(d<bd){bd=d;hit=id}}});
 if(!hit){fmClose();return}if(hit!==fmId)fmClose();if(hit==='chest'){tab='보관';setPanel(true,'chest');return}if(hit==='bench'){if(Math.hypot(S.bn[0]-S.x,S.bn[1]-S.y)<40)setPanel(true,'bench');else toast('작업대 가까이 가서 누르자');return}useFac(hit)});

let fmId=null,fmH='',fmT=0;
const costTxt=c=>Object.entries(c).map(([k,v])=>T[k].n+' '+(S.inv[k]|0)+'/'+v).join(' · ');
function prAct(p){const out=Object.keys(p.o)[0],msg=p.need();return{l:p.n,sub:(msg||p.d)+' · '+costTxt(p.c),on:!msg&&Object.entries(p.c).every(([k,v])=>(S.inv[k]|0)>=v)&&(S.inv[out]|0)<20,f:()=>proc(p.id)}}
const FACMENU={
 purifier:()=>({t:'💧 간이 정수기',st:purCd>0?'정수 중… '+Math.ceil(purCd)+'초':'바닷물을 식수로 바꾼다',a:[
  {l:'물 마시기',sub:'갈증 +35',on:purCd<=0&&S.th<100,f:()=>{S.th=Math.min(100,S.th+35);purCd=8;toast('식수를 마셨다 갈증 +35')}},
  {l:'물통에 담기',sub:S.tool.bottle?'물통 '+Math.round(S.bw||0)+'% (+40)':'물통이 필요하다',on:purCd<=0&&!!S.tool.bottle&&(S.bw||0)<100,f:()=>{S.bw=Math.min(100,(S.bw||0)+40);purCd=8;toast('물통에 물을 담았다 ('+Math.round(S.bw)+'%)')}}]}),
 planter:()=>{const P=S.pl,st=P[2];return{t:'🌱 재배 상자',st:st===0?'비어 있음':st===1?'자라는 중 · 성장 '+Math.round(P[3]||0)+'% · '+(P[4]>0?'촉촉함':'물이 필요하다'):'다 자랐다 ('+T[P[5]||'potato'].n+')',a:[
  {l:'씨앗 심기',sub:st===0?'씨앗 '+(S.inv.seed|0)+'개':'이미 심겨 있다',on:st===0&&S.inv.seed>0,f:plant},
  {l:'물 주기',sub:st!==1?'자라는 중일 때':P[4]>20?'아직 촉촉하다':'수집기 물 15% (현재 '+Math.floor(S.colW||0)+'%)',on:st===1&&P[4]<=20&&(S.colW||0)>=15,f:waterPl},
  {l:'수확하기',sub:st===2?'×3':'아직 다 자라지 않았다',on:st===2,f:harvest}]}},
 furnace:()=>{const rw=['deep','tuna','mack','squid','fish'].find(k=>S.inv[k]>0),n=rw?(rw==='deep'?3:rw==='tuna'?2:1)+(S.tool.knife?1:0):0,
  a=[{l:'생선 굽기',sub:rw?T[rw].n+' → 구운 생선 ×'+n:'구울 생선이 없다',on:!!rw,f:()=>{const r=['deep','tuna','mack','squid','fish'].find(k=>S.inv[k]>0);if(!r)return;S.inv[r]--;const m=(r==='deep'?3:r==='tuna'?2:1)+(S.tool.knife?1:0);if(S.tool.knife)use('knife');S.inv.cooked=(S.inv.cooked|0)+m;toast(T[r].n+'을(를) 구웠다 +'+m);renderInv();save()}}];
  CK.forEach(r=>a.push({l:r.n,sub:r.d+' · '+costTxt(r.c),on:Object.entries(r.c).every(([k,v])=>(S.inv[k]|0)>=v)&&(S.inv[r.id]|0)<20,f:()=>cook(r.id)}));
  a.push(prAct(PR.find(p=>p.id==='fuel')));return{t:'🔥 화로',st:'굽기 · 요리 · 연료 만들기',a}},
 collector:()=>{const w=S.colW||0;return{t:'🌧️ 빗물 수집기',st:'모인 물 '+Math.floor(w)+'%'+(S.tnk?' · 넘치면 탱크로':''),a:[
  {l:'물 마시기',sub:'갈증 +최대 '+Math.round(Math.min(w,100-S.th))+' (10% 이상 필요)',on:w>=10&&S.th<100,f:()=>{const a=Math.min(S.colW,100-S.th);S.th+=a;S.colW-=a;toast('빗물을 마셨다 갈증 +'+Math.round(a))}},
  {l:'물통에 담기',sub:S.tool.bottle?'물통 '+Math.round(S.bw||0)+'% (+최대 40)':'물통이 필요하다',on:w>=5&&!!S.tool.bottle&&(S.bw||0)<100,f:()=>{const a=Math.min(S.colW,40,100-(S.bw||0));S.colW-=a;S.bw=(S.bw||0)+a;toast('물통에 담았다 ('+Math.round(S.bw)+'%)');save()}}]}},
 tank:()=>{const w=S.tkW||0;return{t:'🛢️ 물 저장 탱크',st:'저장수 '+Math.round(w)+' / 200',a:[
  {l:'물 마시기',sub:'갈증 +최대 '+Math.round(Math.min(w,100-S.th)),on:w>=1&&S.th<100,f:()=>{const a=Math.min(S.tkW,100-S.th);S.th+=a;S.tkW-=a;toast('저장수를 마셨다 갈증 +'+Math.round(a))}},
  {l:'물통에 담기',sub:S.tool.bottle?'물통 '+Math.round(S.bw||0)+'% (+최대 40)':'물통이 필요하다',on:w>=1&&!!S.tool.bottle&&(S.bw||0)<100,f:()=>{const a=Math.min(S.tkW,40,100-(S.bw||0));S.tkW-=a;S.bw=(S.bw||0)+a;toast('물통에 담았다 ('+Math.round(S.bw)+'%)');save()}}]}},
 purifier2:()=>{const pw=S.pw|0;return{t:'💧 고급 정수기',st:'전력 '+pw+' · 1회 전력 20',a:[
  {l:'물 마시기',sub:'갈증 +60 · 전력 20',on:pw>=20&&purCd<=0&&S.th<100,f:()=>{S.pw-=20;S.th=Math.min(100,S.th+60);purCd=2;toast('고급 정수기: 갈증 +60')}},
  {l:'물통에 담기',sub:S.tool.bottle?'물통 '+Math.round(S.bw||0)+'% (+60) · 전력 20':'물통이 필요하다',on:pw>=20&&purCd<=0&&!!S.tool.bottle&&(S.bw||0)<100,f:()=>{S.pw-=20;S.bw=Math.min(100,(S.bw||0)+60);purCd=2;toast('물통에 담았다 ('+Math.round(S.bw)+'%)');save()}}]}},
 smelter:()=>({t:'⚒️ 금속 제련로',st:'고철·광석을 녹여 금속을 얻는다',a:['ingot','ingot2','copper'].map(id=>prAct(PR.find(p=>p.id===id)))})
},
FMPOS={planter:()=>S.pl,purifier:()=>S.pur,furnace:()=>S.fur,smelter:()=>S.sm,collector:()=>S.col,tank:()=>S.tnk,purifier2:()=>S.pu2};
function fmRender(){if(!fmId)return;const d=FACMENU[fmId](),h=`<b>${d.t}</b>`+(d.st?`<small class="fs">${d.st}</small>`:'')+'<div class="fg">'+d.a.map((a,i)=>`<button data-i="${i}" ${a.on?'':'disabled'}><span>${a.l}</span><small>${a.sub||''}</small></button>`).join('')+'</div><button data-x="1" class="fx">닫기</button>';
 if(h===fmH&&$('fm').classList.contains('on'))return;const top=$('fm').scrollTop;fmH=h;$('fm').innerHTML=h;$('fm').classList.add('on');$('fm').scrollTop=top}
function fmOpen(id){fmId=id;fmH='';fmT=.4;pkClose();$('det').classList.remove('on');fmRender()}
function fmClose(){fmId=null;fmH='';$('fm').classList.remove('on')}
function fmTick(dt){if(!fmId)return;if(panelOn||dead||build||dm||ex){fmClose();return}const o=FMPOS[fmId]();if(!o||Math.hypot(o[0]-S.x,o[1]-S.y)>34){fmClose();return}fmT-=dt;if(fmT<=0){fmT=.4;fmRender()}}
$('fm').addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b||b.disabled||!fmId)return;e.preventDefault();if(b.dataset.x){fmClose();return}const a=FACMENU[fmId]().a[+b.dataset.i];if(a&&a.on){actT=.25;a.f()}fmH='';fmRender()});
function useFac(k){if(dead||panelOn||ex||build||dm)return;
 const dist=o=>o?Math.hypot(o[0]-S.x,o[1]-S.y):1e9,far=n=>toast(n+' 가까이 가서 누르자');
 actT=.25;
 const MN={planter:[S.pl,22,'재배 상자'],purifier:[S.pur,24,'간이 정수기'],furnace:[S.fur,24,'화로'],smelter:[S.sm,22,'제련로'],collector:[S.col,24,'빗물 수집기'],tank:[S.tnk,22,'물 저장 탱크'],purifier2:[S.pu2,22,'고급 정수기']};
 if(MN[k]){if(dist(MN[k][0])<MN[k][1])fmOpen(k);else{fmClose();far(MN[k][2])}return}
 fmClose();
 if(k==='fuelt'){if(nf(S.ft)){if(S.inv.fuel>0&&(S.fl||0)<=70){S.inv.fuel--;S.fl=Math.min(100,(S.fl||0)+30);toast('연료를 넣었다 ('+Math.round(S.fl)+'%)');renderInv();save()}else toast((S.fl||0)>70?'연료통이 가득하다':'연료가 없다 (화로를 눌러 만들자) · 연료통 '+Math.round(S.fl||0)+'%')}else far('연료통');return}
 if(k==='gen'){if(nf(S.gn))toast('발전기: '+((S.fl||0)>0?'밤에 가동 중':'연료가 없다')+' · 전력 '+Math.round(S.pw||0));else far('발전기');return}
 if(k==='elamp'){if(nf(S.el))toast('전등: 밤에 전력으로 밝힌다 · 전력 '+Math.round(S.pw||0));else far('전등');return}
 if(k==='bed'){if(dist(S.bd)<22){if(sleepCd>0)toast('아직 졸리지 않다 ('+Math.ceil(sleepCd)+'초)');else{S.st=100;S.hp=Math.min(100,S.hp+20);S.tm+=40;S.hu=Math.max(0,S.hu-8);S.th=Math.max(0,S.th-10);sleepCd=60;flash=.6;toast('잠시 눈을 붙였다. 기력·체력 회복 (허기·갈증 소모)');save()}}else far('침대');return}
 if(k==='tank'){if(dist(S.tnk)<22){const a=Math.min(S.tkW||0,100-S.th);if(a<1)toast(S.tkW>0?'갈증이 없다':'탱크가 비었다 (수집기에서 넘친 물이 모인다)');else{S.th+=a;S.tkW-=a;toast('저장수를 마셨다 갈증 +'+Math.round(a))}}else far('물 저장 탱크');return}
 if(k==='purifier2'){if(dist(S.pu2)<22){if(purCd>0)toast('정수 중…');else if((S.pw|0)<20)toast('전력이 부족하다 (태양광 발전기 필요)');else{S.pw-=20;S.th=Math.min(100,S.th+60);purCd=2;toast('고급 정수기: 갈증 +60')}}else far('고급 정수기');return}
 if(k==='radio'){if(dist(S.rad)<22)useRadio();else far('무전기');return}
 if(k==='collector'){if(dist(S.col)<24){const w=S.colW||0;if(w<10)toast('빗물이 아직 모자란다 ('+Math.floor(w)+'%)');else{const a=Math.min(w,100-S.th);if(a<1)toast('갈증이 없다');else{S.th+=a;S.colW=w-a;toast('빗물을 마셨다 갈증 +'+Math.round(a))}}}else far('빗물 수집기');return}
 }
function pickUp(reach,hk,ax){let best=null,bd=1e9;items.forEach(i=>{const d=Math.hypot(i.x-S.x,i.y-(S.y-6));if(d<reach&&d<bd){bd=d;best=i}});
 if(!best)return false;
 if(best.k!=='crate'&&S.inv[best.k]>=20){toast('가방이 가득 찼다 (20) — 보관함에 넣자');return true}
 if(best.k==='crate'&&bd>18&&!(hk==='hook3'||hk==='hook4')){toast('보급 상자는 무거워 끌어올 수 없다 (금속 갈고리를 고르자, 가까이서는 맨손으로 줍기 가능)');return true}
 if(hk==='hook4'&&bd>16&&(S.pw|0)<3){toast('전력이 부족하다 (전동 갈고리는 전력 3 필요)');return true}
 items.splice(items.indexOf(best),1);let gain=1;
 if(best.k==='crate')crate();else{S.inv[best.k]++;if(best.k==='wood'&&ax){const bn=ax==='maxe'?2:1;S.inv.wood=Math.min(20,S.inv.wood+bn);gain=1+bn;use(ax);}}
 if(bd>16&&hk){hookFx={x:best.x,y:best.y,t:.18};if(hk==='hook4')S.pw=Math.max(0,S.pw-3);use(hk)}
 if(best.k!=='crate'){toast('+'+gain+' '+T[best.k].n)}
 renderInv();save();return true}
function act(){if(dead||panelOn||ex)return;actT=.25;if(build){place();return}if(dm){doDm();return}
 const k=hbCur();
 if(k!=='hand'&&!hbOwn(k)){toast(hbName(k)+'이(가) 없다. 슬롯을 눌러 다른 것을 고르자');return}
 if(EV[k]){eatK(k);return}
 const dist=o=>o?Math.hypot(o[0]-S.x,o[1]-S.y):1e9,far=n=>toast(n+' 가까이에서 쓰자');
 if(k==='hand'||k==='axe'||k==='maxe'){if(pickUp(18,null,k==='hand'?null:k))return;if(k==='hand'){const il=nearIsl();if(il&&!il.done){explore(il,null);return}toast('주울 것이 없다 (갈고리를 고르면 먼 곳도 닿는다)')}else toast('가까이 주울 것이 없다 (도끼는 도끼를 선택하고 나무를 주울 때 더 얻는다)');return}
 if(HR[k]){if(pickUp(HR[k],k,null))return;toast('범위 안에 주울 것이 없다');return}
 if(k==='spear'||k==='mspear'){const ms=k==='mspear';
  if(jf&&dist([jf.x,jf.y])<34){jf.hp-=ms?2:1;use(k);hookFx={x:jf.x,y:jf.y,t:.18};if(jf.hp<=0){S.inv.cloth=(S.inv.cloth|0)+1;jf=null;jfT=70;toast('해파리를 쫓아냈다 (+천 1)');renderInv()}else toast('해파리를 찔렀다!');return}
  if(shark&&shark.st!=='flee'&&dist([shark.x,shark.y])<36){shark.st='flee';shark.bites+=ms?9:1;toast('창으로 상어를 쫓아냈다!');hookFx={x:shark.x,y:shark.y,t:.18};use(k);return}
  toast('쫓아낼 상어·해파리가 가까이 없다');return}
 if(k==='wrench'||k==='hammer'||k==='mhammer'){const bn2=brkNear();
  if(bn2){if(k==='wrench'){delete S.brk[bn2];toast(R.find(x=>x.id===bn2).n+' 렌치로 수리 완료');save();return}
   if(S.inv.scrap>=1&&S.inv.wood>=1){S.inv.scrap--;S.inv.wood--;delete S.brk[bn2];toast(R.find(x=>x.id===bn2).n+' 수리 완료');renderInv();save()}else toast('고장났다: 나무 1·고철 1로 수리 (렌치는 재료 없이 수리)');return}
  if(k==='wrench'){toast('고장난 시설이 가까이 없다');return}
  let bk=null,bd2=1e9;S.tiles.forEach(t2=>{if((S.dur[t2]??100)<100){const[p,q]=t2.split(',').map(Number),d=Math.hypot(p*16+8-S.x,q*16+8-S.y);if(d<bd2){bd2=d;bk=t2}}});
  if(bk&&bd2<22){if(S.inv.wood<1)toast('수리에는 나무 1개가 필요하다');else{S.inv.wood--;S.dur[bk]=Math.min(100,S.dur[bk]+(k==='mhammer'?60:30));toast('뗏목을 수리했다');use(k);renderInv();save()}return}
  toast('수리할 곳이 가까이 없다 (금간 타일·고장난 시설)');return}
 if(k==='rod'||k==='rod2'){if(fs.on){if(fs.bite>0){reel();return}fs.on=false;toast('낚싯줄을 거두었다');return}
  if(!ok(S.x+face.x*14,S.y+face.y*14)){fs={on:true,t:2+Math.random()*3,bite:0,k:pickFish(k),rt:k};toast('찌를 던졌다…')}else toast('물가에서 바다를 향해 던지세요');return}
 if(k==='pickaxe'||k==='cutter'){const il=nearIsl();if(il&&!il.done)explore(il,k);else toast('탐사할 섬·폐선이 가까이 없다');return}
 if(k==='bottle'){const w=S.bw||0;if(w<=0)toast('물통이 비었다 (정수기·빗물을 담자)');else if(S.th>=100)toast('갈증이 없다');else{const x=Math.min(w,100-S.th);S.bw=w-x;S.th+=x;toast('물통의 물을 마셨다 갈증 +'+Math.round(x));renderInv();save()}return}
 toast('이 도구는 행동 버튼으로 쓰지 않는다')}
const BW_PLACEHOLDER=0;
const BW={fish:1.3,mack:1.1,squid:1,tuna:.75,deep:.65},FC2={fish:6,mack:8,squid:8,tuna:14,deep:18},pickFish=rt=>{const r=Math.random(),h=rt==='rod2',q=h?[.4,.65,.82]:[.55,.8,.93];return h&&Math.random()<.07?'deep':r<q[0]?'fish':r<q[1]?'mack':r<q[2]?'squid':'tuna'};
function reel(){fs.on=false;const k=fs.k||pickFish();if((k==='tuna'||k==='deep')&&S.st<15){toast('기력이 모자라 대어를 놓쳤다! (기력 15 이상 필요)');return}use(fs.rt||(S.tool.rod2?'rod2':'rod'));S.st=Math.max(0,S.st-(FC2[k]||8));if(S.inv[k]>=20){toast('가방이 가득 찼다');return}cfx={k,t:0,x:S.x+face.x*22,y:S.y+face.y*22};S.inv[k]++;toast(T[k].n+(k==='tuna'?'! 대어다':'')+' +1');renderInv();save()}
function eat(){if(dead||panelOn)return;if(S.bw>0&&S.th<70){const a=Math.min(S.bw,100-S.th);S.bw-=a;S.th+=a;toast('물통의 물을 마셨다 갈증 +'+Math.round(a));save();return}const mk=['stew','hfish','bcorn','bpotato'].find(k=>S.inv[k]>0);if(mk){eatK(mk);return}if(S.inv.cooked>0){S.inv.cooked--;S.inf=0;S.hu=Math.min(100,S.hu+35);toast('구운 생선을 먹었다 허기 +35')}else if(S.inv.potato>0){S.inv.potato--;S.hu=Math.min(100,S.hu+15);toast('감자를 먹었다 허기 +15')}
 else if(CR.some(k=>S.inv[k]>0)){const k=CR.find(k=>S.inv[k]>0);S.inv[k]--;S.hu=Math.min(100,S.hu+CV[k]);if(k==='tomato'||k==='berry')S.th=Math.min(100,S.th+6);toast(T[k].n+'을(를) 먹었다 허기 +'+CV[k])}
 else if(['mack','squid','tuna','fish'].some(k=>S.inv[k]>0)){const k=['mack','squid','tuna','fish'].find(k=>S.inv[k]>0);S.inv[k]--;S.hu=Math.min(100,S.hu+{fish:8,mack:12,squid:10,tuna:18}[k]);if(Math.random()<.2)S.inf=90;toast('날것을 먹었다 허기 +'+{fish:8,mack:12,squid:10,tuna:18}[k])}else{toast('먹을 것이 없다');return}renderInv();save()}

// input
const keys={};let jx=0,jy=0,runB=false,runNow=false;
addEventListener('keydown',e=>{if(e.repeat)return;const k=e.key.toLowerCase();keys[k]=1;if(k==='e'||k===' ')act();if(k==='f')eat();if(k>='1'&&k<='8')hbSelect(+k-1);if(k==='0')hbSelect(-1);if(k==='r')toggleRow();if(k==='c')setPanel(!panelOn&&!dead);if(k==='i')setPanel(!panelOn&&!dead,'info');if(k==='escape'){setPanel(false);fmClose();pkClose()}});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=0});
const joy=$('joy');
function jmove(e){const r=joy.getBoundingClientRect(),R2=r.width/2;let dx=(e.clientX-r.left-R2)/R2,dy=(e.clientY-r.top-R2)/R2;const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}jx=dx;jy=dy;$('knob').style.transform=`translate(${dx*R2*.6}px,${dy*R2*.6}px)`}
joy.addEventListener('pointerdown',e=>{joy.setPointerCapture(e.pointerId);jmove(e)});
joy.addEventListener('pointermove',e=>{if(e.buttons||e.pressure)jmove(e)});
const jend=()=>{jx=jy=0;$('knob').style.transform=''};joy.addEventListener('pointerup',jend);joy.addEventListener('pointercancel',jend);
[['bAct',act],['bRow',toggleRow],['bCraft',()=>setPanel(!panelOn&&!dead)],['bInfo',()=>setPanel(!panelOn&&!dead,'info')]].forEach(([id,f])=>$(id).addEventListener('pointerdown',e=>{e.preventDefault();f()}));
$('panel').addEventListener('pointerdown',e=>{if(e.target===$('panel')){e.preventDefault();setPanel(false)}});
const rb=$('bRun');rb.addEventListener('pointerdown',e=>{e.preventDefault();rb.setPointerCapture(e.pointerId);runB=true});['pointerup','pointercancel'].forEach(n=>rb.addEventListener(n,()=>runB=false));
$('again').onclick=()=>{S=fresh();hbInit();shark=null;sharkT=35;rainOn=false;rk=0;wT=70;crateT=100;stormOn=fogOn=false;sk=fk=0;fogC=-1;flash=0;isl=null;islT=50;ex=null;rowing=false;rv.x=rv.y=0;radT=0;items=[];for(let i=0;i<7;i++)spawn(true);dm=null;mvd=null;jf=null;jfT=70;cfx=null;wh=null;whT=240;tyOn=false;tyk=0;dead=false;build=false;fs.on=false;$('over').classList.remove('on');renderInv();save()};

function update(dt){
 let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+jx,dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+jy;const m=Math.hypot(dx,dy);moving=m>.15&&!ex&&!rowing;runNow=false;rowIn(dx,dy,m,dt);
 if(moving){if(m>1){dx/=m;dy/=m}const run=(keys.shift||runB)&&S.st>2&&S.th>=15;runNow=run;if(run)S.st=Math.max(0,S.st-14*dt);bt=null;stepT-=dt;if(stepT<=0){stepT=run?.22:.34;}const sp=run?72:46;const nx=S.x+dx*sp*dt,ny=S.y+dy*sp*dt;if(ok(nx,S.y))S.x=nx;if(ok(S.x,ny))S.y=ny;const n=Math.hypot(dx,dy);face={x:dx/n,y:dy/n};if(fs.on){fs.on=false;toast('낚시를 멈췄다')}}
 spawnT-=dt;if(spawnT<=0){spawnT=(.9+Math.random()*1.3)*(1+Math.min(1,day()*.08));if(items.length<16)spawn(false)}
 items.forEach(i=>{const m=1+sk*2.5;i.x+=i.vx*dt*m;i.y+=i.vy*dt*m});items=items.filter(i=>Math.hypot(i.x-S.x,i.y-S.y)<spawnR()+70);
 if(fs.on){fs.c=Math.min(1,(fs.c||0)+dt*2.5);if(fs.bite>0){fs.bite-=dt;if(fs.bite<=0){fs.on=false;toast('놓쳤다…')}}else{fs.t-=dt;if(fs.t<=0){fs.bite=(BW[fs.k]||1.1)+(fs.rt==='rod2'?.7:0);toast(fs.k==='tuna'||fs.k==='deep'?'묵직한 입질! 지금 행동!':'입질이다! 지금 행동!');}}}
 sharkUpdate(dt);whaleUpdate(dt);weatherUpdate(dt);islUpdate(dt);S.tm=(S.tm||0)+dt;if(purCd>0)purCd-=dt;if(hookFx){hookFx.t-=dt;if(hookFx.t<=0)hookFx=null}
 S.hu-=.09*dif()*dt;S.th-=(.14+(hot()?.06:0))*dif()*dt;if(!runNow&&!(rowing&&Math.hypot(rv.x,rv.y)>3))S.st=Math.min(maxSt(),S.st+(moving?8:16)*dt);S.st=Math.min(S.st,maxSt());S.hu=Math.max(0,S.hu);S.th=Math.max(0,S.th);
 if(S.hu<=0||S.th<=0)S.hp-=(S.hu<=0&&S.th<=0?2.4:1.2)*dt;else if(S.hu>40&&S.th>40)S.hp=Math.min(100,S.hp+.5*dt);
 if(cold())S.hp-=.6*dt;if(S.inj>0){S.inj-=dt;S.hp-=.3*dt}if(S.inf>0)S.hp-=.2*dt;if(S.hp<=0&&!dead){dead=true;S.hp=0;fs.on=false;setPanel(false);$('over').classList.add('on');try{localStorage.removeItem('raft1')}catch(e){}idbDel()}
 cam.x+=(S.x-VW/2-cam.x)*Math.min(1,dt*5);cam.y+=(S.y-VH/2-cam.y)*Math.min(1,dt*5);
 saveT+=dt;if(saveT>5){saveT=0;if(!dead)save()}}

// drawing
const SC=['#16667b','#1b778d','#2388a0','#2d9bb3','#58bcc9'];let ox=0,oy=0;
const Rc=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x)-ox,Math.round(y)-oy,w,h)};
function sea(){const sp=1+sk*2.2,bx=Math.floor(ox/4),by=Math.floor(oy/4);for(let j=0,JM=Math.ceil(VH/4)+1,IM=Math.ceil(VW/4)+1;j<=JM;j++)for(let i=0;i<=IM;i++){const wx=(bx+i)*4,wy=(by+j)*4,v=Math.sin((wx+SO.x)*.06+t*.7*sp)+Math.sin((wy+SO.y)*.08-t*.5*sp)+Math.sin((wx+wy+SO.x+SO.y)*.035+t*.35*sp)-rk*.5,k=v<-1.2?0:v<-.2?1:v<.9?2:v<1.8?3:4;g.fillStyle=SC[k];g.fillRect(wx-ox,wy-oy,4,4);if(k===4){g.fillStyle='#d9f4ee';g.fillRect(wx-ox+1,wy-oy+1,2,1)}}}
function tile(gx,gy,b){const x=gx*16,y=gy*16+b;Rc(x,y,16,16,'#a8743f');
 for(let r=0;r<4;r++){Rc(x,y+r*4,16,1,'#bd8a52');Rc(x,y+r*4+3,16,1,'#7a4f2a');Rc(x+((r*5)%12)+2,y+r*4+1,1,1,'#4b2f1a');Rc(x+13-((r*3)%5),y+r*4+2,1,1,'#4b2f1a')}
 if(!has(gx,gy+1)){Rc(x,y+16,16,3,'#4a2f1a');Rc(x,y+19,16,1,'#0f4f60')}
 if(!has(gx-1,gy))Rc(x,y,1,16,'#3b2414');if(!has(gx+1,gy))Rc(x+15,y,1,16,'#3b2414');if(!has(gx,gy-1))Rc(x,y,16,1,'#3b2414');
 const lv=(S.rf&&S.rf[gx+','+gy])|0;if(lv>=1)[[1,1],[14,1],[1,14],[14,14]].forEach(([a,c])=>Rc(x+a,y+c,1,1,'#c7ced4'));if(lv>=2){Rc(x,y+7,16,2,'#6d7780');Rc(x,y+7,16,1,'#aab4bd')}if(lv>=3){Rc(x,y,16,1,'#aab4bd');Rc(x,y+15,16,1,'#6d7780');Rc(x,y,1,16,'#aab4bd');Rc(x+15,y,1,16,'#6d7780')}
 const d=S.dur[gx+','+gy]??100,K='#3b2414';if(d<75){Rc(x+3,y+3,1,4,K);Rc(x+4,y+6,3,1,K)}if(d<50){Rc(x+10,y+2,1,5,K);Rc(x+8,y+7,3,1,K);Rc(x+5,y+10,1,4,K)}if(d<25){Rc(x+2,y+12,8,1,K);Rc(x+11,y+9,1,5,K);Rc(x+7,y+4,1,3,K)}}
function sprite(i){const x=Math.round(i.x),y=Math.round(i.y+Math.sin(t*1.5+i.ph)*1.2);Rc(x-4,y+3,8,1,'rgba(8,50,64,.5)');
 if(i.k==='wood'){Rc(x-5,y-2,10,4,'#8a5a33');Rc(x-5,y-2,10,1,'#bd8a52');Rc(x-5,y+1,10,1,'#5c3a1e');Rc(x+3,y-1,1,2,'#d4a470')}
 else if(i.k==='plastic'){Rc(x-2,y-4,4,8,'#cfe9f2');Rc(x+1,y-3,1,6,'#8ab9c8');Rc(x-1,y-5,2,2,'#e0634f')}
 else if(i.k==='rope'){Rc(x-3,y-3,6,6,'#d8b878');Rc(x-1,y-1,2,2,'#7a5f33');Rc(x-3,y+2,6,1,'#a8864f')}
 else if(i.k==='scrap'){Rc(x-4,y-2,7,5,'#8c949c');Rc(x-4,y+2,7,1,'#5d656d');Rc(x-2,y-2,2,1,'#c7ced4');Rc(x+1,y,1,1,'#5d656d')}
 else if(i.k==='seed'){Rc(x-2,y-2,4,4,'#c9a24a');Rc(x-1,y-2,2,1,'#e8d58a');Rc(x-1,y+1,2,1,'#8a6a2a')}
 else if(i.k==='crate'){Rc(x-6,y-4,12,9,'#6b4226');Rc(x-6,y-4,12,2,'#a8743f');Rc(x-1,y-4,2,9,'#e8c76a');Rc(x-6,y+3,12,1,'#3b2414');if(Math.floor(t*3)%2)Rc(x+5,y-7,1,1,'#fff')}
 else if(i.k==='branch'){Rc(x-5,y-1,10,2,'#6b4a2a');Rc(x-2,y-3,2,3,'#6b4a2a');Rc(x+2,y-2,1,2,'#8a5a33')}else if(i.k==='glass'){Rc(x-2,y-4,4,8,'#bfe8e4');Rc(x-1,y-4,1,6,'#e8fffc');Rc(x-1,y-5,2,1,'#6b4226')}else if(i.k==='junk'){Rc(x-4,y-2,8,5,'#7a7a5a');Rc(x-2,y-3,3,2,'#b0a070');Rc(x+2,y-1,2,3,'#5a5a44')}
 else if(i.k==='stone'){Rc(x-4,y-2,8,5,'#8c949c');Rc(x-4,y-2,8,1,'#c7ced4');Rc(x-3,y+2,6,1,'#5d656d');Rc(x+1,y-1,2,2,'#6d7780')}else if(i.k==='clay'){Rc(x-4,y-2,8,5,'#b8683a');Rc(x-4,y-2,8,1,'#d98a56');Rc(x-2,y+1,4,1,'#8a4a28')}else if(i.k==='shard'){Rc(x-3,y-3,6,6,'#aab4bd');Rc(x-3,y-3,3,1,'#e0e6ea');Rc(x,y,3,3,'#6d7780');if(Math.floor(t*3+i.ph)%4===0)Rc(x+3,y-4,1,1,'#fff')}else{Rc(x-4,y-3,7,6,'#d9786a');Rc(x-4,y,7,1,'#b95a4e');Rc(x-3,y-3,3,1,'#ecb0a4')}}
function line(x0,y0,x1,y1,c){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0;for(let i=0;i<=n;i++)Rc(x0+(x1-x0)*i/(n||1),y0+(y1-y0)*i/(n||1),1,1,c)}
function player(b){const x=Math.round(S.x),y=Math.round(S.y)+b,f=moving&&Math.floor(t*9)%2;
 Rc(x-4,y-1,8,2,'rgba(0,0,0,.28)');Rc(x-4,y-13,8,14,'#1c1410');
 Rc(x-3,y-12,6,5,'#e8b98a');Rc(x-3,y-12,6,2,'#4a2f20');if(face.y>=0){Rc(x-2,y-9,1,1,'#1c1410');Rc(x+1,y-9,1,1,'#1c1410')}
 Rc(x-3,y-7,6,4,'#d65a4a');Rc(x-3,y-5,6,1,'#a8402f');
 Rc(x-3,y-3,2,f?2:3,'#2f4a6b');Rc(x+1,y-3,2,f?3:2,'#2f4a6b');
 Rc(x-5,y-13,10,1,'#e8c76a');Rc(x-3,y-14,6,2,'#e8c76a');Rc(x-3,y-13,6,1,'#b8964a');const sd=face.x>=0?1:-1;if(actT>0){actT=Math.max(0,actT-.016);const a=Math.sin(actT*24);Rc(x+(sd>0?4:-6),y-8+a*2,2,2,'#e8b98a');Rc(x+(sd>0?6:-9),y-9+a*3,3,2,'#a8743f')}else if(fs.on)Rc(x+(sd>0?4:-6),y-10,2,3,'#e8b98a')}
function draw(){ox=Math.round(cam.x+Math.sin(t*23)*sk*1.5);oy=Math.round(cam.y+Math.cos(t*19)*sk*1.2);sea();fishFx();const b=Math.round(Math.sin(t*(1.6+sk*3))*(1+sk*2));
 let near=null,nd=1e9;const reach=curReach();items.forEach(i=>{const d=Math.hypot(i.x-S.x,i.y-(S.y-6));if(d<reach&&d<nd){nd=d;near=i}});
 if(isl)drawIsl();if(wh)drawWhale();if(jf)drawJelly();if(shark)drawShark();items.forEach(sprite);
 if(near){const x=Math.round(near.x),y=Math.round(near.y);[[-7,-7],[5,-7],[-7,5],[5,5]].forEach(([a,c])=>Rc(x+a,y+c,2,2,'#fff'))}
 S.tiles.forEach(k=>{const[p,q]=k.split(',').map(Number);tile(p,q,b)});
 if(rk>.3)S.tiles.forEach(k=>{const[p,q]=k.split(',').map(Number);Rc(p*16,q*16+b,16,16,'rgba(20,40,60,'+rk*.25+')')});
 if((S.tm|0)>360){const[p,q]=S.tiles[0].split(',').map(Number);Rc(p*16+11,q*16+11,2,2,'#e8d4c0');Rc(p*16+3,q*16+13,3,1,'#d8b878');if((S.tm|0)>720&&S.tiles.length>1){const[a,c]=S.tiles[1].split(',').map(Number);Rc(a*16+4,c*16+4,3,2,'#6b4226');Rc(a*16+10,c*16+12,2,2,'#cfe9f2')}}
 if(build){cands().forEach(k=>{const[p,q]=k.split(',').map(Number);Rc(p*16,q*16+b,16,16,'rgba(255,255,255,.14)')});const[p,q]=pickC().split(',').map(Number);Rc(p*16,q*16+b,16,16,Math.floor(t*4)%2?'rgba(232,199,106,.6)':'rgba(232,199,106,.3)')}
 if(panelOn&&tab==='건축'){const rk2=rfTile();if(rk2){const[p,q]=rk2.split(',').map(Number);Rc(p*16,q*16+b,16,16,'rgba(232,199,106,.35)')}}
 if(S.bn){const x=S.bn[0],y=S.bn[1]+b;Rc(x-7,y-4,14,3,'#a8743f');Rc(x-7,y-4,14,1,'#d4a470');Rc(x-6,y-1,2,7,'#6b4226');Rc(x+4,y-1,2,7,'#6b4226');Rc(x-3,y-8,2,4,'#8c949c');Rc(x+1,y-6,4,2,'#c7ced4');if((S.bl|0)>=2)Rc(x-7,y-1,14,1,'#8c949c');if((S.bl|0)>=3){Rc(x+3,y-10,2,3,'#e0634f');Rc(x-7,y-4,14,1,'#e8c76a')}}
 {const o=(f,fn)=>{if(S[f])fn(S[f][0],S[f][1]+b)};
 o('sol',(x,y)=>{Rc(x-7,y-3,14,9,'#1c3a6b');Rc(x-7,y-3,14,1,'#8aa9c4');Rc(x-1,y-3,1,9,'#4a6a9b');Rc(x-7,y+1,14,1,'#4a6a9b');Rc(x-1,y+6,3,2,'#5d6b75')});
 o('pu2',(x,y)=>{Rc(x-6,y-7,12,13,'#d5e0e6');Rc(x-5,y-6,10,5,'#7cc7e0');Rc(x-4,y+1,8,3,'#5d6b75');Rc(x+3,y+4,2,1,(S.pw|0)>=20?'#4fb36a':'#e0634f')});
 o('eng',(x,y)=>{Rc(x-6,y-4,12,9,'#3a444b');Rc(x-6,y-4,12,2,'#8c949c');Rc(x-2,y-8,4,4,'#5d6b75');Rc(x+6,y-1,2,3,Math.floor(t*10)%2?'#c7ced4':'#8c949c')});
 o('aut',(x,y)=>{Rc(x-7,y-7,2,13,'#6b4226');Rc(x+5,y-7,2,13,'#6b4226');Rc(x-7,y-7,14,2,'#a8743f');for(let i=0;i<4;i++)Rc(x-5,y-4+i*3,10,1,'#d8b878')});
 o('tnk',(x,y)=>{Rc(x-6,y-8,12,14,'#4a5660');Rc(x-6,y-8,12,2,'#8c949c');const h=Math.round((S.tkW||0)/200*9);Rc(x-4,y+4-h,8,h,'#4fb3e0');Rc(x-6,y+2,12,1,'#2c353c')});
 o('bd',(x,y)=>{Rc(x-7,y-4,14,10,'#6b4226');Rc(x-6,y-3,12,8,'#d9786a');Rc(x-6,y-3,5,4,'#f2ede0');Rc(x-6,y+2,12,1,'#b95a4e')});
 o('fn',(x,y)=>{Rc(x-6,y-9,2,14,'#6b4226');Rc(x-6,y-9,10,2,'#a8743f');Rc(x-4,y-7,1,6,'#e8f3ef');Rc(x-5,y-1,3,2,'#e0634f')});
 o('sm',(x,y)=>{Rc(x-7,y-6,14,13,'#5d6460');Rc(x-7,y-6,14,2,'#8c8680');Rc(x-5,y-3,10,7,'#241812');Rc(x-4,y-1,8,4,Math.floor(t*5)%2?'#f2a33a':'#e0634f');Rc(x-2,y+1,4,2,'#ffe49a');Rc(x+4,y-12,3,6,'#3a3f3c');Rc(x+4+Math.sin(t*3)*1,y-14-((t*6)%4|0),2,2,'rgba(200,200,200,.5)')});
 o('ft',(x,y)=>{const h=Math.round((S.fl||0)/100*7);Rc(x-5,y-7,10,13,'#8a2f28');Rc(x-5,y-7,10,2,'#c9453a');Rc(x-3,y-10,4,3,'#2f3a40');Rc(x-4,y+4-h,8,h,'#e8c76a');Rc(x-5,y+5,10,1,'#4a1a16')});
 o('gn',(x,y)=>{Rc(x-7,y-4,14,10,'#3a444b');Rc(x-7,y-4,14,2,'#8c949c');Rc(x-5,y-1,5,5,'#1c2a33');Rc(x+2,y-1,4,2,(S.fl||0)>0&&dark()>.3?(Math.floor(t*8)%2?'#4fb36a':'#9fe0b0'):'#5d6b75');Rc(x+5,y-8,2,4,'#5d6b75')});
 o('el',(x,y)=>{const on=dark()>.3&&(S.pw||0)>1;Rc(x-1,y-12,2,12,'#4a3a2a');Rc(x-4,y-15,8,4,'#2f3a40');Rc(x-3,y-14,6,2,on?'#d9f4ff':'#7a8a92');if(on)Rc(x-5,y-16,10,1,'rgba(217,244,255,.4)')})}
 if(S.lan){const x=S.lan[0],y=S.lan[1]+b;Rc(x-1,y-10,2,10,'#4a3a2a');Rc(x-3,y-14,6,5,'#2f3a40');Rc(x-2,y-13,4,3,Math.floor(t*5)%2?'#ffe49a':'#f2a33a');Rc(x-4,y-15,8,1,'#8c949c')}
 if(S.pur){const x=S.pur[0],y=S.pur[1]+b;Rc(x-6,y-6,12,12,'#4a5660');Rc(x-5,y-5,10,6,'#7cc7e0');Rc(x-5,y-5,10,1,'#c9eef8');Rc(x-1,y-3,2,3,'#2388a0');Rc(x-4,y+3,8,2,'#2c353c');if(purCd>0)Rc(x-1,y-9-((t*8)%4|0),2,2,'#cfeee8')}
 if(S.fur){const x=S.fur[0],y=S.fur[1]+b,f=Math.floor(t*6)%2;Rc(x-6,y-6,12,12,'#6b6460');Rc(x-6,y-6,12,2,'#8c8680');Rc(x-4,y-3,8,6,'#241812');Rc(x-3,y-1-f,6,4+f,'#e0634f');Rc(x-2,y-1,4,3,'#f2a33a');Rc(x-1,y,2,2,'#ffe49a');for(let i=0;i<4;i++){const p=(t*.8+i*.25)%1;Rc(x-1+Math.sin(p*6+i)*2,y-8-p*14,2,2,'rgba(200,200,200,'+.5*(1-p)+')')}if(f)Rc(x+2,y-6-((t*9)%5|0),1,1,'#ffd27a')}
 if(S.col){const x=S.col[0],y=S.col[1]+b,h=Math.round((S.colW||0)/100*7);Rc(x-5,y-5,10,11,'#5d6b75');Rc(x-4,y-3,8,8,'#1c2a33');Rc(x-4,y+5-h,8,h,'#4fb3e0');Rc(x-7,y-7,14,2,'#a9b8c2');Rc(x-7,y-7,14,1,'#d5e0e6')}
 if(S.chs){const x=S.chs[0],y=S.chs[1]+b;Rc(x-6,y-4,12,10,'#6b4226');Rc(x-6,y-4,12,3,'#a8743f');Rc(x-1,y-2,2,3,'#e8c76a');Rc(x-6,y+5,12,1,'#3b2414')}
 if(S.pl){const[x0,y0,st,gr,w]=S.pl,x=x0,y=y0+b;Rc(x-6,y-3,12,9,'#6b4226');Rc(x-6,y-3,12,1,'#a8743f');Rc(x-5,y-2,10,4,w>0?'#3b2a1e':'#5a4630');Rc(x-6,y+5,12,1,'#3b2414');
  if(st===1){const h=1+Math.round(gr/100*5);Rc(x,y-2-h,1,h+1,'#5fae5a');Rc(x-2,y-2-(h>>1),2,1,'#7fcf6f');Rc(x+1,y-1-(h>>1),2,1,'#7fcf6f');if(w<=0&&Math.floor(t*2)%2)Rc(x+4,y-8,2,2,'#4fb3e0')}
  if(st===2){Rc(x-4,y-8,8,5,'#4f9a4a');Rc(x-3,y-9,6,2,'#7fcf6f');Rc(x-3,y-3,2,2,CC[S.pl[5]||'potato']);Rc(x+1,y-3,2,2,CC[S.pl[5]||'potato']);if(Math.floor(t*3)%2)Rc(x+4,y-9,1,1,'#fff')}}
 if(S.rad){const x=S.rad[0],y=S.rad[1]+b,on=isl&&isl.k===3&&!isl.done;Rc(x-6,y-3,12,9,'#3b4a42');Rc(x-6,y-3,12,1,'#5d6f65');Rc(x-5,y-1,5,4,'#1c2a24');Rc(x+1,y-1,4,2,'#8aa89a');Rc(x+1,y+2,4,1,'#5d6f65');Rc(x-6,y+5,12,1,'#1c2a24');Rc(x+4,y-9,1,7,'#a9b8c2');Rc(x+3,y-10,3,1,'#d5e0e6');Rc(x-4,y,1,1,on?(Math.floor(t*6)%2?'#e0634f':'#5a2a24'):(Math.floor(t)%2?'#4fb36a':'#1f4a2a'));if(on&&Math.floor(t*3)%3===0){Rc(x+7,y-10,2,1,'#e8c76a');Rc(x+9,y-12,2,1,'#e8c76a')}}
 if(PF.length){PF=PF.filter(p=>t-p.t<.6);PF.forEach(p=>{const a=(t-p.t)/.6;for(let i=0;i<6;i++){const an=i*1.05;Rc(p.x+Math.cos(an)*a*10,p.y+b-4-Math.sin(an)*a*6-a*4,2,2,'rgba(232,220,190,'+(1-a)+')')}})}
 if(S.brk)for(const id in S.brk){const o=S[FAC[id]];if(o&&Math.floor(t*3)%2)Rc(o[0]-1,o[1]-12+b,3,3,'#e0634f')}
 if(fs.on){const cp=Math.min(1,fs.c||0),bx=S.x+face.x*22*(.3+.7*cp),by=S.y+face.y*22*(.3+.7*cp)-Math.sin(cp*Math.PI)*8,w=Math.floor(t*3)%3;line(S.x+3,S.y-8,bx,by,'#e8f3ef');
  Rc(bx-6-w,by+2,12+w*2,1,'#d9f4ee');Rc(bx-1,by-1,3,3,'#e0634f');Rc(bx-1,by-1,3,1,'#fff');if(!(fs.bite>0)&&cp>=1){const dd=5+Math.min(1,fs.t/4)*22,aa=t*1.4,fx=bx+Math.cos(aa)*dd,fy=by+3+Math.sin(aa)*dd*.35,sz=fs.k==='tuna'||fs.k==='deep'?3:fs.k==='fish'?1:2;Rc(fx-2-sz,fy,4+sz*2,2,'rgba(8,50,64,.5)');Rc(fx+2+sz,fy,2,1,'rgba(8,50,64,.5)')}if(fs.bite>0){Rc(bx,by-12,2,6,'#fff');Rc(bx,by-4,2,2,'#fff');Rc(bx-8-Math.floor(t*8)%3,by+3,16+Math.floor(t*8)%3*2,1,'#fff')}}
 if(hookFx)line(S.x,S.y-6,hookFx.x,hookFx.y,'#d8b878');
 if(cfx){cfx.t+=.016;const p=cfx.t/.5;if(p>=1)cfx=null;else{const x=cfx.x+(S.x-cfx.x)*p,y=cfx.y+(S.y-6-cfx.y)*p-Math.sin(p*Math.PI)*14,c=CFC[cfx.k]||'#8aa9c4';Rc(x-3,y,6,3,c);Rc(x+3,y+1,2,2,c);Rc(x-2,y,1,1,'#fff')}}
 if(!ex)player(b);drawRow(b);weather();fog();night();extras();arrow()}

let shark=null,sharkT=35;
function mvS(tx,ty,sp){const dx=tx-shark.x,dy=ty-shark.y,d=Math.hypot(dx,dy);if(d>.5){const m=Math.min(sp,d);shark.x+=dx/d*m;shark.y+=dy/d*m;shark.fx=dx}return d}
function bite(k,n=25,m='상어가 뗏목을 물었다!'){S.dur[k]=(S.dur[k]??100)-Math.round(n*(1+Math.min(.8,day()*.08))*(1-.25*((S.rf&&S.rf[k])|0)));toast(m);if(S.dur[k]<=0){delete S.dur[k];if(S.rf)delete S.rf[k];if(S.tiles.length>1){S.tiles.splice(S.tiles.indexOf(k),1);const[p,q]=k.split(',').map(Number),cx=p*16+8,cy=q*16+8;if(S.pur&&S.pur[0]===cx&&S.pur[1]===cy)S.pur=null;if(S.fur&&S.fur[0]===cx&&S.fur[1]===cy)S.fur=null;if(S.col&&S.col[0]===cx&&S.col[1]===cy)S.col=null;if(S.pl&&S.pl[0]===cx&&S.pl[1]===cy)S.pl=null;if(S.rad&&S.rad[0]===cx&&S.rad[1]===cy)S.rad=null;if(S.bn&&S.bn[0]===cx&&S.bn[1]===cy)S.bn=null;if(S.lan&&S.lan[0]===cx&&S.lan[1]===cy)S.lan=null;for(const f of['sol','pu2','eng','aut','tnk','bd','fn','sm','ft','gn','el'])if(S[f]&&S[f][0]===cx&&S[f][1]===cy)S[f]=null;if(S.chs&&S.chs[0]===cx&&S.chs[1]===cy){S.chs=null;S.ch={}}if(!ok(S.x,S.y)){let bd=1e9;S.tiles.forEach(j=>{const[a,b]=j.split(',').map(Number),d=Math.hypot(a*16+8-S.x,b*16+8-S.y);if(d<bd){bd=d;S.x=a*16+8;S.y=b*16+8}})}toast('타일이 부서졌다!')}else S.dur[k]=10}save()}
function sharkUpdate(dt){const[cx,cy]=center();
 if(!shark){sharkT-=dt;if(sharkT<=0){const a=Math.random()*6.283;shark={x:cx+Math.cos(a)*100,y:cy+Math.sin(a)*100,a,st:'circle',t:6+Math.random()*3,bites:0,life:55,fx:1};toast('상어가 나타났다!')}return}
 shark.life-=dt;
 if(shark.st==='circle'){shark.a+=.5*dt;mvS(cx+Math.cos(shark.a)*62,cy+Math.sin(shark.a)*62,30*dt);shark.t-=dt;
  if(shark.t<=0){const E=[];S.tiles.forEach(k=>{const[p,q]=k.split(',').map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{if(!has(p+a,q+b))E.push([k,p*16+8+a*13,q*16+8+b*13])})});shark.tg=E[Math.random()*E.length|0];shark.st='attack'}}
 else if(shark.st==='attack'){if(mvS(shark.tg[1],shark.tg[2],44*dt)<3){shark.bites++;shark.st='flee';bite(shark.tg[0])}}
 else{const a=Math.atan2(shark.y-cy,shark.x-cx);if(mvS(cx+Math.cos(a)*115,cy+Math.sin(a)*115,50*dt)<4){if(shark.bites>=3||shark.life<=0){shark=null;sharkT=50+Math.random()*50}else{shark.st='circle';shark.a=a;shark.t=5+Math.random()*3}}}}
function drawShark(){const x=Math.round(shark.x),y=Math.round(shark.y),f=Math.floor(t*4)%2;Rc(x-5,y,10,3,'rgba(8,50,64,.45)');Rc(x-6,y+1,12,1,'rgba(217,244,238,.7)');Rc(x-4+f,y+2,8,1,'rgba(217,244,238,.4)');Rc(x-1,y-6,2,6,'#5d6b75');Rc(x,y-6,1,6,'#8a99a4');Rc(x-2,y-3,5,3,'#5d6b75');Rc(x-3,y-1,7,2,'#46535c')}
let rk=0,rainOn=false,wT=70,crateT=100,stormOn=false,fogOn=false,sk=0,fk=0,fogC=-1,flash=0,stT=8;
function weatherUpdate(dt){wT-=dt;if(wT<=0){if(rainOn||fogOn){rainOn=stormOn=fogOn=tyOn=false;wT=60+Math.random()*60;if(rk>.3)bow=16;toast('날씨가 개었다')}
  else if(Math.random()<.1+Math.min(.15,day()*.015)){rainOn=stormOn=tyOn=true;wT=45;stT=3;toast('🌪 태풍이 접근한다! 닻을 내리고 뗏목을 점검하자')}
  else{const r=Math.random();if(r<.5){rainOn=true;wT=40+Math.random()*30;toast('비가 내리기 시작한다…')}else if(r<.75){rainOn=stormOn=true;wT=35+Math.random()*20;stT=6;toast('폭풍이 몰려온다! 뗏목을 점검하자')}else{fogOn=true;wT=45+Math.random()*30;fogC=10;toast('짙은 안개가 낀다…')}}}
 rk+=((rainOn?1:0)-rk)*Math.min(1,dt*.5);sk+=((stormOn?1+tyk*.7:0)-sk)*Math.min(1,dt*.5);tyk+=((tyOn?1:0)-tyk)*Math.min(1,dt*.5);fk+=((fogOn?1:0)-fk)*Math.min(1,dt*.4);
 if(stormOn){stT-=dt;if(stT<=0){stT=(7+Math.random()*5)/(1+tyk*2);flash=.5;stormFac();if(Math.random()<.6&&S.tiles.length)bite(S.tiles[Math.random()*S.tiles.length|0],Math.round((12+tyk*14)*(S.tool.anchor?.4:1)),'거센 파도가 뗏목을 때렸다!')}}
 if(fogOn&&fogC>0){fogC-=dt;if(fogC<=0){fogC=-1;if(!isl&&Math.random()<.5){const a=Math.random()*6.283,[cx0,cy0]=center();isl={x:cx0+Math.cos(a)*150,y:cy0+Math.sin(a)*150,r:30,k:7,done:false};toast('안개 속에 미지의 섬이 나타났다!');return}spawn(false);const c=items[items.length-1],[cx,cy]=center(),a=Math.random()*6.283;c.k='crate';c.x=cx+Math.cos(a)*70;c.y=cy+Math.sin(a)*70;c.vx*=.3;c.vy*=.3;toast('안개 속에 무언가 떠 있다…')}}
 if(S.pl&&S.pl[2]===1){const P=S.pl;if(rk>.5)P[4]=100;if(P[4]>0){P[3]+=2.5*dt;P[4]=Math.max(0,P[4]-2*dt);if(P[3]>=100){P[2]=2;toast(T[P[5]||'potato'].n+'이(가) 다 자랐다!')}}}
 if(S.col&&rk>.5)S.colW=Math.min(100,(S.colW||0)+4*dt);
 crateT-=dt;if(crateT<=0){crateT=100+Math.random()*60;spawn(false);items[items.length-1].k='crate';toast('보급 상자가 떠내려온다!')}}
function weather(){if(rk<.02)return;g.fillStyle=`rgba(12,28,48,${rk*.3+sk*.2+tyk*.3})`;g.fillRect(0,0,VW,VH);g.fillStyle=`rgba(200,232,242,${.35+rk*.4})`;const n=Math.round(90*rk+90*sk+90*tyk);for(let i=0;i<n;i++)g.fillRect((i*47+Math.floor(t*(30+70*sk)))%VW,Math.floor((i*29+t*150*(1+i%3*.25))%(VH+10))-6,1,3)}
function crate(){const P=['scrap','scrap','cloth','rope','plastic','wood','fish','fish','cooked','seed','seed','shard','shard','stone','clay','metal','fuel','elec'],o={},m=[];for(let i=0;i<4;i++){const k=P[Math.random()*P.length|0];o[k]=(o[k]||0)+1+(Math.random()<.3?1:0)}for(const k in o){S.inv[k]=(S.inv[k]|0)+o[k];m.push(T[k].n+' ×'+o[k])}toast('보급 상자! '+m.join(', '))}
const MAXU={mspear:25,maxe:40,hook2:50,rod2:30,axe:20,hook:25,rod:12,spear:8,hammer:15,paddle:40,saw:20,mhammer:30,knife:25,pickaxe:20,cutter:15,hook3:70,hook4:90};
const dur=k=>S.tu[k]??MAXU[k];
const LTW=['axe','hammer','spear','hook','knife'],FIXC=k=>['axe','hammer','spear'].includes(k)?{branch:1}:['maxe','mhammer','mspear','knife','pickaxe','cutter','hook3','hook4','rod2'].includes(k)?{scrap:2,rope:1}:{wood:1,rope:1},fixTxt=k=>Object.entries(FIXC(k)).map(([m,v])=>T[m].n+v).join('·'),
TROLE={axe:'가벼운 목재 작업 · 비상용',maxe:'대량 목재 · 희귀 목재',hammer:'가벼운 수리',mhammer:'강화 수리 · 타일 강화',spear:'작은 사냥 · 상어 쫓기',mspear:'상어 격퇴 · 해파리',hook:'가벼운 부유물',hook2:'먼 거리 회수',hook3:'무거운 보급품',hook4:'매우 먼 대형 물체',knife:'생선 손질 · 잉크',pickaxe:'광석 채굴'};
function use(k){setTimeout(renderQS,0);if(k!=='rod'&&k!=='rod2'&&k!=='paddle')S.st=Math.max(0,S.st-(LTW.includes(k)?1:2));S.tu[k]=dur(k)-1;if(S.tu[k]<=0){S.tool[k]=0;delete S.tu[k];const n=R.find(r=>r.id===k).n;setTimeout(()=>toast(n+'이(가) 부러졌다! 다시 제작하자'),1900)}}
function fix(k){const c=FIXC(k);if(!S.tool[k]||Object.entries(c).some(([m,v])=>(S.inv[m]|0)<v))return;for(const m in c)S.inv[m]-=c[m];S.tu[k]=MAXU[k];toast('도구를 수리했다');renderInv();renderPanel();save()}
function freeTile(){let k,n=0;do{k=S.tiles[Math.random()*S.tiles.length|0].split(',').map(Number)}while(++n<30&&[S.pur,S.fur,S.col,S.chs,S.pl,S.rad,S.bn].some(o=>o&&o[0]===k[0]*16+8&&o[1]===k[1]*16+8));return k}
function plant(){const P=S.pl;if(!P||P[2]!==0)return;if(S.inv.seed>0){S.inv.seed--;P[2]=1;P[3]=0;P[4]=0;P[5]=['potato','carrot','tomato','corn','berry','herb'][Math.random()*6|0];toast('씨앗을 심었다 ('+T[P[5]].n+'). 물이 필요하다');renderInv();save()}else toast('심을 씨앗이 없다')}
function waterPl(){const P=S.pl;if(!P||P[2]!==1)return;if(P[4]>20)toast('아직 촉촉하다');else if((S.colW||0)>=15){S.colW-=15;P[4]=100;toast('물을 주었다');save()}else toast('물이 필요하다 — 비를 기다리거나 수집기에 물을 모으자')}
function harvest(){const P=S.pl;if(!P||P[2]!==2)return;const c=P[5]||'potato';S.inv[c]=(S.inv[c]|0)+3;P[2]=0;P[3]=0;toast(T[c].n+'을(를) 수확했다 ×3');renderInv();save()}
function fog(){if(flash>0){g.fillStyle=`rgba(255,255,255,${flash})`;g.fillRect(0,0,VW,VH);flash=Math.max(0,flash-.03)}
 if(fk<.02)return;const r=S.tool.torch?54:40,px=S.x-ox,py=S.y-6-oy;const D=ensureNid().data,NW=nc.width,NH=nc.height;for(let j=0;j<NH;j++)for(let i=0;i<NW;i++){const m=Math.max(0,Math.min(1,(Math.hypot(i*4+2-px,j*4+2-py)-r*.5)/(r*1.1))),k=Math.round(fk*m*5),o=(j*NW+i)*4;D[o]=196;D[o+1]=212;D[o+2]=216;D[o+3]=Math.round(k/9*255)}nx.putImageData(nid,0,0);g.imageSmoothingEnabled=false;g.drawImage(nc,0,0,NW*4,NH*4)}
let isl=null,islT=50,ex=null,rowing=false,rowT=0;const rv={x:0,y:0},SO={x:0,y:0};
const INAME=['무인도','폐선','등대','송신기','연구 시설','버려진 플랫폼','군사 시설','미지의 섬'],NOTES=['일지: 구조 신호가 매일 밤 같은 방향에서 온다.','일지: 신호의 근원은 폭풍 너머 연구 시설이다.','낡은 지도: 먼 바다에서 불빛이 깜박인다…','일지: 마지막 보급선은 돌아오지 않았다.','메모: 무전기가 있다면 신호를 잡을 수 있다.'];
function rowUI(){const b=$('bRow');b.style.display=S.tool.paddle?'grid':'none';b.style.background=rowing?'#58bcc9':'';b.style.color=rowing?'#06121a':''}
function toggleRow(){if(dead||panelOn||ex)return;if(!S.tool.paddle){toast('노가 필요하다 (제작)');return}rowing=!rowing;fs.on=false;toast(rowing?'노를 젓는다 — 조이스틱/WASD가 항해 방향':'노를 거두었다')}
function rowIn(dx,dy,m,dt){if(rowing&&!S.tool.paddle)rowing=false;let tx=0,ty=0;
 if(rowing&&!ex&&m>.15){const q=Math.min(1,m)*(S.st>1?1:.4);S.st=Math.max(0,S.st-2.5*dt);const eo=S.eng&&(S.fl||0)>0&&!bk('engine'),sp2=(eo?44:22)*(S.tool.nav?1.3:1);if(eo)S.fl=Math.max(0,S.fl-.8*dt);tx=dx/m*q*sp2;ty=dy/m*q*sp2;face={x:dx/m,y:dy/m};fs.on=false;rowT+=dt;if(rowT>=5){rowT=0;use('paddle')}}
 const k=Math.min(1,dt*1.8);rv.x+=(tx-rv.x)*k;rv.y+=(ty-rv.y)*k;const mx=rv.x*dt,my=rv.y*dt;SO.x+=mx;SO.y+=my;
 items.forEach(i=>{i.x-=mx;i.y-=my});if(shark){shark.x-=mx;shark.y-=my}if(isl){isl.x-=mx;isl.y-=my}if(wh){wh.x-=mx;wh.y-=my}if(jf){jf.x-=mx;jf.y-=my}}
function islUpdate(dt){const[cx,cy]=center();if(radT>0)radT-=dt;
 if(!isl){islT-=dt*(S.tool.scanner?2.5:1)*(S.tool.telescope?1.4:1)*(S.tool.lrs?1.5:1);if(islT<=0){const a=Math.random()*6.283,k=(S.expl|0)>=2&&Math.random()<.5?4+(Math.random()*4|0):Math.random()*3|0;isl={x:cx+Math.cos(a)*240,y:cy+Math.sin(a)*240,r:[32,26,18,22,24,28,26,30][k],k,done:false};toast('먼 바다에 '+INAME[k]+'이(가) 보인다! 화살표 방향으로 노를 젓자');save()}}
 else{const d=Math.hypot(isl.x-cx,isl.y-cy);if((d>460&&isl.k!==3)||(isl.done&&d>200)){isl=null;islT=60+Math.random()*60}}
 if(ex){ex.t-=dt;if(Math.ceil(ex.t)!==ex.n){ex.n=Math.ceil(ex.t);toast('섬을 탐사하는 중… '+ex.n+'초')}if(ex.t<=0)finish()}}
function nearIsl(){if(!isl)return null;for(const k of S.tiles){const[p,q]=k.split(',').map(Number);if(Math.hypot(p*16+8-isl.x,q*16+8-isl.y)<isl.r+22)return isl}return null}
function explore(il,tp){if(S.hu<15||S.th<15){toast('기력이 부족하다. 먼저 먹고 마시자');return}rowing=false;fs.on=false;ex={t:7,n:0,il,tp};toast('탐사를 떠난다 (허기·갈증 -10)')}
function finish(){const il=ex.il,tp=ex.tp;ex=null;S.hu=Math.max(0,S.hu-10);S.th=Math.max(0,S.th-10);const r=n=>Math.random()*n|0,L={},add=(k,n)=>L[k]=(L[k]|0)+n;
 if(il.k===0){add('wood',4+r(4));add('seed',1+r(2));add('rope',1+r(2));add('cloth',1);if(Math.random()<.4)add('potato',2)}
 else if(il.k===1){add('scrap',3+r(3));add('rope',1+r(2));add('cloth',1+r(2));add('plastic',1+r(2));if(Math.random()<.5)add('scrap',2)}
 else if(il.k>=4)LOOT[il.k](add,r)
 else if(il.k===3){const n=S.sig|0;add('scrap',3+n*2+r(2));add('plastic',2+n);add('cooked',1+n);if(n>0)add('seed',2)}
 else{add('scrap',2+r(2));add('plastic',2);add('cooked',1)}
 const ev=[],ro=Math.random();
 if(il.k===0){add('stone',2+r(3));if(Math.random()<.6)add('clay',1+r(2))}
 if(il.k===1||il.k===5||il.k===6)add('shard',1+r(2));
 if(il.k===1&&Math.random()<.5)add('stone',1);
 if(S.tool.pickaxe&&tp!=='pickaxe'&&[0,1,4,5,6,7].includes(il.k))ev.push('곡괭이를 선택하고 탐사하면 광석을 캘 수 있다');
 if(tp==='pickaxe'&&S.tool.pickaxe&&[0,1,4,5,6,7].includes(il.k)){add('ore',2+r(3));if(Math.random()<.6)add('cuore',1+r(2));use('pickaxe');ev.push('곡괭이로 광석을 캤다')}
 if([1,4,5,6].includes(il.k)){if(tp==='cutter'&&S.tool.cutter){add('elec',1+r(2));if(Math.random()<.5)add('fuel',1);if(Math.random()<.3)add('glass',1);use('cutter');ev.push('절단기로 전자 부품을 회수했다')}else if(Math.random()<.5)ev.push(S.tool.cutter?'전자 부품이 보인다. 절단기를 선택하고 탐사하면 꺼낼 수 있다':'전자 부품이 보이지만 절단기가 없어 꺼낼 수 없다')}
 if(S.tool.chart)addLog('해도: '+INAME[il.k]+' 기록 #'+((S.expl|0)+1));
 if(il.k===0){if(ro<.28){add('berry',2+r(3));ev.push('야생 딸기 덤불을 발견했다')}else if(ro<.5){add('scrap',2+r(2));if(Math.random()<.5)add('metal',1);ev.push('해안 바위에서 광물을 캤다')}else if(ro<.68){add('seed',2+r(2));add('herb',1);ev.push('희귀 씨앗과 허브를 찾았다')}else if(ro<.88){add('fish',2+r(2));ev.push('갯벌 게와 조개를 잡았다');if(Math.random()<.25){S.inj=40;S.hp=Math.max(1,S.hp-8);ev.push('집게에 물려 부상!')}}}
 else if(il.k!==3&&il.k!==2&&ro<.3){add('metal',1+r(2));add('glass',1+r(2));if(Math.random()<.4)add('cloth',2);ev.push('폐허를 발견했다! 쓸 만한 부품이 남아 있다');const RN=['폐허 석판: 이곳엔 한때 사람들이 모여 살았다.','폐허 벽화: 하늘로 빛줄기를 쏘는 탑이 그려져 있다.','폐허 상자: 신호가 닿은 뒤 모두 바다로 나갔다.','폐허 일기: 우리는 빛을 따라가기로 했다.'],n=S.rn|0;if(n<RN.length){S.rn=n+1;setTimeout(()=>{addLog(RN[n]);toast(RN[n])},3400)}}
 const m=[];for(const k in L){S.inv[k]=(S.inv[k]|0)+L[k];m.push(T[k].n+' ×'+L[k])}if(ev.length)setTimeout(()=>toast(ev.join(' · ')),1000);il.done=true;S.expl=(S.expl|0)+1;if(il.k===1&&Math.random()<.3||il.k===6&&Math.random()<.4){S.hp=Math.max(1,S.hp-(il.k===6?20:15));S.inj=50;setTimeout(()=>toast(il.k===6?'경비 장치가 작동했다! 부상':'선내에 숨어 있던 생물에게 물렸다! 부상'),1200)}const lg=LOGK[il.k];if(lg){const c=S.lgc||(S.lgc={}),i=c[il.k]|0;if(i<lg.length){c[il.k]=i+1;setTimeout(()=>{addLog(lg[i]);toast(lg[i])},2600)}}toast(m.join(' · '));
 if(il.k===3){const n=S.sig|0;S.sig=n+1;setTimeout(()=>{addLog(SIGM[n]);toast(SIGM[n])},2000);if(n>=2)setTimeout(ending,4600)}
 if(il.k===2){S.rec=(S.rec|0)+1;setTimeout(()=>{const n=NOTES[(S.rec-1)%NOTES.length];addLog(n);toast(n)},2000)}renderInv();save()}
function drawIsl(){const{r,k}=isl,X=Math.round(isl.x),Y=Math.round(isl.y);
 const ring=(rr,c)=>{for(let d=-rr;d<=rr;d++){const w=Math.round(Math.sqrt(rr*rr-d*d)+(rr>20?Math.sin(d*.5+t*.8):0));Rc(X-w,Y+d,w*2,1,c)}};
 ring(r+5,'#58bcc9');ring(r+2,'#7fd6d6');
 if(k===0){ring(r,'#e6d3a0');ring(r-5,'#4f9a4a');ring(r-9,'#5fae5a');[[-10,-8],[8,-4],[-3,6],[11,8]].forEach(([a,c])=>{Rc(X+a,Y+c-2,2,7,'#6b4226');Rc(X+a-4,Y+c-4,10,2,'#2f7a3f');Rc(X+a-3,Y+c-5,8,1,'#4f9a4a');Rc(X+a-2,Y+c-2,1,1,'#2f7a3f')});if(!isl.done){const cx=X-6+Math.round(Math.sin(t*.9)*9),f=Math.floor(t*6)%2;Rc(cx-2,Y+11,5,3,'#d65a4a');Rc(cx-2,Y+11,5,1,'#f08070');Rc(cx-3,Y+10,1,2,'#d65a4a');Rc(cx+3,Y+10,1,2,'#d65a4a');Rc(cx-2,Y+14,1,1+f,'#a8402f');Rc(cx+2,Y+14,1,2-f,'#a8402f');Rc(cx-1,Y+10,1,1,'#fff');Rc(cx+1,Y+10,1,1,'#fff');const bx=X+4+Math.round(Math.sin(t*.5+2)*6);Rc(bx,Y-14+(Math.floor(t*4)%2),3,1,'#f2f6f4');Rc(bx+3,Y-14,3,1,'#f2f6f4')}Rc(X+14,Y-1,3,8,'#8c949c');Rc(X+14,Y-1,3,1,'#c7ced4');Rc(X+19,Y+2,3,5,'#6d7780');Rc(X+12,Y+7,10,1,'#5d656d')}
 else if(k===1){Rc(X-24,Y-4,48,3,'#8a5a33');Rc(X-22,Y-1,44,4,'#6b4226');Rc(X-18,Y+3,36,3,'#4a2f1a');Rc(X-10,Y,6,2,'#a85a3a');for(let i=0;i<8;i++)Rc(X-20+i*6,Y-4,1,3,'#4a2f1a');Rc(X-1,Y-26,2,23,'#4b2f1a');Rc(X+1,Y-24,13,11,'#cdbfa6');Rc(X+1,Y-14,8,3,'#cdbfa6');Rc(X+20,Y-9,4,5,'#8a5a33')}
 else if(k===3){Rc(X-16,Y-4,32,8,'#5d6b75');Rc(X-16,Y-4,32,1,'#8c949c');Rc(X-14,Y+4,2,5,'#3a444b');Rc(X+12,Y+4,2,5,'#3a444b');Rc(X-1,Y-30,2,26,'#8c949c');Rc(X-6,Y-24,12,3,'#d5e0e6');if(Math.floor(t*4)%2){Rc(X-1,Y-33,3,3,'#e0634f');Rc(X-6,Y-35,12,6,'rgba(224,99,79,.3)')}if((S.sig|0)>=2){Rc(X-14,Y-14,22,10,'#8c949c');Rc(X-14,Y-14,22,2,'#d5e0e6');for(let i=0;i<4;i++)Rc(X-11+i*5,Y-10,3,3,'#2f3a40')}}
 else if(k>=4)drawNew(isl,X,Y,ring)
 else{ring(r,'#6f7b82');ring(r-5,'#8c949c');Rc(X-4,Y-34,8,32,'#e8e2d4');for(let i=0;i<4;i++)Rc(X-4,Y-30+i*8,8,4,'#d65a4a');Rc(X-6,Y-38,12,4,'#2f3a40');Rc(X-1,Y-6,3,5,'#4a2f1a');if(dark()>.3||Math.floor(t*2)%2){Rc(X-8,Y-43,16,6,'rgba(242,211,106,.3)');Rc(X-3,Y-42,6,4,'#f2d36a')}}}
function drawRow(b){if(!rowing||ex)return;const a=Math.sin(t*6),x=Math.round(S.x),y=Math.round(S.y)+b-6,tx=Math.round(x-face.x*15),ty=Math.round(y-face.y*12+a*2);line(x,y,tx,ty,'#a8743f');Rc(tx-1,ty-1,3,3,'#8a5a33');if(Math.floor(t*5)%2)Rc(tx-3,ty+2,6,1,'#d9f4ee')}
function arrow(){if(S.tool.telescope&&!ex)items.forEach(i=>{if(i.k!=='crate')return;const sx=i.x-ox,sy=i.y-oy;if(sx>-6&&sx<VW+6&&sy>-6&&sy<VH+6)return;const a=Math.atan2(sy-VH/2,sx-VW/2),c=Math.cos(a),n=Math.sin(a),f=Math.min((VW/2-10)/(Math.abs(c)||.01),(VH/2-12)/(Math.abs(n)||.01));g.fillStyle='#6fcf7f';g.fillRect(Math.round(VW/2+c*f)-2,Math.round(VH/2+n*f)-2,5,5)});if(!isl||ex)return;const sx=isl.x-ox,sy=isl.y-oy;if(sx>-10&&sx<VW+10&&sy>-10&&sy<VH+10)return;const a=Math.atan2(sy-VH/2,sx-VW/2),c=Math.cos(a),n=Math.sin(a),f=Math.min((VW/2-10)/(Math.abs(c)||.01),(VH/2-12)/(Math.abs(n)||.01)),ax=VW/2+c*f,ay=VH/2+n*f;
 g.fillStyle=Math.floor(t*3)%2?'#e8c76a':'#fff3c4';for(let d=-4;d<=4;d++){const w=4-Math.abs(d);g.fillRect(Math.round(ax)-w,Math.round(ay)+d,w*2+1,1)}}
let radT=0;
const SIGM=['송신기 기록: 여기는 3번 플랫폼. 응답 바람.','연구 로그: 신호는 사람이 아닌 장치가 보내고 있다.','중앙 서버: 구조 신호의 근원을 찾았다.'];
const DIRS=['동','남동','남','남서','서','북서','북','북동'];
function dirOf(o){const[cx,cy]=center(),dx=o.x-cx,dy=o.y-cy,i=(Math.round(Math.atan2(dy,dx)/(Math.PI/4))+8)%8;return DIRS[i]+'쪽, 노로 약 '+Math.round(Math.hypot(dx,dy)/22)+'초'}
function useRadio(){if(dead||ex)return;
 if(isl&&isl.k===3&&!isl.done){toast('신호 발신지: '+dirOf(isl));return}
 if((S.sig|0)>=3){toast('새로운 신호는 없다. 이제 자유롭게 항해하자');return}
 if((S.sig|0)>=2&&!S.tool.lradio){toast('마지막 신호는 너무 멀다. 장거리 무전기가 필요하다');return}if(sk>.5&&!S.tool.lrs){toast('폭풍 때문에 신호가 잡히지 않는다');return}
 if(radT>0){toast('주파수를 맞추는 중… 잡음뿐이다 ('+Math.ceil(radT)+'초)');return}
 if(S.tool.lrs||Math.random()<(dark()>.5?.9:.6)){const[cx,cy]=center(),a=Math.random()*6.283;isl={x:cx+Math.cos(a)*300,y:cy+Math.sin(a)*300,r:22,k:3,done:false};toast('구조 신호 포착! '+dirOf(isl))}
 else{radT=15;toast('잡음뿐이다… 15초 뒤 다시 시도 (밤에 더 잘 잡힌다)')}}
function ending(){$('end').classList.add('on')}
$('endBtn').onclick=()=>$('end').classList.remove('on');
function dark(){return Math.max(0,Math.min(1,(.3-Math.cos(((S.tm||0)%240)/240*6.283))*1.1))}
function night(){const d=dark();if(d<.02)return;const pr=S.tool.torch?46:24,L=[[S.x-ox,S.y-6-oy,pr]];if(S.fur)L.push([S.fur[0]-ox,S.fur[1]-oy,34]);if(S.lan&&!bk('lantern'))L.push([S.lan[0]-ox,S.lan[1]-oy,44]);if(S.el&&(S.pw||0)>1)L.push([S.el[0]-ox,S.el[1]-oy,52]);const D=ensureNid().data,NW=nc.width,NH=nc.height;for(let j=0;j<NH;j++)for(let i=0;i<NW;i++){const x=i*4+2,y=j*4+2;let m=1;for(const[a,c,r]of L)m=Math.min(m,(Math.hypot(x-a,y-c)-r*.6)/(r*.7));m=Math.max(0,Math.min(1,m));const k=Math.min(4,Math.round(d*.76*m*5)),o=(j*NW+i)*4;D[o]=5;D[o+1]=12;D[o+2]=38;D[o+3]=k*51}nx.putImageData(nid,0,0);g.imageSmoothingEnabled=false;g.drawImage(nc,0,0,NW*4,NH*4)
 if(d>.5)for(let i=0;i<30;i++)if(Math.floor(t*2+i)%5){g.fillStyle=`rgba(230,245,255,${d*.6})`;g.fillRect((i*97+Math.floor(t*1.2))%VW,(i*53)%VH,1,1)}}
let splT=0;
const LOOT={4:(a,r)=>{a('metal',1+r(2));a('plastic',2);a('scrap',2);a('cloth',1)},5:(a,r)=>{a('scrap',4+r(3));a('metal',1);a('rope',2);a('cooked',1)},6:(a,r)=>{a('metal',2+r(2));a('scrap',3);a('cooked',2)},7:(a,r)=>{a('seed',3);a('berry',2);a('potato',1);if(Math.random()<.5)a('deep',1);a('metal',1)}},
LOGK={1:['폐선 항해일지: 우리는 신호를 따라 북쪽으로 향했다.','선장의 메모: 안개 속에서 불빛이 우리를 불렀다.'],4:['연구 기록 #1: 신호는 해저 장치에서 시작된다.','연구 기록 #2: 장치는 스스로 복제하고 있다.','연구 기록 #3: 우리는 너무 늦게 알았다.'],5:['플랫폼 일지: 3번 플랫폼은 신호를 중계하던 곳이다.','작업자 메모: 밤마다 바다가 빛났다. 플랑크톤이 아니었다.'],6:['작전 문서: 해역 봉쇄. 신호 근원 접근 금지.','병사의 메모: 위에서는 우리를 잊었다.'],7:['낡은 스케치: 섬이 계속 위치를 바꾼다.','기록: 이 씨앗은 신호가 닿는 곳에서만 자란다.']};
function addLog(x){S.log=S.log||[];if(!S.log.includes(x))S.log.push(x);save()}
function drawNew(i,X,Y,ring){const k=i.k,r=i.r;
 if(k===4){ring(r,'#8c949c');Rc(X-14,Y-14,28,16,'#d5e0e6');Rc(X-14,Y-14,28,2,'#fff');for(let n=0;n<4;n++)Rc(X-11+n*7,Y-9,4,4,Math.floor(t*2+n)%3?'#4fb3e0':'#1c2a33');Rc(X+8,Y-26,1,12,'#a9b8c2');Rc(X+6,Y-27,5,1,'#e0634f')}
 else if(k===5){Rc(X-24,Y-6,48,5,'#7a4a2a');Rc(X-24,Y-6,48,1,'#a86a3a');for(let n=0;n<5;n++)Rc(X-22+n*10,Y-1,2,9,'#4a2f1a');Rc(X+10,Y-24,3,18,'#b85a3a');Rc(X-2,Y-24,15,3,'#b85a3a');Rc(X-2,Y-21,1,10,'#8a99a4')}
 else if(k===6){ring(r,'#5d6b4a');ring(r-5,'#6f7f5a');Rc(X-14,Y-12,28,12,'#46523a');Rc(X-14,Y-12,28,2,'#6f7f5a');Rc(X-6,Y-6,12,6,'#1c2418');Rc(X+16,Y-22,1,14,'#2f3a40');Rc(X+17,Y-22,8,5,Math.floor(t*2)%2?'#d65a4a':'#a8402f')}
 else{ring(r,'#6a5a8a');ring(r-6,'#8a7aaa');for(let n=0;n<4;n++){const h=8+n*3,x=X-12+n*8;Rc(x,Y-h,4,h,'#b8a0e8');Rc(x,Y-h,2,h,'#e8dcff')}if(Math.floor(t*3)%2)Rc(X-2,Y-26,2,2,'#fff')}}
function fishFx(){g.fillStyle='rgba(8,50,64,.35)';for(let i=0;i<6;i++){const x=Math.round((i*83+t*(5+i*2))%(VW+40))-20,y=(i*47+20)%(VH-10);g.fillRect(x,y,6,2);g.fillRect(x-2,y,2,1);g.fillRect(x+6,y,1,1)}}
let sleepCd=0,fnT=30,stepT=0,crT=0,actT=0,tutT=0;const bk=id=>S.brk&&S.brk[id],nc=document.createElement('canvas'),nx=nc.getContext('2d');nc.width=80;nc.height=45;let nid=nx.createImageData(80,45);function ensureNid(){const w=Math.ceil(VW/4),h=Math.ceil(VH/4);if(nc.width!==w||nc.height!==h){nc.width=w;nc.height=h;nid=nx.createImageData(w,h)}return nid}
function brkNear(){if(!S.brk)return null;for(const id in S.brk){const o=S[FAC[id]];if(o&&Math.hypot(o[0]-S.x,o[1]-S.y)<24)return id}return null}
function stormFac(){if(Math.random()<.35*(S.tool.anchor?.4:1)){const ids=Object.keys(FAC).filter(i=>S[FAC[i]]&&!(S.brk&&S.brk[i]));if(ids.length){const i=ids[Math.random()*ids.length|0];(S.brk=S.brk||{})[i]=1;toast('폭풍에 '+R.find(x=>x.id===i).n+'이(가) 고장났다! 렌치·망치를 선택하고 가까이서 행동: 수리')}}}
const TUT=[['조이스틱/WASD로 이동해 보자',()=>S.x!==16||S.y!==16],['맨손(✋)을 고르고 떠다니는 자원 가까이서 행동 버튼으로 줍자',()=>Object.values(S.inv).reduce((a,b)=>a+(b|0),0)>16],['제작 → 도구에서 돌도끼와 돌망치를 만들어 목재 기술을 열자',()=>techOn('wood')],['목재 톱을 만들고 가공 탭에서 판자를 만들자',()=>got('plank')],['판자로 작업대를 설치하자 (제작 → 건축). 이후 정교한 제작은 작업대를 눌러서',()=>S.bn],['갈고리(슬롯에서 선택)나 간이 정수기로 자원과 물을 확보하자',()=>S.pur||S.tool.hook],['작업대를 눌러 점토와 돌로 화로를 만들자 (섬 탐사로 점토를 얻는다)',()=>S.fur],['뗏목 타일을 늘려 보자',()=>S.tiles.length>4]];
function tutTick(dt){const e=$('goal');S.tut=S.tut|0;if(S.tut>=TUT.length){e.style.display='none';return}e.style.display='block';e.textContent='목표: '+TUT[S.tut][0];tutT-=dt;if(tutT<=0){tutT=.5;if(TUT[S.tut][1]()){S.tut++;if(S.tut>=TUT.length)toast('기본 생존법을 익혔다! 이제 자유롭게 탐험하자')}}}
let jf=null,jfT=70,cfx=null;const CFC={fish:'#8aa9c4',mack:'#4a8a9a',tuna:'#3a4a8a',squid:'#d9a0b0',deep:'#6a3a8a'};
function jellyUpdate(dt){const[cx,cy]=center();if(!jf){if(dark()<.5)return;jfT-=dt;if(jfT<=0){const a=Math.random()*6.283;jf={x:cx+Math.cos(a)*120,y:cy+Math.sin(a)*120,hp:2,cd:0,life:60};toast('밤바다에 발광 해파리가 떠오른다! 창으로 쫓아내자')}return}
 jf.life-=dt;jf.cd-=dt;if(jf.life<=0||dark()<.3){jf=null;jfT=60+Math.random()*60;return}
 const d=Math.hypot(S.x-jf.x,S.y-jf.y)||1;if(d>14){const sp=Math.min(d,12*dt),nx=jf.x+(S.x-jf.x)/d*sp,ny=jf.y+(S.y-jf.y)/d*sp;if(!ok(nx,ny)){jf.x=nx;jf.y=ny}}
 if(d<20&&jf.cd<=0){jf.cd=2.5;S.hp-=6;S.st=Math.max(0,S.st-20);toast('해파리에 쏘였다!')}}
function drawJelly(){const x=Math.round(jf.x),y=Math.round(jf.y+Math.sin(t*2)*1.5);Rc(x-7,y-6,14,12,'rgba(180,130,255,.18)');Rc(x-4,y-3,8,4,'rgba(200,160,255,.7)');Rc(x-3,y-4,6,1,'rgba(235,215,255,.9)');for(let i=0;i<4;i++)Rc(x-3+i*2,y+1+((t*4+i)%2|0),1,4,'rgba(180,130,240,.6)')}
let tyk=0,tyOn=false,fallT=15,wh=null,whT=240;const CC={potato:'#d8b878',carrot:'#e8923a',tomato:'#e0434f',corn:'#e8d04a',berry:'#d83a5a',herb:'#5fae5a'},CR=['corn','carrot','tomato','berry','herb'],CV={corn:18,carrot:12,tomato:10,berry:8,herb:4};
let autoT=10;
function whaleUpdate(dt){const[cx,cy]=center();techT-=dt;if(techT<=0){techT=.5;techTick()}jellyUpdate(dt);tutTick(dt);if(sleepCd>0)sleepCd-=dt;if(S.fn&&!bk('fishnet')){fnT-=dt;if(fnT<=0){fnT=25+Math.random()*10;if((S.inv.fish|0)<20){S.inv.fish=(S.inv.fish|0)+1;renderInv();toast('낚시 시설이 생선을 낚았다')}}}if(S.fur&&Math.hypot(S.fur[0]-S.x,S.fur[1]-S.y)<60){crT-=dt;if(crT<=0){crT=.4+Math.random()*.8;}}
 if(S.tnk&&S.col&&S.colW>=90){const a=Math.min(S.colW-50,200-(S.tkW||0));if(a>0){S.colW-=a;S.tkW=(S.tkW||0)+a}}
 if(S.sol&&!bk('solar'))S.pw=Math.min(PWM(),(S.pw||0)+(dark()<.3&&sk<.3?(rk>.3?.4:2.5):0)*dt);
 if(S.gn&&!bk('gen')&&(S.fl||0)>0&&dark()>.3){S.pw=Math.min(PWM(),(S.pw||0)+2.5*(S.tool.bigpow?2:1)*dt);S.fl=Math.max(0,S.fl-.25*dt)}
 if(S.el&&dark()>.3&&(S.pw||0)>0)S.pw=Math.max(0,S.pw-.1*dt);
 if(S.tool.afarm&&S.pl&&S.pl[2]===1&&(S.pw||0)>1&&S.pl[4]<30){S.pl[4]=100;S.pw-=1}
 if(S.aut&&!bk('auto')){autoT-=dt;if(autoT<=0){autoT=10;let b=null,bd=90;items.forEach(i=>{const d=Math.hypot(i.x-S.aut[0],i.y-S.aut[1]);if(i.k!=='crate'&&d<bd){bd=d;b=i}});if(b&&S.inv[b.k]<20){items.splice(items.indexOf(b),1);S.inv[b.k]++;renderInv();toast('자동 수집: +1 '+T[b.k].n)}}}
 if(tyk>.5&&!ex&&!S.tool.anchor){fallT-=dt;if(fallT<=0){fallT=18+Math.random()*10;S.hp-=15;splT=.8;toast('파도에 휩쓸려 바다에 빠졌다! 생명력 -15 (닻이 있으면 막을 수 있다)')}}
 if(!wh){if(sk>.3)return;whT-=dt;if(whT<=0){const a=Math.random()*6.283;wh={x:cx+Math.cos(a)*260,y:cy+Math.sin(a)*260,vx:-Math.cos(a)*9,vy:-Math.sin(a)*9,gift:false,life:0};toast('🐋 거대한 고래가 다가온다…');}return}
 wh.life+=dt;wh.x+=wh.vx*dt;wh.y+=wh.vy*dt;
 if(!wh.gift&&Math.hypot(wh.x-cx,wh.y-cy)<90){wh.gift=true;for(let i=0;i<3;i++){spawn(true);const c=items[items.length-1];c.k='crate';c.x=wh.x+(Math.random()-.5)*50;c.y=wh.y+(Math.random()-.5)*50;c.vx*=.3;c.vy*=.3}toast('고래가 특별한 선물을 띄워 올렸다!');save()}
 if(wh.life>70){wh=null;whT=500+Math.random()*400}}
function drawWhale(){const x=Math.round(wh.x),y=Math.round(wh.y),s=wh.vx>0?1:-1,B=(a,b,w,h,c)=>Rc(s>0?x+a:x-a-w,y+b,w,h,c),u=Math.round(Math.sin(t*.8)*1.5);
 B(-24,-3+u,48,10,'#2f4a6b');B(-20,-6+u,36,4,'#2f4a6b');B(-22,4+u,40,4,'#c9d9e4');B(-28,-9+u,5,7,'#2f4a6b');B(-32,-13+u,5,6,'#2f4a6b');B(16,-1+u,2,2,'#0f2030');B(-20,-2+u,30,1,'#46688f');
 if(Math.floor(t*2)%4<2){Rc(x,y-12+u,1,6,'#d9f4ee');Rc(x-2,y-14+u,5,1,'#d9f4ee')}}
let bow=0;const birds=[[50,30,12],[200,62,9],[120,20,15]];
function extras(){const d=dark(),F=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)},ph=((S.tm||0)%240)/240;
 if(d>.03&&d<.9){g.fillStyle=(ph<.5?'rgba(255,130,50,':'rgba(255,170,190,')+Math.sin(d*Math.PI)*.16+')';g.fillRect(0,0,VW,VH)}
 g.globalAlpha=(d>.5?.12:.3)+rk*.25;for(let i=0;i<3;i++){const x=((i*140+t*(4+i*2))%(VW+100))-50,y=14+i*22;F(x,y,24,4,'#e8f3ef');F(x+4,y-3,14,3,'#e8f3ef');F(x+10,y-5,6,2,'#e8f3ef')}g.globalAlpha=1;
 if(splT>0){splT-=.016;for(let i=0;i<8;i++){const p=1-splT/.8,a=i*.8;F(S.x-ox+Math.cos(a)*p*14,S.y-oy-6-Math.sin(a*1.3)*p*14+p*p*10,2,2,'#d9f4ee')}}
 if(d<.35&&rk<.3&&sk<.3)birds.forEach(B=>{B[0]=(B[0]+B[2]*.016+340)%360;const x=B[0]-20,y=B[1]+Math.sin(t*2+B[2])*4,w=Math.floor(t*6+B[2])%2;F(x-3,y+w,3,1,'#f2f6f4');F(x,y+w,3,1,'#f2f6f4');F(x-1,y+1,2,1,'#f2f6f4')});
 if(bow>0){bow-=.016;g.globalAlpha=Math.min(1,bow/4)*.5;['#e0634f','#e8a24a','#e8d86a','#6fcf7f','#4fb3e0','#6a6fe0','#a06fd0'].forEach((c,i)=>{for(let a=0;a<=180;a+=2){const r=80+i*3,q=a*Math.PI/180;F(VW/2-Math.cos(q)*r,VH-50-Math.sin(q)*r*.8,2,2,c)}});g.globalAlpha=1}
 if(d>.4){g.globalAlpha=Math.min(1,d);for(let j=-6;j<=6;j++){const w=Math.round(Math.sqrt(36-j*j));F(VW-58-w,24+j,w*2,1,'#f4efd0')}F(VW-61,22,2,2,'#d9d2a8');F(VW-56,27,2,1,'#d9d2a8');g.globalAlpha=1;
  for(let i=0;i<36;i++)if(Math.floor(t*2+i)%4===0)F((i*83+Math.floor(t*3))%VW,(i*131)%VH,2,1,'rgba(120,255,230,'+d*.7+')');
  const sg=Math.floor(t/9);if(d>.6&&sg%9===1){const p=(t%9)/1.1;if(p<1){const x=40+p*140+(sg%3)*40,y=10+p*50;F(x,y,2,1,'#fff');F(x-6,y-3,5,1,'rgba(255,255,255,.5)');F(x-12,y-6,5,1,'rgba(255,255,255,.3)')}}}}
addEventListener('beforeunload',()=>{if(!dead)save()});document.addEventListener('visibilitychange',()=>{if(!dead)save()});
let last=performance.now();
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;if(!dead&&!panelOn){t+=dt;update(dt)}else t+=dt*(panelOn?0:1);fmTick(dt);draw();renderHud();rowUI();requestAnimationFrame(loop)}
hbInit();renderInv();toast('아래 슬롯에서 도구를 고르고 행동 버튼으로 사용 · 시설은 직접 눌러서 사용');requestAnimationFrame(loop);

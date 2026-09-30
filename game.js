const world = document.getElementById('world');
const player = document.getElementById('player');
const progress = document.getElementById('progress');
const modal = document.getElementById('modal');
const modalType = document.getElementById('modalType');
const modalText = document.getElementById('modalText');
const continueBtn = document.getElementById('continueBtn');
const final = document.getElementById('final');
const result = document.getElementById('result');
const restart = document.getElementById('restart');

const roommates = [
  {id:'tidy', type:'깔끔한 룸메이트', text:'깨끗하고 정돈된 공간이 좋아!'},
  {id:'quiet', type:'조용한 룸메이트', text:'혼자만의 편안한 시간이 좋아!'},
  {id:'active', type:'활발한 룸메이트', text:'같이 밥 먹고 놀면 더 재밌잖아!'}
];

let x = 100;
let vy = 0;
let jumping = false;
let paused = false;
let met = new Set();
const speed = 4.2;
const gravity = 0.65;
const jumpPower = -11;
const worldWidth = 2200;
const playerWidth = 78;

function setPlayer(){
  player.style.left = x + 'px';
  world.style.transform = `translateX(${-Math.max(0, Math.min(x-120, worldWidth-window.innerWidth+120))}px)`;
}
function jump(){
  if(paused || jumping) return;
  jumping = true; vy = jumpPower;
}
function showRoommate(r){
  paused = true;
  met.add(r.id);
  document.getElementById(r.id).classList.add('met');
  progress.textContent = `룸메이트 ${met.size} / 3`;
  modalType.textContent = r.type;
  modalText.textContent = r.text;
  modal.classList.remove('hidden');
}
function checkCollisions(){
  roommates.forEach(r=>{
    if(met.has(r.id)) return;
    const el = document.getElementById(r.id);
    const rx = parseFloat(el.style.left);
    if(x + playerWidth > rx && x < rx + 110){
      showRoommate(r);
    }
  });
}
function finishIfDone(){
  if(met.size === 3){
    setTimeout(()=>{
      final.classList.remove('hidden');
    },180);
  }
}
continueBtn.addEventListener('click', ()=>{
  modal.classList.add('hidden');
  paused = false;
  finishIfDone();
});
document.querySelectorAll('.choices button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.choices button').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    result.textContent = `💙 ${btn.dataset.choice}와 함께하면 좋겠어요!`;
  });
});
restart.addEventListener('click', ()=>location.reload());

const keys = {};
window.addEventListener('keydown', e=>{
  keys[e.key] = true;
  if(['ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
  if(e.key === ' ') jump();
});
window.addEventListener('keyup', e=>keys[e.key]=false);

function bindHold(id, key){
  const el=document.getElementById(id);
  const down=e=>{e.preventDefault();keys[key]=true};
  const up=e=>{e.preventDefault();keys[key]=false};
  ['pointerdown','touchstart'].forEach(ev=>el.addEventListener(ev,down,{passive:false}));
  ['pointerup','pointercancel','pointerleave','touchend'].forEach(ev=>el.addEventListener(ev,up,{passive:false}));
}
bindHold('leftBtn','ArrowLeft'); bindHold('rightBtn','ArrowRight');
document.getElementById('jumpBtn').addEventListener('pointerdown',e=>{e.preventDefault();jump()});

function loop(){
  if(!paused){
    if(keys.ArrowRight) x += speed;
    if(keys.ArrowLeft) x -= speed;
    x = Math.max(20, Math.min(worldWidth-150, x));
    if(jumping){
      vy += gravity;
      player.style.bottom = (105 - Math.max(0, -vy*0.2)) + 'px';
      // simple arc using velocity
      let bottom = parseFloat(player.dataset.bottom || '105');
      bottom += vy;
      if(bottom <= 105) player.dataset.bottom = bottom;
      if(bottom >= 105){bottom=105;vy=0;jumping=false;}
      player.style.bottom = bottom + 'px';
    } else {
      player.dataset.bottom='105';
      player.style.bottom='105px';
    }
    setPlayer();
    checkCollisions();
  }
  requestAnimationFrame(loop);
}
setPlayer();
loop();

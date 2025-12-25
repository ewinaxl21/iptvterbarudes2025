// Dark/Light Toggle
var toggleBtn = document.getElementById('toggleDark');
toggleBtn.addEventListener('click', function(){
  document.documentElement.classList.toggle('dark');
});

// Open/Close Player
var matchGrid = document.getElementById('matchGrid');
var playerWrapper = document.getElementById('playerWrapper');
var videoPlayer = document.getElementById('videoPlayer');
var playerTitle = document.getElementById('playerTitle');

function closePlayer(){
  playerWrapper.style.display='none';
  videoPlayer.pause();
  videoPlayer.src='';
}

// Swipe Gesture Mobile
var startY,startX;
videoPlayer.addEventListener('touchstart', function(e){
  startY=e.touches[0].clientY;
  startX=e.touches[0].clientX;
});
videoPlayer.addEventListener('touchmove', function(e){
  var deltaY=startY-e.touches[0].clientY;
  var deltaX=startX-e.touches[0].clientX;
  if(Math.abs(deltaY)>Math.abs(deltaX)){
    videoPlayer.volume+=deltaY>0?0.05:-0.05;
    if(videoPlayer.volume>1) videoPlayer.volume=1;
    if(videoPlayer.volume<0) videoPlayer.volume=0;
  }else{
    var brightness=parseFloat(videoPlayer.style.filter.replace('brightness(','').replace(')',''))||1;
    brightness+=deltaX>0?0.05:-0.05;
    if(brightness>2) brightness=2;
    if(brightness<0.1) brightness=0.1;
    videoPlayer.style.filter='brightness('+brightness+')';
  }
  startY=e.touches[0].clientY;
  startX=e.touches[0].clientX;
});

// Ambil Data dari Google Sheets
var SHEET_ID = "17kQ7qk7bxvqxtCttrTgx1Oteslrl6THRdbzR7PPLGgc";
var SHEET_URL = "https://spreadsheets.google.com/feeds/list/"+SHEET_ID+"/od6/public/values?alt=json";

fetch(SHEET_URL)
.then(function(res){ return res.json(); })
.then(function(data){
  var entries = data.feed.entry;
  for(var i=0;i<entries.length;i++){
    var item = entries[i];
    var home = item.gsx$home.$t;
    var away = item.gsx$away.$t;
    var time = item.gsx$time.$t;
    var s1 = item.gsx$s1.$t;

    var card = document.createElement('div');
    card.className='card';
    card.setAttribute('data-stream', s1);

    var h3 = document.createElement('h3');
    h3.textContent = home + ' vs ' + away;
    card.appendChild(h3);

    var pTime = document.createElement('p');
    pTime.textContent = 'Kick-Off: ' + time;
    card.appendChild(pTime);

    var pPred = document.createElement('p');
    pPred.textContent = 'Prediksi AI: ' + (Math.floor(Math.random()*60+40)) + '% ' + home + ' Menang';
    card.appendChild(pPred);

    var iklanDiv = document.createElement('div');
    iklanDiv.className='iklan';
    var iklanLink = document.createElement('a');
    iklanLink.href='https://www.effectivegatecpm.com/q3cunu75v?key=09505e89c16d20b3426fabe0f0f1b06e';
    iklanLink.target='_blank';
    iklanLink.textContent='Iklan 1x per match';
    iklanDiv.appendChild(iklanLink);

    card.appendChild(iklanDiv);
    matchGrid.appendChild(card);
  }
});

// Event Listener Play
matchGrid.addEventListener('click', function(e){
  var card=e.target.closest('.card');
  if(card){
    var stream = card.getAttribute('data-stream');
    var title = card.querySelector('h3').textContent;
    videoPlayer.src = stream;
    playerTitle.textContent = title;
    playerWrapper.style.display = 'flex';
    if(window.innerWidth<768){
      videoPlayer.requestFullscreen().catch(function(){});
    }
  }
});

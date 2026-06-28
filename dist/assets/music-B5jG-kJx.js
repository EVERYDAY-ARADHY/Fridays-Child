(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function d(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=d(n);fetch(n.href,s)}})();(function(){const t=document.createElement("canvas");t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.width="100vw",t.style.height="100vh",t.style.pointerEvents="none",t.style.zIndex="0",t.style.imageRendering="-moz-crisp-edges",t.style.imageRendering="-webkit-crisp-edges",t.style.imageRendering="pixelated",t.style.imageRendering="crisp-edges",document.body.appendChild(t);const e=t.getContext("2d",{alpha:!0});e.imageSmoothingEnabled=!1;const d=80,i="#ff27dc",n=.8,s=.15,u=.6;function g(){t.width=d,t.height=Math.ceil(d*(window.innerHeight/window.innerWidth)),e.imageSmoothingEnabled=!1}window.addEventListener("resize",g),g();let m=-100,p=-100,l=-100,a=-100;function y(c){let o,f;c.touches&&c.touches.length>0?(o=c.touches[0].clientX,f=c.touches[0].clientY):(o=c.clientX,f=c.clientY),m=o/window.innerWidth*t.width,p=f/window.innerHeight*t.height,l<0&&(l=m,a=p)}document.addEventListener("mousemove",y),document.addEventListener("touchmove",y),document.addEventListener("mouseenter",()=>{l=-100,m=-100});function r(){e.globalCompositeOperation="destination-out",e.fillStyle=`rgba(255, 255, 255, ${s})`,e.fillRect(0,0,t.width,t.height),e.globalCompositeOperation="source-over",m>=0&&p>=0&&(e.beginPath(),e.moveTo(l,a),l+=(m-l)*u,a+=(p-a)*u,e.lineTo(l,a),e.strokeStyle=i,e.lineWidth=n*2,e.lineCap="round",e.lineJoin="round",e.stroke()),requestAnimationFrame(r)}r()})();(function(){const t=[{name:"Cutecore Lofi",url:"https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"},{name:"Kawaii Beats",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3"},{name:"K-Pop Chill",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3"}];let e=parseInt(sessionStorage.getItem("fc_music_index")||"0");(isNaN(e)||e>=t.length)&&(e=0);const d=document.createElement("div");d.style.cssText=`
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: rgba(255, 240, 245, 0.85);
    backdrop-filter: blur(12px);
    border: 2px dashed #c44569;
    border-radius: 16px;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 24px rgba(139, 26, 74, 0.15), inset 0 2px 6px rgba(255,255,255,0.8);
    z-index: 9999;
    font-family: 'Space Mono', monospace;
    color: #8b1a4a;
    transition: transform 0.2s;
  `,d.innerHTML=`
    <span class="material-symbols-outlined" id="musicIcon" style="font-size:28px; color: #d4447a; filter: drop-shadow(2px 2px 0px rgba(196,69,105,0.3));">headphones</span>
    <div style="display:flex; flex-direction:column; min-width: 90px;">
      <span id="musicTitle" style="font-size:10px; font-weight:bold; letter-spacing:0.05em; text-transform: uppercase;">${t[e].name}</span>
      <span id="musicStatus" style="font-size:9px; opacity:0.8; font-family: 'Plus Jakarta Sans', sans-serif;">Paused</span>
    </div>
    <div style="display:flex; gap:6px;">
      <button id="musicPrevBtn" style="background:rgba(196,69,105,0.1); color:#8b1a4a; border:none; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition: all 0.1s;">
        <span class="material-symbols-outlined" style="font-size:16px;">skip_previous</span>
      </button>
      <button id="musicBtn" style="background:linear-gradient(135deg, #8b1a4a, #c44569); color:white; border:none; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow: 0 4px 0 #4a0e2e; transition: all 0.1s;">
        <span class="material-symbols-outlined" style="font-size:20px; font-variation-settings:'FILL' 1;" id="musicPlayIcon">play_arrow</span>
      </button>
      <button id="musicNextBtn" style="background:rgba(196,69,105,0.1); color:#8b1a4a; border:none; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition: all 0.1s;">
        <span class="material-symbols-outlined" style="font-size:16px;">skip_next</span>
      </button>
    </div>
  `,document.body.appendChild(d);const i=new Audio(t[e].url);i.loop=!0,i.volume=.25;const n=document.getElementById("musicBtn"),s=document.getElementById("musicPrevBtn"),u=document.getElementById("musicNextBtn"),g=document.getElementById("musicPlayIcon"),m=document.getElementById("musicStatus"),p=document.getElementById("musicIcon"),l=document.getElementById("musicTitle");let a=sessionStorage.getItem("fc_music_playing")==="true";const y=parseFloat(sessionStorage.getItem("fc_music_time")||"0");y>0&&(i.currentTime=y);function r(o){l.textContent=t[e].name,o?(g.textContent="pause",m.textContent="Playing... ~",p.style.animation="musicFloat 2s ease-in-out infinite"):(g.textContent="play_arrow",m.textContent="Paused",p.style.animation="none")}function c(o){const f=!i.paused;e=(e+o+t.length)%t.length,sessionStorage.setItem("fc_music_index",e),i.src=t[e].url,i.currentTime=0,f||a?(i.play().catch(h=>console.log(h)),r(!0)):r(!1)}if(s.addEventListener("click",()=>c(-1)),u.addEventListener("click",()=>c(1)),n.addEventListener("click",()=>{i.paused?(i.play(),a=!0,sessionStorage.setItem("fc_music_playing","true"),r(!0)):(i.pause(),a=!1,sessionStorage.setItem("fc_music_playing","false"),r(!1))}),a){let o=i.play();o!==void 0&&o.then(()=>{r(!0)}).catch(f=>{r(!1);const h=()=>{a&&(i.play(),r(!0)),document.removeEventListener("click",h)};document.addEventListener("click",h)})}if(window.addEventListener("beforeunload",()=>{sessionStorage.setItem("fc_music_time",i.currentTime)}),!document.getElementById("musicKeyframes")){const o=document.createElement("style");o.id="musicKeyframes",o.innerHTML=`
      @keyframes musicFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-4px) rotate(5deg); } }
      #musicBtn:active { transform: translateY(4px) !important; box-shadow: 0 0 0 #4a0e2e !important; }
      #musicPrevBtn:active, #musicNextBtn:active { transform: translateY(2px) !important; background:rgba(196,69,105,0.2) !important; }
    `,document.head.appendChild(o)}})();

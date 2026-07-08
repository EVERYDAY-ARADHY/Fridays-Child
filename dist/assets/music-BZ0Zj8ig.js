(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const u of i.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function d(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=d(n);fetch(n.href,i)}})();(function(){const t=document.createElement("canvas");t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.width="100vw",t.style.height="100vh",t.style.pointerEvents="none",t.style.zIndex="0",t.style.imageRendering="-moz-crisp-edges",t.style.imageRendering="-webkit-crisp-edges",t.style.imageRendering="pixelated",t.style.imageRendering="crisp-edges",document.body.appendChild(t);const e=t.getContext("2d",{alpha:!0});e.imageSmoothingEnabled=!1;const d=80,s="#ff27dc",n=.8,i=.15,u=.6;function f(){t.width=d,t.height=Math.ceil(d*(window.innerHeight/window.innerWidth)),e.imageSmoothingEnabled=!1}window.addEventListener("resize",f),f();let m=-100,p=-100,c=-100,a=-100;function y(l){let o,g;l.touches&&l.touches.length>0?(o=l.touches[0].clientX,g=l.touches[0].clientY):(o=l.clientX,g=l.clientY),m=o/window.innerWidth*t.width,p=g/window.innerHeight*t.height,c<0&&(c=m,a=p)}document.addEventListener("mousemove",y),document.addEventListener("touchmove",y),document.addEventListener("mouseenter",()=>{c=-100,m=-100});function r(){e.globalCompositeOperation="destination-out",e.fillStyle=`rgba(255, 255, 255, ${i})`,e.fillRect(0,0,t.width,t.height),e.globalCompositeOperation="source-over",m>=0&&p>=0&&(e.beginPath(),e.moveTo(c,a),c+=(m-c)*u,a+=(p-a)*u,e.lineTo(c,a),e.strokeStyle=s,e.lineWidth=n*2,e.lineCap="round",e.lineJoin="round",e.stroke()),requestAnimationFrame(r)}r()})();(function(){const t=[{name:"AUR - SHIKAYAT",url:"songs/aur-shikayat.mp3"},{name:"Fairytale",url:"songs/fairytale.mp3"},{name:"Aurora - Runaway",url:"songs/aurora-runaway.mp3"},{name:"Beach Weather",url:"songs/beach-weather.mp3"},{name:"Shinunoga E-Wa",url:"songs/fujii-kaze.mp3"},{name:"KHAIRIYAT",url:"songs/khairiyat.mp3"},{name:"Jhume Re Gori",url:"songs/jhume-re-gori.mp3"},{name:"Kabhi Kabhi Aditi",url:"songs/kabhi-kabhi.mp3"},{name:"Miracle",url:"songs/miracle.mp3"},{name:"NewJeans Ditto",url:"songs/newjeans-ditto.mp3"},{name:"Strawberries & Cigarettes",url:"songs/strawberries.mp3"},{name:"Surf Curse - Freaks",url:"songs/surf-curse.mp3"},{name:"TXT - Run Away",url:"songs/txt-runaway.mp3"},{name:"Love Story",url:"songs/love-story.mp3"},{name:"Tu Hai Kahan",url:"songs/tu-hai-kahan.mp3"},{name:"Maps",url:"songs/maps.mp3"},{name:"Tongue Tied",url:"songs/tongue-tied.mp3"}];let e=parseInt(sessionStorage.getItem("fc_music_index")||"0");(isNaN(e)||e>=t.length)&&(e=0);const d=document.createElement("div");d.style.cssText=`
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
  `,document.body.appendChild(d);const s=new Audio(encodeURI(t[e].url));s.volume=.25,s.addEventListener("ended",()=>{l(1)});const n=document.getElementById("musicBtn"),i=document.getElementById("musicPrevBtn"),u=document.getElementById("musicNextBtn"),f=document.getElementById("musicPlayIcon"),m=document.getElementById("musicStatus"),p=document.getElementById("musicIcon"),c=document.getElementById("musicTitle");let a=sessionStorage.getItem("fc_music_playing")==="true";const y=parseFloat(sessionStorage.getItem("fc_music_time")||"0");y>0&&(s.currentTime=y);function r(o){c.textContent=t[e].name,o?(f.textContent="pause",m.textContent="Playing... ~",p.style.animation="musicFloat 2s ease-in-out infinite"):(f.textContent="play_arrow",m.textContent="Paused",p.style.animation="none")}function l(o){const g=!s.paused;e=(e+o+t.length)%t.length,sessionStorage.setItem("fc_music_index",e),s.src=encodeURI(t[e].url),s.currentTime=0,g||a?(s.play().catch(h=>console.log(h)),r(!0)):r(!1)}if(i.addEventListener("click",()=>l(-1)),u.addEventListener("click",()=>l(1)),n.addEventListener("click",()=>{s.paused?(s.play(),a=!0,sessionStorage.setItem("fc_music_playing","true"),r(!0)):(s.pause(),a=!1,sessionStorage.setItem("fc_music_playing","false"),r(!1))}),a){let o=s.play();o!==void 0&&o.then(()=>{r(!0)}).catch(g=>{r(!1);const h=()=>{a&&(s.play(),r(!0)),document.removeEventListener("click",h)};document.addEventListener("click",h)})}if(window.addEventListener("beforeunload",()=>{sessionStorage.setItem("fc_music_time",s.currentTime)}),!document.getElementById("musicKeyframes")){const o=document.createElement("style");o.id="musicKeyframes",o.innerHTML=`
      @keyframes musicFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-4px) rotate(5deg); } }
      #musicBtn:active { transform: translateY(4px) !important; box-shadow: 0 0 0 #4a0e2e !important; }
      #musicPrevBtn:active, #musicNextBtn:active { transform: translateY(2px) !important; background:rgba(196,69,105,0.2) !important; }
    `,document.head.appendChild(o)}})();

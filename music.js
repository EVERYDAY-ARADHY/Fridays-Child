(function() {
  const SONGS = [
    { name: 'AUR - SHIKAYAT', url: 'songs/aur-shikayat.mp3' },
    { name: 'Fairytale', url: 'songs/fairytale.mp3' },
    { name: 'Aurora - Runaway', url: 'songs/aurora-runaway.mp3' },
    { name: 'Beach Weather', url: 'songs/beach-weather.mp3' },
    { name: 'Shinunoga E-Wa', url: 'songs/fujii-kaze.mp3' },
    { name: 'KHAIRIYAT', url: 'songs/khairiyat.mp3' },
    { name: 'Jhume Re Gori', url: 'songs/jhume-re-gori.mp3' },
    { name: 'Kabhi Kabhi Aditi', url: 'songs/kabhi-kabhi.mp3' },
    { name: 'Miracle', url: 'songs/miracle.mp3' },
    { name: 'NewJeans Ditto', url: "songs/newjeans-ditto.mp3" },
    { name: 'Strawberries & Cigarettes', url: 'songs/strawberries.mp3' },
    { name: 'Surf Curse - Freaks', url: 'songs/surf-curse.mp3' },
    { name: 'TXT - Run Away', url: 'songs/txt-runaway.mp3' },
    { name: 'Love Story', url: 'songs/love-story.mp3' },
    { name: 'Tu Hai Kahan', url: 'songs/tu-hai-kahan.mp3' },
    { name: 'Maps', url: 'songs/maps.mp3' }
  ];
  
  let currentSongIndex = parseInt(sessionStorage.getItem('fc_music_index') || '0');
  if (isNaN(currentSongIndex) || currentSongIndex >= SONGS.length) currentSongIndex = 0;
  
  // Create UI
  const container = document.createElement('div');
  container.style.cssText = `
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
  `;
  
  container.innerHTML = `
    <span class="material-symbols-outlined" id="musicIcon" style="font-size:28px; color: #d4447a; filter: drop-shadow(2px 2px 0px rgba(196,69,105,0.3));">headphones</span>
    <div style="display:flex; flex-direction:column; min-width: 90px;">
      <span id="musicTitle" style="font-size:10px; font-weight:bold; letter-spacing:0.05em; text-transform: uppercase;">${SONGS[currentSongIndex].name}</span>
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
  `;
  
  document.body.appendChild(container);

  const audio = new Audio(encodeURI(SONGS[currentSongIndex].url));
  audio.volume = 0.25; 
  
  audio.addEventListener('ended', () => {
    changeSong(1);
  });
  
  const btn = document.getElementById('musicBtn');
  const prevBtn = document.getElementById('musicPrevBtn');
  const nextBtn = document.getElementById('musicNextBtn');
  const icon = document.getElementById('musicPlayIcon');
  const status = document.getElementById('musicStatus');
  const musicIcon = document.getElementById('musicIcon');
  const title = document.getElementById('musicTitle');

  let isPlaying = sessionStorage.getItem('fc_music_playing') === 'true';
  const savedTime = parseFloat(sessionStorage.getItem('fc_music_time') || '0');
  
  if (savedTime > 0) {
    audio.currentTime = savedTime;
  }
  
  function updateUI(playing) {
    title.textContent = SONGS[currentSongIndex].name;
    if (playing) {
      icon.textContent = 'pause';
      status.textContent = 'Playing... ~';
      musicIcon.style.animation = 'musicFloat 2s ease-in-out infinite';
    } else {
      icon.textContent = 'play_arrow';
      status.textContent = 'Paused';
      musicIcon.style.animation = 'none';
    }
  }

  function changeSong(direction) {
    const wasPlaying = !audio.paused;
    currentSongIndex = (currentSongIndex + direction + SONGS.length) % SONGS.length;
    sessionStorage.setItem('fc_music_index', currentSongIndex);
    
    audio.src = encodeURI(SONGS[currentSongIndex].url);
    audio.currentTime = 0;
    
    if (wasPlaying || isPlaying) {
      audio.play().catch(e => console.log(e));
      updateUI(true);
    } else {
      updateUI(false);
    }
  }

  prevBtn.addEventListener('click', () => changeSong(-1));
  nextBtn.addEventListener('click', () => changeSong(1));

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      isPlaying = true;
      sessionStorage.setItem('fc_music_playing', 'true');
      updateUI(true);
    } else {
      audio.pause();
      isPlaying = false;
      sessionStorage.setItem('fc_music_playing', 'false');
      updateUI(false);
    }
  });

  // Attempt autoplay across page loads
  if (isPlaying) {
    let playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateUI(true);
      }).catch(e => {
        // Autoplay was blocked. Wait for the user's first click anywhere on the page to resume!
        updateUI(false);
        const resumeAudio = () => {
          if (isPlaying) {
             audio.play();
             updateUI(true);
          }
          document.removeEventListener('click', resumeAudio);
        };
        document.addEventListener('click', resumeAudio);
      });
    }
  }

  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('fc_music_time', audio.currentTime);
  });
  
  // Add keyframes
  if (!document.getElementById('musicKeyframes')) {
    const style = document.createElement('style');
    style.id = 'musicKeyframes';
    style.innerHTML = `
      @keyframes musicFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-4px) rotate(5deg); } }
      #musicBtn:active { transform: translateY(4px) !important; box-shadow: 0 0 0 #4a0e2e !important; }
      #musicPrevBtn:active, #musicNextBtn:active { transform: translateY(2px) !important; background:rgba(196,69,105,0.2) !important; }
    `;
    document.head.appendChild(style);
  }
})();

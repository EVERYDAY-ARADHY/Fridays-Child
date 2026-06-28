  
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      document.body.innerHTML += `<div style="position:fixed;top:10px;left:10px;background:white;color:red;padding:20px;z-index:9999;border:2px solid red;">ERROR: ${msg} <br/> Line: ${lineNo}</div>`;
      return false;
    };

    // ── Pixel Burst ─────────────────────────────────────
    const canvas=document.getElementById('burstCanvas'),ctx=canvas.getContext('2d');
    function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
    resize();window.addEventListener('resize',resize);
    const C=['#c44569','#8b1a4a','#d4447a','#ffc0cb','#ffb2bd','#6b1d4a','#ffffff'];
    let ps=[];
    class Px{constructor(x,y){const a=Math.random()*Math.PI*2,s=Math.random()*5+1.5;this.x=x;this.y=y;this.vx=Math.cos(a)*s;this.vy=Math.sin(a)*s-Math.random()*2;this.sz=Math.random()*6+2;this.c=C[Math.floor(Math.random()*C.length)];this.l=1;this.d=Math.random()*0.02+0.012;this.g=0.11;}update(){this.vy+=this.g;this.x+=this.vx;this.y+=this.vy;this.vx*=0.98;this.l-=this.d;}draw(){ctx.save();ctx.globalAlpha=Math.max(0,this.l);ctx.fillStyle=this.c;ctx.fillRect(Math.round(this.x),Math.round(this.y),this.sz,this.sz);ctx.restore();}}
    function burst(x,y,n=30){for(let i=0;i<n;i++)ps.push(new Px(x,y));}
    function loop(){ctx.clearRect(0,0,canvas.width,canvas.height);ps=ps.filter(p=>p.l>0);ps.forEach(p=>{p.update();p.draw();});requestAnimationFrame(loop);}
    loop();
    function ambient(){burst(Math.random()*canvas.width,Math.random()*canvas.height*0.75,14);setTimeout(ambient,Math.random()*6000+5000);}
    ambient();

    // ── Auth & Nav ──────────────────────────────────────
    const username=localStorage.getItem('fc_username')||'Guest';
    const role=localStorage.getItem('fc_role')||'guest';
    const isOwner=role==='owner';

    function buildNav(activePage){
      const badge=isOwner?`<span class="user-badge owner-badge">${username}</span>`:`<span class="user-badge">@${username}</span>`;
      let links=`<a href="home.html" class="nav-link${activePage==='dashboard'?' active':''}">Dashboard</a>`;
      links+=`<a href="gallery.html" class="nav-link${activePage==='gallery'?' active':''}">Gallery</a>`;
      if(isOwner) links+=`<a href="creation.html" class="nav-link${activePage==='studio'?' active':''}">Studio</a>`;
      links+=`<a href="about.html" class="nav-link${activePage==='about'?' active':''}">About</a>`;
      document.getElementById('topNav').innerHTML=`<a href="home.html" class="site-name">Friday's Child</a><nav style="display:flex;gap:4px;align-items:center;">${links}</nav><div style="display:flex;align-items:center;gap:12px;">${badge}</div>`;
    }
    buildNav('dashboard');
    if(isOwner) document.getElementById('ownerStrip').style.display='block';

    // ── Data & Reader State ─────────────────────────────
    const audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    function tone(f,t='sine',d=0.15,v=0.06){if(audioCtx.state==='suspended')audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(0.00001,audioCtx.currentTime+d);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+d);}

    const DEFAULT_ITEMS=[
      {id:'default_1',title:'Cloud Dream',type:'Art',image:'https://lh3.googleusercontent.com/aida-public/AB6AXuC5v1bjqylWuchVZdU5AG6GZj9MEJAfPcNjZRBLAnuMNqDJx7zrfQsJHD2y6yr2nunsRxG1C2gI4LZjY9httWimDoT9eLZ9H5h2HzEM2EYPTy2GNe4Gl1ffPbZBIY7MA0s6_M0Zo0JLmsIpQD93FKso8bWPpxxQzq80JtxJkszTtpt0lfSo9o4N2xXtmK-f4wLes8R39xhblNw4M33zNUJrI7Bjg2tPA7tZwJff4Qr6IsKI0Na-zDD5fDbPyKFt0erq_7NlpBR-ARwT',description:'Soft as cotton, sweet as dawn...',content:'Soft as cotton, sweet as dawn...',creator:'starry_night',likes:0},
      {id:'default_2',title:"Sprout's Song",type:'Poem',image:'https://lh3.googleusercontent.com/aida-public/AB6AXuChfnTjXeIzunLaH6zdcrya8Qav1s3IBWBvmfHDI_hHDQkJxMcdQOp72tJkXn_55L4SYVEzrUCXXxGbLQRdw9tUGeJGMebhu4JH3hloNpT6JzLbbTrirVBL0Z5dNl1zPuqIUHQDGDBDpcKOrZ7SoEAykj1O52xlAIMhKCgqJajcx_rXT_X_OTWxpIc8a6oMYBkYcmBeaQrceYZig8oWpH8oL2EVqifqmejS131Aqsx8nmJKPCIsTThQLoASkYsTnr4izXUJ20yn8jEU',description:'A little leaf stretches out.',content:'Reaching for the digital sun,\na little leaf stretches out.\nIn the glow of the screen,\nlife begins to sprout.',creator:'pixel_poet',likes:0},
      {id:'default_3',title:'Nap Time',type:'Art',image:'https://lh3.googleusercontent.com/aida-public/AB6AXuBgKUytzEDhlPlO6_7x-cfru0kyGwuHoU2bmvrLJmnVIuRq0PzsvKYfLU51H_tACqz8MdwMhNNJptvYAK_O5uhQkCLVWWy0P47YHuXAKF-OvdBlZlAyc7mkwJM61v3qdXkpH22jRnWQ0vl2v_j-hVDpmgiKJEY8w4PSH9uHGr0dSduiPQuagY_X5dl5NihhmHKQ6-0s64QbAcfFam_nM5x99vlUkoXHVB38kwELnmd7RJGGDPm2Ef16nTHMYbfnYAtRjZZNVxYmhPYV',description:'Charging batteries and dreaming of electric sheep.',content:'Charging batteries and dreaming of electric sheep.',creator:'cyber_snooze',likes:0},
      {id:'default_4',title:'Neon Rain',type:'Poem',image:'https://lh3.googleusercontent.com/aida-public/AB6AXuChfnTjXeIzunLaH6zdcrya8Qav1s3IBWBvmfHDI_hHDQkJxMcdQOp72tJkXn_55L4SYVEzrUCXXxGbLQRdw9tUGeJGMebhu4JH3hloNpT6JzLbbTrirVBL0Z5dNl1zPuqIUHQDGDBDpcKOrZ7SoEAykj1O52xlAIMhKCgqJajcx_rXT_X_OTWxpIc8a6oMYBkYcmBeaQrceYZig8oWpH8oL2EVqifqmejS131Aqsx8nmJKPCIsTThQLoASkYsTnr4izXUJ20yn8jEU',description:'Pink drops on a glass screen.',content:'Pink drops on a glass screen,\npixelated tears falling unseen.\nWashing away the static noise,\nbringing back my quiet joys.',creator:'Ms. Aditi',likes:0},
      {id:'default_5',title:'Star Catch',type:'Poem',image:'https://lh3.googleusercontent.com/aida-public/AB6AXuChfnTjXeIzunLaH6zdcrya8Qav1s3IBWBvmfHDI_hHDQkJxMcdQOp72tJkXn_55L4SYVEzrUCXXxGbLQRdw9tUGeJGMebhu4JH3hloNpT6JzLbbTrirVBL0Z5dNl1zPuqIUHQDGDBDpcKOrZ7SoEAykj1O52xlAIMhKCgqJajcx_rXT_X_OTWxpIc8a6oMYBkYcmBeaQrceYZig8oWpH8oL2EVqifqmejS131Aqsx8nmJKPCIsTThQLoASkYsTnr4izXUJ20yn8jEU',description:'Chasing cursors in the dark.',content:'I chased a cursor in the dark,\nit led me to a glowing park.\nWhere binary stars light the sky,\nand 8-bit clouds go floating by.',creator:'Ms. Aditi',likes:0},
      {id:'default_6',title:'Quiet Room',type:'Poem',image:'https://lh3.googleusercontent.com/aida-public/AB6AXuChfnTjXeIzunLaH6zdcrya8Qav1s3IBWBvmfHDI_hHDQkJxMcdQOp72tJkXn_55L4SYVEzrUCXXxGbLQRdw9tUGeJGMebhu4JH3hloNpT6JzLbbTrirVBL0Z5dNl1zPuqIUHQDGDBDpcKOrZ7SoEAykj1O52xlAIMhKCgqJajcx_rXT_X_OTWxpIc8a6oMYBkYcmBeaQrceYZig8oWpH8oL2EVqifqmejS131Aqsx8nmJKPCIsTThQLoASkYsTnr4izXUJ20yn8jEU',description:'Humming servers, peaceful minds.',content:'The server hums a gentle tune,\nbeneath a synthetic, soft moon.\nNo loud alerts, no frantic pace,\njust peace inside this digital space.',creator:'Ms. Aditi',likes:0},
      {id:'default_7',title:'Virtual Hug',type:'Poem',image:'https://lh3.googleusercontent.com/aida-public/AB6AXuChfnTjXeIzunLaH6zdcrya8Qav1s3IBWBvmfHDI_hHDQkJxMcdQOp72tJkXn_55L4SYVEzrUCXXxGbLQRdw9tUGeJGMebhu4JH3hloNpT6JzLbbTrirVBL0Z5dNl1zPuqIUHQDGDBDpcKOrZ7SoEAykj1O52xlAIMhKCgqJajcx_rXT_X_OTWxpIc8a6oMYBkYcmBeaQrceYZig8oWpH8oL2EVqifqmejS131Aqsx8nmJKPCIsTThQLoASkYsTnr4izXUJ20yn8jEU',description:'Sending warmth through the wires.',content:'A simple string of text I send,\nto reach you, my faraway friend.\nThough screens divide us, cold and wide,\nthis little message brings me to your side.',creator:'Ms. Aditi',likes:0},
      {id:'default_8',title:'Glitch Art',type:'Poem',image:'https://lh3.googleusercontent.com/aida-public/AB6AXuChfnTjXeIzunLaH6zdcrya8Qav1s3IBWBvmfHDI_hHDQkJxMcdQOp72tJkXn_55L4SYVEzrUCXXxGbLQRdw9tUGeJGMebhu4JH3hloNpT6JzLbbTrirVBL0Z5dNl1zPuqIUHQDGDBDpcKOrZ7SoEAykj1O52xlAIMhKCgqJajcx_rXT_X_OTWxpIc8a6oMYBkYcmBeaQrceYZig8oWpH8oL2EVqifqmejS131Aqsx8nmJKPCIsTThQLoASkYsTnr4izXUJ20yn8jEU',description:'Beauty in the broken code.',content:'A stuttering frame, a shifted line,\na beautiful mistake, almost divine.\nPerfection is boring, neat and clean,\nthe glitches are where the truth is seen.',creator:'Ms. Aditi',likes:0}
    ];

    function getAllItems(){
      const custom=JSON.parse(localStorage.getItem('fc_custom_items')||'[]');
      const deleted=JSON.parse(localStorage.getItem('fc_deleted_ids')||'[]');
      const edited=JSON.parse(localStorage.getItem('fc_edited_items')||'{}');
      return [...DEFAULT_ITEMS,...custom].filter(i=>!deleted.includes(i.id)).map(i=>edited[i.id]?{...i,...edited[i.id]}:i).map(i=>{
        if(!i.content) i.content = i.description;
        return i;
      });
    }

    let items=[],state='menu',menuIndex=0,readLines=[],readPage=0;
    const linesPerPage=5;

    function setViewState(newState) {
      state = newState;
      const main = document.getElementById('mainContainer');
      const header = document.getElementById('dashboardHeader');
      const reader = document.getElementById('readerContainer');
      const panel = document.getElementById('detailsPanel');
      const strip = document.getElementById('ownerStrip');
      
      if(state === 'read') {
        if(isOwner) strip.style.display = 'none';

        // Enlarge phone and shift left smoothly
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';

        // Move main container up to cover header gap
        main.style.transform = 'translateY(-80px)';
        main.style.gap = window.innerWidth > 768 ? '100px' : '40px';
        
        // Handle wide-mode for media (Art/Edit)
        const item = items[menuIndex];
        const isMedia = item.type === 'Art' || item.type === 'Edit';
        const frameEl = document.querySelector('.tama-frame');
        const screenEl = document.querySelector('.tama-screen');
        const sm = document.getElementById('screenMedia');
        
        if(isMedia) {
           frameEl.classList.add('wide-mode');
           screenEl.classList.add('wide-mode');
           if(item.isVideo) {
             sm.outerHTML = `<video id="screenMedia" class="screen-media" src="${item.image}" autoplay loop muted playsinline controls></video>`;
           } else {
             sm.outerHTML = `<img id="screenMedia" class="screen-media" src="${item.image}" />`;
           }
        } else {
           frameEl.classList.remove('wide-mode');
           screenEl.classList.remove('wide-mode');
           if (sm && sm.tagName === 'VIDEO') {
             sm.outerHTML = `<img id="screenMedia" class="screen-media" />`;
           }
        }
        
        // Force reflow so scaling calculations use the new dimensions
        reader.offsetHeight;

        // Scale reader to fill vertical space nicely but leave a margin at the bottom
        let scaleTarget = 1;
        let rightMargin = '0';
        if(window.innerWidth > 768) {
           const screenHeight = window.innerHeight;
           const readerHeight = reader.offsetHeight || 600;
           // fill 78% of screen height so it doesn't touch the bottom
           scaleTarget = (screenHeight * 0.78) / readerHeight;
           
           // Apply different caps for wide-mode vs portrait
           if(isMedia) {
             if(scaleTarget < 1.0) scaleTarget = 1.0;
             if(scaleTarget > 1.25) scaleTarget = 1.25; 
           } else {
             if(scaleTarget < 1.1) scaleTarget = 1.1;
             if(scaleTarget > 1.55) scaleTarget = 1.55; 
           }
           
           // Extra margin so it doesn't overlap details panel when scaled
           rightMargin = `${reader.offsetWidth * (scaleTarget - 1) + 40}px`;
        }

        reader.style.transform = `scale(${scaleTarget})`;
        reader.style.transformOrigin = window.innerWidth > 768 ? 'top left' : 'center';
        reader.style.marginRight = rightMargin; 
        
        panel.style.display = 'flex';
        setTimeout(() => panel.style.opacity = '1', 150); // slight delay for smooth flow
        
        // Load details panel data
        const item = items[menuIndex];
        document.getElementById('detailTitle').textContent = item.title;
        document.getElementById('detailCreator').textContent = '@' + (item.creator||'anonymous');
        
        const descEl = document.getElementById('detailDesc');
        descEl.textContent = item.description;
        
        // Reset desc state
        descExpanded = false;
        descEl.style.display = '-webkit-box';
        document.getElementById('editDescInput').style.display = 'none';
        document.getElementById('descDisplayControls').style.display = 'flex';
        document.getElementById('descEditControls').style.display = 'none';
        
        descEl.style.webkitLineClamp = '5';
        const seeMoreBtn = document.getElementById('seeMoreBtn');
        seeMoreBtn.textContent = 'See more';
        
        // Check if description is long enough to need See More
        setTimeout(() => {
          if(descEl.scrollHeight > descEl.clientHeight) {
            seeMoreBtn.style.display = 'block';
          } else {
            seeMoreBtn.style.display = 'none';
          }
        }, 10); // Small delay to allow render

        if(isOwner) {
          document.getElementById('editDescBtn').style.display = 'block';
        } else {
          document.getElementById('editDescBtn').style.display = 'none';
        }
        
        fetchLikes(item.id);
        loadComments(item.id);
      } else {
        if(isOwner) strip.style.display = 'block';

        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';

        main.style.transform = 'translateY(0)';
        main.style.gap = '60px';

        panel.style.opacity = '0';
        reader.style.transform = 'scale(1)';
        reader.style.marginRight = '0';
        
        // Remove wide-mode on return to menu
        document.querySelector('.tama-frame').classList.remove('wide-mode');
        document.querySelector('.tama-screen').classList.remove('wide-mode');
        const sm = document.getElementById('screenMedia');
        if (sm && sm.tagName === 'VIDEO') {
          sm.pause();
          sm.removeAttribute('src');
          sm.load();
        }
        
        setTimeout(() => panel.style.display = 'none', 400);
      }
      renderScreen();
    }

    function renderScreen(){
      const iconEl=document.getElementById('screenIcon'),textEl=document.getElementById('screenText');
      if(!items.length){iconEl.innerHTML=`<span class="material-symbols-outlined" style="font-size:44px;color:rgba(255,240,245,0.85);font-variation-settings:'FILL' 1;">menu_book</span>`;textEl.textContent="No stories\nor poems\nfound yet.";return;}
      
      if(state==='menu'){
        iconEl.innerHTML='';
        let start=Math.max(0,menuIndex-2);
        if(start+5>items.length)start=Math.max(0,items.length-5);
        let visible=items.slice(start,start+5);
        let display='--- LIBRARY ---\n';
        visible.forEach((it,idx)=>{
          let ri=start+idx;
          let safeTitle = (it && it.title) ? String(it.title).substring(0,14) : 'Unknown';
          display+=(ri===menuIndex?'> ':'  ')+safeTitle+'\n';
        });
        textEl.style.textAlign='left';textEl.textContent=display;
      } else {
        iconEl.innerHTML='';
        let start=readPage*linesPerPage;
        let visible=readLines.slice(start,start+linesPerPage);
        let pg=Math.floor(readLines.length/linesPerPage)||0;
        let display=`[${items[menuIndex].title.substring(0,12)}] ${readPage+1}/${pg+1}\n`;
        display+=visible.join('\n');
        textEl.style.textAlign='left';textEl.textContent=display;
      }
    }
    
    function chunkText(text){const words=text.split(/[ \n]+/);let lines=[],cur="";words.forEach(w=>{if((cur+w).length>18){lines.push(cur);cur=w+" ";}else cur+=w+" ";});if(cur)lines.push(cur);return lines;}
    
    function initReader(){items=getAllItems();menuIndex=0;setViewState('menu');}

    // Button Controls
    document.getElementById('btnUp').addEventListener('click',()=>{
      if(state==='menu'){tone(659,'sine',0.08);menuIndex=(menuIndex-1+items.length)%items.length;renderScreen();}
    });
    document.getElementById('btnDown').addEventListener('click',()=>{
      if(state==='menu'){tone(392,'sine',0.08);menuIndex=(menuIndex+1)%items.length;renderScreen();}
    });
    document.getElementById('btnLeft').addEventListener('click',()=>{
      if(state==='read'&&readPage>0){tone(494,'sine',0.1);readPage--;renderScreen();}
    });
    document.getElementById('btnRight').addEventListener('click',()=>{
      if(state==='read'&&(readPage+1)*linesPerPage<readLines.length){tone(587,'sine',0.1);readPage++;renderScreen();}
    });
    
    // Keyboard Support
    document.addEventListener('keydown', (e) => {
      // Don't trigger if typing in the comment box or editing description
      if(document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') return;
      
      if(e.key === 'ArrowUp') document.getElementById('btnUp').click();
      if(e.key === 'ArrowDown') document.getElementById('btnDown').click();
      if(e.key === 'ArrowLeft') document.getElementById('btnLeft').click();
      if(e.key === 'ArrowRight') document.getElementById('btnRight').click();
      if(e.key === 'Enter') document.getElementById('btnA').click();
      if(e.key === 'Escape') document.getElementById('btnB').click();
    });

    document.getElementById('btnA').addEventListener('click',()=>{
      tone(523,'triangle',0.1);
      if(state==='menu'&&items.length>0){
        readLines=chunkText(items[menuIndex].content);
        readPage=0;
        setViewState('read');
      }else if(state==='read'){
        if((readPage+1)*linesPerPage<readLines.length)readPage++;
      }
    });
    
    document.getElementById('btnB').addEventListener('click',()=>{
      tone(783,'triangle',0.15);
      if(state==='read') setViewState('menu');
    });
    
    document.getElementById('btnSta').addEventListener('click',()=>{
      tone(880,'square',0.2);
      if(items.length>0){
        menuIndex=Math.floor(Math.random()*items.length);
        readLines=chunkText(items[menuIndex].content);
        readPage=0;
        setViewState('read');
      }
    });

    initReader();

    // ── API Integration (Right Panel) ───────────────────
    async function fetchLikes(itemId){
      document.getElementById('likeCountText').textContent='...';
      const btn = document.getElementById('likeBtn');
      let likedItems = JSON.parse(localStorage.getItem('fc_liked_items') || '[]');
      let isLiked = likedItems.includes(itemId);
      
      if(isLiked) {
        btn.style.opacity = '0.6';
        btn.style.cursor = 'default';
      } else {
        btn.style.opacity = '1';
        btn.style.cursor = "pointer";
      }

      try {
        const res=await fetch(`/api/likes/${itemId}`);
        const data=await res.json();
        document.getElementById('likeCountText').textContent=`${data.count||0} ${isLiked ? 'Liked' : 'Likes'}`;
      } catch(e) {
        document.getElementById('likeCountText').textContent=`0 ${isLiked ? 'Liked' : 'Likes'}`;
      }
    }
    
    async function doLike(){
      if(state!=='read')return;
      const itemId = items[menuIndex].id;
      
      let likedItems = JSON.parse(localStorage.getItem('fc_liked_items') || '[]');
      if(likedItems.includes(itemId)) return; // already liked
      
      const btn=document.getElementById('likeBtn');
      burst(btn.getBoundingClientRect().x+50, btn.getBoundingClientRect().y, 40);
      try {
        const res=await fetch(`/api/likes/${itemId}`,{method:'POST'});
        const data=await res.json();
        
        likedItems.push(itemId);
        localStorage.setItem('fc_liked_items', JSON.stringify(likedItems));
        
        btn.style.opacity = '0.6';
        btn.style.cursor = 'default';
        document.getElementById('likeCountText').textContent=`${data.count||0} Liked`;
      } catch(e) {
        let cnt=parseInt(document.getElementById('likeCountText').textContent)||0;
        
        likedItems.push(itemId);
        localStorage.setItem('fc_liked_items', JSON.stringify(likedItems));
        
        btn.style.opacity = '0.6';
        btn.style.cursor = 'default';
        document.getElementById('likeCountText').textContent=`${cnt+1} Liked`;
      }
    }

    async function loadComments(itemId){
      const list=document.getElementById('commentsList');
      list.innerHTML='<div style="text-align:center;color:#837375;font-size:11px;">Loading notes...</div>';
      try {
        const res=await fetch(`/api/comments/${itemId}`);
        const comments=await res.json();
        if(!comments||!comments.length){
          list.innerHTML=`<div style="text-align:center;color:#837375;font-family:Space Mono,monospace;font-size:11px;">No notes yet (*.*)</div>`;
          return;
        }
        list.innerHTML=comments.map(c=>`
          <div class="comment-card" style="position:relative;">
            <div style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;color:#8b1a4a;margin-bottom:6px;">@${c.author}</div>
            <p style="font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:#514345;line-height:1.5;">${c.text}</p>
            ${isOwner ? `<button onclick="deleteComment('${c._id}')" style="position:absolute;top:12px;right:12px;background:none;border:none;color:#ba1a1a;cursor:pointer;"><span class="material-symbols-outlined" style="font-size:16px;">delete</span></button>` : ''}
          </div>
        `).join('');
      } catch(e) {
        list.innerHTML=`<div style="text-align:center;color:#ba1a1a;font-family:Space Mono,monospace;font-size:11px;">(Database connection failed)</div>`;
      }
    }

    async function postComment(){
      if(state!=='read')return;
      const itemId = items[menuIndex].id;
      const txt=document.getElementById('commentText').value.trim();
      if(!txt)return;
      document.getElementById('commentText').value='';
      try {
        await fetch(`/api/comments/${itemId}`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({author:username, text:txt})
        });
        loadComments(itemId);
        const btn=document.querySelector('.action-button');
        burst(btn.getBoundingClientRect().x, btn.getBoundingClientRect().y, 25);
      } catch(e) {
        alert("Couldn't connect to database!");
      }
    }
    
    async function deleteComment(cid) {
      if(!confirm("Delete this sweet note?")) return;
      try {
        await fetch('/api/comments/' + cid, { method: 'DELETE' });
        loadComments(items[menuIndex].id);
      } catch(e) {
        alert("Couldn't delete the note.");
      }
    }

    let descExpanded = false;
    function toggleDesc() {
      const descEl = document.getElementById('detailDesc');
      const btn = document.getElementById('seeMoreBtn');
      descExpanded = !descExpanded;
      if(descExpanded) {
        descEl.style.webkitLineClamp = 'unset';
        btn.textContent = 'See less';
      } else {
        descEl.style.webkitLineClamp = '5';
        btn.textContent = 'See more';
      }
    }

    function editDesc() {
      const item = items[menuIndex];
      const descEl = document.getElementById('detailDesc');
      const inputEl = document.getElementById('editDescInput');
      
      descEl.style.display = 'none';
      document.getElementById('descDisplayControls').style.display = 'none';
      
      inputEl.style.display = 'block';
      document.getElementById('descEditControls').style.display = 'flex';
      
      inputEl.value = item.description || '';
      inputEl.focus();
    }

    function cancelDesc() {
      document.getElementById('editDescInput').style.display = 'none';
      document.getElementById('descEditControls').style.display = 'none';
      document.getElementById('detailDesc').style.display = '-webkit-box';
      document.getElementById('descDisplayControls').style.display = 'flex';
    }

    function saveDesc() {
      const item = items[menuIndex];
      const newDesc = document.getElementById('editDescInput').value.trim();
      
      let edited = JSON.parse(localStorage.getItem('fc_edited_items')||'{}');
      if(!edited[item.id]) edited[item.id] = {};
      edited[item.id].description = newDesc;
      localStorage.setItem('fc_edited_items', JSON.stringify(edited));
      
      // Update current item and DOM
      item.description = newDesc;
      document.getElementById('detailDesc').textContent = newDesc;
      
      // Switch UI back
      cancelDesc();
      
      // Re-check overflow
      descExpanded = false;
      document.getElementById('detailDesc').style.webkitLineClamp = '5';
      const seeMoreBtn = document.getElementById('seeMoreBtn');
      seeMoreBtn.textContent = 'See more';
      setTimeout(() => {
        if(document.getElementById('detailDesc').scrollHeight > document.getElementById('detailDesc').clientHeight) {
          seeMoreBtn.style.display = 'block';
        } else {
          seeMoreBtn.style.display = 'none';
        }
      }, 10);
    }
  

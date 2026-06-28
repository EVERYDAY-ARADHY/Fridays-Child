(function() {
  // Setup Canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  
  // Force browser to render scaled-up canvas as pixelated squares
  canvas.style.imageRendering = '-moz-crisp-edges';
  canvas.style.imageRendering = '-webkit-crisp-edges';
  canvas.style.imageRendering = 'pixelated';
  canvas.style.imageRendering = 'crisp-edges';
  
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });
  ctx.imageSmoothingEnabled = false;
  
  // Configuration
  const GRID_SIZE = 80; // Smaller blocks
  const COLOR = '#ff27dc';
  const TRAIL_RADIUS = 0.8; // Thinner line
  const FADE_RATE = 0.15; // How fast it fades (0.15 = very fast)
  const INTERPOLATION = 0.6; // Agile lerp

  function resize() {
    canvas.width = GRID_SIZE;
    canvas.height = Math.ceil(GRID_SIZE * (window.innerHeight / window.innerWidth));
    ctx.imageSmoothingEnabled = false;
  }
  
  window.addEventListener('resize', resize);
  resize();

  // Pointer tracking
  let targetX = -100;
  let targetY = -100;
  let currentX = -100;
  let currentY = -100;

  function updateMouse(e) {
    let clientX, clientY;
    if(e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    targetX = (clientX / window.innerWidth) * canvas.width;
    targetY = (clientY / window.innerHeight) * canvas.height;
    
    // Jump instantly if the trail is far off screen (e.g. initial load)
    if(currentX < 0) { currentX = targetX; currentY = targetY; }
  }

  document.addEventListener('mousemove', updateMouse);
  document.addEventListener('touchmove', updateMouse);
  document.addEventListener('mouseenter', () => {
    currentX = -100;
    targetX = -100;
  });

  function draw() {
    // 1. Fade existing trail smoothly
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(255, 255, 255, ${FADE_RATE})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Draw new segment
    ctx.globalCompositeOperation = 'source-over';
    
    if (targetX >= 0 && targetY >= 0) {
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      
      // Interpolate towards target
      currentX += (targetX - currentX) * INTERPOLATION;
      currentY += (targetY - currentY) * INTERPOLATION;
      
      ctx.lineTo(currentX, currentY);
      ctx.strokeStyle = COLOR;
      ctx.lineWidth = TRAIL_RADIUS * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    
    requestAnimationFrame(draw);
  }
  
  draw();
})();

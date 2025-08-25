"use strict";

/* ================= Year & Cookie Consent ================= */
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const bar = document.getElementById('cookiebar');
  const consent = window.localStorage ? localStorage.getItem('cookie-consent') : null;
  if (bar && !consent) { bar.classList.remove('hidden'); }

  const accept = document.getElementById('cookie-accept');
  const decline = document.getElementById('cookie-decline');
  if (accept) accept.addEventListener('click', ()=>{
    try { localStorage.setItem('cookie-consent','all'); } catch(e){}
    if (bar) bar.classList.add('hidden');
  });
  if (decline) decline.addEventListener('click', ()=>{
    try { localStorage.setItem('cookie-consent','necessary'); } catch(e){}
    if (bar) bar.classList.add('hidden');
  });
})();


/* ================= Galerie Slider (one-by-one, auto, loop, keys, touch, modal) ================= */
(function(){
  const slider  = document.getElementById('slider');
  const track   = document.getElementById('slider-track');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  if (!slider || !track) return;

  const slides  = Array.from(track.querySelectorAll('img'));
  let index = 0;
  let step  = 0;
  let timer = null;

  function computeStep(){
    if (!slides.length) { step = 0; return; }
    const s = slides[0];
    const rect = s.getBoundingClientRect();
    const cs = getComputedStyle(s);
    const ml = parseFloat(cs.marginLeft)  || 0;
    const mr = parseFloat(cs.marginRight) || 0;
    step = rect.width + ml + mr;
  }

  function update(){
    track.style.transform = `translateX(-${index * step}px)`;
  }

  function go(i){
    const max = slides.length;
    index = (i + max) % max;
    update();
  }

  window.addEventListener('resize', ()=>{ computeStep(); update(); });
  if (prevBtn) prevBtn.addEventListener('click', ()=>go(index - 1));
  if (nextBtn) nextBtn.addEventListener('click', ()=>go(index + 1));

  function startAuto(){ if(timer) return; timer = setInterval(()=>go(index+1), 4000); }
  function stopAuto(){ if(!timer) return; clearInterval(timer); timer = null; }
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  let startX = null;
  slider.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; stopAuto(); }, {passive:true});
  slider.addEventListener('touchend', e=>{
    if(startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 50){ dx < 0 ? go(index+1) : go(index-1); }
    startX = null; startAuto();
  }, {passive:true});

  const modal    = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');

  slides.forEach(img => {
    img.addEventListener('click', ()=>{
      if (!modal || !modalImg) return;
      modalImg.src = img.src;
      modal.classList.add('show');
    });
  });

  function closeModal(){
    if (!modal || !modalImg) return;
    modal.classList.remove('show');
    setTimeout(()=>{ modalImg.src = ''; }, 200);
  }
  if (modal) {
    modal.addEventListener('click', e=>{ if(e.target === modal) closeModal(); });
    window.addEventListener('keydown', e=>{ if(e.key === 'Escape') closeModal(); });
  }

  computeStep();
  update();
  startAuto();
})();


/* ================= Smooth Scroll + ScrollSpy ================= */
(function(){
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('header nav a[href^="#"]'));
  if (!sections.length || !navLinks.length) return;

  const linkById = new Map(navLinks.map(a => [a.getAttribute('href'), a]));

  const spy = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        navLinks.forEach(a=>a.classList.remove('active'));
        const link = linkById.get('#'+en.target.id);
        if(link){ link.classList.add('active'); }
      }
    });
  },{ rootMargin:'-60% 0px -35% 0px', threshold:0.01 });

  sections.forEach(s=>spy.observe(s));
})();

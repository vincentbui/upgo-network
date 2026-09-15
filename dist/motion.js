(() => {
  const scrollProgress = document.querySelector('[data-scroll-progress]');
  if (scrollProgress) {
    let scrollProgressQueued = false;
    const updateScrollProgress = () => {
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
      scrollProgressQueued = false;
    };
    const queueScrollProgress = () => {
      if (scrollProgressQueued) return;
      scrollProgressQueued = true;
      requestAnimationFrame(updateScrollProgress);
    };
    updateScrollProgress();
    window.addEventListener('scroll', queueScrollProgress, { passive: true });
    window.addEventListener('resize', queueScrollProgress);
  }

  const splash = document.querySelector('[data-site-splash]');
  if (splash) {
    let splashSeen = false;
    try { splashSeen = sessionStorage.getItem('upgo_first_visit_splash_v1') === '1'; } catch {}
    if (splashSeen) {
      splash.remove();
      document.body.classList.remove('splash-active');
    } else {
      try { sessionStorage.setItem('upgo_first_visit_splash_v1', '1'); } catch {}
      document.body.classList.add('splash-active');
      requestAnimationFrame(() => splash.classList.add('is-running'));
      const splashReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const splashDuration = splashReduced ? 220 : 1450;
      window.setTimeout(() => {
        splash.classList.add('is-leaving');
        document.body.classList.remove('splash-active');
      }, splashDuration);
      window.setTimeout(() => splash.remove(), splashDuration + (splashReduced ? 80 : 500));
    }
  }

  // Fixed reading speed and exact repeat distance prevent a jump at the seam.
  const ticker = document.querySelector('.ticker');
  const track = ticker.querySelector('.ticker-track');
  const originalItems = [...track.children].filter(el => el.getAttribute('aria-hidden') !== 'true');
  function sizeTicker() {
    track.classList.remove('ticker-ready');
    [...track.children].filter(el => el.getAttribute('aria-hidden') === 'true').forEach(el => el.remove());
    const distance = originalItems.reduce((sum,el) => sum + el.getBoundingClientRect().width + parseFloat(getComputedStyle(el).marginRight || 0),0);
    if (!distance) return;
    const repeats = Math.ceil(ticker.clientWidth / distance) + 1;
    for (let i=0;i<repeats;i++) originalItems.forEach(el => { const clone=el.cloneNode(true);clone.setAttribute('aria-hidden','true');track.append(clone); });
    track.style.setProperty('--ticker-distance',`-${distance}px`);
    track.style.setProperty('--ticker-duration',`${distance / 40}s`);
    track.classList.add('ticker-ready');
  }
  sizeTicker();
  if (document.fonts) document.fonts.ready.then(sizeTicker);
  let tickerResize;
  window.addEventListener('resize',()=>{clearTimeout(tickerResize);tickerResize=setTimeout(sizeTicker,150);});
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.section-heading,.advantage-grid article,.insight-card,.offer-carousel,.final-cta').forEach((el,i) => {
      el.style.setProperty('--reveal-delay', `${i % 3 * 70}ms`);
      el.classList.add('reveal-ready'); reveal.observe(el);
    });
  }
  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', e => {
    if (reduced.matches || e.pointerType !== 'mouse') return;
    const box = hero.getBoundingClientRect();
    hero.style.setProperty('--hero-x', `${((e.clientX-box.left)/box.width-.5)*22}px`);
    hero.style.setProperty('--hero-y', `${((e.clientY-box.top)/box.height-.5)*18}px`);
  });
  hero.addEventListener('pointerleave', () => {hero.style.setProperty('--hero-x','0px');hero.style.setProperty('--hero-y','0px');});
  const offersSection=document.querySelector('.offers');
  const offerStage=offersSection?.querySelector('.offer-stage');
  if(offerStage&&!reduced.matches){
    let offerGlowFrame=0;
    offerStage.addEventListener('pointermove',e=>{
      if(e.pointerType!=='mouse')return;
      cancelAnimationFrame(offerGlowFrame);
      offerGlowFrame=requestAnimationFrame(()=>{
        const box=offerStage.getBoundingClientRect();
        offerStage.style.setProperty('--offer-glow-x',`${e.clientX-box.left}px`);
        offerStage.style.setProperty('--offer-glow-y',`${e.clientY-box.top}px`);
        offerStage.style.setProperty('--offer-glow-opacity','1');
      });
    });
    offerStage.addEventListener('pointerleave',()=>offerStage.style.setProperty('--offer-glow-opacity','0'));
  }
  if ('IntersectionObserver' in window) {
    const nav = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.desktop-nav a').forEach(a => {
        if (a.hash === '#'+entry.target.id) a.setAttribute('aria-current','location');
        else a.removeAttribute('aria-current');
      });
    }), {rootMargin:'-15% 0px -50% 0px'});
    document.querySelectorAll('section[id]').forEach(el => nav.observe(el));
  }
  const banner = document.querySelector('.event-banner');
  const copy = banner.querySelector('.event-copy');
  const events = [
    ['LAUNCH WEEK','Thế hệ Publisher đầu tiên. Cùng UPGO.','Khởi đầu cùng Affiliate Manager, tìm Offer phù hợp với nguồn Traffic của bạn.'],
    ['WEBINAR','Từ test đến scale. Cùng chuyên gia.','Chọn Offer, test creative, tối ưu campaign. Lịch chia sẻ đang được cập nhật.'],
    ['OFFER UPDATE','Offer mới. Cơ hội mới tại SEA.','Khám phá Nutra & Beauty cho nguồn Traffic của bạn. Danh mục đang được cập nhật.']
  ];
  const controls = document.createElement('div'); controls.className='event-controls'; controls.setAttribute('aria-label','Điều khiển banner');
  let index=0, paused=reduced.matches, hovered=false, focused=false;
  const buttons=events.map((event,i) => {
    const b=document.createElement('button');b.type='button';b.className='event-dot';b.setAttribute('aria-label',`Banner ${i+1}: ${event[0]}`);
    b.addEventListener('click',()=>{render(i);});controls.append(b);return b;
  });
  function arrow(direction,label){
    const button=document.createElement('button');button.type='button';button.className='event-arrow';button.setAttribute('aria-label',label);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',direction<0?'M15 6l-6 6 6 6':'M9 6l6 6-6 6');svg.append(path);button.append(svg);
    button.addEventListener('click',()=>render(index+direction));return button;
  }
  controls.prepend(arrow(-1,'Banner trước'));controls.append(arrow(1,'Banner tiếp theo'));banner.append(controls);
  controls.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();render(index+(e.key==='ArrowRight'?1:-1));}});
  const visuals=[...banner.querySelectorAll('.event-visual')];
  const ready=visuals.map(img=>img.decode ? img.decode().catch(()=>{}) : Promise.resolve());
  let eventRevision=0;
  async function render(i,animate=true){
    const next=(i+events.length)%events.length;
    if(animate&&next===index)return;
    const revision=++eventRevision;index=next;
    await ready[next];if(revision!==eventRevision)return;
    copy.getAnimations().forEach(animation=>animation.cancel());
    if(animate){
      const out=copy.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'});
      await out.finished.catch(()=>{});if(revision!==eventRevision)return;out.cancel();
    }
    copy.querySelector('h2').textContent=events[next][1];copy.querySelector('p').textContent=events[next][2];
    copy.querySelector('.event-label span').textContent=events[next][0];
    buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(next===j)));
    visuals.forEach((img,j)=>img.classList.toggle('is-active',next===j));
    if(animate)copy.animate([{opacity:0,transform:reduced.matches?'none':'translateY(8px)'},{opacity:1,transform:'none'}],{duration:440,easing:'cubic-bezier(.2,.7,.2,1)'});
  }
  render(0,false);
  banner.addEventListener('pointerenter',()=>{hovered=true;});banner.addEventListener('pointerleave',()=>{hovered=false;});
  banner.addEventListener('focusin',()=>{focused=true;});banner.addEventListener('focusout',e=>{focused=banner.contains(e.relatedTarget);});
  window.setInterval(()=>{if(!paused&&!hovered&&!focused&&!document.hidden&&!reduced.matches)render((index+1)%events.length);},6500);
  reduced.addEventListener('change',()=>{paused=reduced.matches;});
  const stage=document.querySelector('.offer-stage');let start=null;
  stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')start={x:e.clientX,y:e.clientY};});
  stage.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)selectOffer(activeOffer+(dx<0?1:-1));});
  stage.addEventListener('pointercancel',()=>{start=null;});
  document.querySelector('.carousel-tabs').removeAttribute('role');
  const offerControls=document.querySelector('.carousel-controls');
  offerControls.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();selectOffer(activeOffer+(e.key==='ArrowRight'?1:-1));}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){mobileNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}});
})();

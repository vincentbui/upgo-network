(() => {
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
    ['EVENT','UPGO Launch Week — Ưu đãi đăng ký Publisher đầu tiên','Tham gia tuần ra mắt để nhận hỗ trợ ưu tiên từ Affiliate Manager. Chương trình minh họa, thông tin chính thức đang cập nhật.'],
    ['WEBINAR','Từ test đến scale — Cùng Affiliate Manager','Trao đổi về lựa chọn Offer, test creative và tối ưu campaign. Lịch webinar minh họa đang chờ xác nhận.'],
    ['OFFER UPDATE','Khám phá cơ hội mới tại thị trường SEA','Danh mục Nutra và Beauty dành cho Publisher đang được chuẩn bị. Nội dung minh họa cho bản preview.']
  ];
  const controls = document.createElement('div'); controls.className='event-controls'; controls.setAttribute('aria-label','Điều khiển banner');
  let index=0, paused=reduced.matches, hovered=false, focused=false;
  const buttons=events.map((event,i) => {
    const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label',`Banner ${i+1}: ${event[0]}`);
    b.addEventListener('click',()=>{render(i);});controls.append(b);return b;
  });
  const pause=document.createElement('button');pause.type='button';pause.className='event-pause';controls.append(pause);copy.append(controls);
  function setPauseLabel(){pause.textContent=paused?'Phát tự động':'Tạm dừng';pause.setAttribute('aria-pressed',String(paused));}
  pause.addEventListener('click',()=>{paused=!paused;setPauseLabel();});setPauseLabel();
  function render(i){
    index=i;copy.querySelector('h2').textContent=events[i][1];copy.querySelector('p').textContent=events[i][2];
    const labels=copy.querySelectorAll('.event-label span');labels[0].textContent=events[i][0];labels[1].textContent=`${String(i+1).padStart(2,'0')} / 03 · MINH HỌA`;
    buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
    copy.classList.remove('content-enter');requestAnimationFrame(()=>copy.classList.add('content-enter'));
  }
  render(0);
  banner.addEventListener('pointerenter',()=>{hovered=true;});banner.addEventListener('pointerleave',()=>{hovered=false;});
  banner.addEventListener('focusin',()=>{focused=true;});banner.addEventListener('focusout',e=>{focused=banner.contains(e.relatedTarget);});
  window.setInterval(()=>{if(!paused&&!hovered&&!focused&&!document.hidden&&!reduced.matches)render((index+1)%events.length);},6500);
  reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;setPauseLabel();}});
  const stage=document.querySelector('.offer-stage');let start=null;
  stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')start={x:e.clientX,y:e.clientY};});
  stage.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showOffer(activeOffer+(dx<0?1:-1));});
  stage.addEventListener('pointercancel',()=>{start=null;});
  document.querySelector('.carousel-tabs').removeAttribute('role');
  const offerControls=document.querySelector('.carousel-controls');
  offerControls.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showOffer(activeOffer+(e.key==='ArrowRight'?1:-1));}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){mobileNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}});
})();

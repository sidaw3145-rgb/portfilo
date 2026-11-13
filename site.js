const dlg=document.querySelector('dialog'), body=dlg.querySelector('.dialog-body'), close=dlg.querySelector('.close');
function showCase(id){const detail=document.getElementById(id);if(!detail?.classList.contains('detail')||typeof dlg.showModal!=='function')return false;const copy=detail.cloneNode(true);copy.removeAttribute('id');copy.querySelector('h2').id='active-case-title';copy.setAttribute('aria-labelledby','active-case-title');body.replaceChildren(copy);dlg.setAttribute('aria-labelledby','active-case-title');if(!dlg.open)dlg.showModal();dlg.scrollTop=0;close.focus();return true}
document.querySelectorAll('[data-case]').forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;if(showCase(a.dataset.case)){e.preventDefault();history.pushState({case:true},'','#'+a.dataset.case)}}));
const sync=()=>{if(!showCase(location.hash.slice(1))&&dlg.open)dlg.close()};window.addEventListener('hashchange',sync);sync();
close.addEventListener('click',()=>dlg.close());dlg.addEventListener('click',e=>{if(e.target===dlg){const r=dlg.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dlg.close()}});
dlg.addEventListener('close',()=>{if(document.getElementById(location.hash.slice(1))?.classList.contains('detail')){if(history.state?.case)history.back();else history.replaceState(null,'',location.pathname+location.search+'#work')}});

let frame = 0;
function updateProgress() {
  frame = 0;
  const max = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty('--page-progress', max > 0 ? Math.max(0, Math.min(1, scrollY / max)) : 0);
}
function scheduleProgress(){if(!frame)frame=requestAnimationFrame(updateProgress)}
window.addEventListener('scroll', scheduleProgress, {passive:true});
window.addEventListener('resize', scheduleProgress);
window.addEventListener('load', scheduleProgress);
scheduleProgress();

const motion = matchMedia('(prefers-reduced-motion: no-preference)');
if ('IntersectionObserver' in window) {
  const targets = [...document.querySelectorAll('.section-top,.case,.credential-row,.skill-item,.contact')];
  const reveal = new IntersectionObserver(entries => {
    let order = 0;
    for (const {target, isIntersecting} of entries) {
      if (!motion.matches) continue;
      if (!isIntersecting) {
        target.classList.remove('arrived');
        continue;
      }
      target.style.setProperty('--entry-delay', `${Math.min(order++, 3) * 85}ms`);
      target.classList.add('arrived');
    }
  });

  function setupArrival() {
    reveal.disconnect();
    for (const target of targets) {
      target.classList.remove('scroll-entry', 'arrived');
      if (motion.matches) {
        target.classList.add('scroll-entry');
        reveal.observe(target);
      }
    }
  }

  document.querySelectorAll('.case,.skill-item').forEach((element, index) => {
    element.dataset.entry = index % 2 === 0 ? 'left' : 'right';
  });
  motion.addEventListener('change', setupArrival);
  setupArrival();
}

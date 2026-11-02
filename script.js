const links = document.querySelectorAll('[data-section]');
const pages = document.querySelectorAll('[data-page]');
const modal = document.querySelector('#video-modal');
const player = document.querySelector('#video-player');
const modalTitle = document.querySelector('#video-title');

function showPage(id, projectId = null) {
  document.body.classList.toggle('viewing-home', id === 'home');
  document.body.classList.toggle('viewing-photos', id === 'photos');
  pages.forEach((page) => page.classList.toggle('active', page.id === id));
  links.forEach((link) => {
    const active = link.dataset.section === id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelector('.projects-overview').hidden = Boolean(projectId);
  document.querySelector('.project-cases').hidden = !projectId;
  document.querySelectorAll('.project-case').forEach((project) => { project.hidden = project.id !== projectId; });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

links.forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  if (location.hash === `#${link.dataset.section}`) showPage(link.dataset.section);
  else location.hash = link.dataset.section;
}));

document.querySelectorAll('[data-video]').forEach((item) => item.addEventListener('click', () => {
  player.src = item.dataset.video;
  modalTitle.textContent = item.dataset.title || 'Video';
  modal.showModal();
}));

document.querySelector('.close-modal').addEventListener('click', () => modal.close());
modal.addEventListener('close', () => { player.src = ''; });
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });

document.querySelectorAll('.rail-button').forEach((button) => button.addEventListener('click', () => {
  const rail = button.closest('.photo-series').querySelector('.photo-rail');
  const amount = rail.clientWidth * 0.75 * (button.dataset.railDirection === 'left' ? -1 : 1);
  rail.scrollBy({ left: amount, behavior: 'smooth' });
}));

document.querySelectorAll('.photo-rail').forEach((rail) => {
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = false;

  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || rail.scrollWidth <= rail.clientWidth + 2) return;
    isDragging = true;
    moved = false;
    startX = event.clientX;
    startScrollLeft = rail.scrollLeft;
  });

  rail.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    const distance = event.clientX - startX;
    if (!moved && Math.abs(distance) <= 6) return;
    if (!moved) {
      moved = true;
      rail.classList.add('is-dragging');
      rail.setPointerCapture(event.pointerId);
    }
    rail.scrollLeft = startScrollLeft - distance;
  });

  const finishDrag = () => {
    isDragging = false;
    rail.classList.remove('is-dragging');
  };
  rail.addEventListener('pointerup', finishDrag);
  rail.addEventListener('pointercancel', finishDrag);
  rail.addEventListener('pointerleave', () => { if (!moved) finishDrag(); });
  rail.addEventListener('dragstart', (event) => event.preventDefault());
  rail.addEventListener('click', (event) => {
    if (!moved) return;
    event.preventDefault();
    event.stopPropagation();
    moved = false;
  }, true);

  // Preserve native trackpad/touch momentum and normal vertical page scrolling.
});

const photoModal = document.querySelector('#photo-modal');
const photoTitle = document.querySelector('#photo-title');
const photoLarge = document.querySelector('.photo-large');
document.querySelectorAll('.photo-placeholder, .project-still').forEach((photo) => photo.addEventListener('click', () => {
  photoTitle.textContent = photo.dataset.photoTitle;
  const source = photo.dataset.photoSrc;
  photoLarge.replaceChildren();
  if (source) {
    const image = document.createElement('img');
    image.src = source;
    image.alt = photo.querySelector('img')?.alt || photo.dataset.photoTitle;
    photoLarge.append(image);
  }
  photoModal.showModal();
}));
document.querySelector('.close-photo-modal').addEventListener('click', () => photoModal.close());
photoModal.addEventListener('click', (event) => { if (event.target === photoModal) photoModal.close(); });

document.querySelectorAll('.project-case').forEach((project) => {
  const back = document.createElement('a');
  back.className = 'case-back';
  back.href = '#projects';
  back.textContent = '← All projects';
  project.prepend(back);
  const footer = back.cloneNode(true);
  footer.classList.add('case-back-bottom');
  project.append(footer);
});

function routePage() {
  const target = document.getElementById(location.hash.slice(1));
  const project = target?.closest('.project-case');
  const page = target?.closest('[data-page]');
  showPage(page?.id || 'home', project?.id || null);
  if (page && target !== page && !project) target.scrollIntoView({ behavior: 'instant' });
}
window.addEventListener('hashchange', routePage);
routePage();

const seriesIndex = document.querySelector('.photo-index');
const seriesLinks = [...seriesIndex.querySelectorAll('a')];
seriesLinks.forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:'smooth', block:'start'});
}));
const seriesObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
  if (visible) seriesLinks.forEach(link => {
    const active = link.hash === '#' + visible.target.id;
    link.classList.toggle('current', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}, {rootMargin:'-5% 0px -35% 0px', threshold:0});
document.querySelectorAll('.photo-series').forEach(series => seriesObserver.observe(series));

document.querySelectorAll('.video-shelf').forEach((shelf, index) => {
  const rail = shelf.querySelector('.video-rail');
  rail.id = `video-rail-${index}`;
  const category = shelf.querySelector('h2').textContent;
  const controls = document.createElement('div');
  controls.className = 'video-controls';
  const buttons = [-1, 1].map((direction) => {
    const button = document.createElement('button');
    button.className = 'video-scroll';
    button.type = 'button';
    button.textContent = direction < 0 ? '←' : '→';
    button.setAttribute('aria-label', `${category}: scroll ${direction < 0 ? 'left' : 'right'}`);
    button.setAttribute('aria-controls', rail.id);
    button.addEventListener('click', () => {
      const card = rail.querySelector('.published-film');
      const gap = parseFloat(getComputedStyle(rail).gap) || 0;
      rail.scrollBy({left: direction * (card.getBoundingClientRect().width + gap), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    });
    controls.append(button);
    return button;
  });
  shelf.querySelector('.shelf-heading').append(controls);
  const updateControls = () => {
    controls.style.display = rail.scrollWidth > rail.clientWidth + 2 ? 'flex' : 'none';
    buttons[0].disabled = rail.scrollLeft <= 2;
    buttons[1].disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;
  };
  rail.addEventListener('scroll', updateControls, {passive:true});
  new ResizeObserver(updateControls).observe(rail);
  updateControls();
});

// Focusable rails retain native touch/trackpad scrolling and explicit keyboard navigation.
document.querySelectorAll('.video-rail, .photo-rail').forEach((rail) => {
  const label = rail.closest('.video-shelf, .photo-series').querySelector('h2').textContent;
  rail.setAttribute('role', 'region');
  rail.setAttribute('aria-label', `${label} works`);
  const updateFocus = () => { rail.tabIndex = rail.scrollWidth > rail.clientWidth + 2 ? 0 : -1; };
  new ResizeObserver(updateFocus).observe(rail);
  updateFocus();
  rail.addEventListener('keydown', (event) => {
    if (event.target !== rail || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const step = rail.firstElementChild.getBoundingClientRect().width + (parseFloat(getComputedStyle(rail).gap) || 0);
    const left = event.key === 'Home' ? 0 : event.key === 'End' ? rail.scrollWidth : rail.scrollLeft + (event.key === 'ArrowLeft' ? -step : step);
    rail.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
});

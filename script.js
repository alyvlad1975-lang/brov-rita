// Номер счётчика Яндекс Метрики. Пока пусто: Метрика и уведомление о cookie отключены.
const METRIKA_ID = '';

// Вкладки прайса
const tabs = document.querySelectorAll('[role="tab"]');
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (e) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
}

// Просмотр фото
const box = document.getElementById('lightbox');
const boxImg = box.querySelector('img');
document.querySelectorAll('.gallery__item').forEach((item) => {
  item.addEventListener('click', () => {
    boxImg.src = item.dataset.full;
    boxImg.alt = item.querySelector('img').alt;
    box.showModal();
  });
});
box.addEventListener('click', (e) => { if (e.target === box) box.close(); });

// Волна от нажатия на кнопки
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('pointerdown', (e) => {
  const btn = e.target.closest('.pill');
  if (!btn || calm) return;
  const r = btn.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2.2;
  const dot = document.createElement('span');
  dot.className = 'ripple';
  dot.style.width = dot.style.height = size + 'px';
  dot.style.left = (e.clientX - r.left - size / 2) + 'px';
  dot.style.top = (e.clientY - r.top - size / 2) + 'px';
  btn.appendChild(dot);
  dot.addEventListener('animationend', () => dot.remove());
  setTimeout(() => dot.remove(), 1000);
});

// Метрика: загружается только после согласия посетителя
function loadMetrika() {
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    k = e.createElement(t); a = e.getElementsByTagName(t)[0];
    k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
  ym(METRIKA_ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
}
function goal(name) { if (window.ym && METRIKA_ID) ym(METRIKA_ID, 'reachGoal', name); }

// Цели: запись онлайн, Telegram, звонок, маршрут
[['.js-book', 'book'], ['.js-tg', 'telegram'], ['.js-phone', 'phone'], ['.js-route', 'route']].forEach(([sel, name]) => {
  document.querySelectorAll(sel).forEach((el) => el.addEventListener('click', () => goal(name)));
});

if (METRIKA_ID) {
  let choice = null;
  try { choice = localStorage.getItem('cookie-choice'); } catch (e) {}
  if (choice === 'yes') loadMetrika();
  if (!choice) {
    const banner = document.getElementById('cookie');
    banner.hidden = false;
    banner.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      try { localStorage.setItem('cookie-choice', btn.dataset.cookie); } catch (err) {}
      if (btn.dataset.cookie === 'yes') loadMetrika();
      banner.hidden = true;
    });
  }
}

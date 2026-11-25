/* Карусель в hero: автопереключение раз в 10 секунд,
   клик по правой половине — вперёд, по левой — назад. */
(function () {
  var hero = document.getElementById('hero-carousel');
  if (!hero) return;

  var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
  var bar = hero.querySelector('.hero-progress-bar');
  var DURATION = 10000;
  var index = 0;
  var timer = null;

  function restartProgress() {
    if (!bar) return;
    bar.classList.remove('is-running');
    void bar.offsetWidth; // перезапуск CSS-анимации
    bar.classList.add('is-running');
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      show(index + 1);
    }, DURATION);
  }

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === index);
    });
    restartProgress();
    schedule();
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  hero.addEventListener('click', function (event) {
    var rect = hero.getBoundingClientRect();
    var x = event.clientX - rect.left;
    if (x < rect.width / 2) {
      prev();
    } else {
      next();
    }
  });

  hero.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearTimeout(timer);
    } else {
      show(index);
    }
  });

  show(0);
})();

/* История в «О нас»: кнопки «назад» / «дальше» листают текст
   по хронологическому порядку, по кругу. */
(function () {
  var about = document.getElementById('about-carousel');
  if (!about) return;

  var slides = Array.prototype.slice.call(about.querySelectorAll('.about-speech'));
  var prevBtn = about.querySelector('.arrow--left');
  var nextBtn = about.querySelector('.arrow--right');
  if (!slides.length) return;

  var index = 0;

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      show(index - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      show(index + 1);
    });
  }

  about.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + 1);
    }
  });

  show(0);
})();

/* Окно заказа: кнопка в шапке открывает модальное окно,
   закрытие — по крестику, фону или Escape. */
(function () {
  var openBtn = document.querySelector('.order-btn');
  var modal = document.getElementById('order-modal');
  if (!openBtn || !modal) return;

  var closeBtn = modal.querySelector('.order-modal__close');
  var lastFocused = null;

  function open() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('order-modal-open');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('order-modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  openBtn.addEventListener('click', open);

  modal.addEventListener('click', function (event) {
    // Клик может прийтись на SVG-линию внутри кнопки, поэтому ищем ближайшего родителя.
    var target = event.target;
    if (target && target.closest && target.closest('[data-order-close]')) {
      close();
    } else if (target && target.hasAttribute && target.hasAttribute('data-order-close')) {
      close();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (modal.hidden) return;

    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    var focusable = Array.prototype.slice.call(
      modal.querySelectorAll('a[href], button:not([disabled])')
    );
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();

/* Предпросмотр нужной ширины и прокрутка к «О нас» без лишних HTML-файлов:
   index.html?width=1920&scroll=about
   Параметры: width (320–3840), height (необязательно), scroll=about. */
(function () {
  var query = window.location.search.replace(/^\?/, '');

  function getParam(name) {
    var match = new RegExp('(?:^|&)' + name + '=([^&]*)').exec(query);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function scrollToAbout(win) {
    var doc = win.document;
    var about = doc.getElementById('about-carousel') || doc.querySelector('.about');
    if (!about) return;
    win.scrollTo(0, about.getBoundingClientRect().top + win.pageYOffset - 10);
  }

  var width = parseInt(getParam('width'), 10);
  var height = parseInt(getParam('height'), 10);
  var scroll = getParam('scroll');

  if (width >= 320 && width <= 3840) {
    document.body.classList.add('is-preview');

    var frame = document.createElement('iframe');
    frame.className = 'preview-frame';
    frame.title = 'Предпросмотр сайта шириной ' + width + 'px';
    frame.style.width = width + 'px';
    if (height >= 320 && height <= 4000) {
      frame.style.height = height + 'px';
    }

    frame.addEventListener('load', function () {
      if (scroll === 'about') scrollToAbout(frame.contentWindow);
    });

    document.body.appendChild(frame);
    frame.src = window.location.href.split('?')[0].split('#')[0];
    return;
  }

  if (scroll === 'about') scrollToAbout(window);
})();

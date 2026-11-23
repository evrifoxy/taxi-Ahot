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

(function(){
  "use strict";
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  // Light / dark theme toggle
  var themeBtn = document.getElementById('themeToggle');
  var themeColorMeta = document.getElementById('themeColorMeta');
  var THEME_COLORS = { dark: '#0d1b2a', light: '#f4f7fb' };

  function currentTheme(){
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function applyThemeColorMeta(theme){
    if(themeColorMeta) themeColorMeta.setAttribute('content', THEME_COLORS[theme]);
  }
  function setTheme(theme, persist){
    if(theme === 'light'){
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    applyThemeColorMeta(theme);
    if(themeBtn) themeBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    if(persist){
      try{ localStorage.setItem('theme', theme); }catch(e){}
    }
  }

  applyThemeColorMeta(currentTheme());
  if(themeBtn){
    themeBtn.setAttribute('aria-pressed', currentTheme() === 'light' ? 'true' : 'false');
    themeBtn.addEventListener('click', function(){
      setTheme(currentTheme() === 'light' ? 'dark' : 'light', true);
    });
  }

  // Follow system theme changes if the user hasn't picked one explicitly
  try{
    if(!localStorage.getItem('theme')){
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e){
        if(!localStorage.getItem('theme')) setTheme(e.matches ? 'light' : 'dark', false);
      });
    }
  }catch(e){}

  // Mobile nav toggle (with icon morph)
  var toggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active nav link on scroll
  var sections = document.querySelectorAll('main section[id]');
  var links = document.querySelectorAll('.nav-link');
  var navObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        links.forEach(function(l){ l.classList.remove('active'); });
        var active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if(active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(function(s){ navObserver.observe(s); });

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  // Typing role rotator (static single line if reduced motion is requested)
  var roles = ['Software Developer', 'Data Engineer', 'B.Tech IT Student'];
  var el = document.getElementById('typedRole');
  if(reduceMotion){
    el.textContent = roles[0];
  } else {
    var ri = 0, ci = 0, deleting = false;
    (function tick(){
      var current = roles[ri];
      if(!deleting){
        ci++;
        el.textContent = current.slice(0, ci);
        if(ci === current.length){
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        ci--;
        el.textContent = current.slice(0, ci);
        if(ci === 0){
          deleting = false;
          ri = (ri + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 45 : 75);
    })();
  }

  // Scroll progress bar
  var progress = document.getElementById('scrollProgress');
  var ticking = false;
  function updateProgress(){
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var scrollHeight = (h.scrollHeight - h.clientHeight) || 1;
    progress.style.width = Math.min(100, (scrollTop / scrollHeight) * 100) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  updateProgress();

  // Subtle editor card tilt on pointer move (disabled for touch / reduced motion)
  var editorCard = document.getElementById('editorCard');
  if(editorCard && !isCoarsePointer && !reduceMotion){
    var rect;
    editorCard.addEventListener('mouseenter', function(){ rect = editorCard.getBoundingClientRect(); });
    editorCard.addEventListener('mousemove', function(e){
      if(!rect) rect = editorCard.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rx = (py - 0.5) * -6;
      var ry = (px - 0.5) * 10 - 4;
      editorCard.style.transform = 'perspective(1400px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    });
    editorCard.addEventListener('mouseleave', function(){
      editorCard.style.transform = 'perspective(1400px) rotateY(-4deg) rotateX(1deg)';
    });
  }
})();
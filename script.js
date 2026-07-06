(function(){
  "use strict";

  // Mobile nav toggle
  var toggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      navLinks.classList.remove('open');
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

  // Typing role rotator
  var roles = ['Software Developer', 'Data Analyst', 'B.Tech IT Student'];
  var el = document.getElementById('typedRole');
  var ri = 0, ci = 0, deleting = false;

  function tick(){
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
  }
  tick();
})();
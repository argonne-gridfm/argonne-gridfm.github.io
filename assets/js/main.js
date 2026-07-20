/* ===== GridAI website — interactions ===== */
(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Publication filter ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var pubs = document.querySelectorAll('.pub');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      pubs.forEach(function (p) {
        var tags = (p.getAttribute('data-tags') || '');
        var show = (f === 'all') || tags.indexOf(f) !== -1;
        p.classList.toggle('hide', !show);
      });
    });
  });

  /* ---------- Hero network canvas ---------- */
  var canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var nodes = [];
    var w, h, dpr;
    var mouse = { x: -9999, y: -9999 };
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    function buildNodes() {
      var count = Math.max(28, Math.min(70, Math.round((w * h) / 22000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 1.2
        });
      }
    }

    var LINK = 140;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      // edges
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            var alpha = (1 - dist / LINK) * 0.5;
            ctx.strokeStyle = 'rgba(41,171,226,' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // nodes (+ mouse glow)
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        var mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        var near = md < 120;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = near ? 'rgba(122,201,67,0.95)' : 'rgba(180,220,245,0.85)';
        ctx.fill();
      }
    }

    function step() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    var raf;
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', resize);
    resize();
    if (prefersReduced) { draw(); } else { step(); }
  }

  /* ---------- Nav background on scroll ---------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (window.scrollY > 40) nav.style.background = 'rgba(11,35,64,0.96)';
    else nav.style.background = 'rgba(11,35,64,0.85)';
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Logo marquee: duplicate items for seamless loop ---------- */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    var html = track.innerHTML;
    track.innerHTML = html + html; // second copy makes translateX(-50%) seamless
  });

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();

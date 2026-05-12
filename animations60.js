/* ═══════════════════════════════════════════════════════════════════
   THE CREAMY QUEEN — 60 SIGNATURE ANIMATIONS (JS)
   Wires up the animation triggers defined in animations60.css.
   Loads after script.js. Defensive: every section guards against
   missing elements so it never breaks the existing site.
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ──────────── helpers ──────────── */
  var prefersReduced = false;
  try {
    prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function onceInView(node, cb, opts) {
    if (!node || !('IntersectionObserver' in window)) { cb && cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          io.unobserve(en.target);
          cb && cb(en.target);
        }
      });
    }, opts || { threshold: 0.25 });
    io.observe(node);
  }
  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ──────────── (1) Crown Melt Intro ──────────── */
  (function crownMelt() {
    var crown = document.getElementById('introCrown');
    if (!crown) return;
    var wrap = crown.parentNode;
    if (!wrap) return;
    wrap.classList.add('cq60-melt-wrap');
    var drip = el('span', 'cq60-melt-drip');
    var hard = el('span', 'cq60-melt-harden');
    wrap.appendChild(drip);
    wrap.appendChild(hard);
  })();

  /* ──────────── (2) Royal Freezer Door Reveal ──────────── */
  (function freezerDoor() {
    if (sessionStorage.getItem('cq_freezer_seen')) return;
    try { sessionStorage.setItem('cq_freezer_seen', '1'); } catch (e) {}
    var freezer = el('div', 'cq60-freezer');
    freezer.innerHTML =
      '<div class="cq60-freezer-mist"></div>' +
      '<div class="cq60-freezer-door left"></div>' +
      '<div class="cq60-freezer-door right"></div>' +
      '<div class="cq60-freezer-headline">The Drop Is Open.</div>';
    document.body.appendChild(freezer);
    // delay open until after the existing intro overlay finishes (~5s)
    var seenIntro = sessionStorage.getItem('cq_intro_seen');
    var delay = seenIntro ? 200 : 4800;
    setTimeout(function () { freezer.classList.add('show-headline'); }, delay);
    setTimeout(function () { freezer.classList.add('open'); }, delay + 900);
    setTimeout(function () { freezer.style.display = 'none'; }, delay + 2400);
  })();

  /* ──────────── (3) Scoop Drop Shockwave ──────────── */
  (function shockwave() {
    var wave = el('div', 'cq60-shockwave');
    document.body.appendChild(wave);
    var seenIntro = sessionStorage.getItem('cq_intro_seen');
    setTimeout(function () { wave.classList.add('go'); },
      seenIntro ? 500 : 5200);
    setTimeout(function () { wave.remove(); },
      (seenIntro ? 500 : 5200) + 1800);
  })();

  /* ──────────── (4) Queen Has Left The Freezer Sequence ──────────── */
  // Trigger on demand: when body.sold-out is added (existing class) or via
  // explicit data-trigger. Also expose window.cq60.announce()
  function showAnnouncement(text) {
    var o = el('div', 'cq60-announce');
    o.innerHTML =
      '<div class="cq60-announce-text">' + (text || 'The Queen Has Left The Freezer.') + '</div>' +
      '<span class="cq60-frost-crack" style="transform:translate(-50%,-50%) rotate(8deg);"></span>' +
      '<span class="cq60-frost-crack" style="transform:translate(-50%,-50%) rotate(-12deg);"></span>' +
      '<span class="cq60-frost-crack" style="transform:translate(-50%,-50%) rotate(28deg);"></span>';
    document.body.appendChild(o);
    requestAnimationFrame(function () { o.classList.add('show'); });
    setTimeout(function () { o.remove(); }, 4500);
  }

  /* ──────────── (5) Golden Drip Curtain ──────────── */
  function dripCurtain() {
    var c = el('div', 'cq60-curtain');
    document.body.appendChild(c);
    requestAnimationFrame(function () { c.classList.add('drop'); });
    setTimeout(function () { c.remove(); }, 2400);
  }
  // Trigger on first hash navigation or major nav click (subtle wipe)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    if (a.classList.contains('cdr-flav') || a.classList.contains('bap-add')) return;
    if (sessionStorage.getItem('cq_curtain_done')) return;
    try { sessionStorage.setItem('cq_curtain_done', '1'); } catch (er) {}
    dripCurtain();
  }, true);

  /* ──────────── (6) Cup Number Boot-Up ──────────── */
  (function cupBoot() {
    var node = document.getElementById('cupLabelNum');
    if (!node) return;
    var target = parseInt(node.textContent, 10) || 43;
    node.classList.add('cq60-booting');
    var cur = 0;
    var step = Math.max(1, Math.round(target / 30));
    var iv = setInterval(function () {
      cur += step;
      if (cur >= target) {
        cur = target;
        clearInterval(iv);
        node.classList.remove('cq60-booting');
      }
      node.textContent = ('00' + cur).slice(-3);
    }, 50);
  })();

  /* ──────────── (7) Atlanta Heatwave Cream Effect ──────────── */
  (function heatwave() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    hero.appendChild(el('div', 'cq60-heatwave'));
    hero.appendChild(el('div', 'cq60-cold-mist'));
  })();

  /* ──────────── (8) Crown Signal Beacon ──────────── */
  (function beacon() {
    document.body.appendChild(el('div', 'cq60-beacon'));
  })();

  /* ──────────── (9) Royal Stamp Impact ──────────── */
  function royalStamp(word) {
    var s = el('div', 'cq60-stamp');
    s.innerHTML = '<div class="cq60-stamp-word">' + (word || 'CROWNED') + '</div>';
    for (var i = 0; i < 20; i++) {
      var sp = el('span', 'cq60-sprinkle');
      sp.style.left = '50%'; sp.style.top = '50%';
      sp.style.setProperty('--dx', rand(-180, 180) + 'px');
      sp.style.setProperty('--dy', rand(-180, 180) + 'px');
      sp.style.background = ['#f7d46b', '#fff7e6', '#b21f2d', '#cfeea1'][i % 4];
      s.appendChild(sp);
    }
    document.body.appendChild(s);
    requestAnimationFrame(function () { s.classList.add('go'); });
    setTimeout(function () { s.remove(); }, 2600);
  }
  // Hook to passport completion (3/3 stamps) and to first Crown Club join
  var passport = document.getElementById('passport');
  if (passport) {
    var po = new MutationObserver(function () {
      var stamps = passport.querySelectorAll('.passport-stamp.stamped');
      if (stamps.length >= 3 && !passport._cq60Stamped) {
        passport._cq60Stamped = true;
        royalStamp('CROWNED');
      }
    });
    po.observe(passport, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  /* ──────────── (10) Sellout Siren Glow ──────────── */
  (function sellout() {
    var live = document.getElementById('liveBadge');
    if (live) live.classList.add('cq60-siren');
    var badge = document.querySelector('.in-progress-badge');
    if (badge) badge.classList.add('cq60-siren');
  })();

  /* ──────────── (11) Live Cup Claim Ticker ──────────── */
  (function ticker() {
    if (window.innerWidth < 720) return;
    var box = el('div', 'cq60-ticker');
    box.innerHTML = '<h6>♛ Live Drop Rack</h6><ul class="cq60-ticker-list" id="cq60TickList"></ul>';
    document.body.appendChild(box);
    var list = box.querySelector('#cq60TickList');
    var names = ['K. Hayes', 'D. Bryant', 'M. Foster', 'A. Patel', 'R. Walker', 'J. Camp', 'T. Reed', 'L. Jenkins'];
    var flavs = ['Vanilla Crown', 'Cookies & Cream', 'Key Lime Queen'];
    function add() {
      var li = el('li');
      var gold = Math.random() < 0.3 ? ' gold' : '';
      li.innerHTML =
        '<span class="ck-cup' + gold + '"></span>' +
        '<span>' + names[Math.floor(Math.random() * names.length)] + ' claimed ' +
        flavs[Math.floor(Math.random() * flavs.length)] + '</span>';
      list.insertBefore(li, list.firstChild);
      while (list.children.length > 5) list.removeChild(list.lastChild);
    }
    add(); add();
    setInterval(add, 7000);
  })();

  /* ──────────── (12) Claimed Cup Heat Map ──────────── */
  (function heatmap() {
    var grid = document.getElementById('cdrCups');
    if (!grid) return;
    // wait for the existing script.js to inject cups, then style
    setTimeout(function () { grid.classList.add('cq60-heat'); }, 600);
  })();

  /* ──────────── (13) Sellout Prediction Pulse ──────────── */
  (function predPulse() {
    var node = document.getElementById('dbMinutes');
    if (!node) return;
    node.classList.add('cq60-pulse');
    var claimed = parseInt(($('#cdrClaimed') || {}).textContent, 10) || 42;
    var speed = Math.max(0.6, 2.4 - (claimed / 60) * 1.8);
    node.style.setProperty('--cq60-pulse-speed', speed + 's');
  })();

  /* ──────────── (14) Batch Story Cinema Scroll ──────────── */
  (function cinema() {
    var story = document.getElementById('dbStory');
    if (!story) return;
    story.classList.add('cq60-cinema');
    var ings = ['🥛', '🍪', '🍋', '🌿', '🍯'];
    ings.forEach(function (icon, i) {
      var f = el('span', 'cq60-float-ing', icon);
      f.style.left = (10 + i * 20) + '%';
      f.style.bottom = '0';
      f.style.setProperty('--fx', rand(-30, 30) + 'px');
      f.style.animationDelay = (i * 0.4) + 's';
      story.appendChild(f);
    });
    onceInView(story, function () { story.classList.add('in-view'); }, { threshold: 0.3 });
  })();

  /* ──────────── (15) Cup 043 Spotlight ──────────── */
  (function spotlight() {
    var grid = document.getElementById('cdrCups');
    if (!grid) return;
    setTimeout(function () {
      var cups = grid.querySelectorAll('.cdr-cup');
      // next cup = first non-claimed
      var found;
      for (var i = 0; i < cups.length; i++) {
        if (!cups[i].classList.contains('claimed')) { found = cups[i]; break; }
      }
      if (found) found.classList.add('cq60-spotlight');
    }, 800);
  })();

  /* ──────────── (16) Drop Capacity Liquid Rising Bubbles ──────────── */
  (function rising() {
    var fill = document.getElementById('lmFill');
    if (fill) fill.classList.add('cq60-rising');
  })();

  /* ──────────── (17) Crown Club Early Access Gate ──────────── */
  (function clubGate() {
    var gate = document.getElementById('clubGate');
    if (!gate) return;
    gate.classList.add('cq60-gate-locked');
    onceInView(gate, function () {
      setTimeout(function () {
        gate.classList.remove('cq60-gate-locked');
        gate.classList.add('cq60-gate-open');
      }, 600);
    }, { threshold: 0.25 });
  })();

  /* ──────────── (18) Flavor Leaderboard Confetti ──────────── */
  (function confetti() {
    var fastest = document.getElementById('dbFastest');
    if (!fastest) return;
    var holder = fastest.closest('.db-tile');
    if (!holder) return;
    holder.style.position = 'relative';
    function burst() {
      holder.classList.add('cq60-confetti-burst');
      // remove old pieces
      $all('.cq60-confetti-piece', holder).forEach(function (p) { p.remove(); });
      var colors = ['#f7d46b', '#fff7e6', '#cfeea1', '#b21f2d', '#6b4a3a'];
      for (var i = 0; i < 18; i++) {
        var p = el('span', 'cq60-confetti-piece');
        p.style.left = '50%'; p.style.top = '40%';
        p.style.background = colors[i % colors.length];
        p.style.setProperty('--cdx', rand(-80, 80) + 'px');
        p.style.setProperty('--cdy', rand(-90, -20) + 'px');
        holder.appendChild(p);
      }
      setTimeout(function () { holder.classList.remove('cq60-confetti-burst'); }, 1800);
    }
    onceInView(holder, burst);
    holder.addEventListener('mouseenter', burst);
  })();

  /* ──────────── (19) Batch Timeline Time-Lapse ──────────── */
  (function timelapse() {
    var t = document.getElementById('royalTimeline');
    if (!t) return;
    t.classList.add('cq60-timelapse');
    onceInView(t, function () { t.classList.add('in-view'); }, { threshold: 0.2 });
  })();

  /* ──────────── (20) Sold Out Explosion ──────────── */
  function soldOutExplosion() {
    if (document.querySelector('.cq60-soldout-flash')) return;
    document.body.classList.add('cq60-sold-out');
    var f = el('div', 'cq60-soldout-flash');
    f.innerHTML = '<div style="text-align:center"><div class="cs-crown">♛</div><div class="cs-text">CROWNED OUT</div></div>';
    document.body.appendChild(f);
    requestAnimationFrame(function () { f.classList.add('go'); });
    setTimeout(function () { f.remove(); }, 3400);
  }
  // Hook to body.sold-out class (existing).
  var soldObserver = new MutationObserver(function () {
    if (document.body.classList.contains('sold-out') && !document.body._cq60Exploded) {
      document.body._cq60Exploded = true;
      soldOutExplosion();
      showAnnouncement('The Queen Has Left The Freezer.');
    }
  });
  soldObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  /* ──────────── (21-23) Vanilla / Cookies / Lime hover decorations ──────────── */
  (function flavorCardDecor() {
    var cookies = document.querySelector('.flavor-card.cookies');
    if (cookies) {
      for (var i = 0; i < 8; i++) {
        var c = el('span', 'cq60-crumble');
        c.style.left = rand(10, 90) + '%';
        c.style.top  = rand(20, 80) + '%';
        c.style.setProperty('--bx', rand(-60, 60) + 'px');
        c.style.setProperty('--by', rand(-60, 60) + 'px');
        c.style.animationDelay = (i * 0.12) + 's';
        cookies.appendChild(c);
      }
    }
    var lime = document.querySelector('.flavor-card.lime');
    if (lime) {
      for (var j = 0; j < 3; j++) {
        var s = el('span', 'cq60-citrus');
        s.style.left = '50%'; s.style.top = '50%';
        s.style.animationDelay = (j * 1) + 's';
        lime.appendChild(s);
      }
    }
  })();

  /* ──────────── (24) Flavor Card Tilt With Cream Depth ──────────── */
  (function tilt() {
    if (prefersReduced) return;
    $all('.flavor-card.tilt-card').forEach(function (card) {
      card.classList.add('cq60-tilt');
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--tx', ((x - 0.5) * 14).toFixed(2) + 'deg');
        card.style.setProperty('--ty', ((0.5 - y) * 10).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--tx', '0deg');
        card.style.setProperty('--ty', '0deg');
      });
    });
  })();

  /* ──────────── (25) Ingredient Orbit System ──────────── */
  (function orbit() {
    var ringMap = {
      vanilla: ['🥛', '🍪', '👑', '✨'],
      cookies: ['🍪', '🍫', '🥛', '👑'],
      lime:    ['🍋', '🌿', '🥛', '👑']
    };
    Object.keys(ringMap).forEach(function (k) {
      var card = document.querySelector('.flavor-card.' + k);
      if (!card) return;
      var ring = el('div', 'cq60-orbit-ring');
      ringMap[k].forEach(function (ic, i) {
        var t = el('i', null, ic);
        t.style.animationDelay = (-i * 2) + 's';
        ring.appendChild(t);
      });
      card.appendChild(ring);
    });
  })();

  /* ──────────── (26) Royal Score Meter Fill ──────────── */
  (function scoreMeter() {
    $all('.flavor-card .trading-stats').forEach(function (s) {
      s.classList.add('cq60-score-fill');
    });
  })();

  /* ──────────── (27) Flavor Aroma Trail ──────────── */
  (function aroma() {
    var map = { vanilla: 'V·A·N·I·L·L·A', cookies: 'C·O·O·K·I·E·S', lime: 'K·E·Y·L·I·M·E' };
    Object.keys(map).forEach(function (k) {
      var card = document.querySelector('.flavor-card.' + k);
      if (!card) return;
      var a = el('span', 'cq60-aroma', map[k]);
      card.appendChild(a);
    });
  })();

  /* ──────────── (28) Crown Bite Reveal — ingredient overlay ──────────── */
  (function bite() {
    var map = {
      vanilla: '+ Vanilla cream<br>+ Cookie crumble<br>+ Gold glaze',
      cookies: '+ Cookies &amp; cream<br>+ Chocolate ribbon<br>+ Cookie dust',
      lime:    '+ Key lime cream<br>+ Graham crumble<br>+ Lime zest'
    };
    Object.keys(map).forEach(function (k) {
      var card = document.querySelector('.flavor-card.' + k);
      if (!card) return;
      var art = card.querySelector('.flavor-art');
      if (!art) return;
      var list = el('span', 'cq60-bite-list', map[k]);
      art.appendChild(list);
    });
  })();

  /* ──────────── (29) Flavor Mood Lighting ──────────── */
  (function mood() {
    var keys = ['vanilla', 'cookies', 'lime'];
    keys.forEach(function (k) {
      var card = document.querySelector('.flavor-card.' + k);
      if (!card) return;
      card.addEventListener('mouseenter', function () {
        document.body.classList.remove('cq60-mood-vanilla', 'cq60-mood-cookies', 'cq60-mood-lime');
        document.body.classList.add('cq60-mood-' + k);
      });
      card.addEventListener('mouseleave', function () {
        document.body.classList.remove('cq60-mood-vanilla', 'cq60-mood-cookies', 'cq60-mood-lime');
      });
    });
  })();

  /* ──────────── (30) Signature Flavor Entrance ──────────── */
  (function entrance() {
    ['vanilla', 'cookies', 'lime'].forEach(function (k) {
      var card = document.querySelector('.flavor-card.' + k);
      if (!card) return;
      onceInView(card, function () { card.classList.add('cq60-enter'); }, { threshold: 0.2 });
    });
  })();

  /* ──────────── (31) Real Cup Packing Simulator ──────────── */
  (function bapPack() {
    var inner = document.getElementById('bapBoxInner');
    if (!inner) return;
    var seenCount = 0;
    var mo = new MutationObserver(function () {
      var slots = inner.querySelectorAll('.bap-box-slot, [class*="bap-slot"], .bap-cup');
      // generic: animate any new child
      var kids = inner.children;
      if (kids.length > seenCount) {
        for (var i = seenCount; i < kids.length; i++) {
          var node = kids[i];
          if (!node.classList) continue;
          node.classList.add('cq60-slot');
          var drop = el('span', 'cq60-cup-drop');
          node.appendChild(drop);
          setTimeout((function (d) { return function () { d.remove(); }; })(drop), 800);
        }
        seenCount = kids.length;
      }
    });
    mo.observe(inner, { childList: true });
  })();

  /* ──────────── (32) Box Lid Close — Royal Sticker Seal ──────────── */
  (function lidSeal() {
    var lid = document.getElementById('bapBoxLid');
    var full = document.getElementById('bapFull');
    if (!lid || !full) return;
    var seal = el('div', 'cq60-lid-seal', '♛<br><span style="font-size:9px;letter-spacing:.1em">SEALED</span>');
    lid.style.position = 'relative';
    lid.appendChild(seal);
    var mo = new MutationObserver(function () {
      if (!full.hasAttribute('hidden')) {
        seal.classList.add('go');
      } else {
        seal.classList.remove('go');
      }
    });
    mo.observe(full, { attributes: true, attributeFilter: ['hidden'] });
  })();

  /* ──────────── (33) Mystery Fog ──────────── */
  // Pure CSS via .bap-add.mystery — nothing to wire.

  /* ──────────── (34) Cup Drag Trail ──────────── */
  (function trail() {
    if (prefersReduced) return;
    var active = false;
    function onDown(e) {
      var t = e.target.closest && e.target.closest('.bap-add, .card-claim, .cdr-flav');
      if (!t) return;
      active = true;
      setTimeout(function () { active = false; }, 800);
    }
    function onMove(e) {
      if (!active) return;
      var x = (e.touches ? e.touches[0].clientX : e.clientX);
      var y = (e.touches ? e.touches[0].clientY : e.clientY);
      var d = el('span', 'cq60-trail-dot');
      d.style.left = x + 'px';
      d.style.top  = y + 'px';
      d.style.transform = 'translate(-50%,-50%)';
      document.body.appendChild(d);
      setTimeout(function () { d.remove(); }, 800);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchstart', onDown, { passive: true });
    document.addEventListener('touchmove',  onMove, { passive: true });
  })();

  /* ──────────── (35) Box Weight Bounce ──────────── */
  (function bounce() {
    var box  = document.getElementById('bapBox');
    var fill = document.getElementById('bapFilled');
    if (!box || !fill) return;
    var last = parseInt(fill.textContent, 10) || 0;
    var mo = new MutationObserver(function () {
      var cur = parseInt(fill.textContent, 10) || 0;
      if (cur > last) {
        box.classList.remove('cq60-bounce');
        void box.offsetWidth; // restart anim
        box.classList.add('cq60-bounce');
      }
      last = cur;
    });
    mo.observe(fill, { childList: true, characterData: true, subtree: true });
  })();

  /* ──────────── (36) Pack Size Transformation ──────────── */
  (function resize() {
    var box = document.getElementById('bapBox');
    if (!box) return;
    var mo = new MutationObserver(function () {
      box.classList.remove('cq60-resize');
      void box.offsetWidth;
      box.classList.add('cq60-resize');
    });
    mo.observe(box, { attributes: true, attributeFilter: ['data-size'] });
  })();

  /* ──────────── (37) Flavor Collision Mix ──────────── */
  (function collision() {
    var inner = document.getElementById('bapBoxInner');
    if (!inner) return;
    var colorMap = { vanilla: '#fff7e6', cookies: '#6b4a3a', lime: '#cfeea1', mystery: '#43135e' };
    var lastColor = null;
    var mo = new MutationObserver(function () {
      var kids = inner.children;
      if (kids.length === 0) { lastColor = null; return; }
      var last = kids[kids.length - 1];
      var color = last.getAttribute && (last.dataset.color || last.getAttribute('data-color'));
      if (!color) {
        // try class
        Object.keys(colorMap).forEach(function (k) {
          if (last.className && last.className.indexOf(k) !== -1) color = k;
        });
      }
      if (color && lastColor && color !== lastColor) {
        var s = el('span', 'cq60-swirl-mix');
        var box = document.getElementById('bapBox');
        if (box) {
          box.style.position = 'relative';
          s.style.left = '50%'; s.style.top = '50%';
          s.style.marginLeft = '-35px'; s.style.marginTop = '-35px';
          s.style.setProperty('--c1', colorMap[lastColor] || '#fff7e6');
          s.style.setProperty('--c2', colorMap[color] || '#6b4a3a');
          box.appendChild(s);
          setTimeout(function () { s.remove(); }, 1000);
        }
      }
      if (color) lastColor = color;
    });
    mo.observe(inner, { childList: true });
  })();

  /* ──────────── (38) Royal Receipt Printout ──────────── */
  (function receipt() {
    var full = document.getElementById('bapFull');
    if (!full) return;
    var rec = el('div', 'cq60-receipt');
    rec.innerHTML =
      '<h6>♛ THE CREAMY QUEEN ♛</h6>' +
      '<small style="display:block;text-align:center">— ROYAL RECEIPT —</small>' +
      '<ul>' +
        '<li><span>Pack:</span><span id="cq60RecSize">6-Pack</span></li>' +
        '<li><span>Cups:</span><span id="cq60RecCups">0</span></li>' +
        '<li><span>Pickup:</span><span>Fri 5–7 PM</span></li>' +
        '<li><span>Crown #:</span><span id="cq60RecCrown">043</span></li>' +
      '</ul>' +
      '<small style="display:block;text-align:center;margin-top:6px">Thank you, Royal.</small>';
    full.appendChild(rec);
    var mo = new MutationObserver(function () {
      if (!full.hasAttribute('hidden')) {
        var box = document.getElementById('bapBox');
        var size = (box && box.getAttribute('data-size')) || '6';
        var cups = (document.getElementById('bapFilled') || {}).textContent || '0';
        var crown = (document.getElementById('cupLabelNum') || {}).textContent || '043';
        var rs = rec.querySelector('#cq60RecSize');
        var rc = rec.querySelector('#cq60RecCups');
        var rk = rec.querySelector('#cq60RecCrown');
        if (rs) rs.textContent = size + '-Pack';
        if (rc) rc.textContent = cups;
        if (rk) rk.textContent = crown;
        setTimeout(function () { rec.classList.add('show'); }, 600);
      } else {
        rec.classList.remove('show');
      }
    });
    mo.observe(full, { attributes: true, attributeFilter: ['hidden'] });
  })();

  /* ──────────── (39) Locked Slot Teaser ──────────── */
  (function lockedSlots() {
    var inner = document.getElementById('bapBoxInner');
    var box = document.getElementById('bapBox');
    if (!inner || !box) return;
    function refresh() {
      var size = parseInt(box.getAttribute('data-size'), 10) || 6;
      var have = inner.children.length;
      var teasers = $all('.cq60-slot.cq60-locked', inner);
      teasers.forEach(function (n) { n.remove(); });
      var need = Math.max(0, size - have);
      // show up to 2 teasers for empty slots (subtle)
      for (var i = 0; i < Math.min(need, 2); i++) {
        var s = el('div', 'cq60-slot cq60-locked');
        s.style.cssText = 'width:54px;height:64px;display:inline-block;margin:4px;border-radius:6px;';
        inner.appendChild(s);
      }
    }
    var mo = new MutationObserver(refresh);
    mo.observe(inner, { childList: true });
    var mo2 = new MutationObserver(refresh);
    mo2.observe(box, { attributes: true, attributeFilter: ['data-size'] });
    refresh();
  })();

  /* ──────────── (40) Ready To Claim Crown Burst ──────────── */
  (function readyBurst() {
    var full = document.getElementById('bapFull');
    var cta  = document.getElementById('bapToPreorder');
    if (!full || !cta) return;
    var holder = full;
    holder.style.position = 'relative';
    var burst = el('div', 'cq60-crown-burst', '♛');
    holder.appendChild(burst);
    var mo = new MutationObserver(function () {
      if (!full.hasAttribute('hidden')) {
        burst.classList.remove('go');
        void burst.offsetWidth;
        burst.classList.add('go');
      }
    });
    mo.observe(full, { attributes: true, attributeFilter: ['hidden'] });
  })();

  /* ──────────── (41) Crown Member Number Ceremony ──────────── */
  (function memberCeremony() {
    var form = document.getElementById('gateForm');
    if (!form) return;
    form.addEventListener('submit', function () {
      // wait a tick for the existing site to compute the number
      setTimeout(function () {
        var num = ((document.getElementById('clubNumber') || {}).textContent || '#0049').trim();
        if (sessionStorage.getItem('cq_cert_shown')) return;
        try { sessionStorage.setItem('cq_cert_shown', '1'); } catch (e) {}
        var c = el('div', 'cq60-cert');
        c.innerHTML =
          '<div class="cq60-cert-card">' +
            '<div class="cc-crown">♛</div>' +
            '<div style="font:700 11px/1.2 Inter, sans-serif;letter-spacing:.18em;color:#f7d46b">CROWN MEMBER</div>' +
            '<div class="cc-num">' + num + '</div>' +
            '<div style="opacity:.8">By royal decree of The Creamy Queen.</div>' +
          '</div>';
        document.body.appendChild(c);
        requestAnimationFrame(function () { c.classList.add('go'); });
        document.body.classList.add('cq60-club-member'); // also enables (46)
        setTimeout(function () { c.remove(); }, 4200);
      }, 80);
    });
  })();

  /* ──────────── (42) Digital Crown Pass ──────────── */
  (function pass() {
    var card = document.getElementById('memberCard');
    if (!card) return;
    onceInView(card, function () { card.classList.add('cq60-pass'); });
  })();

  /* ──────────── (43) Birthday Cup Unlock ──────────── */
  (function birthday() {
    var bday = document.getElementById('gateBirthday');
    var form = document.getElementById('gateForm');
    if (!bday || !form) return;
    form.addEventListener('submit', function () {
      if (!bday.value || !/^\d{1,2}\/\d{1,2}$/.test(bday.value.trim())) return;
      // visually unlock the birthday line in the perks list
      var perks = document.querySelectorAll('.club-perks li');
      perks.forEach(function (li) {
        if (/birthday/i.test(li.textContent)) {
          li.classList.add('cq60-birthday-cup');
          li.style.position = 'relative';
          for (var i = 0; i < 8; i++) {
            var sp = el('span', 'cq60-spark');
            sp.style.setProperty('--sx', rand(-50, 50) + 'px');
            sp.style.setProperty('--sy', rand(-50, 10) + 'px');
            sp.style.animationDelay = (i * 0.06) + 's';
            li.appendChild(sp);
          }
          setTimeout(function () { li.classList.add('unlock'); }, 50);
        }
      });
    });
  })();

  /* ──────────── (44) Secret Flavor Vault Door ──────────── */
  (function vault() {
    var sec = document.getElementById('vault') || document.getElementById('secretMenu');
    if (!sec) return;
    var grid = sec.querySelector('.sm-grid, .vault-grid');
    if (!grid) {
      grid = sec; // fallback wrap whole section
    }
    grid.classList.add('cq60-vault-door');
    grid.style.position = 'relative';
    var panel = el('div', 'vd-panel');
    grid.appendChild(panel);
    onceInView(sec, function () {
      setTimeout(function () { grid.classList.add('open'); }, 400);
    }, { threshold: 0.25 });
  })();

  /* ──────────── (45) Loyalty Punch Card Stamp ──────────── */
  (function punch() {
    var card = document.getElementById('memberCard');
    if (!card) return;
    var bot = card.querySelector('.mc-bot');
    if (!bot) return;
    var punchEl = bot.querySelector('span');
    if (!punchEl) return;
    var row = el('div');
    row.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:2px;margin-top:8px;';
    var punches = 0;
    var n = parseInt((document.getElementById('mcPunches') || {}).textContent, 10) || 0;
    for (var i = 0; i < 8; i++) {
      var p = el('span', 'cq60-punch');
      if (i < n) p.classList.add('stamped');
      row.appendChild(p);
    }
    bot.parentNode.appendChild(row);
    // stamp animation when count rises
    var counter = document.getElementById('mcPunches');
    if (counter) {
      var last = n;
      var mo = new MutationObserver(function () {
        var cur = parseInt(counter.textContent, 10) || 0;
        if (cur > last) {
          var dots = row.querySelectorAll('.cq60-punch');
          for (var i = last; i < Math.min(cur, dots.length); i++) {
            (function (d) {
              d.classList.remove('stamped');
              void d.offsetWidth;
              d.classList.add('stamped');
            })(dots[i]);
          }
          last = cur;
        }
      });
      mo.observe(counter, { childList: true, characterData: true, subtree: true });
    }
  })();

  /* ──────────── (46) Early Access Countdown Glow ──────────── */
  // Activated when (41) ceremony runs OR when club gate opens.
  document.addEventListener('cq60:clubJoin', function () {
    document.body.classList.add('cq60-club-member');
  });

  /* ──────────── (47) Royal Inner Circle Orbit ──────────── */
  (function innerCircle() {
    var refSec = document.getElementById('clubTiers');
    if (!refSec) return;
    var wrap = el('div');
    wrap.style.cssText = 'margin:32px auto 0;text-align:center';
    wrap.innerHTML = '<div style="font:700 11px/1.2 Inter, sans-serif;letter-spacing:.18em;color:#f7d46b;margin-bottom:8px;text-transform:uppercase">The Royal Inner Circle</div>';
    var circle = el('div', 'cq60-inner-circle');
    circle.innerHTML =
      '<div class="ic-center">♛</div>' +
      '<div class="ic-perk">Early Access</div>' +
      '<div class="ic-perk">Birthday Cup</div>' +
      '<div class="ic-perk">Secret Menu</div>' +
      '<div class="ic-perk">2× Voting</div>' +
      '<div class="ic-perk">Loyalty Punch</div>' +
      '<div class="ic-perk">Drop SMS</div>';
    wrap.appendChild(circle);
    refSec.parentNode.insertBefore(wrap, refSec.nextSibling);
  })();

  /* ──────────── (48) VIP Text Message Preview ──────────── */
  (function vipText() {
    function showOnce() {
      if (sessionStorage.getItem('cq_vip_text_shown')) return;
      try { sessionStorage.setItem('cq_vip_text_shown', '1'); } catch (e) {}
      var n = el('div', 'cq60-vip-text');
      n.innerHTML =
        '<small>Messages · now</small>' +
        '<strong>♛ The Creamy Queen</strong>' +
        '<div class="vt-msg">The Crown opens at 12:00. Tap for early access — your cup is waiting.</div>';
      document.body.appendChild(n);
      setTimeout(function () { n.classList.add('show'); }, 100);
      setTimeout(function () { n.classList.remove('show'); }, 6000);
      setTimeout(function () { n.remove(); }, 7000);
    }
    var crownClub = document.getElementById('crown-club');
    if (crownClub) onceInView(crownClub, function () { setTimeout(showOnce, 1200); }, { threshold: 0.3 });
  })();

  /* ──────────── (49) Crown Level Progression ──────────── */
  (function levels() {
    var card = document.getElementById('memberCard');
    if (!card) return;
    var wrap = el('div');
    wrap.style.cssText = 'margin-top:14px;padding:0 8px;';
    wrap.innerHTML =
      '<div style="font:700 10px/1.2 Inter,sans-serif;letter-spacing:.14em;color:rgba(255,255,255,.6);text-transform:uppercase;margin-bottom:4px">Crown Level</div>' +
      '<div class="cq60-level-bar"><i id="cq60LevelFill"></i></div>' +
      '<div class="cq60-level-tags">' +
        '<span>New Royal</span><span class="active">Founding Royal</span><span>Creamy Queen Elite</span>' +
      '</div>';
    card.appendChild(wrap);
    var fill = wrap.querySelector('#cq60LevelFill');
    onceInView(card, function () {
      setTimeout(function () { if (fill) fill.style.width = '60%'; }, 200);
    });
  })();

  /* ──────────── (50) Invite A Royal Chain Reaction ──────────── */
  (function inviteChain() {
    var copy = document.getElementById('refCopy');
    if (!copy) return;
    copy.addEventListener('click', function () {
      var c = el('div', 'cq60-chain');
      var nodes = [
        [15, 75], [30, 40], [50, 70], [70, 35], [85, 65]
      ];
      // place nodes
      nodes.forEach(function (p, i) {
        var n = el('span', 'cq60-chain-node', '♛');
        n.style.left = p[0] + '%'; n.style.top = p[1] + '%';
        n.style.animationDelay = (i * 0.25) + 's';
        c.appendChild(n);
      });
      // place links
      for (var i = 0; i < nodes.length - 1; i++) {
        var a = nodes[i], b = nodes[i + 1];
        var w = window.innerWidth, h = window.innerHeight;
        var ax = a[0] * w / 100, ay = a[1] * h / 100;
        var bx = b[0] * w / 100, by = b[1] * h / 100;
        var dx = bx - ax, dy = by - ay;
        var len = Math.sqrt(dx * dx + dy * dy);
        var ang = Math.atan2(dy, dx) * 180 / Math.PI;
        var link = el('span', 'cq60-chain-link');
        link.style.left = ax + 'px';
        link.style.top  = ay + 'px';
        link.style.width = len + 'px';
        link.style.transform = 'rotate(' + ang + 'deg)';
        link.style.animationDelay = (i * 0.25 + 0.2) + 's';
        c.appendChild(link);
      }
      document.body.appendChild(c);
      requestAnimationFrame(function () { c.classList.add('go'); });
      setTimeout(function () { c.remove(); }, 4000);
    });
  })();

  /* ──────────── (51) Cup Crowd Estimator ──────────── */
  (function crowd() {
    // Look for an event quantity input/select; fall back to building a slider in events section.
    var events = document.getElementById('events');
    if (!events) return;
    var existing = document.getElementById('cq60Crowd');
    if (existing) return;
    var holder = el('div');
    holder.style.cssText = 'margin:24px 0;padding:14px 16px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:14px;';
    holder.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:8px">' +
        '<div>' +
          '<div style="font:700 11px/1.2 Inter,sans-serif;letter-spacing:.18em;color:#f7d46b;text-transform:uppercase">Crowd Estimator</div>' +
          '<div style="font:700 14px/1.2 Inter,sans-serif;color:#fff7e6;margin-top:4px">Guests: <span id="cq60GCount">25</span> &mdash; Cups needed: <strong id="cq60GCups">25</strong></div>' +
        '</div>' +
        '<input type="range" id="cq60GSlider" min="10" max="200" step="5" value="25" style="flex:1;min-width:200px">' +
      '</div>' +
      '<div class="cq60-crowd" id="cq60Crowd"></div>';
    var calendar = events.querySelector('.event-calendar') || events.children[1] || events.firstChild;
    if (calendar) events.insertBefore(holder, calendar);
    else events.appendChild(holder);

    var slider = holder.querySelector('#cq60GSlider');
    var crowdBox = holder.querySelector('#cq60Crowd');
    var gCount = holder.querySelector('#cq60GCount');
    var gCups  = holder.querySelector('#cq60GCups');
    function paint(n) {
      gCount.textContent = n;
      gCups.textContent  = n;
      crowdBox.innerHTML = '';
      var max = Math.min(n, 200);
      for (var i = 0; i < max; i++) {
        var c = el('span', 'cq60-crowd-cup');
        c.style.animationDelay = (i * 0.01) + 's';
        crowdBox.appendChild(c);
      }
    }
    slider.addEventListener('input', function () { paint(parseInt(slider.value, 10)); });
    paint(25);
  })();

  /* ──────────── (52) Catering Truck Arrival ──────────── */
  (function truck() {
    var ev = document.querySelector('.events');
    if (!ev) return;
    ev.style.position = 'relative';
    var t = el('div', 'cq60-truck', '🚚');
    ev.appendChild(t);
    onceInView(ev, function () { ev.classList.add('cq60-truck-roll'); }, { threshold: 0.2 });
  })();

  /* ──────────── (53) 50-Cup Party Stack Build ──────────── */
  (function stack() {
    var ev = document.querySelector('.events');
    if (!ev) return;
    var section = ev.querySelector('.event-grid') || ev;
    if (document.getElementById('cq60Stack')) return;
    var wrap = el('div');
    wrap.id = 'cq60StackWrap';
    wrap.style.cssText = 'margin:24px 0;padding:14px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:14px;text-align:center';
    wrap.innerHTML =
      '<div style="font:700 11px/1.2 Inter,sans-serif;letter-spacing:.18em;color:#f7d46b;text-transform:uppercase;margin-bottom:8px">50-Cup Party Stack</div>' +
      '<div class="cq60-stack" id="cq60Stack"></div>';
    section.parentNode.insertBefore(wrap, section.nextSibling);
    var stack = wrap.querySelector('#cq60Stack');
    // pyramid: 10 cups on bottom row, decreasing — fits 50 in 10 rows? simpler: 5 rows pyramid 9,8,7..
    onceInView(wrap, function () {
      var w = stack.clientWidth || 280;
      var cupW = 22, cupH = 28, gap = 4;
      var rows = [9, 8, 7, 6, 5, 4, 3, 3, 3, 2]; // sums to 50
      var idx = 0;
      var totalH = rows.length * cupH;
      for (var r = 0; r < rows.length; r++) {
        var rowCount = rows[r];
        var rowWidth = rowCount * (cupW + gap);
        var startX = (w - rowWidth) / 2;
        for (var i = 0; i < rowCount; i++) {
          var c = el('span', 'cq60-stack-cup');
          c.style.left = (startX + i * (cupW + gap)) + 'px';
          c.style.bottom = (r * (cupH - 4) + 8) + 'px';
          c.style.animationDelay = (idx * 0.04) + 's';
          stack.appendChild(c);
          idx++;
        }
      }
      // crown topper
      var crown = el('span');
      crown.textContent = '♛';
      crown.style.cssText = 'position:absolute;left:50%;top:0;transform:translateX(-50%);font-size:28px;color:#f7d46b;text-shadow:0 0 12px rgba(247,212,107,.7);opacity:0;animation:cq60-crowd-pop .5s ease-out ' + (idx * 0.04 + 0.2) + 's forwards;';
      stack.appendChild(crown);
    }, { threshold: 0.2 });
  })();

  /* ──────────── (54) 100-Cup Event Wall ──────────── */
  (function wall() {
    var ev = document.querySelector('.events');
    if (!ev) return;
    if (document.getElementById('cq60Wall')) return;
    var wrap = el('div');
    wrap.style.cssText = 'margin:18px 0;padding:14px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:14px;';
    wrap.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">' +
        '<div style="font:700 11px/1.2 Inter,sans-serif;letter-spacing:.18em;color:#f7d46b;text-transform:uppercase">100-Cup Event Wall</div>' +
        '<small style="color:rgba(255,255,255,.6)">stadium-style concession display</small>' +
      '</div>' +
      '<div class="cq60-wall" id="cq60Wall"></div>';
    ev.appendChild(wrap);
    var wallEl = wrap.querySelector('#cq60Wall');
    onceInView(wallEl, function () {
      for (var i = 0; i < 100; i++) {
        var c = el('span', 'cq60-wall-cup' + (i % 13 === 0 ? ' gold' : ''));
        c.style.animationDelay = (i * 0.015) + 's';
        wallEl.appendChild(c);
      }
    }, { threshold: 0.2 });
  })();

  /* ──────────── (55) Pop-Up Booth Assembly ──────────── */
  (function booth() {
    var ev = document.querySelector('.events');
    if (!ev) return;
    if (document.getElementById('cq60Booth')) return;
    var wrap = el('div');
    wrap.style.cssText = 'margin:18px 0;padding:14px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:14px;';
    wrap.innerHTML =
      '<div style="font:700 11px/1.2 Inter,sans-serif;letter-spacing:.18em;color:#f7d46b;text-transform:uppercase;text-align:center;margin-bottom:8px">Pop-Up Booth Assembly</div>' +
      '<div class="cq60-booth" id="cq60Booth">' +
        '<div class="cq60-booth-piece p4">THE CREAMY QUEEN ♛</div>' +
        '<div class="cq60-booth-piece p3"></div>' +
        '<div class="cq60-booth-piece p2"></div>' +
        '<div class="cq60-booth-piece p1"></div>' +
        '<div class="cq60-booth-piece p5">🥤🥤🥤🥤</div>' +
      '</div>';
    ev.appendChild(wrap);
  })();

  /* ──────────── (56) Event Map Crown Pins ──────────── */
  (function map() {
    var ev = document.querySelector('.events');
    if (!ev) return;
    if (document.getElementById('cq60Map')) return;
    var wrap = el('div');
    wrap.style.cssText = 'margin:18px 0;padding:14px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:14px;';
    wrap.innerHTML =
      '<div style="font:700 11px/1.2 Inter,sans-serif;letter-spacing:.18em;color:#f7d46b;text-transform:uppercase;margin-bottom:8px">Atlanta-Area Drop Map</div>' +
      '<div class="cq60-map" id="cq60Map"></div>';
    ev.appendChild(wrap);
    var m = wrap.querySelector('#cq60Map');
    var pins = [
      { x: 32, y: 48, name: 'Decatur Pop-Up' },
      { x: 50, y: 38, name: 'Midtown Pop-Up' },
      { x: 60, y: 56, name: 'East Atlanta' },
      { x: 42, y: 64, name: 'Grant Park' },
      { x: 70, y: 30, name: 'Buckhead' }
    ];
    pins.forEach(function (p, i) {
      var pin = el('span', 'cq60-map-pin');
      pin.title = p.name;
      pin.style.left = p.x + '%';
      pin.style.top  = p.y + '%';
      pin.style.animationDelay = (i * 0.3) + 's';
      m.appendChild(pin);
    });
  })();

  /* ──────────── (57) School / Team Drop Animation ──────────── */
  (function lockers() {
    var ev = document.querySelector('.events');
    if (!ev) return;
    if (document.getElementById('cq60Lockers')) return;
    var wrap = el('div');
    wrap.style.cssText = 'margin:18px 0;padding:14px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:14px;';
    wrap.innerHTML =
      '<div style="font:700 11px/1.2 Inter,sans-serif;letter-spacing:.18em;color:#f7d46b;text-transform:uppercase;margin-bottom:8px">School / Team Drop</div>' +
      '<div class="cq60-lockers" id="cq60Lockers"></div>';
    ev.appendChild(wrap);
    var box = wrap.querySelector('#cq60Lockers');
    onceInView(box, function () {
      for (var i = 0; i < 20; i++) {
        var L = el('div', 'cq60-locker');
        L.innerHTML = '<span class="cq60-locker-cup" style="animation-delay:' + (i * 0.06) + 's"></span><b>#' + (i + 1) + '</b>';
        box.appendChild(L);
      }
    }, { threshold: 0.2 });
  })();

  /* ──────────── (58) Party Box Camera Flash ──────────── */
  (function flash() {
    $all('.event-card').forEach(function (c) { c.classList.add('cq60-flash'); });
  })();

  /* ──────────── (59) Second Scoop Surge ──────────── */
  (function surge() {
    // attach to the catering quote form submit and to cup count growth
    var cups = document.getElementById('bapFilled');
    var box  = document.getElementById('bapBox');
    if (cups && box) {
      box.classList.add('cq60-surge');
      var last = 0;
      var mo = new MutationObserver(function () {
        var cur = parseInt(cups.textContent, 10) || 0;
        if (cur > last && cur > 1) {
          var b = el('span', 'cq60-surge-burst', '+1');
          box.appendChild(b);
          setTimeout(function () { b.remove(); }, 1100);
        }
        last = cur;
      });
      mo.observe(cups, { childList: true, characterData: true, subtree: true });
    }
  })();

  /* ──────────── (60) Storefront Tomorrow Vision Sequence ──────────── */
  (function vision() {
    var fc = document.getElementById('forecast');
    if (!fc) return;
    if (document.getElementById('cq60Vision')) return;
    var wrap = el('div');
    wrap.id = 'cq60VisionWrap';
    wrap.style.cssText = 'margin-top:24px;';
    wrap.innerHTML =
      '<div style="font:700 11px/1.2 Inter,sans-serif;letter-spacing:.18em;color:#f7d46b;text-transform:uppercase;margin-bottom:10px">Storefront Tomorrow Vision</div>' +
      '<div class="cq60-vision" id="cq60Vision">' +
        '<div class="cq60-vision-stage"><span class="vs-icon">🛒</span><b>Pop-Up Table</b><small>today</small></div>' +
        '<div class="cq60-vision-stage"><span class="vs-icon">❄️</span><b>Branded Freezer</b><small>Drop 004</small></div>' +
        '<div class="cq60-vision-stage"><span class="vs-icon">🚚</span><b>Food Truck</b><small>2026</small></div>' +
        '<div class="cq60-vision-stage"><span class="vs-icon">🏪</span><b>Storefront</b><small>2027</small></div>' +
        '<div class="cq60-vision-stage"><span class="vs-icon">👑</span><b>Dessert Empire</b><small>the crown</small></div>' +
      '</div>';
    fc.appendChild(wrap);
    var v = wrap.querySelector('#cq60Vision');
    onceInView(v, function () { v.classList.add('in-view'); }, { threshold: 0.25 });
  })();

  /* expose tiny dev API */
  window.cq60 = {
    announce: showAnnouncement,
    curtain:  dripCurtain,
    stamp:    royalStamp,
    soldOut:  soldOutExplosion
  };
})();

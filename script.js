/* ═══════════════════════════════════════════════════
   The Creamy Queen — Drop Site Script
   All features: intro, inventory, countdown, scroll
   indicator, cursor trail, crown club, voting, quiz,
   order form, copy/email, reveal observer.
═══════════════════════════════════════════════════ */

/* ── Site config ── */
var CQ = {
  sold: 42,
  total: 60,
  urgencyAt: 10,           // show urgency when remaining <= this
  dropDate: new Date('2026-05-15T17:00:00'),
  dropIsLive: true,
  dropIsSoldOut: false,
  clubMemberCount: 48      // simulated base count for Crown Club
};

/* ──────────────────────────────────────────────────
   HELPER: show toast
────────────────────────────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg || 'Done.';
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 3000);
}

/* ──────────────────────────────────────────────────
   1. INTRO OVERLAY (crown drop sequence)
────────────────────────────────────────────────── */
(function () {
  var overlay  = document.getElementById('introOverlay');
  if (!overlay) return;

  // Only show once per browser session
  if (sessionStorage.getItem('cq_intro_seen')) {
    overlay.classList.add('gone');
    return;
  }

  var crown  = document.getElementById('introCrown');
  var ripple = document.getElementById('introRipple');
  var swirl  = document.getElementById('introSwirlWrap');
  var text   = document.getElementById('introText');
  var skip   = document.getElementById('introSkip');
  var done   = false;

  function finish() {
    if (done) return;
    done = true;
    sessionStorage.setItem('cq_intro_seen', '1');
    overlay.classList.add('fade-out');
    setTimeout(function () { overlay.classList.add('gone'); }, 950);
  }

  if (skip) skip.addEventListener('click', finish);

  setTimeout(function () { if (crown)  crown.classList.add('drop'); },  300);
  setTimeout(function () { if (ripple) ripple.classList.add('spread'); }, 1100);
  setTimeout(function () { if (swirl)  swirl.classList.add('rise'); },   1500);
  setTimeout(function () { if (text)   text.classList.add('visible'); },  1950);
  setTimeout(finish, 5000);
})();

/* ──────────────────────────────────────────────────
   2. INVENTORY URGENCY + LIQUID FILL METER
────────────────────────────────────────────────── */
(function () {
  var sold      = CQ.sold;
  var total     = CQ.total;
  var remaining = total - sold;
  var pct       = Math.min(100, Math.round((sold / total) * 100));

  /* Set liquid fill height (small delay for transition) */
  var lmFill  = document.getElementById('lmFill');
  if (lmFill) {
    setTimeout(function () {
      lmFill.style.height = pct + '%';
    }, 600);
  }

  /* Status label */
  var lmStatus = document.getElementById('lmStatus');

  function applyUrgency() {
    if (CQ.dropIsSoldOut || remaining <= 0) {
      /* Sold-out state */
      document.body.classList.add('sold-out');
      if (lmStatus) lmStatus.textContent = 'THE DROP HAS BEEN CROWNED OUT.';
      var badge = document.getElementById('floatingBadge');
      if (badge) badge.textContent = 'Sold Out';
      var heroBtn = document.getElementById('heroCtaBtn');
      if (heroBtn) { heroBtn.textContent = 'SOLD OUT — JOIN NEXT DROP'; heroBtn.href = '#crown-club'; }
      launchConfetti();
    } else if (remaining <= CQ.urgencyAt) {
      /* Urgency mode */
      document.body.classList.add('urgency-active');
      var banner = document.getElementById('urgencyBanner');
      if (banner) {
        banner.textContent = 'Only ' + remaining + ' cups left — THE CROWN IS ALMOST GONE.';
        banner.classList.add('visible');
        document.body.classList.add('urgency-banner-open');
      }
      if (lmStatus) lmStatus.textContent = 'THE CROWN IS ALMOST GONE.';
      if (lmFill) lmFill.style.background = 'linear-gradient(0deg,rgba(230,100,0,0.9),rgba(247,200,100,0.85))';
    } else {
      if (lmStatus) lmStatus.textContent = 'Cups are going fast.';
    }
  }

  applyUrgency();
})();

/* ──────────────────────────────────────────────────
   3. SOLD-OUT CONFETTI BURST
────────────────────────────────────────────────── */
function launchConfetti() {
  var container = document.getElementById('confettiContainer');
  if (!container) return;
  var shapes = ['♛', '•', '◆', '★'];
  var colors = ['#f7d46b', '#fff7e6', '#d4af37', '#ffffff', '#f7a46b'];
  for (var i = 0; i < 90; i++) {
    (function (delay) {
      setTimeout(function () {
        var el = document.createElement('div');
        el.className = 'confetti-piece';
        el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        el.style.left = (Math.random() * 100) + 'vw';
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
        el.style.animationDuration = (1.4 + Math.random() * 2.2) + 's';
        el.style.fontSize = (10 + Math.random() * 18) + 'px';
        container.appendChild(el);
        el.addEventListener('animationend', function () { el.remove(); });
      }, delay);
    })(i * 35);
  }
}

/* ──────────────────────────────────────────────────
   4. MOBILE NAVIGATION TOGGLE
────────────────────────────────────────────────── */
(function () {
  var toggle = document.getElementById('mobileToggle');
  var nav    = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.textContent = open ? '\u2715' : '\u2630';
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.textContent = '\u2630';
    });
  });
})();

/* ──────────────────────────────────────────────────
   5. CROWN CLOCK (countdown timer)
────────────────────────────────────────────────── */
(function () {
  var dEl  = document.getElementById('clockDays');
  var hEl  = document.getElementById('clockHours');
  var mEl  = document.getElementById('clockMins');
  var sEl  = document.getElementById('clockSecs');
  var lbl  = document.getElementById('clockTopLabel');
  var sub  = document.getElementById('clockSub');
  if (!dEl) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var now  = Date.now();
    var diff = CQ.dropDate.getTime() - now;

    if (diff <= 0) {
      /* Drop is live */
      if (lbl) lbl.textContent = 'THE CREAM IS LIVE.';
      if (sub) sub.textContent = 'The drop is open — reserve your crown now.';
      dEl.textContent = '00';
      hEl.textContent = '00';
      mEl.textContent = '00';
      sEl.textContent = '00';
      clearInterval(timer);
      return;
    }

    var s = Math.floor(diff / 1000);
    var m = Math.floor(s / 60); s %= 60;
    var h = Math.floor(m / 60); m %= 60;
    var d = Math.floor(h / 24); h %= 24;

    dEl.textContent = pad(d);
    hEl.textContent = pad(h);
    mEl.textContent = pad(m);
    sEl.textContent = pad(s);
  }

  var timer = setInterval(tick, 1000);
  tick();
})();

/* ──────────────────────────────────────────────────
   6. SCROLL INDICATOR (crown moves along track)
────────────────────────────────────────────────── */
(function () {
  var crown = document.getElementById('siCrown');
  var track = document.getElementById('siTrack');
  if (!crown || !track) return;

  function onScroll() {
    var scrollTop  = window.scrollY;
    var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    var pct        = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
    var trackH     = track.offsetHeight;
    crown.style.top = Math.round(pct * (trackH - 20)) + 'px';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Clickable dots */
  track.querySelectorAll('.si-dot').forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = document.querySelector(dot.dataset.href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ──────────────────────────────────────────────────
   7. CURSOR TRAIL (per flavor section)
────────────────────────────────────────────────── */
(function () {
  var throttle = false;

  function createParticle(x, y, type) {
    var p = document.createElement('span');
    p.className = 'cursor-particle';
    var symbols = { vanilla: ['✦','·','★'], cookies: ['●','·','◆'], lime: ['✦','·','✧'] };
    var colors  = { vanilla: '#f7d46b', cookies: '#8B5C14', lime: '#cfeea1' };
    p.textContent = (symbols[type] || ['·'])[Math.floor(Math.random() * 3)];
    p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;color:' + (colors[type] || '#fff') + ';font-size:' + (8 + Math.random() * 10) + 'px;';
    document.body.appendChild(p);
    setTimeout(function () { p.remove(); }, 950);
  }

  document.addEventListener('mousemove', function (e) {
    if (throttle) return;
    throttle = true;
    setTimeout(function () { throttle = false; }, 60);

    var el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    var type = null;
    if (el.closest('.flavor-card.vanilla')) type = 'vanilla';
    else if (el.closest('.flavor-card.cookies')) type = 'cookies';
    else if (el.closest('.flavor-card.lime'))    type = 'lime';

    if (type) createParticle(e.clientX + window.scrollX, e.clientY + window.scrollY, type);
  });
})();

/* ──────────────────────────────────────────────────
   8. CROWN CLUB / DROP ALERT GATE
────────────────────────────────────────────────── */
(function () {
  var gateForm   = document.getElementById('gateForm');
  var gateFront  = document.getElementById('gateFront');
  var gateInside = document.getElementById('gateInside');
  var gateInput  = document.getElementById('gateInput');
  var clubNumber = document.getElementById('clubNumber');
  var vaultGrid  = document.getElementById('vaultGrid');

  if (!gateForm) return;

  /* If already joined this session, show inside */
  if (sessionStorage.getItem('cq_club_joined') && gateInside) {
    gateFront.hidden = true;
    gateInside.hidden = false;
  }

  gateForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = (gateInput && gateInput.value.trim()) || '';
    if (!val) return;

    /* Animate doors opening */
    if (gateFront) gateFront.classList.add('open');

    setTimeout(function () {
      if (gateFront)  gateFront.hidden = true;
      if (gateInside) {
        gateInside.hidden = false;
        /* Assign a member number */
        var num = CQ.clubMemberCount + 1;
        CQ.clubMemberCount = num;
        if (clubNumber) clubNumber.textContent = '#' + String(num).padStart(4, '0');
      }
      sessionStorage.setItem('cq_club_joined', '1');

      /* Unlock vault cards */
      unlockVault();
    }, 950);
  });

  function unlockVault() {
    if (!vaultGrid) return;
    var locked = vaultGrid.querySelectorAll('.vault-card.locked');
    locked.forEach(function (card, i) {
      setTimeout(function () {
        card.classList.remove('locked');
        card.classList.add('unlocked');
        var lockIcon = card.querySelector('.vault-lock-icon');
        if (lockIcon) lockIcon.textContent = '✦';
        var status = card.querySelector('.vault-status');
        if (status) { status.textContent = 'Unlocked'; status.style.color = 'var(--gold-2)'; }
      }, i * 280);
    });
  }
})();

/* ──────────────────────────────────────────────────
   9. FLIP CELL ANIMATION (archive)
────────────────────────────────────────────────── */
(function () {
  var cells = document.querySelectorAll('.flip-cell');
  if (!cells.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('animated');
        }, 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  cells.forEach(function (c) { obs.observe(c); });
})();

/* ──────────────────────────────────────────────────
   10. DROP FORECAST BARS (animate on scroll)
────────────────────────────────────────────────── */
(function () {
  var bars = document.querySelectorAll('.fb-fill');
  if (!bars.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var pct = entry.target.style.getPropertyValue('--fpct') || '0%';
        entry.target.style.width = pct;
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(function (b) { obs.observe(b); });
})();

/* ──────────────────────────────────────────────────
   11. FLAVOR VOTING BATTLE
────────────────────────────────────────────────── */
(function () {
  var stored = null;
  try { stored = JSON.parse(localStorage.getItem('cq_votes')); } catch (e) {}
  var votes  = stored || { banana: 47, strawberry: 31 };
  var voted  = localStorage.getItem('cq_voted_flavor') || null;

  var bBtn = document.getElementById('voteBanana');
  var sBtn = document.getElementById('voteStrawberry');
  var bBar = document.getElementById('bananaBar');
  var sBar = document.getElementById('strawberryBar');
  var bPct = document.getElementById('bananaPct');
  var sPct = document.getElementById('strawberryPct');
  var verdict = document.getElementById('voteVerdict');

  function renderVotes() {
    var tot = votes.banana + votes.strawberry || 1;
    var bp  = Math.round((votes.banana / tot) * 100);
    var sp  = 100 - bp;
    if (bBar) bBar.style.width = bp + '%';
    if (sBar) sBar.style.width = sp + '%';
    if (bPct) bPct.textContent = bp + '%';
    if (sPct) sPct.textContent = sp + '%';

    var winFlavor = votes.banana >= votes.strawberry ? 'banana' : 'strawberry';
    document.querySelectorAll('.vote-card').forEach(function (card) {
      card.classList.toggle('winning', card.dataset.flavor === winFlavor);
    });
  }

  function castVote(flavor) {
    if (voted) return;
    votes[flavor]++;
    voted = flavor;
    try {
      localStorage.setItem('cq_votes', JSON.stringify(votes));
      localStorage.setItem('cq_voted_flavor', flavor);
    } catch (e) {}
    renderVotes();
    /* Disable both buttons */
    if (bBtn) { bBtn.disabled = true; bBtn.textContent = flavor === 'banana' ? 'Voted \u265b' : 'Voted'; }
    if (sBtn) { sBtn.disabled = true; sBtn.textContent = flavor === 'strawberry' ? 'Voted \u265b' : 'Voted'; }

    var winner = votes.banana >= votes.strawberry ? 'Banana Pudding Throne' : 'Strawberry Shortcake Queen';
    if (verdict) {
      verdict.textContent = 'THE COURT HAS SPOKEN. ' + winner + ' leads.';
      verdict.classList.add('visible');
    }
  }

  if (voted) {
    [bBtn, sBtn].forEach(function (btn) { if (btn) btn.disabled = true; });
    var winner = votes.banana >= votes.strawberry ? 'Banana Pudding Throne' : 'Strawberry Shortcake Queen';
    if (verdict) { verdict.textContent = 'THE COURT HAS SPOKEN. ' + winner + ' leads.'; verdict.classList.add('visible'); }
  }

  if (bBtn) bBtn.addEventListener('click', function () { castVote('banana'); });
  if (sBtn) sBtn.addEventListener('click', function () { castVote('strawberry'); });

  /* Animate bars when in view */
  var obs = new IntersectionObserver(function (entries) {
    if (entries.some(function (e) { return e.isIntersecting; })) {
      renderVotes();
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  var arena = document.querySelector('.vote-arena');
  if (arena) obs.observe(arena);
})();

/* ──────────────────────────────────────────────────
   12. FLAVOR PERSONALITY QUIZ
────────────────────────────────────────────────── */
(function () {
  var answers = {};
  var current = 1;
  var total   = 4;

  var progressFill = document.getElementById('quizProgressFill');
  var result       = document.getElementById('quizResult');
  var qrFlavor     = document.getElementById('qrFlavor');
  var qrDesc       = document.getElementById('qrDesc');
  var retryBtn     = document.getElementById('quizRetry');

  function setProgress(step) {
    if (progressFill) progressFill.style.width = Math.round((step / total) * 100) + '%';
  }

  function showStep(n) {
    for (var i = 1; i <= total; i++) {
      var el = document.getElementById('qs' + i);
      if (el) el.classList.toggle('active', i === n);
    }
    if (result) result.hidden = true;
    setProgress(n - 1);
  }

  function showResult() {
    for (var i = 1; i <= total; i++) {
      var el = document.getElementById('qs' + i);
      if (el) el.classList.remove('active');
    }
    if (progressFill) progressFill.style.width = '100%';
    if (result) result.hidden = false;

    var flavor, desc;
    if (answers[1] === 'tangy' || answers[3] === 'fruit') {
      flavor = 'Key Lime Queen';
      desc   = 'Bright, bold, and citrus-crowned. You like your dessert with character, a refreshing kick, and a signature that lingers.';
    } else if (answers[2] === 'bold' || answers[3] === 'cookie') {
      flavor = 'Cookies & Cream Castle';
      desc   = 'Bold, rich, cookie-loaded, and impossible to ignore. You are crowd-favorite energy — the one everyone asks for by name.';
    } else {
      flavor = 'Vanilla Crown';
      desc   = 'Classic, elegant, and perfectly crowned. You know quality when you taste it, and you want every bite to feel royal.';
    }

    if (qrFlavor) qrFlavor.textContent = flavor;
    if (qrDesc)   qrDesc.textContent   = desc;
  }

  document.querySelectorAll('.quiz-opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var q = parseInt(this.dataset.q, 10);
      var v = this.dataset.v;
      answers[q] = v;

      if (q < total) {
        current = q + 1;
        showStep(current);
      } else {
        showResult();
      }
    });
  });

  if (retryBtn) {
    retryBtn.addEventListener('click', function () {
      answers = {};
      current = 1;
      showStep(1);
    });
  }

  showStep(1);
})();

/* ──────────────────────────────────────────────────
   13. ORDER FORM SUMMARY + SEAL BUTTON ANIMATION
────────────────────────────────────────────────── */
(function () {
  var packSelect     = document.getElementById('packSelect');
  var quantitySelect = document.getElementById('quantitySelect');
  var flavorSelect   = document.getElementById('flavorSelect');
  var pickupSelect   = document.getElementById('pickupSelect');
  var summaryPack    = document.getElementById('summaryPack');
  var summaryPrice   = document.getElementById('summaryPrice');
  var summaryTotal   = document.getElementById('summaryTotal');
  var summaryText    = document.getElementById('summaryText');
  var emailOrder     = document.getElementById('emailOrder');

  function getSummaryData() {
    var parts     = (packSelect && packSelect.value.split('|')) || [];
    var packName  = parts[0] || '';
    var basePrice = parseInt(parts[1] || '0', 10);
    var qty       = parseInt((quantitySelect && quantitySelect.value) || '1', 10);
    var flavor    = (flavorSelect && flavorSelect.value) || '';
    var pickup    = (pickupSelect && pickupSelect.value) || '';
    var name      = (document.getElementById('customerName') && document.getElementById('customerName').value) || '';
    var contact   = (document.getElementById('customerContact') && document.getElementById('customerContact').value) || '';
    var notes     = (document.getElementById('notes') && document.getElementById('notes').value) || '';
    var total     = basePrice * qty;
    return { packName: packName, basePrice: basePrice, qty: qty, flavor: flavor, pickup: pickup, name: name, contact: contact, notes: notes, total: total };
  }

  function updateSummary() {
    var d = getSummaryData();
    if (summaryPack)  summaryPack.textContent  = d.packName;
    if (summaryPrice) summaryPrice.textContent = '$' + d.basePrice;
    if (summaryTotal) summaryTotal.textContent = '$' + d.total;
    if (summaryText)  summaryText.textContent  = d.packName + ' \u2022 Qty ' + d.qty + ' \u2022 ' + d.flavor + ' \u2022 ' + d.pickup;

    if (emailOrder) {
      var subject = encodeURIComponent('The Creamy Queen Preorder \u2014 ' + d.packName);
      var body    = encodeURIComponent(
        'Name: ' + d.name + '\n' +
        'Contact: ' + d.contact + '\n' +
        'Pack: ' + d.packName + '\n' +
        'Price: $' + d.basePrice + '\n' +
        'Quantity: ' + d.qty + '\n' +
        'Total: $' + d.total + '\n' +
        'Flavor: ' + d.flavor + '\n' +
        'Pickup: ' + d.pickup + (d.notes ? '\nNotes: ' + d.notes : '')
      );
      emailOrder.href = 'mailto:orders@thecreamyqueen.com?subject=' + subject + '&body=' + body;
    }
  }

  [packSelect, quantitySelect, flavorSelect, pickupSelect].forEach(function (el) {
    if (el) el.addEventListener('change', updateSummary);
  });
  ['customerName', 'customerContact', 'notes'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateSummary);
  });
  updateSummary();
})();

/* ──────────────────────────────────────────────────
   14. COPY ORDER (seal button animation + clipboard)
────────────────────────────────────────────────── */
(function () {
  var copyBtn = document.getElementById('copyOrder');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', function () {
    /* Seal animation */
    copyBtn.classList.add('sealing');
    setTimeout(function () { copyBtn.classList.remove('sealing'); }, 700);

    var packSelect     = document.getElementById('packSelect');
    var quantitySelect = document.getElementById('quantitySelect');
    var flavorSelect   = document.getElementById('flavorSelect');
    var pickupSelect   = document.getElementById('pickupSelect');
    var parts      = (packSelect && packSelect.value.split('|')) || [];
    var packName   = parts[0] || '';
    var basePrice  = parseInt(parts[1] || '0', 10);
    var qty        = parseInt((quantitySelect && quantitySelect.value) || '1', 10);
    var flavor     = (flavorSelect && flavorSelect.value) || '';
    var pickup     = (pickupSelect && pickupSelect.value) || '';
    var name       = (document.getElementById('customerName') && document.getElementById('customerName').value) || '';
    var contact    = (document.getElementById('customerContact') && document.getElementById('customerContact').value) || '';
    var notes      = (document.getElementById('notes') && document.getElementById('notes').value) || '';
    var total      = basePrice * qty;

    var summary = [
      '--- The Creamy Queen Preorder ---',
      'Name: ' + name,
      'Contact: ' + contact,
      'Pack: ' + packName,
      'Price: $' + basePrice,
      'Quantity: ' + qty,
      'Total: $' + total,
      'Flavor: ' + flavor,
      'Pickup: ' + pickup,
      notes ? 'Notes: ' + notes : '',
      '---------------------------------'
    ].filter(Boolean).join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summary).then(function () {
        showToast('Order sealed & copied to clipboard. \u265b');
      }).catch(function () {
        fallbackCopy(summary);
      });
    } else {
      fallbackCopy(summary);
    }
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('Order sealed & copied. \u265b'); }
    catch (e) { showToast('Could not copy automatically.'); }
    document.body.removeChild(ta);
  }
})();

/* ──────────────────────────────────────────────────
   15. INTERSECTION OBSERVER REVEAL
────────────────────────────────────────────────── */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(function (el) { obs.observe(el); });
})();

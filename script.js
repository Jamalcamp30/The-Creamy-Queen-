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

/* ═══════════════════════════════════════════════════════════
   SIGNATURE UPGRADE LAYER — 25 animations + 25 features
═══════════════════════════════════════════════════════════ */

/* ── 16. ROYAL DROP BOARD — live mirror of CQ state ─────── */
(function () {
  var claimed   = document.getElementById('dbClaimed');
  var bar       = document.getElementById('dbClaimedBar');
  var nextCup   = document.getElementById('dbNextCup');
  var minutes   = document.getElementById('dbMinutes');
  var predict   = document.getElementById('dbPredictText');
  var batch     = document.getElementById('dbBatch');
  var fcRem     = document.getElementById('fcRemaining');
  if (!claimed) return;

  var remaining = CQ.total - CQ.sold;
  claimed.textContent = CQ.sold;
  var pct = Math.min(100, Math.round((CQ.sold / CQ.total) * 100));
  setTimeout(function () { if (bar) bar.style.width = pct + '%'; }, 700);
  if (nextCup) nextCup.textContent = String(CQ.sold + 1).padStart(3, '0');
  if (fcRem)   fcRem.textContent   = remaining;
  if (batch)   batch.textContent   = '003';

  /* Sellout prediction: assume avg cup-claim ~1.3 min */
  if (minutes && predict) {
    var est = Math.max(2, Math.round(remaining * 1.3));
    minutes.textContent = est;
    if (remaining <= 0) predict.textContent = 'crown closed';
    else if (remaining <= CQ.urgencyAt) predict.textContent = 'critical — moving fast';
  }

  /* VIP early access timer (12 minute head-start countdown) */
  var vip = document.getElementById('dbVipTimer');
  if (vip) {
    var endsAt = sessionStorage.getItem('cq_vip_ends');
    if (!endsAt) {
      endsAt = Date.now() + 12 * 60 * 1000;
      sessionStorage.setItem('cq_vip_ends', endsAt);
    } else { endsAt = parseInt(endsAt, 10); }
    function tickVip() {
      var diff = endsAt - Date.now();
      if (diff <= 0) { vip.textContent = 'LIVE NOW'; vip.style.color = '#f7d46b'; return; }
      var s = Math.floor(diff / 1000);
      var m = Math.floor(s / 60); s %= 60;
      vip.textContent = m + ':' + String(s).padStart(2, '0');
      setTimeout(tickVip, 1000);
    }
    tickVip();
  }
})();

/* ── 17. QUEEN'S SPOTLIGHT (follows hero CTA) ───────────── */
(function () {
  var spot = document.getElementById('queenSpotlight');
  var cta  = document.getElementById('heroCtaBtn');
  if (!spot || !cta) return;

  function position() {
    var r = cta.getBoundingClientRect();
    /* only show while hero CTA is in viewport */
    if (r.bottom < 0 || r.top > window.innerHeight) {
      spot.classList.remove('active'); return;
    }
    spot.classList.add('active');
    spot.style.left = (r.left + r.width / 2) + 'px';
    spot.style.top  = (r.top  + r.height / 2) + 'px';
  }
  position();
  window.addEventListener('scroll', position, { passive: true });
  window.addEventListener('resize', position);
})();

/* ── 18. 3D FLAVOR CARD TILT ────────────────────────────── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cards = document.querySelectorAll('.tilt-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top)  / r.height;
      var rx = (py - 0.5) * -8;
      var ry = (px - 0.5) *  10;
      card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
})();

/* ── 19. CLAIM A CUP (flavor card -> flavor passport stamp) */
(function () {
  var stamps   = document.querySelectorAll('.passport-stamp');
  var reward   = document.getElementById('passportReward');
  var stamped  = {};
  try { stamped = JSON.parse(localStorage.getItem('cq_passport') || '{}') || {}; } catch (e) {}

  function refresh() {
    var count = 0;
    stamps.forEach(function (s) {
      var name = s.dataset.stamp;
      if (stamped[name]) { s.classList.add('stamped'); count++; }
    });
    if (reward) {
      if (count >= 3) {
        reward.textContent = '★ All 3 crowns stamped — Secret menu cup unlocked at next pickup.';
        reward.classList.add('unlocked');
      } else {
        reward.textContent = count + ' / 3 crowns stamped. Royalty is patient.';
      }
    }
  }

  function stamp(name) {
    if (stamped[name]) return;
    stamped[name] = Date.now();
    try { localStorage.setItem('cq_passport', JSON.stringify(stamped)); } catch (e) {}
    refresh();
    showToast('Passport stamped: ' + name + ' ♛');
  }

  document.querySelectorAll('.card-claim').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.classList.add('popping');
      setTimeout(function () { btn.classList.remove('popping'); }, 650);
      var flavor = btn.dataset.flavor;
      stamp(flavor);
      /* prefill preorder */
      var flavorSelect = document.getElementById('flavorSelect');
      if (flavorSelect) {
        for (var i = 0; i < flavorSelect.options.length; i++) {
          if (flavorSelect.options[i].text.replace(/&amp;/g,'&').trim() === flavor.replace(/&amp;/g,'&').trim()) {
            flavorSelect.selectedIndex = i;
            flavorSelect.dispatchEvent(new Event('change'));
            break;
          }
        }
      }
    });
  });

  refresh();
})();

/* ── 20. BUILD-A-PACK ────────────────────────────────────── */
(function () {
  var sizeBtns = document.querySelectorAll('.bap-size');
  var addBtns  = document.querySelectorAll('.bap-add');
  var resetBtn = document.getElementById('bapReset');
  var box      = document.getElementById('bapBox');
  var inner    = document.getElementById('bapBoxInner');
  var filledEl = document.getElementById('bapFilled');
  var capEl    = document.getElementById('bapCap');
  var fullEl   = document.getElementById('bapFull');
  var emptyEl  = document.getElementById('bapEmpty');
  var toPre    = document.getElementById('bapToPreorder');
  if (!box || !inner) return;

  var capacity = 6, cups = [];

  function syncSizes() {
    sizeBtns.forEach(function (b) {
      b.classList.toggle('active', parseInt(b.dataset.size, 10) === capacity);
    });
  }
  function render() {
    inner.innerHTML = '';
    cups.forEach(function (c) {
      var el = document.createElement('div');
      el.className = 'bap-cup ' + c.color;
      el.textContent = c.flavor.length > 14 ? c.flavor.split(' ')[0] : c.flavor.replace('&amp;', '&');
      el.title = c.flavor;
      inner.appendChild(el);
    });
    if (filledEl) filledEl.textContent = cups.length;
    if (capEl)    capEl.textContent    = capacity;
    box.dataset.size = capacity;
    box.classList.toggle('has-cup', cups.length > 0);
    if (fullEl) fullEl.hidden = cups.length < capacity;
    if (emptyEl) emptyEl.style.display = cups.length === 0 ? '' : 'none';
  }
  function setSize(n) {
    capacity = n;
    if (cups.length > capacity) cups = cups.slice(0, capacity);
    syncSizes();
    render();
  }

  sizeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { setSize(parseInt(btn.dataset.size, 10)); });
  });
  addBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (cups.length >= capacity) {
        showToast('Box is full — bump up the size or send to preorder.');
        return;
      }
      cups.push({ flavor: btn.dataset.flavor, color: btn.dataset.color });
      render();
    });
  });
  if (resetBtn) resetBtn.addEventListener('click', function () { cups = []; render(); });

  if (toPre) {
    toPre.addEventListener('click', function (e) {
      var packSelect = document.getElementById('packSelect');
      if (packSelect) {
        var target = capacity === 2 ? 'Single Crown Cup|7'
                   : capacity === 4 ? 'Royal Sampler|18'
                   : capacity === 6 ? 'Family Crown Box|38'
                   : 'Party Drop Box|75';
        for (var i = 0; i < packSelect.options.length; i++) {
          if (packSelect.options[i].value === target) { packSelect.selectedIndex = i; break; }
        }
        packSelect.dispatchEvent(new Event('change'));
      }
      var notes = document.getElementById('notes');
      if (notes && cups.length) {
        var flavors = cups.map(function (c) { return c.flavor.replace('&amp;','&'); }).join(', ');
        notes.value = (notes.value ? notes.value + '\n' : '') + 'Build-A-Pack: ' + flavors;
        notes.dispatchEvent(new Event('input'));
      }
    });
  }

  /* default to 6 */
  setSize(6);
})();

/* ── 21. CATERING CROWN CALCULATOR ───────────────────────── */
(function () {
  var slider = document.getElementById('ccGuests');
  var out    = document.getElementById('ccGuestsOut');
  var cMin   = document.getElementById('ccCups');
  var cMax   = document.getElementById('ccCupsMax');
  var pack   = document.getElementById('ccPack');
  var price  = document.getElementById('ccPrice');
  var btn    = document.getElementById('ccBookBtn');
  if (!slider) return;

  function update() {
    var g = parseInt(slider.value, 10);
    /* ~1.2 cups per guest (everyone comes back for seconds) */
    var lo = Math.ceil(g * 1.1);
    var hi = Math.ceil(g * 1.4);
    if (out)  out.value = g + ' guests';
    if (cMin) cMin.textContent = lo;
    if (cMax) cMax.textContent = hi;
    var p = '', pr = '';
    if (hi <= 12)     { p = 'Party Drop Box';       pr = '$75'; }
    else if (hi <= 50){ p = '50-Cup Party Drop';    pr = '$325+'; }
    else if (hi <= 100){p = '100-Cup Event Drop';   pr = '$650+'; }
    else              { p = 'Custom Event Drop';    pr = '$' + (Math.round(hi * 6.5)) + '+'; }
    if (pack) pack.textContent = p;
    if (price) price.textContent = pr;

    var fillPct = ((g - parseInt(slider.min,10)) / (parseInt(slider.max,10) - parseInt(slider.min,10))) * 100;
    slider.style.setProperty('--ccfill', fillPct + '%');

    if (btn) {
      btn.onclick = function () {
        var notes = document.getElementById('notes');
        if (notes) {
          notes.value = 'Catering inquiry: ' + g + ' guests, ~' + lo + '-' + hi + ' cups, ' + p + '.';
          notes.dispatchEvent(new Event('input'));
        }
        var pickup = document.getElementById('pickupSelect');
        if (pickup) {
          for (var i = 0; i < pickup.options.length; i++) {
            if (pickup.options[i].value.toLowerCase().indexOf('event') > -1) {
              pickup.selectedIndex = i; pickup.dispatchEvent(new Event('change')); break;
            }
          }
        }
        var packSelect = document.getElementById('packSelect');
        if (packSelect) {
          for (var j = 0; j < packSelect.options.length; j++) {
            if (packSelect.options[j].text.indexOf(p.split('-')[0]) > -1 || packSelect.options[j].text.indexOf(p) > -1) {
              packSelect.selectedIndex = j; packSelect.dispatchEvent(new Event('change')); break;
            }
          }
        }
      };
    }
  }
  slider.addEventListener('input', update);
  update();
})();

/* ── 22. HALL OF FAME — "Bring It Back" voting ──────────── */
(function () {
  var buttons = document.querySelectorAll('.hof-bring');
  if (!buttons.length) return;
  var stored = {};
  try { stored = JSON.parse(localStorage.getItem('cq_bring_back') || '{}') || {}; } catch (e) {}
  var voted = {};
  try { voted = JSON.parse(localStorage.getItem('cq_bring_voted') || '{}') || {}; } catch (e) {}

  /* simulated base counts for social-proof effect */
  var seeds = { 'Cookies &amp; Cream Castle': 142, 'Peach Cobbler Crown': 89, 'Banana Pudding Throne': 73, 'Red Velvet Royalty': 51 };

  buttons.forEach(function (btn) {
    var flavor = btn.dataset.flavor;
    var countEl = btn.querySelector('.hbb-count');
    var count = (stored[flavor] != null) ? stored[flavor] : (seeds[flavor] || 0);
    if (countEl) countEl.textContent = count;
    if (voted[flavor]) btn.classList.add('voted');

    btn.addEventListener('click', function () {
      if (voted[flavor]) { showToast('Already voted to bring back ' + flavor.replace('&amp;','&')); return; }
      count++;
      stored[flavor] = count;
      voted[flavor]  = 1;
      try {
        localStorage.setItem('cq_bring_back',  JSON.stringify(stored));
        localStorage.setItem('cq_bring_voted', JSON.stringify(voted));
      } catch (e) {}
      if (countEl) countEl.textContent = count;
      btn.classList.add('voted');
      showToast('Vote registered for ' + flavor.replace('&amp;','&') + ' ♛');
    });
  });
})();

/* ── 23. SCOREBOARD — count-up animation ─────────────────── */
(function () {
  var tiles = document.querySelectorAll('.sb-tile [data-counter]');
  if (!tiles.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.dataset.counter, 10) || 0;
      var suffix = el.dataset.suffix || '';
      var start = Date.now(); var dur = 1400;
      function step() {
        var p = Math.min(1, (Date.now() - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      step();
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  tiles.forEach(function (t) { obs.observe(t); });
})();

/* ── 24. CUP NUMBERING + MYSTERY CUP + ROYAL RECEIPT ────── */
(function () {
  var packSelect     = document.getElementById('packSelect');
  var quantitySelect = document.getElementById('quantitySelect');
  var flavorSelect   = document.getElementById('flavorSelect');
  var pickupSelect   = document.getElementById('pickupSelect');
  var mystery        = document.getElementById('mysteryCup');
  var summaryTotal   = document.getElementById('summaryTotal');
  var summaryPrice   = document.getElementById('summaryPrice');
  var summaryCupNum  = document.getElementById('summaryCupNum');
  var summaryBatch   = document.getElementById('summaryBatch');
  var summaryMysRow  = document.getElementById('summaryMysteryRow');

  function recalc() {
    var parts = (packSelect && packSelect.value.split('|')) || [];
    var basePrice = parseInt(parts[1] || '0', 10);
    var qty       = parseInt((quantitySelect && quantitySelect.value) || '1', 10);
    var tot       = basePrice * qty;
    if (mystery && mystery.checked) { tot += 7; if (summaryMysRow) summaryMysRow.hidden = false; }
    else { if (summaryMysRow) summaryMysRow.hidden = true; }
    if (summaryTotal) summaryTotal.textContent = '$' + tot;
    if (summaryPrice) summaryPrice.textContent = '$' + basePrice;
    if (summaryCupNum) summaryCupNum.textContent = String(CQ.sold + 1).padStart(3, '0');
    if (summaryBatch)  summaryBatch.textContent  = '003';
  }

  [packSelect, quantitySelect, flavorSelect, pickupSelect, mystery].forEach(function (el) {
    if (el) el.addEventListener('change', recalc);
  });
  recalc();

  /* Royal receipt slide-up after seal */
  var copyBtn  = document.getElementById('copyOrder');
  var receipt  = document.getElementById('royalReceipt');
  var rrLines  = document.getElementById('rrLines');
  var rrCupNum = document.getElementById('rrCupNum');
  var rrBatch  = document.getElementById('rrBatch');
  if (!copyBtn || !receipt) return;

  copyBtn.addEventListener('click', function () {
    var parts = (packSelect && packSelect.value.split('|')) || [];
    var packName  = parts[0] || '';
    var basePrice = parseInt(parts[1] || '0', 10);
    var qty       = parseInt((quantitySelect && quantitySelect.value) || '1', 10);
    var flavor    = (flavorSelect && flavorSelect.value) || '';
    var pickup    = (pickupSelect && pickupSelect.value) || '';
    var name      = (document.getElementById('customerName')    || {}).value || '—';
    var mys       = mystery && mystery.checked;
    var tot       = basePrice * qty + (mys ? 7 : 0);
    var lines = [
      ['Name',     name],
      ['Pack',     packName],
      ['Qty',      String(qty)],
      ['Flavor',   flavor],
      ['Pickup',   pickup]
    ];
    if (mys) lines.push(['+ Mystery Cup', '$7']);
    lines.push(['TOTAL', '$' + tot]);
    if (rrLines) {
      rrLines.innerHTML = lines.map(function (l) {
        return '<li><span>' + l[0] + '</span><b>' + l[1] + '</b></li>';
      }).join('');
    }
    if (rrCupNum) rrCupNum.textContent = String(CQ.sold + 1).padStart(3, '0');
    if (rrBatch)  rrBatch.textContent  = '003';
    receipt.hidden = false;
    /* re-trigger slide-up animation */
    receipt.style.animation = 'none';
    void receipt.offsetWidth;
    receipt.style.animation = '';
    /* sparkle burst */
    launchConfetti();
  });
})();

/* ── 25. SOLD-OUT CROWN LOCK + FINAL CUP MOMENT ─────────── */
(function () {
  /* Apply crown-lock to vault cards if they ever sell out (visual demo) */
  var remaining = CQ.total - CQ.sold;
  if (remaining <= 0 || CQ.dropIsSoldOut) {
    document.querySelectorAll('.vault-card').forEach(function (c) {
      c.classList.add('crown-locked');
    });
    var overlay = document.getElementById('finalCupOverlay');
    if (overlay) {
      overlay.classList.add('show');
      /* hide after animation */
      setTimeout(function () { overlay.classList.remove('show'); }, 6200);
    }
  }
})();

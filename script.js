/* ── Inventory bar ── */
(function () {
  const soldCount = parseInt(document.getElementById('soldCount')?.textContent || '0', 10);
  const total = 60;
  const fill = document.getElementById('inventoryFill');
  if (fill) {
    const pct = Math.min(100, Math.round((soldCount / total) * 100));
    requestAnimationFrame(function () {
      fill.style.width = pct + '%';
    });
  }
})();

/* ── Mobile navigation toggle ── */
(function () {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    toggle.textContent = isOpen ? '\u2715' : '\u2630';
  });

  // Close nav when a link is clicked
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.textContent = '\u2630';
    });
  });
})();

/* ── Order form summary ── */
(function () {
  var packSelect = document.getElementById('packSelect');
  var quantitySelect = document.getElementById('quantitySelect');
  var flavorSelect = document.getElementById('flavorSelect');
  var pickupSelect = document.getElementById('pickupSelect');
  var summaryPack = document.getElementById('summaryPack');
  var summaryPrice = document.getElementById('summaryPrice');
  var summaryTotal = document.getElementById('summaryTotal');
  var summaryText = document.getElementById('summaryText');
  var emailOrder = document.getElementById('emailOrder');

  function updateSummary() {
    if (!packSelect) return;
    var parts = packSelect.value.split('|');
    var packName = parts[0] || '';
    var basePrice = parseInt(parts[1] || '0', 10);
    var qty = parseInt((quantitySelect && quantitySelect.value) || '1', 10);
    var flavor = (flavorSelect && flavorSelect.value) || '';
    var pickup = (pickupSelect && pickupSelect.value) || '';
    var total = basePrice * qty;

    if (summaryPack) summaryPack.textContent = packName;
    if (summaryPrice) summaryPrice.textContent = '$' + basePrice;
    if (summaryTotal) summaryTotal.textContent = '$' + total;
    if (summaryText) {
      summaryText.textContent = packName + ' \u2022 Qty ' + qty + ' \u2022 ' + flavor + ' \u2022 ' + pickup;
    }

    // Update email link
    if (emailOrder) {
      var customerName = (document.getElementById('customerName') && document.getElementById('customerName').value) || '';
      var customerContact = (document.getElementById('customerContact') && document.getElementById('customerContact').value) || '';
      var notes = (document.getElementById('notes') && document.getElementById('notes').value) || '';
      var subject = encodeURIComponent('The Creamy Queen Preorder – ' + packName);
      var body = encodeURIComponent(
        'Name: ' + customerName + '\n' +
        'Contact: ' + customerContact + '\n' +
        'Pack: ' + packName + '\n' +
        'Price: $' + basePrice + '\n' +
        'Quantity: ' + qty + '\n' +
        'Total: $' + total + '\n' +
        'Flavor: ' + flavor + '\n' +
        'Pickup: ' + pickup + '\n' +
        'Notes: ' + notes
      );
      emailOrder.href = 'mailto:orders@thecreamyqueen.com?subject=' + subject + '&body=' + body;
    }
  }

  [packSelect, quantitySelect, flavorSelect, pickupSelect].forEach(function (el) {
    if (el) el.addEventListener('change', updateSummary);
  });

  // Also update email when name/contact/notes change
  ['customerName', 'customerContact', 'notes'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateSummary);
  });

  updateSummary();
})();

/* ── Copy order to clipboard ── */
(function () {
  var copyBtn = document.getElementById('copyOrder');
  var toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg || 'Copied!';
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2800);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var packSelect = document.getElementById('packSelect');
      var quantitySelect = document.getElementById('quantitySelect');
      var flavorSelect = document.getElementById('flavorSelect');
      var pickupSelect = document.getElementById('pickupSelect');
      var customerName = (document.getElementById('customerName') && document.getElementById('customerName').value) || '';
      var customerContact = (document.getElementById('customerContact') && document.getElementById('customerContact').value) || '';
      var notes = (document.getElementById('notes') && document.getElementById('notes').value) || '';

      var parts = (packSelect && packSelect.value.split('|')) || [];
      var packName = parts[0] || '';
      var basePrice = parseInt(parts[1] || '0', 10);
      var qty = parseInt((quantitySelect && quantitySelect.value) || '1', 10);
      var flavor = (flavorSelect && flavorSelect.value) || '';
      var pickup = (pickupSelect && pickupSelect.value) || '';
      var total = basePrice * qty;

      var summary =
        '--- The Creamy Queen Preorder ---\n' +
        'Name: ' + customerName + '\n' +
        'Contact: ' + customerContact + '\n' +
        'Pack: ' + packName + '\n' +
        'Price: $' + basePrice + '\n' +
        'Quantity: ' + qty + '\n' +
        'Total: $' + total + '\n' +
        'Flavor: ' + flavor + '\n' +
        'Pickup: ' + pickup + (notes ? '\nNotes: ' + notes : '') + '\n' +
        '---------------------------------';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summary).then(function () {
          showToast('Order copied to clipboard.');
        }).catch(function () {
          showToast('Could not copy. Please copy manually.');
        });
      } else {
        // Fallback
        var ta = document.createElement('textarea');
        ta.value = summary;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showToast('Order copied to clipboard.');
        } catch (e) {
          showToast('Could not copy. Please copy manually.');
        }
        document.body.removeChild(ta);
      }
    });
  }
})();

/* ── Intersection Observer reveal ── */
(function () {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();

var design = anime({
  targets: 'svg #XMLID5',
  keyframes: [
    {translateX: -500},
    {rotateY: 180},
    {translateX: 920},
    {rotateY: 0},
    {translateX: -500},
    {rotateY: 180},
    {translateX: -500},
  ],
  easing: 'easeInOutSine',
  duration: 60000,
});

anime({
  targets: '#dust-paarticle path',
  translateY: [10, -150],
  direction: 'alternate',
  loop: true,
  delay: function(el, i, l) {
    return i * 100;
  },
  endDelay: function(el, i, l) {
    return (l - i) * 100;
  }
});

/* ====== UI interactions enhancements ====== */
document.addEventListener('DOMContentLoaded', function () {

  // focus first email input
  var firstEmail = document.querySelector('.authfy-login input[type="email"]');
  if (firstEmail) firstEmail.focus();

  // panel toggler
  document.querySelectorAll('.lnk-toggler').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      var sel = this.getAttribute('data-panel');
      var target = document.querySelector(sel);
      if (!target) return;
      document.querySelectorAll('.authfy-panel').forEach(function(p){ p.classList.remove('active'); });
      target.classList.add('active');
      // smooth scroll for mobile
      var container = document.querySelector('.authfy-container');
      if (container && window.innerWidth < 900) container.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // password toggle (keep accessibility + caret)
  document.querySelectorAll('.pwd-toggle').forEach(function(toggle){
    toggle.setAttribute('role','button');
    toggle.setAttribute('tabindex','0');
    toggle.setAttribute('aria-pressed','false');
    toggle.title = 'Show password';
    toggle.style.cursor = 'pointer';

    function doToggle(t){
      var input = t.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (!input) return;
      var isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      t.classList.toggle('fa-eye', isPwd);
      t.classList.toggle('fa-eye-slash', !isPwd);
      t.setAttribute('aria-pressed', String(isPwd));
      t.title = isPwd ? 'Hide password' : 'Show password';
      // restore focus + caret to end
      input.focus();
      try { var l = input.value.length; input.setSelectionRange(l,l); } catch(e){}
    }

    toggle.addEventListener('click', function(e){ e.preventDefault(); doToggle(this); });
    toggle.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); doToggle(this); }});
    ['mousedown','touchstart'].forEach(function(evt){ toggle.addEventListener(evt, function(e){ e.preventDefault(); }, {passive:false}); });
  });

  // Enter key submits for email/password fields (simulate click on primary btn)
  document.querySelectorAll('.authfy-login input').forEach(function(inp){
    inp.addEventListener('keydown', function(e){
      if (e.key === 'Enter') {
        var form = this.closest('form');
        if (!form) return;
        var primary = form.querySelector('.btn.btn-lg');
        if (primary) primary.click();
        e.preventDefault();
      }
    });
  });

  // Keep existing validation & toast code (if present) — add small safeguard
  // If prior handlers exist in file, they run; otherwise attach minimal click handler:
  if (!document.querySelectorAll('.authfy-login .btn.btn-lg').length) {
    document.querySelectorAll('.btn.btn-lg').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        alert('Button clicked (no handler present).');
      });
    });
  }

});
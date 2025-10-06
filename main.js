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

/* ======= ADDED INTERACTIONS (updated for better pwd toggle) ======= */
document.addEventListener('DOMContentLoaded', function () {

  // panel toggler (Sign up / Forgot / Login)
  document.querySelectorAll('.lnk-toggler').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      var panelSelector = this.getAttribute('data-panel');
      var target = document.querySelector(panelSelector);
      if (!target) return;
      document.querySelectorAll('.authfy-panel').forEach(function(p){ p.classList.remove('active'); });
      target.classList.add('active');
      // scroll to container on small devices
      var container = document.querySelector('.authfy-container');
      if (container) container.scrollIntoView({behavior:'smooth', block:'center'});
    });
  });

  // password show/hide - improved to retain focus & caret position and add accessibility attrs
  document.querySelectorAll('.pwd-toggle').forEach(function(toggle){
    // initialize aria/title
    toggle.setAttribute('role','button');
    toggle.setAttribute('tabindex','0');
    toggle.setAttribute('aria-pressed','false');
    toggle.setAttribute('title','Show password');
    toggle.style.cursor = 'pointer';

    // helper to perform toggle and restore caret
    function doToggle(t) {
      var input = t.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (!input) return;
      var wasPwd = input.type === 'password';
      if (wasPwd) {
        input.type = 'text';
        t.classList.remove('fa-eye-slash');
        t.classList.add('fa-eye');
        t.setAttribute('aria-pressed','true');
        t.setAttribute('title','Hide password');
      } else {
        input.type = 'password';
        t.classList.remove('fa-eye');
        t.classList.add('fa-eye-slash');
        t.setAttribute('aria-pressed','false');
        t.setAttribute('title','Show password');
      }
      // focus and move caret to end (so user can continue typing)
      input.focus();
      try {
        var len = input.value.length;
        input.setSelectionRange(len, len);
      } catch (err) {
        // ignore if not supported
      }
    }

    // click/tap
    toggle.addEventListener('click', function(e){
      e.preventDefault();
      doToggle(this);
    });

    // keyboard support (Enter / Space)
    toggle.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        doToggle(this);
      }
    });

    // on mousedown/touchstart prevent losing focus before toggle (improves mobile behavior)
    ['mousedown','touchstart'].forEach(function(evt){
      toggle.addEventListener(evt, function(e){
        e.preventDefault();
      }, {passive: false});
    });
  });

  // simple form handling + feedback
  function toast(msg, timeout){
    timeout = timeout || 2800;
    var t = document.createElement('div');
    t.className = 'snl-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    // force reflow to allow transition
    void t.offsetWidth;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 220); }, timeout);
  }

  // primary buttons inside forms (login / signup / recover)
  document.querySelectorAll('.authfy-login .btn.btn-lg').forEach(function(btn){
    btn.addEventListener('click', function(e){
      // try to find closest form
      var form = this.closest('form');
      if (!form) return;
      e.preventDefault();
      var email = form.querySelector('input[type="email"]');
      var pwd = form.querySelector('input[type="password"]');
      // basic validation for login/signup
      if (email && email.value.trim() === '') {
        // shake active panel
        var panel = form.closest('.authfy-panel');
        if (panel) {
          panel.classList.remove('shake');
          void panel.offsetWidth;
          panel.classList.add('shake');
          setTimeout(function(){ panel.classList.remove('shake'); }, 600);
        }
        toast('Please enter your email');
        return;
      }
      if (pwd && pwd.value.trim() === '') {
        toast('Please enter your password');
        return;
      }
      // simulate success
      toast('Success — (simulated). Redirecting...', 1800);
      // small success animation using anime.js if available
      if (typeof anime !== 'undefined') {
        anime({
          targets: form.closest('.authfy-panel'),
          scale: [1, 0.995, 1],
          duration: 700,
          easing: 'easeInOutQuad'
        });
      }
    });
  });

  // social button feedback
  document.querySelectorAll('.brand-col .social-buttons a').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      toast('Social sign-in not configured (demo).');
    });
  });

});
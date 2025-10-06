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

/* ======= ADDED INTERACTIONS ======= */
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

  // password show/hide
  document.querySelectorAll('.pwd-toggle').forEach(function(toggle){
    toggle.style.cursor = 'pointer';
    toggle.addEventListener('click', function(){
      var input = this.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      } else {
        input.type = 'password';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      }
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
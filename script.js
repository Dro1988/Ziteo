// Ziteo site scripts
// ---------------------------------------------------------------------------
// CONTACT FORM: the form posts to FormSubmit (free, no backend needed).
// The owner must replace CONTACT_EMAIL below with the real inbox address,
// then submit the form once to activate it (FormSubmit sends a confirm email).
// ---------------------------------------------------------------------------
var CONTACT_EMAIL = "hello@tryziteo.com"; // owner: create this address (or forward) in IONOS, then submit the form once to activate FormSubmit

(function () {
  // Mobile nav
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') links.classList.remove('open');
  });

  // Contact form
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = {
      name: form.name.value.trim(),
      business: form.business.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      plan: form.plan.value,
      message: form.message.value.trim()
    };

    status.textContent = 'Sending...';
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    fetch('https://formsubmit.co/ajax/' + encodeURIComponent(CONTACT_EMAIL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'New Ziteo inquiry: ' + data.business,
        Name: data.name,
        Business: data.business,
        Phone: data.phone,
        Email: data.email,
        'Interested in': data.plan,
        Message: data.message || '(none)'
      })
    })
      .then(function (res) { return res.json(); })
      .then(function () {
        status.className = 'form-status ok';
        status.textContent = "Got it — we'll be in touch within one business day.";
        form.reset();
      })
      .catch(function () {
        status.className = 'form-status err';
        status.textContent = 'Something went wrong sending that. Please try again, or call us directly.';
      })
      .finally(function () { btn.disabled = false; });
  });
})();

// NEWSLETTER SIGNUP: posts to FormSubmit (free). First submit triggers a
// confirmation email to dandrsalesllc@gmail.com — click it to activate.
(function () {
  var form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('nlName').value.trim();
    var email = document.getElementById('nlEmail').value.trim();
    var status = document.getElementById('nlStatus');
    if (!email || email.indexOf('@') < 0) {
      status.className = 'form-status err';
      status.textContent = 'Please enter a valid email address.';
      return;
    }
    status.textContent = 'Subscribing...';
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    fetch('https://formsubmit.co/ajax/' + encodeURIComponent('dandrsalesllc@gmail.com'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ _subject: 'New Ziteo guide subscriber', Name: name || '(none)', Email: email })
    })
      .then(function (res) { return res.json(); })
      .then(function () {
        status.className = 'form-status ok';
        status.textContent = "You're in — talk soon.";
        form.reset();
      })
      .catch(function () {
        status.className = 'form-status err';
        status.textContent = 'Something went wrong. Please try again.';
      })
      .finally(function () { btn.disabled = false; });
  });
})();

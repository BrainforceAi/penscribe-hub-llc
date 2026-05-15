// site.js — shared interactions for all pages

document.addEventListener('DOMContentLoaded', function () {

  // Nav scroll shadow
  var nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  // Mobile hamburger
  var toggle = document.getElementById('nav-toggle');
  var links  = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
  }

  // Close booking modal on overlay click
  var modal = document.getElementById('booking-modal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeBooking();
    });
  }

  // Lucide icons
  if (window.lucide) lucide.createIcons();
});

function openBooking(subject) {
  var modal = document.getElementById('booking-modal');
  var link  = document.getElementById('booking-email-link');
  if (!modal) return;
  var sub  = subject || 'Consultation request';
  var body = 'Hi,\n\nWe would like to discuss' +
             (subject ? ' "' + subject + '"' : ' a government contracting opportunity') +
             '.\n\nAbout our business:\n\n\nRelevant solicitation (if any):\n\n\nThank you,\n';
  if (link) link.href = 'mailto:isaac@thepenscribe.com?subject=' +
    encodeURIComponent(sub) + '&body=' + encodeURIComponent(body);
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeBooking() {
  var modal = document.getElementById('booking-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

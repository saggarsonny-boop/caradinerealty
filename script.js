// Nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Project filters
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Contact form — basic client-side validation + success state
const form = document.getElementById('contact-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const message = form.querySelector('#message');
  let valid = true;

  [name, email, message].forEach(field => field.classList.remove('error'));

  if (!name.value.trim()) { name.classList.add('error'); valid = false; }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('error'); valid = false;
  }
  if (!message.value.trim()) { message.classList.add('error'); valid = false; }

  if (!valid) return;

  form.innerHTML = `<div class="form-success">
    <strong>Message received!</strong><br />
    Thanks for reaching out — we'll be in touch within one business day.
  </div>`;
});

// Smooth scroll offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

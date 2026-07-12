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

// Project Detail Modal & Slider
const modal = document.getElementById('project-modal');
const modalOverlay = modal.querySelector('.modal-overlay');
const closeBtns = modal.querySelectorAll('[data-close-modal]');
const baSlider = document.getElementById('ba-slider');
const baBeforeImg = document.getElementById('ba-before-img');
const baSliderLine = document.getElementById('ba-slider-line');

// Open Modal
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    // Populate modal data based on card (mock functionality for now)
    const title = card.querySelector('h3').textContent;
    const tag = card.querySelector('.project-tag').textContent;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-tag').textContent = tag;
    
    // Reset slider
    baSlider.value = 50;
    updateSlider(50);

    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
});

// Close Modal
const closeModal = () => {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
    closeModal();
  }
});

// Before/After Slider Logic
const updateSlider = (value) => {
  baBeforeImg.style.width = `${value}%`;
  baSliderLine.style.left = `${value}%`;
};

baSlider.addEventListener('input', (e) => {
  updateSlider(e.target.value);
});

// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); // Run once
    }
  });
}, {
  root: null,
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Client Login Modal Logic
const loginTrigger = document.getElementById('login-trigger');
const loginModal = document.getElementById('login-modal');
const loginCloseBtn = document.getElementById('login-close');
const loginCloseOverlay = document.getElementById('login-close-overlay');

const openLoginModal = (e) => {
  e.preventDefault();
  loginModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLoginModal = () => {
  loginModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

if (loginTrigger && loginModal) {
  loginTrigger.addEventListener('click', openLoginModal);
  loginCloseBtn.addEventListener('click', closeLoginModal);
  loginCloseOverlay.addEventListener('click', closeLoginModal);
}



<!-- Stripe Checkout Block -->
<div id="stripe-checkout-cta" style="margin: 2rem auto; padding: 2rem; border-radius: 12px; background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.2); text-align: center; font-family: sans-serif; max-width: 600px;">
    <h3 style="margin-top: 0; color: #fff;">Activate Premium License</h3>
    <p style="color: #9ca3af; font-size: 0.95rem; margin-bottom: 1.5rem;">Get instant access to all advanced capabilities and integration features.</p>
    <a href="https://buy.stripe.com/9B6bJ33Aj3sRanU22Z0RG0I" target="_blank" style="display: inline-block; padding: 0.8rem 2rem; background: #3b82f6; color: #fff; font-weight: bold; border-radius: 8px; text-decoration: none; transition: background 0.2s;">Unlock Now</a>
</div>

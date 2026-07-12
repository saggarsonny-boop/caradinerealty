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
const baAfter = document.querySelector('.ba-after');
const baBefore = document.querySelector('.ba-before');
const modalGallery = document.getElementById('modal-gallery');
const modalNarrative = document.getElementById('modal-narrative');
const baContainer = document.getElementById('modal-before-after');

// Complete project database mapping
const projectData = {
  delcastle: {
    narrative: "<p>Our complete renovation of 5125 Delcastle Drive in Florissant, MO 63034. This project showcase details full residential revitalization, including customized interior layouts, updated kitchens and baths, systems modernization, and clean exterior landscaping.</p>",
    before: "public/listings/5125_delcastle/01_Exterior.jpg",
    after: "public/listings/5125_delcastle/Exterior.jpg",
    gallery: [
      '01_Exterior.jpg', '02_Interior.jpg', '03_Interior.jpg', '04_Interior.jpg',
      '05_Interior.jpg', '06_Interior.jpg', '07_Interior.jpg', '08_Interior.jpg',
      '09_Interior.jpg', '10_Interior.jpg', '11_Interior.jpg', '12_Interior.jpg',
      '13_Interior.jpg', '14_Interior.jpg', '15_Interior.jpg', '16_Interior.jpg',
      '17_Interior.jpg', '18_Interior.jpg', '19_Interior.jpg', '20_Exterior.jpg',
      '21_Exterior.jpg', 'Exterior.jpg'
    ].map(name => `public/listings/5125_delcastle/${name}`)
  },
  warehouse: {
    narrative: "<p>Full exterior and interior conversion of a historic 19th-century industrial brick warehouse. Reconstructed into creative loft-offices with modern HVAC, seismic retrofitting, and energy-efficient insulated glass frames, while preserving all original heavy-timber framing and exposed interior brick walls.</p>",
    before: "public/projects/warehouse_before.jpg",
    after: "public/projects/warehouse_after.jpg",
    gallery: ["public/projects/warehouse_before.jpg", "public/projects/warehouse_after.jpg"]
  },
  infill: {
    narrative: "<p>A high-density mixed-use development that replaced a vacant, blight-ridden urban lot. Features premium ground-floor storefront spaces for local retailers and cafes, with modern eco-friendly residences above. Includes geothermal heating, green roofs, and smart building controls.</p>",
    before: "public/projects/infill_before.jpg",
    after: "public/projects/infill_after.jpg",
    gallery: ["public/projects/infill_before.jpg", "public/projects/infill_after.jpg"]
  },
  storefront: {
    narrative: "<p>Historic restoration of a downtown brick commercial facade. Removed decades of metal cladding to expose and restore the original wood-carved moldings, brick arches, and cast-iron pillars. Replaced building systems and modernized the interior layouts for retail usage.</p>",
    before: "public/projects/storefront_before.jpg",
    after: "public/projects/storefront_after.jpg",
    gallery: ["public/projects/storefront_before.jpg", "public/projects/storefront_after.jpg"]
  },
  school: {
    narrative: "<p>Adaptive reuse conversion of an abandoned public school building. Repurposed the historic classrooms and gymnasium into 36 high-quality, fully accessible senior housing apartments, preserving the landmark exterior brick details, high ceilings, and original central corridors.</p>",
    before: "public/projects/school_before.jpg",
    after: "public/projects/school_after.jpg",
    gallery: ["public/projects/school_before.jpg", "public/projects/school_after.jpg"]
  },
  multifamily: {
    narrative: "<p>Ground-up construction of a modern 48-unit multi-family apartment community. Designed from the ground up for energy efficiency, utilizing solar arrays, high-efficiency insulation, and smart home packages. Features a central community courtyard and shared green space.</p>",
    before: "",
    after: "public/projects/multifamily_front.jpg",
    gallery: ["public/projects/multifamily_front.jpg"]
  },
  health: {
    narrative: "<p>A brand new, state-of-the-art community wellness center designed in partnership with local non-profits. The facility offers community health clinics, meeting spaces, a teaching kitchen, and outdoor walking paths to support local preventative care services.</p>",
    before: "",
    after: "public/projects/health_front.jpg",
    gallery: ["public/projects/health_front.jpg"]
  }
};

// Open Modal
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h3').textContent;
    const tag = card.querySelector('.project-tag').textContent;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-tag').textContent = tag;
    
    // Reset slider
    baSlider.value = 50;
    updateSlider(50);

    const projectId = card.dataset.projectId;
    const pData = projectData[projectId];

    if (pData) {
      modalNarrative.innerHTML = pData.narrative;
      
      // Before/After Slider Handling
      if (pData.before) {
        baContainer.style.display = 'block';
        baAfter.style.backgroundImage = `url('${pData.after}')`;
        baAfter.style.backgroundSize = "cover";
        baAfter.style.backgroundPosition = "center";
        baAfter.querySelector('.placeholder-img').textContent = '';

        baBeforeImg.style.backgroundImage = `url('${pData.before}')`;
        baBeforeImg.style.backgroundSize = "cover";
        baBeforeImg.style.backgroundPosition = "center";
        baBeforeImg.querySelector('.placeholder-img').textContent = '';
      } else {
        // Hide slider for new construction (no "before" state)
        baContainer.style.display = 'none';
      }

      // Progress Gallery
      modalGallery.innerHTML = '';
      pData.gallery.forEach(imgPath => {
        const item = document.createElement('div');
        item.className = 'gallery-placeholder';
        item.style.backgroundImage = `url('${imgPath}')`;
        item.style.backgroundSize = 'cover';
        item.style.backgroundPosition = 'center';
        item.textContent = '';
        modalGallery.appendChild(item);
      });
    } else {
      modalNarrative.innerHTML = `<p>A look at the property and community transformation process. Detailed timeline, progress reports, and specifications are available in the client portal.</p>`;
      baContainer.style.display = 'block';
      baAfter.style.backgroundImage = "";
      baAfter.querySelector('.placeholder-img').textContent = 'After';
      baBeforeImg.style.backgroundImage = "";
      baBeforeImg.querySelector('.placeholder-img').textContent = 'Before';
      modalGallery.innerHTML = `
        <div class="gallery-placeholder">Photo Placeholder</div>
        <div class="gallery-placeholder">Photo Placeholder</div>
        <div class="gallery-placeholder">Photo Placeholder</div>
      `;
    }

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

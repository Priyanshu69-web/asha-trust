/*
 * Asha Education Trust - Interactivity Logic
 * Custom javascript supporting responsive navigation, carousels, forms, and galleries
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- STICKY HEADER & SCROLL BEHAVIOR ---
  const header = document.getElementById('site-header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
      // Subtle header padding reduction or shadow styling is managed in CSS
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once on startup in case page loaded scrolled down

  // --- MOBILE DRAWER INTERACTION ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('open');
      navLinks.classList.toggle('active');
      
      // Prevent body scrolling when mobile menu is active
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile drawer when clicking a link
    const navItemLinks = document.querySelectorAll('.nav-item-link');
    navItemLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- ACTIVE HEADER NAV HIGHLIGHT ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const primaryLinks = document.querySelectorAll('.nav-item-link');

  const highlightNav = () => {
    let scrollY = window.scrollY;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140; // match header offset
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        primaryLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav);

  // --- GALLERY LIGHTBOX MODAL ---
  const galleryCards = document.querySelectorAll('.gallery-card-custom');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (galleryCards.length > 0 && lightboxModal && lightboxImg && lightboxClose) {
    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-image');
        const imgAlt = card.querySelector('img').getAttribute('alt');
        
        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', imgAlt);
        
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // disable page scroll
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = ''; // restore scrolling
      setTimeout(() => {
        lightboxImg.setAttribute('src', '');
      }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on clicking backdrop overlay
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- TESTIMONIAL VIDEO INTERACTION ---
  const playButtons = document.querySelectorAll('.play-button-overlay');
  playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.testimonial-slide-card');
      const studentName = card.querySelector('.student-name-text').textContent;
      alert(`Playing video success story for ${studentName}...\nIn production, this opens a video player or plays in-place.`);
    });
  });

  // --- CONTACT FORM SUBMISSION HANDLING ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const source = document.getElementById('contact-source').value;
      const message = document.getElementById('contact-message').value.trim();
      
      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      
      alert(`Thank you, ${name}! Your inquiry has been received.\nOur admissions counsellor will contact you at ${email} shortly.`);
      contactForm.reset();
    });
  }

  // --- NEWSLETTER PRE-FOOTER FORM SUBMISSION ---
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      alert(`Success! Subscribed to AET skilling newsletter: ${emailInput.value}`);
      newsletterForm.reset();
    });
  }
});

/*
 * Lifekare Medical and Technical Institute - Interactivity Logic
 * Custom javascript supporting responsive navigation, carousels, popup modals,
 * animated stats counters, course filter tabs, and galleries.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- STICKY HEADER & SCROLL BEHAVIOR ---
  const header = document.getElementById('site-header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // --- HASH SCROLL OFFSET FOR FIXED HEADER ---
  const scrollToHash = () => {
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        const headerHeight = header ? header.offsetHeight : 74;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 24);
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  if (window.location.hash) {
    setTimeout(scrollToHash, 150);
  }
  window.addEventListener('hashchange', scrollToHash);

  // --- MOBILE DRAWER INTERACTION ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('open');
      navLinks.classList.toggle('active');
      
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
  const isHomePage = !!document.getElementById('home');
  if (isHomePage) {
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
            const href = link.getAttribute('href');
            if (href && (href.endsWith(`#${sectionId}`) || href === `#${sectionId}`)) {
              primaryLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    };
    window.addEventListener('scroll', highlightNav);
  }

  // --- HERO CAROUSEL INTERACTION ---
  const heroCarousel = document.getElementById('hero-carousel');
  if (heroCarousel) {
    const track = document.getElementById('carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('next-slide');
    const prevBtn = document.getElementById('prev-slide');
    const dotsContainer = document.getElementById('carousel-dots');
    const dots = Array.from(dotsContainer.children);
    
    let currentIndex = 0;
    let autoSlideTimer;

    const updateCarousel = (index) => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    };

    const nextSlide = () => {
      let nextIndex = (currentIndex + 1) % slides.length;
      updateCarousel(nextIndex);
    };

    const prevSlide = () => {
      let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel(prevIndex);
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, 5000); // Auto slide every 5 seconds
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    };

    // Click Handlers
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateCarousel(idx);
        startAutoSlide();
      });
    });

    // Pause on Hover
    heroCarousel.addEventListener('mouseenter', stopAutoSlide);
    heroCarousel.addEventListener('mouseleave', startAutoSlide);

    // Initial setup
    updateCarousel(0);
    startAutoSlide();
  }

  // --- POPUP ADMISSION ENQUIRY MODAL ---
  const enquiryPopup = document.getElementById('enquiry-popup');
  const closePopupBtn = document.getElementById('close-popup');
  const popupForm = document.getElementById('popup-enquiry-form');
  const formWrapper = document.getElementById('enquiry-form-wrapper');
  const successMsg = document.getElementById('popup-success-msg');

  const openPopup = () => {
    if (enquiryPopup) {
      if (formWrapper) formWrapper.style.display = 'block';
      if (successMsg) successMsg.style.display = 'none';
      if (popupForm) popupForm.reset();
      enquiryPopup.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closePopup = () => {
    if (enquiryPopup) {
      enquiryPopup.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Wire all popup trigger buttons
  const popupTriggers = document.querySelectorAll('.trigger-popup, .program-action-btn, .campus-card-btn, .scholarship-cta-btn');
  popupTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup();
    });
  });

  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', closePopup);
  }

  if (enquiryPopup) {
    enquiryPopup.addEventListener('click', (e) => {
      if (e.target === enquiryPopup) {
        closePopup();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && enquiryPopup.classList.contains('active')) {
        closePopup();
      }
    });
  }

  // Show Popup on first visit of the session
  if (isHomePage && enquiryPopup) {
    const hasVisited = sessionStorage.getItem('lmti_visited');
    if (!hasVisited) {
      setTimeout(() => {
        openPopup();
        sessionStorage.setItem('lmti_visited', 'true');
      }, 2500); // 2.5 seconds delay after load
    }
  }

  // Handle Popup Form Submission
  if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('popup-name').value.trim();
      const email = document.getElementById('popup-email').value.trim();
      const phone = document.getElementById('popup-phone').value.trim();
      const course = document.getElementById('popup-course').value;

      if (!name || !email || !phone || !course) {
        alert('Please fill in all required fields.');
        return;
      }

      // Hide form, show success message
      if (formWrapper && successMsg) {
        formWrapper.style.display = 'none';
        successMsg.style.display = 'block';
        
        // Auto-close popup after 3 seconds
        setTimeout(closePopup, 3000);
      }
    });
  }

  // --- POPUP CSR ENQUIRY MODAL ---
  const csrEnquiryPopup = document.getElementById('csr-enquiry-popup');
  const closeCsrPopupBtn = document.getElementById('csr-close-popup');
  const csrPopupForm = document.getElementById('csr-popup-enquiry-form');
  const csrFormWrapper = document.getElementById('csr-enquiry-form-wrapper');
  const csrSuccessMsg = document.getElementById('csr-popup-success-msg');

  const openCsrPopup = () => {
    if (csrEnquiryPopup) {
      if (csrFormWrapper) csrFormWrapper.style.display = 'block';
      if (csrSuccessMsg) csrSuccessMsg.style.display = 'none';
      if (csrPopupForm) csrPopupForm.reset();
      csrEnquiryPopup.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeCsrPopup = () => {
    if (csrEnquiryPopup) {
      csrEnquiryPopup.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Wire all CSR popup trigger buttons
  const csrPopupTriggers = document.querySelectorAll('.trigger-csr-popup');
  csrPopupTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCsrPopup();
    });
  });

  if (closeCsrPopupBtn) {
    closeCsrPopupBtn.addEventListener('click', closeCsrPopup);
  }

  if (csrEnquiryPopup) {
    csrEnquiryPopup.addEventListener('click', (e) => {
      if (e.target === csrEnquiryPopup) {
        closeCsrPopup();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && csrEnquiryPopup.classList.contains('active')) {
        closeCsrPopup();
      }
    });
  }

  // Handle CSR Popup Form Submission
  if (csrPopupForm) {
    csrPopupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('csr-popup-name').value.trim();
      const email = document.getElementById('csr-popup-email').value.trim();
      const mobile = document.getElementById('csr-popup-mobile').value.trim();
      const organization = document.getElementById('csr-popup-org').value.trim();
      const address = document.getElementById('csr-popup-address').value.trim();

      if (!name || !email || !mobile || !organization || !address) {
        alert('Please fill in all required fields.');
        return;
      }

      // Format enquiry message for WhatsApp (Mobile: 9811418383) and Mailto (Email: LMTI@ASHA-TRUST.ORG)
      const formattedMessage = `CSR Project Enquiry:\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nOrganization: ${organization}\nAddress: ${address}`;
      
      const waNumber = '919811418383';
      const emailTarget = 'LMTI@ASHA-TRUST.ORG';
      
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(formattedMessage)}`;
      const mailtoUrl = `mailto:${emailTarget}?subject=${encodeURIComponent('New CSR Project Enquiry - ' + organization)}&body=${encodeURIComponent(formattedMessage)}`;

      // Update success buttons links
      const waBtn = document.getElementById('csr-success-wa-link');
      const mailBtn = document.getElementById('csr-success-mail-link');
      if (waBtn) waBtn.href = waUrl;
      if (mailBtn) mailBtn.href = mailtoUrl;

      // Hide form, show success message
      if (csrFormWrapper && csrSuccessMsg) {
        csrFormWrapper.style.display = 'none';
        csrSuccessMsg.style.display = 'block';
      }

      // Automatically open WhatsApp option in a new tab
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 600);
    });
  }



  // --- COURSE TABS FILTER SYSTEM ---
  const tabButtons = document.querySelectorAll('.skill-tab-btn');
  const coursesGrid = document.getElementById('courses-grid');
  
  if (tabButtons.length > 0 && coursesGrid) {
    const courseCards = Array.from(coursesGrid.children);

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        courseCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- ANIMATED STATS COUNTERS ---
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0) {
    const runCounters = () => {
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 1500; // 1.5 seconds animation duration
        const stepTime = Math.max(Math.floor(duration / target), 15);
        
        // Determine increment
        const increment = Math.ceil(target / (duration / stepTime));

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            stat.textContent = target + (target === 9 || target === 20 ? '+' : '+');
            if (target === 9) stat.textContent = '9+ Years';
            if (target === 1200) stat.textContent = '1200+';
            if (target === 20) stat.textContent = '20+';
            if (target === 5000) stat.textContent = '5000+';
            clearInterval(timer);
          } else {
            stat.textContent = current;
          }
        }, stepTime);
      });
    };

    // Intersection Observer to trigger counters when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.career-stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    } else {
      // Fallback
      runCounters();
    }
  }

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
      openPopup(); // Trigger the same popup for enquiries
    });
  });

  // --- CONTACT FORM SUBMISSION HANDLING ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      
      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      
      const parentCard = contactForm.closest('.contact-form-card-custom');
      const inlineSuccessMsg = parentCard ? parentCard.querySelector('.contact-success-msg-custom') : null;
      const formHeading = parentCard ? parentCard.querySelector('.contact-form-heading') : null;
      
      if (inlineSuccessMsg) {
        contactForm.style.display = 'none';
        if (formHeading) formHeading.style.display = 'none';
        inlineSuccessMsg.style.display = 'flex';
      } else {
        alert(`Thank you, ${name}! Your inquiry has been received.\nOur admissions counsellor will contact you at ${email} shortly.`);
        contactForm.reset();
      }
    });
  }

});

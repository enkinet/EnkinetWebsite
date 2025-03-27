document.addEventListener('DOMContentLoaded', () => {
  // Seleccionar elementos del DOM
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const header = document.querySelector('header');
  const serviciosCarousel = document.querySelector('.servicios-carousel');
  const productosCarousel = document.querySelector('.productos-carousel');
  const backToTop = document.querySelector('.back-to-top');
  const contactForm = document.getElementById('fullContactForm');
  const newsletterForm = document.getElementById('newsletterForm');
  const themeBtn = document.getElementById('theme-btn');

  // Cambio de tema
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      document.body.classList.toggle('light-theme');
      localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.add('dark-theme');
    }
  }

  // Menú móvil
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Función para scroll suave a secciones
  function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const headerOffset = header.offsetHeight;
      const elementPosition = targetElement.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Función para navegar a un servicio específico
  function scrollToService(serviceIndex) {
    const serviciosSection = document.getElementById('servicios');
    if (serviciosSection) {
      const headerOffset = header.offsetHeight;
      const elementPosition = serviciosSection.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Mostrar el servicio específico en el carrusel
      if (serviciosCarousel) {
        currentIndex = serviceIndex;
        updateCarousel();
      }
    }
  }

  // Navegación suave para enlaces con #
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (!this.hasAttribute('onclick')) { // Solo para enlaces sin onclick personalizado
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
      }
    });
  });

  // Header con efecto de scroll
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    header.classList.toggle('scrolled', currentScroll > 50);
    backToTop.classList.toggle('visible', currentScroll > 100);
  });

  // Botón volver arriba
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Validación de formularios
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showMessage(form, message, isError = false) {
    const messageDiv = form.querySelector('.form-message') || document.createElement('div');
    messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
    messageDiv.textContent = message;

    if (!form.querySelector('.form-message')) {
      form.appendChild(messageDiv);
    }

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  // Formulario de contacto
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = contactForm.querySelector('[name="email"]').value;
      const nombre = contactForm.querySelector('[name="nombre"]').value;
      const mensaje = contactForm.querySelector('[name="mensaje"]').value;
      const privacyCheckbox = contactForm.querySelector('[name="privacyConsent"]').checked;

      if (!nombre || !isValidEmail(email) || !mensaje || !privacyCheckbox) {
        showMessage(contactForm, 'Por favor, completa todos los campos correctamente.', true);
        return;
      }

      showMessage(contactForm, '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
      contactForm.reset();
    });
  }

  // Formulario de newsletter
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('[name="email"]').value;

      if (!isValidEmail(email)) {
        showMessage(newsletterForm, 'Por favor, ingresa un correo válido.', true);
        return;
      }

      showMessage(newsletterForm, '¡Gracias por suscribirte! Recibirás nuestras novedades pronto.');
      newsletterForm.reset();
    });
  }

  // Animaciones al hacer scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate__animated', 'animate__fadeIn');
        animateOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    animateOnScroll.observe(element);
  });

  // Función para manejar carruseles con bucle infinito
  function setupCarousel(carousel, itemsSelector) {
    if (!carousel) return;

    const items = carousel.querySelectorAll(itemsSelector);
    if (items.length === 0) return;

    const allItems = carousel.querySelectorAll(itemsSelector);
    let currentIndex = 0;
    const totalItems = allItems.length;
    let touchStartX = 0;
    let touchEndX = 0;

    function updateCarousel(smooth = true) {
      const itemWidth = carousel.offsetWidth / 2;
      const offset = -currentIndex * itemWidth;
      carousel.style.transition = smooth ? 'transform 0.5s ease' : 'none';
      carousel.style.transform = `translateX(${offset}px)`;
    }

    updateCarousel(false);

    const prevBtn = carousel.parentElement.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.parentElement.querySelector('.carousel-btn.next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        } else {
          currentIndex = totalItems - 2;
          updateCarousel();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < totalItems - 2) {
          currentIndex++;
          updateCarousel();
        } else {
          currentIndex = 0;
          updateCarousel();
        }
      });
    }

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      if (!touchStartX) return;
      const touch = e.touches[0];
      const diff = touchStartX - touch.clientX;
      if (Math.abs(diff) > 5) {
        e.preventDefault();
      }
    }, { passive: false });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < totalItems - 2) {
          currentIndex++;
          updateCarousel();
        } else if (diff < 0 && currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      }

      touchStartX = 0;
      touchEndX = 0;
    }, { passive: true });

    window.addEventListener('resize', () => {
      updateCarousel(false);
    });
  }

  setupCarousel(serviciosCarousel, '.servicio');
  setupCarousel(productosCarousel, '.producto');

  // Animación de estadísticas en la sección "Nosotros"
  const statItems = document.querySelectorAll('.stat-item[data-count]');
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const count = parseInt(stat.getAttribute('data-count')) || 0;
        let current = 0;
        const increment = count / 50;

        const updateCounter = () => {
          if (current < count) {
            current += increment;
            const value = Math.round(current);
            stat.querySelector('.stat-number').textContent = count === 95 ? `${value}%` : value;
            requestAnimationFrame(updateCounter);
          } else {
            stat.querySelector('.stat-number').textContent = count === 95 ? `${count}%` : count;
          }
        };

        updateCounter();
        observer.unobserve(stat);
      }
    });
  }, { threshold: 0.5 });

  statItems.forEach(stat => statObserver.observe(stat));
});
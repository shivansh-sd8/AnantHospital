/**
* Template Name: Medilab
* Template URL: https://bootstrapmade.com/medilab-free-medical-bootstrap-theme/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  document.querySelectorAll('.navmenu .dropdown ul').forEach((dropdownList) => {
    const searchInput = dropdownList.querySelector('.dropdown-search-input');
    if (!searchInput) return;

    const dropdownItems = Array.from(dropdownList.querySelectorAll('li'));
    const filterItems = () => {
      const query = searchInput.value.trim().toLowerCase();
      dropdownItems.forEach((li) => {
        if (li.classList.contains('dropdown-search')) return;
        const link = li.querySelector('a');
        if (!link) return;
        const text = (link.textContent || '').trim().toLowerCase();
        li.style.display = query === '' || text.includes(query) ? '' : 'none';
      });
    };

    searchInput.addEventListener('input', filterItems);

    searchInput.addEventListener('keydown', (e) => {
      e.stopPropagation();
    });

    dropdownList.addEventListener('transitionend', () => {
      if (getComputedStyle(dropdownList).visibility === 'visible') {
        filterItems();
      }
    });
  });

  const appointmentForm = document.querySelector('#appointmentForm');
  if (appointmentForm) {
    const dateInput = appointmentForm.querySelector('#date');
    const phoneInput = appointmentForm.querySelector('#phone');
    const errorEl = document.querySelector('#appointmentError');

    const toLocalDateTimeValue = (date) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const clearError = () => {
      if (!errorEl) return;
      errorEl.textContent = '';
      errorEl.style.display = 'none';
      errorEl.removeAttribute('role');
    };

    const showError = (message) => {
      if (!errorEl) return;
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      errorEl.setAttribute('role', 'alert');
    };

    const now = new Date();
    now.setSeconds(0, 0);
    const minValue = toLocalDateTimeValue(now);
    if (dateInput) {
      dateInput.setAttribute('min', minValue);
    }

    const normalizePhone = () => {
      if (!phoneInput) return;
      const digitsOnly = (phoneInput.value || '').replace(/\D/g, '').slice(0, 10);
      if (phoneInput.value !== digitsOnly) {
        phoneInput.value = digitsOnly;
      }
      if (digitsOnly.length === 0 || digitsOnly.length === 10) {
        phoneInput.setCustomValidity('');
      } else {
        phoneInput.setCustomValidity('Please enter a 10-digit phone number.');
      }
    };

    if (phoneInput) {
      phoneInput.addEventListener('input', normalizePhone);
      phoneInput.addEventListener('paste', () => {
        setTimeout(normalizePhone, 0);
      });
      phoneInput.addEventListener('keydown', (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
        if (allowedKeys.includes(e.key)) return;
        if (e.ctrlKey || e.metaKey) return;
        if (/^[0-9]$/.test(e.key)) return;
        e.preventDefault();
      });
      normalizePhone();
    }

    const validateNotPast = () => {
      if (!dateInput) return true;
      const value = dateInput.value;
      if (!value) {
        dateInput.setCustomValidity('');
        clearError();
        return true;
      }

      const selected = new Date(value);
      const current = new Date();
      if (Number.isNaN(selected.getTime())) {
        dateInput.setCustomValidity('');
        clearError();
        return true;
      }

      if (selected.getTime() < current.getTime()) {
        const message = 'Please select a future date/time for the appointment.';
        dateInput.setCustomValidity(message);
        showError(message);
        return false;
      }

      dateInput.setCustomValidity('');
      clearError();
      return true;
    };

    if (dateInput) {
      dateInput.addEventListener('change', validateNotPast);
      dateInput.addEventListener('input', validateNotPast);
    }

    appointmentForm.addEventListener('submit', (e) => {
      normalizePhone();
      const ok = validateNotPast();
      if (!ok) {
        e.preventDefault();
        if (dateInput) dateInput.focus();
      }
    });
  }

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
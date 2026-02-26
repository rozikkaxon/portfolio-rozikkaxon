/* =============================================
   CORAL BOLD — Portfolio Script
   Ro'zikkaxon Iskandarova
   ============================================= */

// ======================
// THEME TOGGLE (global — called via onclick)
// ======================
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update toggle icon
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = newTheme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
    }
}

// Apply saved theme immediately (before DOMContentLoaded to avoid flash)
(function() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ---- Theme icon initialization ----
    const savedTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.textContent = savedTheme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
    }

    // ---- State ----
    let currentLang = 'uz';

    // ---- DOM Elements ----
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const langToggle = document.getElementById('langToggle');
    const langOptions = langToggle.querySelectorAll('.lang-option');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // ======================
    // 1. LANGUAGE TOGGLE
    // ======================
    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang === 'uz' ? 'uz' : 'en';

        // Update all elements with data-uz and data-en
        const elements = document.querySelectorAll('[data-uz][data-en]');
        elements.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text !== null) {
                el.textContent = text;
            }
        });

        // Update active state on language options
        langOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });
    }

    // Click on language options
    langOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.dataset.lang;
            if (lang !== currentLang) {
                setLanguage(lang);
            }
        });
    });

    // ======================
    // 2. NAVBAR SCROLL
    // ======================
    let lastScroll = 0;

    function handleNavbarScroll() {
        const scrollY = window.scrollY;

        // Add scrolled class
        navbar.classList.toggle('scrolled', scrollY > 50);

        // Back to top visibility
        backToTop.classList.toggle('visible', scrollY > 600);

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ======================
    // 3. HAMBURGER MENU
    // ======================
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ======================
    // 4. SMOOTH SCROLL
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ======================
    // 5. BACK TO TOP
    // ======================
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ======================
    // 6. INTERSECTION OBSERVER — Reveal Animations
    // ======================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ======================
    // 7. CONTACT FORM
    // ======================
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const message = contactForm.querySelector('#message').value.trim();

        // Basic validation
        if (!name || !email || !message) {
            showFormStatus(
                currentLang === 'uz'
                    ? 'Iltimos, barcha maydonlarni to\'ldiring.'
                    : 'Please fill in all fields.',
                'error'
            );
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus(
                currentLang === 'uz'
                    ? 'Iltimos, to\'g\'ri email manzilini kiriting.'
                    : 'Please enter a valid email address.',
                'error'
            );
            return;
        }

        // Success simulation
        showFormStatus(
            currentLang === 'uz'
                ? 'Xabaringiz yuborildi! Tez orada javob beraman.'
                : 'Message sent! I will respond soon.',
            'success'
        );

        contactForm.reset();

        // Clear status after 5 seconds
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }, 5000);
    });

    function showFormStatus(msg, type) {
        formStatus.textContent = msg;
        formStatus.className = `form-status ${type}`;
    }

    // ======================
    // 8. ACTIVE NAV LINK ON SCROLL
    // ======================
    const sections = document.querySelectorAll('section[id]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.querySelectorAll('a').forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--coral)';
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // ======================
    // 9. STAGGERED REVEAL for cards/badges
    // ======================
    function staggerReveal(selector, parentSelector) {
        const parent = document.querySelector(parentSelector);
        if (!parent) return;

        const items = parent.querySelectorAll(selector);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, index) => {
                        item.style.transition = `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`;
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        // Set initial hidden state
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(16px) scale(0.95)';
        });

        observer.observe(parent);
    }

    staggerReveal('.skill-badge', '.skills-grid');
    staggerReveal('.project-card', '.projects-grid');

    // ======================
    // 10. TYPING-LIKE COUNTER for section numbers
    // ======================
    // (Optional subtle enhancement — section numbers glow on reveal)
    document.querySelectorAll('.section-number').forEach(num => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    num.style.transition = 'transform 0.5s ease, color 0.5s ease';
                    num.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        num.style.transform = 'scale(1)';
                    }, 400);
                    observer.unobserve(num);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(num);
    });

    // Initialize
    handleNavbarScroll();
});

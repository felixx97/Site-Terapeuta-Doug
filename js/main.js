/* 
========================================================================
   TERAPEUTA DOUGLAS OLIVER - MAIN JAVASCRIPT (INTERACTION & ANIMATION)
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Global Behaviors
    initHeaderScroll();
    initMobileMenu();
    initScrollAnimations();
    injectFloatingWhatsApp();
    
    // 2. Initialize Services Filtering (If on services page)
    if (document.querySelector('.filter-btn')) {
        initServicesFilter();
    }
});

/**
 * Shinks header and changes glass opacity on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const scrollThreshold = 50;

    const toggleHeaderClass = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    };

    window.addEventListener('scroll', toggleHeaderClass);
    toggleHeaderClass(); // Run once on load in case page is refreshed scrolled
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggle || !mobileNav) return;

    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        // Prevent body scrolling when menu is active
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Scroll Reveal Animations using Intersection Observer
 */
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // viewport
            threshold: 0.15, // trigger when 15% of the element is visible
            rootMargin: '0px 0px -50px 0px' // adjust bottom margin slightly
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Once visible, we don't need to observe it anymore
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(element => observer.observe(element));
    } else {
        // Fallback for older browsers
        reveals.forEach(element => element.classList.add('active'));
    }
}

/**
 * Services page live category filtering
 */
function initServicesFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.services-grid .service-card');

    if (!filterButtons.length || !serviceCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add soft fade-out transition before hiding
                card.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    // Trigger reflow to ensure display change applies before transition
                    card.offsetHeight; 
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px) scale(0.95)';
                    // Hide completely after transition finishes
                    setTimeout(() => {
                        if (btn.classList.contains('active') && btn.getAttribute('data-filter') !== category && category !== 'all') {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

/**
 * Dynamically inject the premium floating WhatsApp badge across all pages
 */
function injectFloatingWhatsApp() {
    if (document.querySelector('.whatsapp-floating')) return;

    const floatingBtn = document.createElement('a');
    floatingBtn.className = 'whatsapp-floating flex-center';
    floatingBtn.href = getWhatsAppLink('Botão Flutuante');
    floatingBtn.target = '_blank';
    floatingBtn.rel = 'noopener noreferrer';
    floatingBtn.setAttribute('aria-label', 'Falar com o terapeuta no WhatsApp');
    
    // Inject the SVG icon inside the button
    floatingBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.416 9.864-9.852.002-2.634-1.02-5.11-2.877-6.97C16.392 1.96 13.91 1.958 12.01 1.958c-5.44 0-9.866 4.42-9.869 9.858-.001 1.502.404 2.97 1.173 4.251l-.993 3.627 3.736-.98zm11.46-6.49c-.27-.136-1.602-.79-1.85-.882-.25-.092-.43-.136-.61.136-.18.273-.7.882-.857 1.06-.16.182-.315.205-.585.069-.27-.136-1.14-.42-2.172-1.34-0.803-.717-1.345-1.603-1.502-1.876-.16-.273-.017-.42.118-.556.12-.123.27-.318.406-.477.135-.16.18-.272.27-.455.09-.182.046-.34-.022-.477-.068-.137-.61-1.473-.836-2.02-.22-.53-.442-.457-.61-.466-.157-.008-.337-.01-.518-.01-.18 0-.473.067-.72.337-.247.272-.943.923-.943 2.25 0 1.328.966 2.61 1.1 2.78.135.17 1.9 2.9 4.603 4.07.643.277 1.145.443 1.536.567.646.206 1.233.176 1.7.107.52-.078 1.602-.656 1.83-1.29.227-.636.227-1.182.16-1.29-.07-.11-.25-.15-.52-.286z"/>
        </svg>
    `;

    document.body.appendChild(floatingBtn);
}

/**
 * Standard utility to generate highly targeted WhatsApp deep links
 * Customizes standard texts depending on the visual section to give context
 * @param {string} trackingSource - The section of the site where the CTA was triggered
 */
function getWhatsAppLink(trackingSource) {
    const phoneNumber = '5511999999999'; // Simulated Brazilian phone number (DDD São Paulo)
    const text = encodeURIComponent(
        `Olá, Douglas Oliver! Gostaria de obter mais informações sobre os tratamentos e agendar uma sessão. (Origem: ${trackingSource})`
    );
    return `https://wa.me/${phoneNumber}?text=${text}`;
}

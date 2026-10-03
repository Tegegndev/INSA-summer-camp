/**
 * Reusable Navbar Controller — Visit Wolaita
 */
(function() {
    function initNavbar() {
        const nav = document.querySelector('nav.site-nav');
        if (!nav) return;

        const hamburger = nav.querySelector('.hamburger');
        const navItems = nav.querySelector('.nav-items');

        // 1. Scroll effect with passive listener
        const handleScroll = () => {
            if (window.scrollY > 40) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check on page load

        // 2. Mobile drawer toggling
        if (hamburger && navItems) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = hamburger.classList.toggle('active');
                navItems.classList.toggle('open');
                hamburger.setAttribute('aria-expanded', String(isOpen));
            });

            // Close when clicking any nav link
            navItems.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navItems.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                });
            });

            // Close when clicking outside drawer
            document.addEventListener('click', (e) => {
                if (navItems.classList.contains('open') && !nav.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navItems.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navItems.classList.contains('open')) {
                    hamburger.classList.remove('active');
                    navItems.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // 3. Language switcher dropdown
        const langSwitch = nav.querySelector('.lang-switch');
        const langTrigger = nav.querySelector('.lang-trigger');
        if (langSwitch && langTrigger) {
            const closeLangMenu = () => {
                langSwitch.classList.remove('open');
                langTrigger.setAttribute('aria-expanded', 'false');
            };

            langTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = langSwitch.classList.toggle('open');
                langTrigger.setAttribute('aria-expanded', String(isOpen));
            });

            document.addEventListener('click', (e) => {
                if (langSwitch.classList.contains('open') && !langSwitch.contains(e.target)) {
                    closeLangMenu();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeLangMenu();
            });
        }

        // 4. Fallback active page detection based on URL
        const currentPath = window.location.pathname.toLowerCase();
        const navLinks = nav.querySelectorAll('.nav-items a');
        let hasActive = false;

        navLinks.forEach(link => {
            if (link.classList.contains('active')) {
                hasActive = true;
            }
        });

        if (!hasActive && navLinks.length > 0) {
            if (currentPath.includes('about')) {
                const aboutLink = nav.querySelector('a[data-nav="about"]');
                if (aboutLink) aboutLink.classList.add('active');
            } else if (currentPath.includes('gallar') || currentPath.includes('gallery')) {
                const galleryLink = nav.querySelector('a[data-nav="gallery"]');
                if (galleryLink) galleryLink.classList.add('active');
            } else if (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '') {
                const homeLink = nav.querySelector('a[data-nav="home"]');
                if (homeLink) homeLink.classList.add('active');
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }
})();

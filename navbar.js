/**
 * IPFS Navigation Engine - Zero Dependency Standalone
 * Ensures mobile menu functionality even if other scripts fail.
 */

function initIPFSNavigation() {
    console.log("IPFS Navigation: Initializing...");

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) {
        console.warn("IPFS Navigation: Essential elements (.menu-toggle or .nav-links) not found.");
        return;
    }

    // Single source of truth for menu state
    const toggleMenu = (e) => {
        if (e) e.preventDefault();
        console.log("IPFS Navigation: Toggle Triggered");
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Toggle body scroll lock to prevent background scrolling
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    menuToggle.removeEventListener('click', toggleMenu);
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu on link click
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            console.log("IPFS Navigation: Link Clicked, Closing Menu");
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    console.log("IPFS Navigation: Ready.");
}

// Execution triggers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIPFSNavigation);
} else {
    initIPFSNavigation();
}

// Global fallback for immediate execution
window.addEventListener('load', initIPFSNavigation);

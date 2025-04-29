document.addEventListener('DOMContentLoaded', function() {
    console.log('Debug script loaded');
    
    // Get all the elements we need
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.overlay');
    const closeBtn = document.querySelector('.mobile-nav-close');
    const testButton = document.getElementById('test-menu-button');
    
    // Log whether each element exists
    console.log('Menu elements found:', {
        menuToggle: !!menuToggle,
        mobileNav: !!mobileNav,
        overlay: !!overlay,
        closeBtn: !!closeBtn,
        testButton: !!testButton
    });
    
    // If the test button exists, add a direct click handler
    if (testButton) {
        testButton.onclick = function() {
            console.log('Test button clicked');
            if (mobileNav && overlay) {
                // Use direct style manipulation instead of classList
                mobileNav.style.left = "0";
                overlay.style.display = "block";
                document.body.style.overflow = "hidden";
                console.log('Opened mobile nav with test button');
            } else {
                console.error('Mobile nav or overlay not found');
            }
        };
    }
    
    // If the menuToggle exists, add a click handler to manually check what happens
    if (menuToggle) {
        console.log('Adding click handler to menu toggle');
        
        // Add a direct click handler that doesn't rely on event bubbling
        menuToggle.addEventListener('click', function(e) {
            console.log('Menu toggle click detected!');
            
            // Try to prevent any default behavior or propagation
            e.preventDefault();
            e.stopPropagation();
            
            // Try to manipulate the mobile nav directly
            if (mobileNav && overlay) {
                console.log('Opening mobile nav...');
                mobileNav.style.left = "0";
                overlay.style.display = "block";
                document.body.style.overflow = "hidden";
            } else {
                console.error('Cannot open mobile nav - elements not found');
            }
        }, true); // Use capture phase
    } else {
        console.error('Menu toggle not found!');
    }
}); 
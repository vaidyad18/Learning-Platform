document.addEventListener('DOMContentLoaded', function() {
    // Simple mobile menu implementation
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.overlay');
    const closeBtn = document.querySelector('.mobile-nav-close');
    const body = document.body;

    console.log("Menu elements found:", {
        menuToggle: !!menuToggle,
        mobileNav: !!mobileNav,
        overlay: !!overlay,
        closeBtn: !!closeBtn
    });

    // Toggle menu
    if (menuToggle) {
        menuToggle.onclick = function(e) {
            e.stopPropagation();
            console.log("Menu toggle clicked");
            mobileNav.style.left = "0";
            overlay.style.display = "block";
            body.style.overflow = "hidden";
        };
    }

    // Close menu
    if (closeBtn) {
        closeBtn.onclick = function() {
            console.log("Close button clicked");
            mobileNav.style.left = "-100%";
            overlay.style.display = "none";
            body.style.overflow = "";
        };
    }

    // Close when clicking overlay
    if (overlay) {
        overlay.onclick = function() {
            console.log("Overlay clicked");
            mobileNav.style.left = "-100%";
            overlay.style.display = "none";
            body.style.overflow = "";
        };
    }

    // Close when clicking links
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.onclick = function() {
            console.log("Mobile link clicked");
            mobileNav.style.left = "-100%";
            overlay.style.display = "none";
            body.style.overflow = "";
        };
    });
    
    // Testimonials functionality
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    if (testimonials.length > 1) {
        for (let i = 1; i < testimonials.length; i++) {
            testimonials[i].style.display = 'none';
        }
        
        setInterval(() => {
            testimonials[currentTestimonial].style.display = 'none';
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].style.display = 'block';
        }, 5000);
    }
    
    // Scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        font-size: 20px;
        z-index: 99;
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animation on scroll
    const animateElements = document.querySelectorAll('.feature-card, .course-card, .testimonial');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    checkScroll();
    
    window.addEventListener('scroll', checkScroll);

    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('success-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.error').forEach(error => {
                error.style.display = 'none';
            });
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            if (name === '') {
                document.getElementById('name-error').style.display = 'block';
                isValid = false;
            }
            
            if (email === '') {
                document.getElementById('email-error').textContent = 'Please enter your email.';
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            } else if (!isValidEmail(email)) {
                document.getElementById('email-error').textContent = 'Please enter a valid email address.';
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            }
            
            if (message === '') {
                document.getElementById('message-error').style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                successMessage.style.display = 'block';
                contactForm.reset();
                
                setTimeout(function() {
                    successMessage.style.display = 'none';
                }, 5000);
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
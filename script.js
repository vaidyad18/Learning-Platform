document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Setup
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Create mobile menu content with updated links
    mobileMenu.innerHTML = `
        <div class="mobile-menu-header">
            <div class="logo">
                <h1>LearnHub</h1>
            </div>
            <div class="close-menu">×</div>
        </div>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="courses.html">Courses</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="contact.html" class="active">Contact</a></li>
            </ul>
        </nav>
        <div class="mobile-auth">
            <a href="login.html" class="btn btn-primary">Login</a>
            <a href="register.html" class="btn">Sign Up</a>
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
    });
    
    // Close mobile menu
    const closeMenu = document.querySelector('.close-menu');
    closeMenu.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
    });
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    // Hide all testimonials except the first one
    if (testimonials.length > 1) {
        for (let i = 1; i < testimonials.length; i++) {
            testimonials[i].style.display = 'none';
        }
        
        // Auto slide testimonials
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
    
    // Show/hide scroll button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when button is clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animate elements on scroll
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
    
    // Set initial state for animation
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Check elements on load
    checkScroll();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkScroll);

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('success-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset errors
            document.querySelectorAll('.error').forEach(error => {
                error.style.display = 'none';
            });
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // Validate name
            if (name === '') {
                document.getElementById('name-error').style.display = 'block';
                isValid = false;
            }
            
            // Validate email
            if (email === '') {
                document.getElementById('email-error').textContent = 'Please enter your email.';
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            } else if (!isValidEmail(email)) {
                document.getElementById('email-error').textContent = 'Please enter a valid email address.';
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            }
            
            // Validate message
            if (message === '') {
                document.getElementById('message-error').style.display = 'block';
                isValid = false;
            }
            
            // If form is valid, show success message and reset form
            if (isValid) {
                successMessage.style.display = 'block';
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(function() {
                    successMessage.style.display = 'none';
                }, 5000);
            }
        });
    }
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
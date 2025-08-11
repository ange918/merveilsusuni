// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Hero Carousel Functionality
    function initHeroCarousel() {
        const carouselImages = document.querySelectorAll('.hero-carousel-image');
        let currentImageIndex = 0;
        const totalImages = carouselImages.length;
        
        function showImage(index) {
            // Hide all images
            carouselImages.forEach(img => {
                img.style.opacity = '0';
            });
            
            // Show current image
            carouselImages[index].style.opacity = '1';
        }
        
        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % totalImages;
            showImage(currentImageIndex);
        }
        
        // Start the carousel - change image every 5 seconds
        setInterval(nextImage, 5000);
    }
    
    // Initialize hero carousel
    initHeroCarousel();
    
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking on a nav link
    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-blue-400');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('text-blue-400');
            }
        });
    }
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }
        
        // Get submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Hide loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            // Show success message
            successMessage.classList.remove('hidden');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);
            
        }, 2000);
    });
    
    // Project card "En savoir plus" button functionality
    const projectButtons = document.querySelectorAll('.project-card .btn-secondary');
    
    projectButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const projectNames = ['Mediagrowth Agency', 'Susatt Agency', 'Africa Fashion Awards'];
            const projectName = projectNames[index];
            
            // Create modal or show more details
            showProjectDetails(projectName, index);
        });
    });
    
    // Function to show project details
    function showProjectDetails(projectName, index) {
        const projectDetails = [
            {
                name: 'Mediagrowth Agency',
                description: 'Mediagrowth Agency est une agence digitale innovante spécialisée dans la croissance des entreprises africaines. Nous offrons des solutions complètes de marketing digital, de stratégie de marque, et de développement web. Notre mission est d\'accompagner les entrepreneurs africains dans leur transformation digitale.',
                services: ['Marketing Digital', 'Stratégie de Marque', 'Développement Web', 'Réseaux Sociaux', 'Publicité en ligne'],
                website: '#'
            },
            {
                name: 'Susatt Agency',
                description: 'Susatt Agency est une agence créative dédiée au développement artistique et à la gestion de talents dans l\'industrie de la mode et du divertissement. Nous découvrons, formons et accompagnons les talents émergents vers l\'excellence professionnelle.',
                services: ['Gestion de Talents', 'Coaching Artistique', 'Production d\'Événements', 'Relations Médias', 'Développement de Carrière'],
                website: '#'
            },
            {
                name: 'Africa Fashion Awards',
                description: 'Africa Fashion Awards est un événement prestigieux qui célèbre l\'excellence et l\'innovation dans l\'industrie de la mode africaine. Cet événement annuel met en lumière les créateurs, mannequins et professionnels qui façonnent l\'avenir de la mode africaine.',
                services: ['Cérémonie de Remise de Prix', 'Défilés de Mode', 'Réseautage Professionnel', 'Exhibitions', 'Conférences'],
                website: '#'
            }
        ];
        
        const project = projectDetails[index];
        
        // Create modal HTML
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" id="project-modal">
                <div class="bg-slate-800 rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                    <div class="p-8">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-3xl font-bold text-blue-300">${project.name}</h3>
                            <button id="close-modal" class="text-gray-400 hover:text-white transition-colors">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <p class="text-gray-300 text-lg leading-relaxed mb-8">${project.description}</p>
                        
                        <div class="mb-8">
                            <h4 class="text-xl font-semibold mb-4 text-blue-300">Services & Domaines d'expertise</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                ${project.services.map(service => `
                                    <div class="flex items-center">
                                        <svg class="w-4 h-4 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>${service}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row gap-4">
                            <a href="#contact" 
                               class="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-center">
                                Collaborer avec nous
                            </a>
                            <button id="close-modal-btn" 
                                    class="btn-secondary bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-800 px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners for closing modal
        const modal = document.getElementById('project-modal');
        const closeBtn = document.getElementById('close-modal');
        const closeBtnBottom = document.getElementById('close-modal-btn');
        
        function closeModal() {
            modal.remove();
        }
        
        closeBtn.addEventListener('click', closeModal);
        closeBtnBottom.addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        // Handle "Collaborer avec nous" link
        const collaborateLink = modal.querySelector('a[href="#contact"]');
        collaborateLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
            document.getElementById('contact').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for scroll animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Initialize active nav on page load
    updateActiveNav();
    
    // Add scroll to top functionality
    let scrollTopBtn = null;
    
    function createScrollTopButton() {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
        `;
        scrollTopBtn.className = 'fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 invisible z-40';
        scrollTopBtn.setAttribute('aria-label', 'Retour en haut');
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(scrollTopBtn);
    }
    
    function toggleScrollTopButton() {
        if (!scrollTopBtn) {
            createScrollTopButton();
        }
        
        if (window.scrollY > 500) {
            scrollTopBtn.classList.remove('opacity-0', 'invisible');
            scrollTopBtn.classList.add('opacity-100', 'visible');
        } else {
            scrollTopBtn.classList.add('opacity-0', 'invisible');
            scrollTopBtn.classList.remove('opacity-100', 'visible');
        }
    }
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', toggleScrollTopButton);
    
    // Navbar background opacity on scroll
    const navbar = document.querySelector('nav');
    
    function updateNavbarBackground() {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-night-blue');
            navbar.classList.remove('bg-night-blue/90');
        } else {
            navbar.classList.add('bg-night-blue/90');
            navbar.classList.remove('bg-night-blue');
        }
    }
    
    window.addEventListener('scroll', updateNavbarBackground);
    
    // Initialize navbar background
    updateNavbarBackground();
    
    console.log('Portfolio de Merveille Susuni chargé avec succès !');
});

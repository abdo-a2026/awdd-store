// ========================================
// Global Variables
// ========================================
let currentProject = null;
let currentImageIndex = 0;

// ========================================
// DOM Elements
// ========================================
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const projectsContainer = document.getElementById('projectsContainer');
const modalOverlay = document.getElementById('modalOverlay');
const modalContainer = document.getElementById('modalContainer');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// ========================================
// Initialize App
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    loadProjects();
    initModal();
    initContactForm();
    initScrollButtons();
    initAnimations();
    handleHashNavigation();
    handleResponsive();
});

// ========================================
// Mobile Menu System
// ========================================
function initMobileMenu() {
    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            toggleMobileMenu();
        });
    }

    // Close sidebar button
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Close on overlay click
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Close menu when nav link is clicked on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', handleResponsive);
}

function toggleMobileMenu() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeMobileMenu() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function handleResponsive() {
    // Close mobile menu if window is resized to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

// ========================================
// Navigation System
// ========================================
function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            navigateToSection(targetSection);
            
            // Update URL hash
            window.location.hash = targetSection;
        });
    });

    // Handle browser back/forward
    window.addEventListener('hashchange', handleHashNavigation);
}

function navigateToSection(sectionId) {
    // Remove active class from all sections and links
    sections.forEach(section => section.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    // Add active class to target section and link
    const targetSection = document.getElementById(sectionId);
    const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollTop = 0;
    }
    
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Trigger animations for the new section
    animateSection(targetSection);
}

function handleHashNavigation() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        navigateToSection(hash);
    } else {
        navigateToSection('home');
    }
}

// ========================================
// Load Projects from products.js
// ========================================
function loadProjects() {
    if (typeof products === 'undefined' || !products.length) {
        projectsContainer.innerHTML = '<p style="text-align: center; color: var(--text-light);">لا توجد مشاريع متاحة حالياً</p>';
        return;
    }

    projectsContainer.innerHTML = '';
    
    products.forEach(product => {
        const projectCard = createProjectCard(product);
        projectsContainer.appendChild(projectCard);
    });

    // Add animation on scroll
    observeProjectCards();
}

function createProjectCard(product) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-id', product.id);

    const mainImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : 'public/placeholder.jpg';

    card.innerHTML = `
        <img src="${mainImage}" alt="${product.name}" class="project-image" loading="lazy">
        <div class="project-info">
            <h3 class="project-name">${product.name}</h3>
            <p class="project-type">
                <i class="fas fa-tag"></i>
                ${product.type}
            </p>
            <div class="project-actions">
                <button class="btn btn-primary btn-small view-details-btn">
                    <i class="fas fa-info-circle"></i>
                    التفاصيل
                </button>
                <a href="${product.liveDemo}" target="_blank" class="btn btn-secondary btn-small">
                    <i class="fas fa-external-link-alt"></i>
                    مشاهدة
                </a>
            </div>
        </div>
    `;

    // Add event listener for details button
    const detailsBtn = card.querySelector('.view-details-btn');
    detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(product);
    });

    // Add hover effect sound (optional)
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });

    return card;
}

// ========================================
// Scroll Buttons for Projects
// ========================================
function initScrollButtons() {
    if (scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            projectsContainer.scrollBy({
                left: 350,
                behavior: 'smooth'
            });
        });

        scrollRightBtn.addEventListener('click', () => {
            projectsContainer.scrollBy({
                left: -350,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// Modal System
// ========================================
function initModal() {
    // Close modal on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal on close button
    modalClose.addEventListener('click', closeModal);

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Gallery navigation
    document.querySelector('.gallery-prev').addEventListener('click', () => {
        navigateGallery(-1);
    });

    document.querySelector('.gallery-next').addEventListener('click', () => {
        navigateGallery(1);
    });
}

function openModal(product) {
    currentProject = product;
    currentImageIndex = 0;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Populate modal content
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalType').innerHTML = `<i class="fas fa-tag"></i> ${product.type}`;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalGoal').textContent = product.goal;

    // Technologies
    const techContainer = document.getElementById('modalTechnologies');
    techContainer.innerHTML = '';
    product.technologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'modal-tag';
        tag.textContent = tech;
        techContainer.appendChild(tag);
    });

    // Features
    const featuresContainer = document.getElementById('modalFeatures');
    featuresContainer.innerHTML = '';
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresContainer.appendChild(li);
    });

    // Live demo link
    const liveLink = document.getElementById('modalLiveLink');
    liveLink.href = product.liveDemo;

    // Request button
    const requestBtn = document.getElementById('modalRequestBtn');
    requestBtn.addEventListener('click', () => {
        closeModal();
        navigateToSection('contact');
        // Pre-fill contact form
        document.getElementById('projectType').value = getProjectTypeValue(product.type);
        document.getElementById('message').value = `أرغب في طلب موقع مشابه لـ "${product.name}"`;
    });

    // Load gallery
    loadGallery(product.images);

    // Show modal
    modalOverlay.classList.add('active');

    // Animate modal entrance
    setTimeout(() => {
        modalContainer.style.transform = 'scale(1)';
    }, 10);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    modalContainer.style.transform = 'scale(0.9)';
    document.body.style.overflow = 'auto';
    currentProject = null;
    currentImageIndex = 0;
}

function loadGallery(images) {
    if (!images || images.length === 0) {
        images = ['public/placeholder.jpg'];
    }

    // Load first image
    document.getElementById('modalImage').src = images[0];

    // Create dots
    const dotsContainer = document.getElementById('galleryDots');
    dotsContainer.innerHTML = '';

    if (images.length > 1) {
        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'gallery-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentImageIndex = index;
                updateGalleryImage();
            });
            dotsContainer.appendChild(dot);
        });
    }
}

function navigateGallery(direction) {
    if (!currentProject || !currentProject.images) return;

    const images = currentProject.images;
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    } else if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }

    updateGalleryImage();
}

function updateGalleryImage() {
    if (!currentProject || !currentProject.images) return;

    const images = currentProject.images;
    const modalImage = document.getElementById('modalImage');
    
    // Fade out
    modalImage.style.opacity = '0';
    
    setTimeout(() => {
        modalImage.src = images[currentImageIndex];
        modalImage.style.opacity = '1';
    }, 200);

    // Update dots
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentImageIndex);
    });
}

function getProjectTypeValue(typeName) {
    const typeMap = {
        'صفحة هبوط': 'landing',
        'متجر إلكتروني': 'ecommerce',
        'موقع أعمال': 'business',
        'موقع شخصي': 'portfolio',
        'موقع مطعم': 'restaurant'
    };
    return typeMap[typeName] || 'other';
}

// ========================================
// Contact Form
// ========================================
function initContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            projectType: document.getElementById('projectType').value,
            message: document.getElementById('message').value
        };

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            console.log('Form Data:', formData);
            
            // Show success message
            alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // You can replace this with actual email sending or API call
            // Example: sendToAPI(formData);
        }, 1500);
    });
}

// ========================================
// Animations
// ========================================
function initAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

function observeProjectCards() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

function animateSection(section) {
    if (!section) return;

    const animatableElements = section.querySelectorAll('.animate-fade-up');
    animatableElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'fadeUp 0.8s ease forwards';
        }, 10);
    });
}

// ========================================
// Smooth Scroll for Hero Buttons
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.slice(1);
            navigateToSection(targetId);
        }
    });
});

// ========================================
// Sidebar Hover Effect Enhancement
// ========================================
sidebar.addEventListener('mouseenter', () => {
    if (window.innerWidth > 768) {
        sidebar.style.width = 'var(--sidebar-expanded)';
    }
});

sidebar.addEventListener('mouseleave', () => {
    if (window.innerWidth > 768) {
        sidebar.style.width = 'var(--sidebar-width)';
    }
});

// ========================================
// Lazy Loading Images
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    // Alt + number to navigate sections
    if (e.altKey) {
        const sectionMap = {
            '1': 'home',
            '2': 'projects',
            '3': 'services',
            '4': 'about',
            '5': 'contact'
        };
        
        if (sectionMap[e.key]) {
            e.preventDefault();
            navigateToSection(sectionMap[e.key]);
        }
    }

    // Arrow keys for gallery navigation in modal
    if (modalOverlay.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            navigateGallery(1);
        } else if (e.key === 'ArrowRight') {
            navigateGallery(-1);
        }
    }
});

// ========================================
// Performance Optimization
// ========================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
window.addEventListener('scroll', debounce(() => {
    // Add any scroll-based functionality here
}, 100));

// ========================================
// Touch Events for Mobile
// ========================================
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// Swipe for projects scroll
projectsContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

projectsContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleProjectSwipe();
}, { passive: true });

function handleProjectSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);

    // Only trigger horizontal swipe if vertical movement is minimal
    if (diffY < 50 && Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) {
            // Swipe left - scroll right
            projectsContainer.scrollBy({ left: 350, behavior: 'smooth' });
        } else {
            // Swipe right - scroll left
            projectsContainer.scrollBy({ left: -350, behavior: 'smooth' });
        }
    }
}

// Swipe to open/close sidebar on mobile
let sidebarTouchStartX = 0;
let sidebarTouchEndX = 0;

document.addEventListener('touchstart', (e) => {
    sidebarTouchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    sidebarTouchEndX = e.changedTouches[0].screenX;
    handleSidebarSwipe();
}, { passive: true });

function handleSidebarSwipe() {
    if (window.innerWidth > 768) return;
    
    const swipeThreshold = 100;
    const diff = sidebarTouchEndX - sidebarTouchStartX;
    
    // Swipe from left edge to open sidebar
    if (sidebarTouchStartX < 50 && diff > swipeThreshold) {
        toggleMobileMenu();
    }
    
    // Swipe right to close sidebar when open
    if (sidebar.classList.contains('active') && diff > swipeThreshold) {
        closeMobileMenu();
    }
}

// ========================================
// Error Handling
// ========================================
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
});

// ========================================
// Console Welcome Message
// ========================================
console.log('%c🚀 AWDD Store Studio', 'font-size: 20px; font-weight: bold; color: #003531;');
console.log('%cWelcome to our portfolio store!', 'font-size: 14px; color: #00ADA3;');
console.log('%cBuilt with ❤️ using vanilla JavaScript', 'font-size: 12px; color: #6c757d;');

// ========================================
// Export functions for external use (if needed)
// ========================================
window.portfolioStore = {
    navigateToSection,
    openModal,
    closeModal,
    loadProjects,
    toggleMobileMenu,
    closeMobileMenu
};

// ========================================
// Optimize for Mobile Performance
// ========================================
// Disable hover effects on touch devices
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Prevent zoom on double tap for better UX
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Smooth scroll behavior for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
                
                // Smooth scroll to section
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        }
    });
});

// Add loading state for images
document.querySelectorAll('img').forEach(img => {
    // Skip logo images from lazy loading
    if (img.closest('.logo') || img.closest('.floating-logo')) {
        img.classList.add('loaded');
        return;
    }
    
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
    
    img.addEventListener('error', function() {
        console.warn('Image failed to load:', this.src);
        // Keep the fallback icon that's set in onerror attribute
        this.classList.add('error');
    });
});

// Optimize scrolling performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Add scroll-based functionality here if needed
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });
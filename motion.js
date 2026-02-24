// Skills array for search functionality
const skills = [
    'Python Programming', 'C Programming', 'Frontend Web Developer',
    'Graphics Designing', 'Intermediate Video Editor'
];

// Sections array
const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
];

let activeSection = 'home';
let isMobileMenuOpen = false;

// Scroll to section function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');

    if (isMobileMenuOpen) {
        mobileMenu.style.display = 'flex';
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        mobileMenu.style.display = 'none';
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

// Close mobile menu
function closeMobileMenu() {
    isMobileMenuOpen = false;
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');

    mobileMenu.style.display = 'none';
    menuIcon.style.display = 'block';
    closeIcon.style.display = 'none';
}

// Handle search
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase().trim();

    if (!query) return;

    // Search through sections
    const matchedSection = sections.find(
        (section) =>
            section.label.toLowerCase().includes(query) ||
            section.id.toLowerCase().includes(query)
    );

    if (matchedSection) {
        scrollToSection(matchedSection.id);
        searchInput.value = '';
        return;
    }

    // Search through skills
    const matchedSkill = skills.find((skill) =>
        skill.toLowerCase().includes(query)
    );

    if (matchedSkill) {
        scrollToSection('skills');
        searchInput.value = '';
    }
}

// Intersection Observer for fade-in animations
function setupIntersectionObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.2 }
    );

    sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
    });
}

// Update active section on scroll
function updateActiveSection() {
    const scrollPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
            activeSection = sections[i].id;
            updateActiveNavLink();
            break;
        }
    }
}

// Update active navigation link
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
        const sectionId = link.getAttribute('data-section');
        if (sectionId === activeSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    setupIntersectionObserver();
    updateActiveNavLink();

    // Make home section visible immediately
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.classList.add('visible');
    }
});

// Handle scroll events
window.addEventListener('scroll', updateActiveSection);

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

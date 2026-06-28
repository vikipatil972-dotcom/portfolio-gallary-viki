/* ==========================================
   INITIAL DATA & STORAGE SETUP
   ========================================== */
const INITIAL_PHOTOS = [
    {
        id: "photo-1",
        src: "photo1.jpg",
        title: "Campus Musings",
        desc: "Reflecting on technology and design under the campus palms, preparing for a future in software engineering.",
        custom: false
    },
    {
        id: "photo-2",
        src: "photo2.jpg",
        title: "Leadership & Calm",
        desc: "Pausing for a moment in the college courtyard, embracing professional focus, discipline, and personal growth.",
        custom: false
    },
    {
        id: "photo-3",
        src: "photo3.jpg",
        title: "Focused Vision",
        desc: "A portrait capturing determination and a modern outlook, ready to explore web development and creative tech.",
        custom: false
    },
    {
        id: "photo-4",
        src: "photo4.jpg",
        title: "Professional Elegance",
        desc: "Stepping forward with confidence in formal attire, embodying the values of innovation and self-growth.",
        custom: false
    },
    {
        id: "photo-5",
        src: "photo5.jpg",
        title: "Strategic Stride",
        desc: "Outdoors in a formal suit, aiming for structural discipline, engineering excellence, and digital creativity.",
        custom: false
    }
];

// Initialize LocalStorage for Photos
let photos = [];
function initPhotosStorage() {
    const stored = localStorage.getItem('vivek_portfolio_photos');
    if (stored) {
        try {
            photos = JSON.parse(stored);
            // Auto-migration: if any photo uses the old assets/images path, clean it up
            let migrated = false;
            photos = photos.map(photo => {
                if (photo.src && photo.src.startsWith('assets/images/')) {
                    photo.src = photo.src.replace('assets/images/', '');
                    migrated = true;
                }
                return photo;
            });
            if (migrated) {
                savePhotosToStorage();
            }
        } catch (e) {
            console.error("Failed to parse stored photos, resetting to defaults", e);
            photos = [...INITIAL_PHOTOS];
            savePhotosToStorage();
        }
    } else {
        photos = [...INITIAL_PHOTOS];
        savePhotosToStorage();
    }
}

function savePhotosToStorage() {
    localStorage.setItem('vivek_portfolio_photos', JSON.stringify(photos));
}

/* ==========================================
   ADMIN AUTHENTICATION & ACCESS CONTROL
   ========================================== */
const ADMIN_PASSWORD = "vivek2005";

function isAuthenticated() {
    return sessionStorage.getItem('vivek_auth') === 'true';
}

function checkAdminAuth(successCallback) {
    if (isAuthenticated()) {
        successCallback();
        return;
    }
    
    const input = prompt("Enter Admin Password:");
    if (input === null) {
        return; // User cancelled prompt
    }
    
    if (input === ADMIN_PASSWORD) {
        sessionStorage.setItem('vivek_auth', 'true');
        showToast("Authenticated successfully!", "success");
        updateNavAdminButton();
        successCallback();
    } else {
        showToast("Incorrect password. Access denied.", "danger");
    }
}

/* ==========================================
   DARK MODE / LIGHT MODE SYSTEM
   ========================================== */
const themeToggleBtn = document.getElementById('themeToggleBtn');

function initTheme() {
    const savedTheme = localStorage.getItem('vivek_portfolio_theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        updateThemeToggleIcon('light');
    } else {
        document.body.classList.remove('light-theme');
        updateThemeToggleIcon('dark');
    }
}

function toggleTheme() {
    if (document.body.classList.contains('light-theme')) {
        document.body.classList.remove('light-theme');
        localStorage.setItem('vivek_portfolio_theme', 'dark');
        updateThemeToggleIcon('dark');
        showToast("Switched to Dark Mode.", "success");
    } else {
        document.body.classList.add('light-theme');
        localStorage.setItem('vivek_portfolio_theme', 'light');
        updateThemeToggleIcon('light');
        showToast("Switched to Light Mode.", "success");
    }
}

function updateThemeToggleIcon(theme) {
    if (theme === 'light') {
        themeToggleBtn.innerHTML = `
            <svg class="icon svg-sun" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        `;
    } else {
        themeToggleBtn.innerHTML = `
            <svg class="icon svg-moon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        `;
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

/* ==========================================
   SPA NAVIGATION (ROUTING)
   ========================================== */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinksContainer = document.getElementById('navLinks');

function navigateToSection(sectionId) {
    sections.forEach(sec => {
        if (sec.id === sectionId) {
            sec.classList.add('active-section');
            setTimeout(() => {
                sec.classList.add('show-section');
            }, 30);
        } else {
            sec.classList.remove('show-section');
            sec.classList.remove('active-section');
        }
    });

    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleRouting() {
    const hash = window.location.hash.substring(1) || 'home';
    const validSections = ['home', 'gallery', 'about', 'contact'];
    
    if (validSections.includes(hash)) {
        navigateToSection(hash);
    } else {
        window.location.hash = 'home';
    }
}

// Scroll header logic
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        const header = document.querySelector('.navbar');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scroll-scrolled');
            } else {
                header.classList.remove('scroll-scrolled');
            }
        }
    });
}, { passive: true });

// Mobile menu toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active-menu');
        const svgMenu = mobileMenuBtn.querySelector('svg');
        if (svgMenu) {
            if (navLinksContainer.classList.contains('active-menu')) {
                svgMenu.innerHTML = `<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>`;
            } else {
                svgMenu.innerHTML = `<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>`;
            }
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetSection = link.getAttribute('data-section');
        window.location.hash = targetSection;
        
        if (navLinksContainer) {
            navLinksContainer.classList.remove('active-menu');
        }
        if (mobileMenuBtn) {
            const svgMenu = mobileMenuBtn.querySelector('svg');
            if (svgMenu) {
                svgMenu.innerHTML = `<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>`;
            }
        }
    });
});

/* ==========================================
   TOAST NOTIFICATION ENGINE
   ========================================== */
const toastContainer = document.getElementById('toastContainer');

function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconSvg = type === 'success' 
        ? `<svg class="icon toast-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--success); flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
        : `<svg class="icon toast-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--danger); flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        
    toast.innerHTML = `
        ${iconSvg}
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show-toast');
    }, 30);
    
    setTimeout(() => {
        toast.classList.remove('show-toast');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/* ==========================================
   PHOTO RENDERING & GALLERY LOGIC
   ========================================== */
const galleryGrid = document.getElementById('galleryGrid');
const gallerySearch = document.getElementById('gallerySearch');
const photoCountSpan = document.getElementById('photoCount');

function renderGallery(filterText = '') {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    const query = filterText.toLowerCase().trim();
    
    const filteredPhotos = photos.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.desc.toLowerCase().includes(query)
    );
    
    if (photoCountSpan) {
        photoCountSpan.textContent = filteredPhotos.length;
    }
    
    if (filteredPhotos.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
                <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; opacity: 0.1;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <p>No photos found matching your search.</p>
            </div>
        `;
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    filteredPhotos.forEach((photo, index) => {
        const card = document.createElement('div');
        card.className = 'photo-card card-animation-enter';
        card.style.animationDelay = `${Math.min(index * 25, 200)}ms`;
        card.setAttribute('data-id', photo.id);
        
        card.innerHTML = `
            <div class="photo-card-img-wrap" onclick="openLightbox('${photo.id}')">
                <img src="${photo.src}" alt="${photo.title}" class="photo-card-img" loading="lazy">
                <div class="photo-card-overlay"></div>
            </div>
            <div class="card-actions">
                <button class="card-action-btn edit-btn" onclick="editPhoto('${photo.id}', event)" title="Edit Description">
                    <svg class="icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="card-action-btn delete-btn" onclick="deletePhoto('${photo.id}', event)" title="Delete Photo">
                    <svg class="icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
            <div class="photo-card-info">
                <h4 class="photo-card-title">${photo.title}</h4>
                <p class="photo-card-desc">
                    ${photo.desc}
                </p>
            </div>
        `;
        
        fragment.appendChild(card);
    });
    
    galleryGrid.appendChild(fragment);
}

// Search keyup
if (gallerySearch) {
    let searchTimeout;
    gallerySearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            renderGallery(e.target.value);
        }, 150);
    });
}

// Delete Photo Action (Gated by Auth & Confirmation)
function deletePhoto(id, event) {
    if (event) event.stopPropagation(); // Stop lightbox zoom
    
    const index = photos.findIndex(p => p.id === id);
    if (index === -1) return;
    
    checkAdminAuth(() => {
        const confirmed = confirm("Are you sure you want to delete this photo?");
        if (!confirmed) return;
        
        const cardEl = document.querySelector(`.photo-card[data-id="${id}"]`);
        if (cardEl) {
            cardEl.classList.remove('card-animation-enter');
            cardEl.classList.add('card-animation-exit');
            
            setTimeout(() => {
                photos.splice(index, 1);
                savePhotosToStorage();
                renderGallery(gallerySearch ? gallerySearch.value : '');
                showToast("Photo deleted successfully.", "success");
            }, 250);
        } else {
            photos.splice(index, 1);
            savePhotosToStorage();
            renderGallery(gallerySearch ? gallerySearch.value : '');
            showToast("Photo deleted successfully.", "success");
        }
    });
}

// Edit Photo Description (Gated by Auth)
function editPhoto(id, event) {
    if (event) event.stopPropagation(); // Stop lightbox zoom
    
    const photo = photos.find(p => p.id === id);
    if (!photo) return;
    
    checkAdminAuth(() => {
        const newDesc = prompt("Edit description:", photo.desc);
        if (newDesc === null) return; // Cancelled
        
        const trimmed = newDesc.trim();
        if (trimmed === "") {
            showToast("Description cannot be empty.", "danger");
            return;
        }
        
        photo.desc = trimmed;
        savePhotosToStorage();
        renderGallery(gallerySearch ? gallerySearch.value : '');
        showToast("Description updated.", "success");
    });
}

/* ==========================================
   IMAGE COMPRESSION & UPLOAD LOGIC
   ========================================== */
const addPhotoModal = document.getElementById('addPhotoModal');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const closeAddModalBtn = document.querySelector('#addPhotoModal .modal-close');
const cancelAddBtn = document.getElementById('cancelAddBtn');
const addPhotoForm = document.getElementById('addPhotoForm');
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadPreview = document.getElementById('uploadPreview');

let uploadedImageBase64 = null;

// Add Photo triggers checkAdminAuth
if (openAddModalBtn) {
    openAddModalBtn.addEventListener('click', () => {
        checkAdminAuth(() => {
            resetAddPhotoForm();
            if (addPhotoModal) {
                addPhotoModal.classList.add('active-modal');
            }
        });
    });
}

function closeAddModal() {
    if (addPhotoModal) {
        addPhotoModal.classList.remove('active-modal');
    }
}

if (closeAddModalBtn) {
    closeAddModalBtn.addEventListener('click', closeAddModal);
}
if (cancelAddBtn) {
    cancelAddBtn.addEventListener('click', closeAddModal);
}

if (addPhotoModal) {
    addPhotoModal.addEventListener('click', (e) => {
        if (e.target === addPhotoModal) closeAddModal();
    });
}

if (uploadZone) {
    uploadZone.addEventListener('click', () => {
        if (fileInput) fileInput.click();
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--saffron-primary)';
        uploadZone.style.background = 'rgba(224, 83, 0, 0.03)';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = 'rgba(191, 160, 67, 0.2)';
        uploadZone.style.background = 'var(--bg-surface-elevated)';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'rgba(191, 160, 67, 0.2)';
        uploadZone.style.background = 'var(--bg-surface-elevated)';
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageFile(e.dataTransfer.files[0]);
        }
    });
}

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
        }
    });
}

// Canvas image compression (up to 900px, JPEG 0.72)
function handleImageFile(file) {
    if (!file.type.match('image.*')) {
        showToast("Invalid format. Please upload an image.", "danger");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            
            uploadedImageBase64 = canvas.toDataURL('image/jpeg', 0.92);
            if (uploadPreview) {
                uploadPreview.src = uploadedImageBase64;
                uploadPreview.style.display = 'block';
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function resetAddPhotoForm() {
    if (addPhotoForm) addPhotoForm.reset();
    uploadedImageBase64 = null;
    if (uploadPreview) {
        uploadPreview.src = '';
        uploadPreview.style.display = 'none';
    }
}

if (addPhotoForm) {
    addPhotoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!isAuthenticated()) {
            showToast("Session expired. Please authenticate again.", "danger");
            return;
        }
        
        if (!uploadedImageBase64) {
            showToast("Please select or drop an image.", "danger");
            return;
        }
        
        const title = document.getElementById('photoTitle').value.trim();
        const desc = document.getElementById('photoDesc').value.trim();
        
        const newPhoto = {
            id: `photo-${Date.now()}`,
            src: uploadedImageBase64,
            title: title,
            desc: desc,
            custom: true
        };
        
        photos.unshift(newPhoto);
        savePhotosToStorage();
        renderGallery(gallerySearch ? gallerySearch.value : '');
        
        closeAddModal();
        showToast("Photo added successfully!", "success");
        
        window.location.hash = 'gallery';
    });
}

/* ==========================================
   LIGHTBOX / FULLSCREEN VIEWER LOGIC
   ========================================== */
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentLightboxIndex = -1;

function openLightbox(id) {
    currentLightboxIndex = photos.findIndex(p => p.id === id);
    if (currentLightboxIndex === -1) return;
    
    updateLightboxContent();
    if (lightboxModal) {
        lightboxModal.classList.add('active-modal');
    }
    
    document.addEventListener('keydown', handleLightboxKeys);
}

function closeLightbox() {
    if (lightboxModal) {
        lightboxModal.classList.remove('active-modal');
    }
    if (lightboxImg) {
        lightboxImg.classList.remove('show-img');
    }
    document.removeEventListener('keydown', handleLightboxKeys);
}

function updateLightboxContent() {
    const photo = photos[currentLightboxIndex];
    if (!photo) return;
    
    if (lightboxImg) {
        lightboxImg.classList.remove('show-img');
    }
    
    setTimeout(() => {
        if (lightboxImg) {
            lightboxImg.src = photo.src;
            lightboxImg.onload = () => {
                lightboxImg.classList.add('show-img');
            };
        }
        if (lightboxTitle) lightboxTitle.textContent = photo.title;
        if (lightboxDesc) lightboxDesc.textContent = photo.desc;
    }, 120);
}

function showNextPhoto() {
    if (photos.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % photos.length;
    updateLightboxContent();
}

function showPrevPhoto() {
    if (photos.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + photos.length) % photos.length;
    updateLightboxContent();
}

function handleLightboxKeys(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
}

if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
if (lightboxNext) lightboxNext.addEventListener('click', showNextPhoto);
if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevPhoto);

if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-wrap') || e.target.classList.contains('lightbox-img-wrap')) {
            closeLightbox();
        }
    });
}

/* ==========================================
   CONTACT FORM INTEGRATION
   ========================================== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const message = document.getElementById('formMessage').value.trim();
        
        if (name && email && message) {
            showToast(`Thank you, ${name}! Message sent.`, "success");
            contactForm.reset();
        } else {
            showToast("Please fill out all fields.", "danger");
        }
    });
}

/* ==========================================
   ADMIN PORTAL NAV HEADER LINK
   ========================================== */
const navAdminBtn = document.getElementById('navAdminBtn');

function updateNavAdminButton() {
    if (!navAdminBtn) return;
    if (isAuthenticated()) {
        navAdminBtn.innerHTML = `
            <svg class="icon svg-unlock" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
            <span>Admin Logout</span>
        `;
        navAdminBtn.title = "Click to Log Out";
    } else {
        navAdminBtn.innerHTML = `
            <svg class="icon svg-lock" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>Admin Login</span>
        `;
        navAdminBtn.title = "Click to Log In";
    }
}

if (navAdminBtn) {
    navAdminBtn.addEventListener('click', () => {
        if (isAuthenticated()) {
            sessionStorage.removeItem('vivek_auth');
            showToast("Logged out successfully.", "success");
            updateNavAdminButton();
            renderGallery();
        } else {
            checkAdminAuth(() => {
                updateNavAdminButton();
                renderGallery();
            });
        }
    });
}

/* ==========================================
   INITIALIZATION
   ========================================== */
window.addEventListener('DOMContentLoaded', () => {
    initPhotosStorage();
    initTheme();
    handleRouting();
    renderGallery();
    updateNavAdminButton();
    initBubbleCanvas();
});

window.addEventListener('hashchange', handleRouting);

/* ==========================================
   INTERACTIVE CANVAS BUBBLE BACKGROUND
   ========================================== */
function initBubbleCanvas() {
    const canvas = document.getElementById('bubble-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    // Resize handler
    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });
    
    // Mouse coordinates
    const mouse = {
        x: null,
        y: null,
        radius: 120, // Interaction radius
        active: false
    };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
        
        // Spawn small cursor trails (bubbles) occasionally
        if (Math.random() < 0.25) {
            trailParticles.push(new TrailParticle(mouse.x, mouse.y));
        }
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
        mouse.active = false;
    });
    
    const bubbles = [];
    const trailParticles = [];
    
    // Palette matching saffron, gold, and purple with transparency
    const colors = [
        'rgba(224, 83, 0, ',   // Saffron
        'rgba(191, 160, 67, ',  // Gold
        'rgba(157, 78, 221, ',  // Neon Purple
        'rgba(0, 210, 255, '   // Neon Blue/Cyan
    ];
    
    class Bubble {
        constructor() {
            this.reset();
            // Start at random Y so they don't all rise from bottom initially
            this.y = Math.random() * height;
        }
        
        reset() {
            this.radius = Math.random() * 5 + 2; // Radius between 2px and 7px
            this.x = Math.random() * width;
            this.y = height + this.radius + Math.random() * 100;
            this.baseSpeedY = -(Math.random() * 0.5 + 0.2); // Slowly floating up
            this.speedY = this.baseSpeedY;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.colorOpacity = Math.random() * 0.15 + 0.1; // Opacity 0.1 to 0.25
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
            
            // For repelling movement
            this.vx = 0;
            this.vy = 0;
            this.friction = 0.95;
        }
        
        update() {
            // Apply repulsion force if mouse is active and close
            if (mouse.active && mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    // Force vector pointing away from mouse
                    const forceX = (dx / distance) * force * 1.5;
                    const forceY = (dy / distance) * force * 1.5;
                    
                    this.vx += forceX;
                    this.vy += forceY;
                }
            }
            
            // Apply velocity from force
            this.x += this.speedX + this.vx;
            this.y += this.speedY + this.vy;
            
            // Friction/Decay on force velocity
            this.vx *= this.friction;
            this.vy *= this.friction;
            
            // Wrap X coordinates
            if (this.x < -this.radius) this.x = width + this.radius;
            if (this.x > width + this.radius) this.x = -this.radius;
            
            // Reset if goes off top
            if (this.y < -this.radius) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.colorBase + this.colorOpacity + ')';
            ctx.fill();
        }
    }
    
    class TrailParticle {
        constructor(x, y) {
            this.x = x + (Math.random() * 10 - 5);
            this.y = y + (Math.random() * 10 - 5);
            this.radius = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.speedY = Math.random() * 0.8 - 0.4;
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = 0.5;
            this.decay = Math.random() * 0.02 + 0.015;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.decay;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.colorBase + this.opacity + ')';
            ctx.fill();
        }
    }
    
    // Populate bubbles
    const bubbleCount = Math.min(65, Math.floor((width * height) / 18000));
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new Bubble());
    }
    
    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update & Draw Bubbles
        for (let i = 0; i < bubbles.length; i++) {
            bubbles[i].update();
            bubbles[i].draw();
        }
        
        // Update & Draw Trail Particles
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            trailParticles[i].update();
            if (trailParticles[i].opacity <= 0) {
                trailParticles.splice(i, 1);
            } else {
                trailParticles[i].draw();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

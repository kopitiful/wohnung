document.addEventListener('DOMContentLoaded', function() {
    // Elemente auswählen
    const gallery = document.querySelector('.gallery');
    const images = document.querySelectorAll('.gallery img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.dots-container');
    
    let currentIndex = 0;
    const imageCount = images.length;
    let autoplayInterval;

    // Navigation-Punkte erstellen
    function createDots() {
        for (let i = 0; i < imageCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToImage(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Zum bestimmten Bild springen
    function goToImage(index) {
        // Index begrenzen
        if (index >= imageCount) index = 0;
        if (index < 0) index = imageCount - 1;
        
        // Animation
        gallery.style.transform = `translateX(-${index * 100}%)`;
        
        // Aktiven Punkt aktualisieren
        document.querySelectorAll('.dot').forEach(dot => {
            dot.classList.remove('active');
        });
        document.querySelectorAll('.dot')[index].classList.add('active');
        
        currentIndex = index;
        
        // Autoplay zurücksetzen
        resetAutoplay();
    }

    // Autoplay starten
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToImage(currentIndex + 1);
        }, 5000); // Wechsel alle 5 Sekunden
    }

    // Autoplay zurücksetzen
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Touch-Events für Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoplayInterval); // Pausiere Autoplay während Interaktion
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay(); // Starte Autoplay wieder
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50; // Mindest-Swipe-Distanz
        if (touchEndX < touchStartX - threshold) {
            goToImage(currentIndex + 1); // Swipe nach links
        } else if (touchEndX > touchStartX + threshold) {
            goToImage(currentIndex - 1); // Swipe nach rechts
        }
    }

    // Event Listener
    prevBtn.addEventListener('click', () => {
        goToImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToImage(currentIndex + 1);
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToImage(currentIndex + 1);
        }
    });

    // Initialisierung
    createDots();
    startAutoplay();

    // Pause bei Hover (Desktop)
    gallery.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    gallery.addEventListener('mouseleave', () => {
        startAutoplay();
    });
});

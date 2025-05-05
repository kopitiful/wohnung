document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    const images = document.querySelectorAll('.gallery img');
    const dotsContainer = document.querySelector('.dots-container');
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Dots erstellen
    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToImage(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Navigation
    document.querySelector('.prev').addEventListener('click', () => {
        goToImage(currentIndex - 1);
    });
    
    document.querySelector('.next').addEventListener('click', () => {
        goToImage(currentIndex + 1);
    });
    
    // Touch-Events für Mobile
    gallery.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    gallery.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if(touchEndX < touchStartX - 50) {
            goToImage(currentIndex + 1); // Swipe left
        }
        if(touchEndX > touchStartX + 50) {
            goToImage(currentIndex - 1); // Swipe right
        }
    }
    
    function goToImage(index) {
        // Wrap around
        if(index >= images.length) index = 0;
        if(index < 0) index = images.length - 1;
        
        // Aktuelles Bild ausblenden
        images[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        
        // Neues Bild anzeigen
        currentIndex = index;
        images[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }
    
    // Automatische Rotation
    setInterval(() => {
        goToImage(currentIndex + 1);
    }, 5000);
});

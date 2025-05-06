document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    const images = document.querySelectorAll('.gallery img');
    const dotsContainer = document.querySelector('.dots-container');
    let currentIndex = 0;
    let autoplay;

    // Navigationspunkte erstellen
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
        resetAutoplay();
    });

    document.querySelector('.next').addEventListener('click', () => {
        goToImage(currentIndex + 1);
        resetAutoplay();
    });

    // Bildwechsel-Funktion
    function goToImage(index) {
        if(index >= images.length) index = 0;
        if(index < 0) index = images.length - 1;
        
        gallery.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    }

    // Autoplay
    function startAutoplay() {
        autoplay = setInterval(() => {
            goToImage(currentIndex + 1);
        }, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplay);
        startAutoplay();
    }

    // Touch-Support
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoplay);
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if(touchEndX < touchStartX - 50) goToImage(currentIndex + 1);
        if(touchEndX > touchStartX + 50) goToImage(currentIndex - 1);
        startAutoplay();
    }, { passive: true });

    // Start
    startAutoplay();
});

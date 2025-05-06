document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    const images = document.querySelectorAll('.gallery img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;

    // Bildgrößen anpassen
    function resizeImages() {
        const containerWidth = document.querySelector('.gallery-container').offsetWidth;
        images.forEach(img => {
            img.style.width = containerWidth + 'px';
        });
    }

    // Zum Bild navigieren
    function goToImage(index) {
        index = (index + images.length) % images.length;
        gallery.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
    }

    // Initialisierung
    window.addEventListener('load', resizeImages);
    window.addEventListener('resize', resizeImages);

    // Navigation
    prevBtn.addEventListener('click', () => goToImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToImage(currentIndex + 1));

    // Automatische Rotation
    setInterval(() => goToImage(currentIndex + 1), 5000);
});

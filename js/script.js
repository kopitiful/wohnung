document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    const images = document.querySelectorAll('.gallery img');
    const dotsContainer = document.querySelector('.dots-container');
    let currentIndex = 0;
    
    // Erstelle Navigationspunkte
    images.forEach((_, index) => {
        const dot = document.createElement('span');
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
    
    // Bildwechsel-Funktion
    function goToImage(index) {
        if(index >= images.length) index = 0;
        if(index < 0) index = images.length - 1;
        
        gallery.style.transform = `translateX(-${index * 100}%)`;
        dots[currentIndex].classList.remove('active');
        currentIndex = index;
        dots[currentIndex].classList.add('active');
    }
    
    // Automatische Rotation
    setInterval(() => {
        goToImage(currentIndex + 1);
    }, 5000);
});

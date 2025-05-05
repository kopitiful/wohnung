document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.gallery img');
    const dotsContainer = document.querySelector('.dots-container');
    let currentIndex = 0;
    
    // Create dots
    images.forEach((img, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if(index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showImage(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function showImage(index) {
        images[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        
        currentIndex = (index + images.length) % images.length;
        
        images[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }
    
    document.querySelector('.prev').addEventListener('click', () => {
        showImage(currentIndex - 1);
    });
    
    document.querySelector('.next').addEventListener('click', () => {
        showImage(currentIndex + 1);
    });
    
    // Auto-rotate every 5 seconds
    setInterval(() => {
        showImage(currentIndex + 1);
    }, 5000);
});
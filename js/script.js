
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
// Formular-Handling
document.getElementById('inquiryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const recipient = formData.get('recipient');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Hier würde normalerweise der Versand erfolgen
    console.log('Anfrage würde gesendet an:', recipient);
    console.log('Von:', email);
    console.log('Nachricht:', message);
    
    alert('Vielen Dank! Ihre Anfrage wurde übermittelt.');
    this.reset();
});

// Formular-Handling für Formspree
const form = document.getElementById('inquiryForm');
const statusElement = document.getElementById('form-status');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Submit-Button deaktivieren
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet...';
    
    // Formular versenden
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            statusElement.textContent = 'Vielen Dank! Ihre Anfrage wurde versendet.';
            statusElement.className = 'status-message success';
            form.reset();
        } else {
            throw new Error('Fehler beim Senden');
        }
    })
    .catch(error => {
        statusElement.textContent = 'Fehler! Bitte versuchen Sie es später erneut.';
        statusElement.className = 'status-message error';
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Anfrage versenden';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inquiryForm');
    const statusElement = document.createElement('div');
    statusElement.className = 'form-status';
    form.parentNode.insertBefore(statusElement, form.nextSibling);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Button-Status ändern
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet...';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusElement.textContent = 'Vielen Dank! Ihre Anfrage wurde versendet.';
                statusElement.className = 'form-status success';
                form.reset();
            } else {
                throw new Error('Serverfehler');
            }
        } catch (error) {
            statusElement.textContent = 'Fehler beim Senden. Bitte versuchen Sie es später.';
            statusElement.className = 'form-status error';
            console.error('Formularfehler:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Anfrage versenden';
        }
    });
});

//Kalender

// In script.js
document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni",
                       "Juli", "August", "September", "Oktober", "November", "Dezember"];

    function renderCalendar() {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        document.getElementById('current-month').textContent = 
            `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        let daysHtml = '';
        let dayCounter = 1;

        // Leere Tage am Anfang
        for (let i = 0; i < firstDay.getDay(); i++) {
            daysHtml += '<div></div>';
        }

        // Tage des Monats
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${i}`;
            const isBooked = checkIfDateIsBooked(dateStr); // Ihre Buchungslogik
            
            daysHtml += `
                <div class="${isBooked ? 'day-booked' : 'day-available'}" 
                     data-date="${dateStr}">
                    ${i}
                </div>
            `;
        }

        document.getElementById('calendar-days').innerHTML = daysHtml;
    }

    // Beispiel-Funktion (ersetzen Sie durch echte Logik)
    function checkIfDateIsBooked(dateStr) {
        // Hier Ihre Buchungsprüfung einfügen
        const bookedDates = ['2023-8-15', '2023-8-16']; // Beispiel
        return bookedDates.includes(dateStr);
    }

    // Navigation
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initialer Aufruf
    renderCalendar();
});

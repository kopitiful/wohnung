// Nach dem Deployen des Workers hier die echte URL eintragen (siehe worker/README.md)
const WORKER_URL = "https://REPLACE_WITH_YOUR_WORKER.workers.dev";

document.addEventListener('DOMContentLoaded', async function () {
    const priceEl = document.getElementById('dynamic-price');
    const calendarDaysEl = document.getElementById('calendar-days');
    const monthLabelEl = document.getElementById('current-month');
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');

    if (!calendarDaysEl) return;

    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"];

    let availability = { defaultPrice: null, extraGuestPrice: null, ranges: [] };
    let currentDate = new Date();
    currentDate.setDate(1);

    function parseDate(str) {
        const [y, m, d] = str.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    function priceForDate(date) {
        for (const r of availability.ranges) {
            const start = parseDate(r.start);
            const end = parseDate(r.end);
            if (date >= start && date <= end) {
                return { status: r.status, price: typeof r.price === 'number' ? r.price : availability.defaultPrice };
            }
        }
        return { status: 'available', price: availability.defaultPrice };
    }

    function renderPrice() {
        if (!priceEl) return;
        if (availability.defaultPrice == null) {
            priceEl.textContent = 'Preis auf Anfrage – bitte Kontaktformular nutzen.';
            return;
        }
        let text = `ab ${availability.defaultPrice}€ pro Nacht`;
        if (availability.extraGuestPrice != null) {
            text += ` (ab 5 Gästen +${availability.extraGuestPrice}€ pro weiterem Gast)`;
        }
        priceEl.textContent = text;
    }

    function renderCalendar() {
        monthLabelEl.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startOffset = (firstDay.getDay() + 6) % 7; // Montag = 0

        let html = '';
        for (let i = 0; i < startOffset; i++) {
            html += '<div></div>';
        }
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
            const info = priceForDate(date);
            const cls = info.status === 'booked' ? 'day-booked' : 'day-available';
            const title = info.status === 'booked'
                ? 'Gebucht'
                : (info.price != null ? `Verfügbar – ${info.price}€/Nacht` : 'Verfügbar');
            html += `<div class="${cls}" title="${title}">${d}</div>`;
        }
        calendarDaysEl.innerHTML = html;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    try {
        const res = await fetch(`${WORKER_URL}/api/availability`);
        availability = await res.json();
    } catch (e) {
        if (priceEl) priceEl.textContent = 'Preis auf Anfrage – bitte Kontaktformular nutzen.';
    }

    renderPrice();
    renderCalendar();
});

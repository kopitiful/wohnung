document.addEventListener('DOMContentLoaded', function() {
    const Calendar = FullCalendar.Calendar;
    const calendarEl = document.getElementById('calendar');

    const calendar = new Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'de',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: [
            // Beispiel-Daten (ersetzten Sie durch echte Buchungen)
            {
                title: 'Gebucht',
                start: '2023-08-15',
                end: '2023-08-20',
                className: 'fc-event-booked'
            },
            {
                title: 'Verfügbar',
                start: '2023-08-21',
                end: '2023-08-25',
                className: 'fc-event-available'
            }
        ],
        dateClick: function(info) {
            alert('Ausgewähltes Datum: ' + info.dateStr);
        }
    });

    calendar.render();
});


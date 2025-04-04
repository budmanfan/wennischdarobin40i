document.addEventListener('DOMContentLoaded', function () {
    const targetDate = new Date('April 2, 2034 00:00:00 GMT+0200');
    const countdownElement = document.getElementById('countdown');
    const funFactElement = document.getElementById('fun-fact');
    const robinPhoto = document.getElementById('robin-photo');
    const robinCaption = document.getElementById('robin-caption');

    function updateCountdown() {
        const now = new Date();
        const timeDifference = targetDate - now;

        if (timeDifference <= 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = 'Das Ereignis hat stattgefunden!';
            funFactElement.textContent = '';
            robinPhoto.style.display = 'none';
            return;
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        countdownElement.textContent = `${days} Tage ${hours} h ${minutes} min ${seconds} s`;

        fetchFunFact(days);
        //updateRobinImage(); // now with it's own interval
    }

    function fetchFunFact(dayIndex) {
        fetch('data/funFacts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(funFacts => {
                const funFact = funFacts[dayIndex.toString()];
                funFactElement.textContent = funFact ? funFact : 'Kein Fun Fact für diesen Tag verfügbar.';
            })
            .catch(error => {
                console.error('Fehler beim Laden des Fun Facts:', error);
                funFactElement.textContent = 'Fehler beim Laden des Fun Facts.';
            });
    }

    function updateRobinImage() {
        const today = new Date();
        const birthYear = 1994;
        const birthMonth = 3; // April (0-based)
        const birthDay = 2;

        let age = today.getFullYear() - birthYear;
        const birthdayThisYear = new Date(today.getFullYear(), birthMonth, birthDay);
        if (today < birthdayThisYear) {
            age -= 1;
        }

        const showSilly = Math.random() < 0.05; // ~5% chance every 3 seconds

        if (age < 31) {
            robinPhoto.style.display = 'none'; // hide if out of bounds
            robinCaption.style.display = 'none';
        } else if (showSilly) {
            const sillyIndex = Math.floor(Math.random() * 10); // 0–9
            robinPhoto.src = `data/robin_silly${sillyIndex}.webp?cb=${Date.now()}`; // cache buster
            robinCaption.textContent = `???`;
        } else if (age > 40) {
            robinPhoto.src = `data/robin40.webp`;
            robinPhoto.style.display = 'block';
            robinCaption.textContent = `Robin, ${age} Jahre alt`;
            robinCaption.style.display = 'block';
        } else { // age between 31 and 40
            robinPhoto.src = `data/robin${age}.webp`;
            robinPhoto.style.display = 'block';
            robinCaption.textContent = `Robin, ${age} Jahre alt`;
            robinCaption.style.display = 'block';
        }
    }

    setInterval(updateCountdown, 1000);       // Update countdown every second
    setInterval(updateRobinImage, 3000);      // Update image every 5 seconds

    updateCountdown();     // Call once immediately
    updateRobinImage();    // Also call image update immediately
});

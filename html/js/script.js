document.addEventListener('DOMContentLoaded', function () {
    const targetDate = new Date('April 2, 2034 00:00:00 GMT+0200');
    const countdownElement = document.getElementById('countdown');
    const funFactElement = document.getElementById('fun-fact');
    const robinPhoto = document.getElementById('robin-photo'); // <-- reference to image element

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
        updateRobinImage(); // <-- call image logic
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

    // ✅ NEW FUNCTION to update the image based on Robin's age
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

        if (age >= 31 && age <= 40) {
            robinPhoto.src = `data/robin${age}.webp`;
            robinPhoto.style.display = 'block';
        } else {
            robinPhoto.style.display = 'none'; // hide if out of bounds
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
});

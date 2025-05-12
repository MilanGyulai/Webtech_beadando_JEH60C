document.addEventListener('DOMContentLoaded', () => {
    // Ez az eseményfigyelő akkor fut le, amikor a teljes HTML dokumentum betöltődött és feldolgozásra került.

    const carListSection = document.getElementById('car-list-section');
    // Lekérjük a "car-list-section" ID-val rendelkező HTML szekciót, ami az autók listáját tartalmazza.
    const carDetailsSection = document.getElementById('car-details-section');
    // Lekérjük a "car-details-section" ID-val rendelkező HTML szekciót, ami az autó részleteit tartalmazza.
    const carList = document.getElementById('car-list');
    // Lekérjük a "car-list" ID-val rendelkező HTML listát (<ul> elem), ahol az autók meg fognak jelenni.
    const carDetailsContainer = document.getElementById('car-details');
    // Lekérjük a "car-details" ID-val rendelkező HTML konténert (<div> elem), ahol az autó részletei meg fognak jelenni.
    const backToListButton = document.getElementById('back-to-list');
    // Lekérjük a "back-to-list" ID-val rendelkező HTML gombot, ami visszavisz az autólistához.
    const neptunKod = 'jeh60c';
    // A te Neptun kódod, ami az API hívásokhoz szükséges.
    let storedCars = [];
    // Egy üres tömb, amiben az összes lekérdezett autó adatát tároljuk a későbbi felhasználáshoz (pl. szerkesztéshez).

    async function getCars() {
        // Ez az aszinkron függvény lekérdezi az autók listáját a szerverről.
        try {
            const response = await fetch(`https://iit-playground.arondev.hu/api/${neptunKod}/car`);
            // Megpróbálunk egy HTTP GET kérést küldeni a megadott URL-re.
            if (!response.ok) {
                throw new Error(`Hiba történt a lekérdezés során: ${response.status}`);
                // Ha a válasz nem sikeres (a státuszkód nem 200-as tartományban van), hibát dobunk.
            }
            const cars = await response.json();
            // A szerver válaszának feldolgozása JSON formátumból JavaScript objektummá.
            storedCars = cars;
            // A lekérdezett autókat elmentjük a storedCars tömbbe.
            showCarListOnPage(cars);
            // Az autók megjelenítése a weboldalon a showCarListOnPage függvény segítségével.
        } catch (error) {
            // Ha valamilyen hiba történt a fetch kérés során (pl. hálózati probléma).
            console.error('Hiba az autók betöltésekor:', error);
            // Kiírjuk a konzolra a hibaüzenetet.
            carList.innerHTML = '<p>Hiba történt az autók betöltésekor.</p>';
            // Hibaüzenetet jelenítünk meg a felhasználónak az autólista helyén.
        }
    }

    function showCarListOnPage(cars) {
        // Ez a függvény felelős az autók listájának megjelenítéséért a HTML oldalon.
        carList.innerHTML = '';
        // Töröljük a korábbi autókat a listából.
        cars.forEach(car => {
            // Végigmegyünk az összes lekérdezett autón.
            const listItem = document.createElement('li');
            // Létrehozunk egy új listaelem (<li>) minden autóhoz.
            listItem.innerHTML = `
                <h3>${car.brand} ${car.model}</h3>
                <button class="view-details-button" data-car-id="${car.id}">Részletek</button>
                <button class="delete-car-button" data-car-id="${car.id}">Törlés</button>
                <button class="edit-car-list-button" data-car-id="${car.id}">Módosítás</button>
            `;
            // Beállítjuk a listaelem HTML tartalmát, beleértve az autó márkáját, modelljét és a gombokat.
            // A gombokhoz data-car-id attribútumot adunk az autó ID-jával.
            const detailsButton = listItem.querySelector('.view-details-button');
            // Lekérjük a "Részletek" gombot az aktuális listaelemből.
            detailsButton.addEventListener('click', () => getCarDetails(car.id));
            // Hozzáadunk egy eseményfigyelőt a "Részletek" gombra, ami a getCarDetails függvényt hívja meg az autó ID-jával.
            const deleteButton = listItem.querySelector('.delete-car-button');
            // Lekérjük a "Törlés" gombot az aktuális listaelemből.
            deleteButton.addEventListener('click', () => deleteCar(car.id));
            // Hozzáadunk egy eseményfigyelőt a "Törlés" gombra, ami a deleteCar függvényt hívja meg az autó ID-jával.
            const editButton = listItem.querySelector('.edit-car-list-button');
            // Lekérjük a "Módosítás" gombot az aktuális listaelemből.
            editButton.addEventListener('click', () => {
                // Hozzáadunk egy eseményfigyelőt a "Módosítás" gombra.
                const carId = car.id;
                // Lekérjük az aktuális autó ID-ját.
                sessionStorage.setItem('storedCars', JSON.stringify(storedCars));
                // Elmentjük a teljes autólistát a sessionStorage-ba, hogy a szerkesztő oldalon elérhető legyen.
                window.location.href = `CarEdit.html?id=${carId}`;
                // Átirányítjuk a felhasználót a CarEdit.html oldalra, az autó ID-ját URL paraméterként átadva.
            });
            carList.appendChild(listItem);
            // Hozzáadjuk az elkészült listaelem az autólistához (<ul> elemhez).
        });
    }

    async function getCarDetails(carId) {
        // Ez az aszinkron függvény lekérdezi egy adott autó részleteit a szerverről az ID alapján.
        try {
            const response = await fetch(`https://iit-playground.arondev.hu/api/${neptunKod}/car/${carId}`);
            // Megpróbálunk egy HTTP GET kérést küldeni a megadott URL-re az autó ID-jával.
            if (!response.ok) {
                throw new Error(`Hiba történt az autó adatainak lekérdezése során: ${response.status}`);
                // Ha a válasz nem sikeres, hibát dobunk.
            }
            const carDetails = await response.json();
            // A szerver válaszának feldolgozása JSON formátumból JavaScript objektummá.
            displayCarDetails(carDetails);
            // Az autó részleteinek megjelenítése a weboldalon a displayCarDetails függvény segítségével.
        } catch (error) {
            // Ha valamilyen hiba történt a fetch kérés során.
            console.error(`Hiba a(z) ${carId} azonosítójú autó adatainak betöltésekor:`, error);
            // Kiírjuk a konzolra a hibaüzenetet.
            carDetailsContainer.innerHTML = '<p>Hiba történt az autó adatainak betöltésekor.</p>';
            // Hibaüzenetet jelenítünk meg a felhasználónak az autó részleteinek helyén.
        }
    }

    function displayCarDetails(car) {
        // Ez a függvény felelős egy adott autó részleteinek megjelenítéséért a HTML oldalon.
        carDetailsContainer.innerHTML = `
            <h3>${car.brand} ${car.model}</h3>
            <p>Azonosító: ${car.id}</p>
            <p>Tulajdonos: ${car.owner}</p>
            <p>Forgalomba helyezés: ${car.dayOfCommission}</p>
            <p>Elektromos: ${car.electric ? 'Igen' : 'Nem'}</p>
            <p>Üzemanyag fogyasztás: ${car.fuelUse}</p>
            <button id="back-to-list-button">Vissza a listához</button>
            <button id="delete-car-details-button" data-car-id="${car.id}">Törlés</button>
        `;
        // Beállítjuk a részletek konténerének HTML tartalmát az autó adataival és a gombokkal.
        const backButton = carDetailsContainer.querySelector('#back-to-list-button');
        // Lekérjük a "Vissza a listához" gombot.
        backButton.addEventListener('click', showCarListSection);
        // Hozzáadunk egy eseményfigyelőt a "Vissza a listához" gombra, ami a showCarListSection függvényt hívja meg.
        const deleteDetailsButton = carDetailsContainer.querySelector('#delete-car-details-button');
        // Lekérjük a "Törlés" gombot a részletek nézetben.
        deleteDetailsButton.addEventListener('click', () => deleteCar(car.id));
        // Hozzáadunk egy eseményfigyelőt a "Törlés" gombra a részletek nézetben, ami a deleteCar függvényt hívja meg.
        carListSection.classList.add('hidden');
        // Elrejtjük az autólista szekciót.
        carDetailsSection.classList.remove('hidden');
        // Megjelenítjük az autó részleteinek szekcióját.
    }

    function showCarListSection() {
        // Ez a függvény jeleníti meg az autólista szekciót és elrejti a részletek szekciót.
        carListSection.classList.remove('hidden');
        // Megjelenítjük az autólista szekciót.
        carDetailsSection.classList.add('hidden');
        // Elrejtjük az autó részleteinek szekcióját.
        getCars();
        // Újratöltjük az autólistát, hogy az esetleges törlések megjelenjenek.
    }

    async function deleteCar(id) {
        // Ez az aszinkron függvény töröl egy autót a szerverről az ID alapján.
        if (confirm('Biztosan törölni szeretnéd ezt az autót?')) {
            // Megkérdezzük a felhasználót, hogy biztos-e a törlésben.
            try {
                const response = await fetch(`https://iit-playground.arondev.hu/api/${neptunKod}/car/${id}`, {
                    method: 'DELETE',
                    // A HTTP metódus DELETE a törléshez.
                });
                if (response.ok) {
                    // Ha a törlés sikeres volt.
                    console.log(`A(z) ${id} azonosítójú autó sikeresen törölve!`);
                    // Kiírjuk a konzolra a sikeres törlést.
                    getCars();
                    // Újratöltjük az autólistát a törölt autó nélkül.
                } else {
                    // Ha a törlés sikertelen volt.
                    const error = await response.json();
                    // Megpróbáljuk a hibaüzenetet JSON formátumban feldolgozni.
                    console.error('Hiba az autó törlésekor:', error);
                    // Kiírjuk a konzolra a hibaüzenetet.
                    alert('Hiba történt az autó törlésekor!');
                    // Értesítjük a felhasználót a hibáról.
                }
            } catch (error) {
                // Ha valamilyen hiba történt a fetch kérés során.
                console.error('Hiba az autó törlésekor:', error);
                // Kiírjuk a konzolra a hibaüzenetet.
                alert('Hálózati hiba történt az autó törlésekor!');
                // Értesítjük a felhasználót a hálózati hibáról.
            }
        }
    }

    backToListButton.addEventListener('click', showCarListSection);
    // Hozzáadunk egy eseményfigyelőt a "Vissza a listához" gombra az oldal betöltésekor is (bár a displayCarDetails is beállítja).
    getCars();
    // Az oldal betöltésekor azonnal lekérdezzük az autók listáját.
});
document.addEventListener('DOMContentLoaded', () => {
    // Ez az eseményfigyelő akkor fut le, amikor a teljes HTML dokumentum betöltődött és feldolgozásra került.

    const editCarForm = document.getElementById('edit-car-form');
    // Lekérjük a "edit-car-form" ID-val rendelkező HTML űrlap elemet.
    const editIdInput = document.getElementById('edit-id');
    // Lekérjük a "edit-id" ID-val rendelkező rejtett input elemet, ami az autó ID-ját tárolja.
    const neptunKod = 'jeh60c';
    // A te Neptun kódod, ami az API hívásokhoz szükséges.
    let storedCarsFromList = sessionStorage.getItem('storedCars') ? JSON.parse(sessionStorage.getItem('storedCars')) : [];
    // Megpróbáljuk kiolvasni a "storedCars" nevű elemet a sessionStorage-ból.
    // Ha létezik, JSON-ból JavaScript objektummá alakítjuk, egyébként egy üres tömböt állítunk be.
    // Ez a tömb tartalmazza az autók listáját az előző oldalról.

    function populateEditForm(car) {
        // Ez a függvény tölti ki a szerkesztő űrlap mezőit az átadott autó objektum adataival.
        editIdInput.value = car.id;
        // Beállítjuk a rejtett ID mező értékét az autó ID-jával.
        document.getElementById('edit-brand').value = car.brand;
        // Beállítjuk a "brand" ID-val rendelkező input mező értékét az autó márkájával.
        document.getElementById('edit-model').value = car.model;
        // Beállítjuk a "model" ID-val rendelkező input mező értékét az autó modelljével.
        document.getElementById('edit-fuelUse').value = car.fuelUse || '';
        // Beállítjuk a "fuelUse" ID-val rendelkező input mező értékét az autó üzemanyag-fogyasztásával (ha van).
        document.getElementById('edit-owner').value = car.owner || '';
        // Beállítjuk az "owner" ID-val rendelkező input mező értékét az autó tulajdonosával (ha van).
        document.getElementById('edit-dayOfCommission').value = car.dayOfCommission || '';
        // Beállítjuk a "dayOfCommission" ID-val rendelkező input mező értékét az autó forgalomba helyezésének dátumával (ha van).
        document.getElementById('edit-electric').checked = car.electric || false;
        // Beállítjuk az "electric" ID-val rendelkező checkbox állapotát az autó elektromos státuszának megfelelően (ha van).
        console.log('Űrlap feltöltve ezzel az autóval:', car);
        // Kiírjuk a konzolra, hogy melyik autó adataival töltöttük fel az űrlapot (debug célokra).
    }

    async function updateCar(event) {
        // Ez az aszinkron függvény kezeli az űrlap elküldését (a "Mentés" gombra kattintást).
        event.preventDefault();
        // Megakadályozzuk az űrlap alapértelmezett elküldési viselkedését (oldal újratöltése).
        const formData = new FormData(editCarForm);
        // Létrehozunk egy FormData objektumot az űrlap adataiból.
        const carData = Object.fromEntries(formData.entries());
        // A FormData objektumból létrehozunk egy egyszerű JavaScript objektumot, ahol a kulcsok az input mezők nevei, az értékek pedig a beírt adatok.
        carData.id = editIdInput.value;
        // Hozzáadjuk az autó ID-ját az adatobjektumhoz a rejtett mezőből.
        carData.electric = carData.electric === 'on';
        // Az elektromos checkbox értéke "on" vagy undefined lehet, ezért boolean értékké alakítjuk.

        console.log('Küldendő adatok:', carData);
        // Kiírjuk a konzolra a szerverre küldendő adatokat (debug célokra).

        try {
            // Megpróbálunk egy HTTP PUT kérést küldeni a szerverre az autó adatainak módosításához.
            const response = await fetch(`https://iit-playground.arondev.hu/api/${neptunKod}/car`, {
                method: 'PUT',
                // A HTTP metódus PUT, ami általában meglévő erőforrás módosítására szolgál.
                headers: {
                    'Content-Type': 'application/json',
                    // Beállítjuk a Content-Type fejlécet, jelezve, hogy JSON formátumban küldjük az adatokat.
                },
                body: JSON.stringify(carData),
                // A kérés törzsében elküldjük az autó adatait JSON formátumban.
            });

            if (response.ok) {
                // Ha a szerver sikeres választ adott (pl. 200 OK).
                console.log('Autó sikeresen módosítva!');
                // Kiírjuk a konzolra, hogy az autó módosítása sikeres volt.
                window.location.href = 'CarList.html';
                // Átirányítjuk a felhasználót az autólistát tartalmazó oldalra.
            } else {
                // Ha a szerver hibás választ adott (pl. 4xx vagy 5xx).
                const error = await response.json();
                // Megpróbáljuk a hibaüzenetet JSON formátumban feldolgozni.
                console.error('Hiba az autó módosításakor:', error);
                // Kiírjuk a konzolra a hibaüzenetet.
                alert('Hiba történt az autó módosításakor!');
                // Értesítjük a felhasználót a hibaüzenettel.
            }
        } catch (error) {
            // Ha valamilyen hiba történt a fetch kérés során (pl. hálózati probléma).
            console.error('Hiba az autó módosításakor:', error);
            // Kiírjuk a konzolra a hibaüzenetet.
            alert('Hálózati hiba történt az autó módosításakor!');
            // Értesítjük a felhasználót a hálózati hibáról.
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    // Létrehozunk egy URLSearchParams objektumot az aktuális oldal URL-jének lekérdezési paramétereiből.
    const carIdFromUrl = urlParams.get('id');
    // Lekérdezzük az "id" nevű URL paraméter értékét (az autó ID-ját).
    console.log('Car ID a URL-ből:', carIdFromUrl);
    // Kiírjuk a konzolra az URL-ből kinyert autó ID-ját (debug célokra).

    if (carIdFromUrl) {
        // Ha van autó ID a URL-ben (ami azt jelenti, hogy a szerkesztő oldalra egy autó listájáról navigáltunk).
        // Megkeressük az autót a tárolt listában az ID alapján.
        const carToEdit = storedCarsFromList.find(car => car.id === parseInt(carIdFromUrl));
        if (carToEdit) {
            // Ha megtaláltuk az autót a tárolt listában.
            populateEditForm(carToEdit);
            // Feltöltjük az űrlapot az autó adataival.
        } else {
            // Ha nem találtuk meg az autót a tárolt listában (valamilyen hiba történt).
            alert('Hiba: Az autó adatai nem találhatók.');
            // Értesítjük a felhasználót.
            window.location.href = 'CarList.html';
            // Visszanavigálunk az autólistára.
        }
    } else {
        // Ha nincs autó ID a URL-ben (valószínűleg közvetlenül nyitották meg a szerkesztő oldalt, ami nem a várt működés).
        alert('Érvénytelen autó ID!');
        // Értesítjük a felhasználót.
        window.location.href = 'CarList.html';
        // Visszanavigálunk az autólistára.
    }

    editCarForm.addEventListener('submit', updateCar);
    // Hozzáadunk egy eseményfigyelőt az űrlap "submit" eseményére, ami az űrlap elküldésekor (a "Mentés" gombra kattintva) lefut.
    // Amikor az űrlapot elküldik, az updateCar függvény kerül meghívásra.
});
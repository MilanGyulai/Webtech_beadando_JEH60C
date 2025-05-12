document.addEventListener('DOMContentLoaded', () => {
    // Amikor a teljes HTML dokumentum betöltődött és feldolgozásra került,
    // ez a függvény fut le.
  
    // Lekérjük a HTML form elemet az ID-ja alapján, hogy később kezelhessük az űrlapküldést.
    const addCarForm = document.getElementById('add-car-form');
    // A te Neptun kódod, ami az API hívásokhoz szükséges.
    const neptunKod = 'jeh60c';
  
    // Aszinkron függvény egy új autó hozzáadásához a szerveren.
    async function addCar(event) {
      // Megakadályozzuk az űrlap alapértelmezett működését (az oldal újratöltését).
      event.preventDefault();
      // Létrehozunk egy FormData objektumot az űrlap adataiból.
      const formData = new FormData(addCarForm);
      // A FormData objektumot átalakítjuk egy egyszerű JavaScript objektummá,
      // ahol a kulcsok az űrlap mezőinek nevei, az értékek pedig a mezők értékei.
      const carData = Object.fromEntries(formData.entries());
      // A 'electric' checkbox értéke 'on' lesz, ha be van jelölve. Ezt átalakítjuk logikai értékre.
      carData.electric = carData.electric === 'on';
  
      try {
        // Megpróbálunk egy HTTP POST kérést küldeni a megadott URL-re.
        const response = await fetch(`https://iit-playground.arondev.hu/api/${neptunKod}/car`, {
          method: 'POST', // A HTTP POST metódust használjuk új erőforrás létrehozásához.
          headers: {
            'Content-Type': 'application/json', // Beállítjuk a kérés fejlécét, hogy JSON formátumú adatot küldünk.
          },
          body: JSON.stringify(carData), // A JavaScript autó adat objektumot JSON formátumú szöveggé alakítjuk a kérés törzsében.
        });
  
        // Ellenőrizzük, hogy a szerver sikeresen feldolgozta-e a kérést (a válasz státuszkódja 200-as tartományban van).
        if (response.ok) {
          console.log('Autó sikeresen hozzáadva!');
          window.location.href = 'index.html'; // Sikeres hozzáadás után visszairányítjuk a felhasználót az autók listájának oldalára.
          addCarForm.reset(); // Az űrlap mezőinek alaphelyzetbe állítása.
        } else {
          // Ha a szerver valamilyen hibával válaszolt.
          const error = await response.json(); // Megpróbáljuk a szerver válaszát JSON formátumban feldolgozni, hogy részletesebb hibaüzenetet kapjunk.
          console.error('Hiba az autó hozzáadásakor:', error);
          alert('Hiba történt az autó hozzáadásakor!'); // Megjelenítünk egy általános hibaüzenetet a felhasználónak.
        }
      } catch (error) {
        // Ha valamilyen hiba történt a fetch kérés során (pl. hálózati probléma).
        console.error('Hiba az autó hozzáadásakor:', error);
        alert('Hálózati hiba történt az autó hozzáadásakor!'); // Megjelenítünk egy hálózati hibaüzenetet a felhasználónak.
      }
    }
  
    // Eseményfigyelőt adunk az űrlap 'submit' eseményéhez. Amikor az űrlapot elküldik,
    // az addCar függvény fut le.
    addCarForm.addEventListener('submit', addCar);
  });
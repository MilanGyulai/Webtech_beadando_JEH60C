document.addEventListener('DOMContentLoaded', () => {
    // Amikor a teljes HTML dokumentum betöltődött és feldolgozásra került,
    // ez a függvény fut le.
  
    // Lekérjük a HTML elemeket az ID-juk alapján, hogy később manipulálhassuk őket.
    const carListSection = document.getElementById('car-list-section'); // Az autók listájának szekciója.
    const carDetailsSection = document.getElementById('car-details-section'); // Az autó részleteinek szekciója.
    const carList = document.getElementById('car-list'); // Az autók listájának (<ul>) eleme.
    const carDetailsContainer = document.getElementById('car-details'); // Az autó részleteit tartalmazó (<div>) elem.
    const backToListButton = document.getElementById('back-to-list'); // A "Vissza a listához" gomb.
    const neptunKod = 'jeh60c'; // A te Neptun kódod, ami az API hívásokhoz szükséges.
  
    // Függvény az autók lista lekérdezésére a szerverről.
    async function getCars() {
      try {
        // Megpróbálunk egy HTTP GET kérést küldeni a megadott URL-re.
        const response = await fetch(`https://iit-playground.arondev.hu/api/${neptunKod}/car`);
        // Ha a válasz nem sikeres (a státuszkód nem 200-as tartományban van),
        // akkor egy hibát dobunk, ami megszakítja a függvény futását és a catch blokkba ugrik.
        if (!response.ok) {
          throw new Error(`Hiba történt a lekérdezés során: ${response.status}`);
        }
        // A szerver válaszának feldolgozása JSON formátumból JavaScript objektummá.
        const cars = await response.json();
        // Az autók megjelenítése a weboldalon a showCarListOnPage függvény segítségével.
        showCarListOnPage(cars);
      } catch (error) {
        // Ha valamilyen hiba történt a try blokkban (pl. hálózati hiba, vagy a szerver nem válaszolt),
        // ez a blokk fut le.
        console.error('Hiba az autók betöltésekor:', error);
        // A hibaüzenet megjelenítése a felhasználónak az autólista helyén.
        carList.innerHTML = '<p>Hiba történt az autók betöltésekor.</p>';
      }
    }
  
    // Függvény az autók lista megjelenítésére a weboldalon.
    function showCarListOnPage(cars) {
      carList.innerHTML = ''; // Először töröljük a meglévő listát, hogy ne duplázódjanak az elemek.
      cars.forEach(car => {
        // Minden egyes autó objektumhoz a 'cars' tömbben:
        // Létrehozunk egy új listaelem (<li>) a HTML-ben.
        const listItem = document.createElement('li');
        // Beállítjuk a listaelem belső HTML tartalmát. Ez tartalmazza az autó márkáját és modelljét,
        // valamint két gombot: egyet a részletek megtekintéséhez és egyet a törléshez.
        listItem.innerHTML = `
            <h3>${car.brand} ${car.model}</h3>
            <button class="view-details-button" data-car-id="${car.id}">Részletek</button>
            <button class="delete-car-button" data-car-id="${car.id}">Törlés</button>
          `;
        // Megkeressük a "Részletek" gombot az aktuális listaelemben a class neve alapján.
        const detailsButton = listItem.querySelector('.view-details-button');
        // Eseményfigyelőt adunk a "Részletek" gombhoz. Kattintásra egy névtelen függvény fut le,
        // ami meghívja a getCarDetails függvényt az aktuális autó ID-jával.
        detailsButton.addEventListener('click', () => getCarDetails(car.id));
  
        // Megkeressük a "Törlés" gombot az aktuális listaelemben a class neve alapján.
        const deleteButton = listItem.querySelector('.delete-car-button');
        // Eseményfigyelőt adunk a "Törlés" gombhoz. Kattintásra egy névtelen függvény fut le,
        // ami meghívja a deleteCar függvényt az aktuális autó ID-jával.
        deleteButton.addEventListener('click', () => deleteCar(car.id));
  
        // Hozzáadjuk a létrehozott listaelemet a fő autó listához (<ul> elemhez).
        carList.appendChild(listItem);
      });
    }
  
    // Függvény egy adott autó adatainak lekérdezésére a szerverről az ID alapján.
    async function getCarDetails(carId) {
      try {
        // Hasonlóan a getCars függvényhez, itt is egy HTTP GET kérést küldünk,
        // de ezúttal egy specifikus autó URL-jére, az ID-t is beleértve.
        const response = await fetch(`https://iit-playground.arondev.hu/api/${neptunKod}/car/${carId}`);
        // Ha a válasz nem sikeres, hibát dobunk.
        if (!response.ok) {
          throw new Error(`Hiba történt az autó adatainak lekérdezése során: ${response.status}`);
        }
        // A szerver válaszának feldolgozása JSON formátumból JavaScript objektummá.
        const carDetails = await response.json();
        // Az autó részleteinek megjelenítése a weboldalon a displayCarDetails függvény segítségével.
        displayCarDetails(carDetails);
      } catch (error) {
        // Hiba kezelése az autó adatainak lekérdezésekor.
        console.error(`Hiba a(z) ${carId} azonosítójú autó adatainak betöltésekor:`, error);
        // Hibaüzenet megjelenítése a felhasználónak a részletek helyén.
        carDetailsContainer.innerHTML = '<p>Hiba történt az autó adatainak betöltésekor.</p>';
      }
    }
  
    // Függvény az adott autó részleteinek megjelenítésére a weboldalon.
    function displayCarDetails(car) {
      // Beállítjuk a részleteket tartalmazó (<div>) elem belső HTML tartalmát
      // az autó adatainak megfelelően. Ez tartalmazza a márkát, modellt, ID-t, tulajdonost, stb.,
      // valamint egy "Vissza a listához" gombot.
      carDetailsContainer.innerHTML = `
          <h3>${car.brand} ${car.model}</h3>
          <p>Azonosító: ${car.id}</p>
          <p>Tulajdonos: ${car.owner}</p>
          <p>Forgalomba helyezés: ${car.dayOfCommission}</p>
          <p>Elektromos: ${car.electric ? 'Igen' : 'Nem'}</p>
          <p>Üzemanyag fogyasztás: ${car.fuelUse}</p>
          <button id="back-to-list-button">Vissza a listához</button>
        `;
      // Megkeressük a "Vissza a listához" gombot a részletek nézetben az ID alapján.
      const backButton = carDetailsContainer.querySelector('#back-to-list-button');
      // Eseményfigyelőt adunk a "Vissza a listához" gombhoz. Kattintásra meghívjuk a showCarListSection függvényt.
      backButton.addEventListener('click', showCarListSection);
      // Elrejtjük az autó listájának szekcióját és megjelenítjük az autó részleteinek szekcióját.
      carListSection.classList.add('hidden');
      carDetailsSection.classList.remove('hidden');
    }
  
    // Függvény az autó lista rész megjelenítésére és a részletek elrejtésére.
    function showCarListSection() {
      carListSection.classList.remove('hidden');
      carDetailsSection.classList.add('hidden');
    }
  
    // Aszinkron függvény egy autó törlésére a szerverről az ID alapján.
    async function deleteCar(id) {
      // Megjelenítünk egy megerősítő párbeszédablakot a felhasználónak a törlés előtt.
      if (confirm('Biztosan törölni szeretnéd ezt az autót?')) {
        try {
          // HTTP DELETE kérést küldünk a megadott URL-re, a törlendő autó ID-jával.
          const response = await fetch(`https://iit-playground.arondev.hu/api/${neptunKod}/car/${id}`, {
            method: 'DELETE',
          });
          // Ha a válasz sikeres, kiírunk egy üzenetet a konzolra és újratöltjük az autólistát.
          if (response.ok) {
            console.log(`A(z) ${id} azonosítójú autó sikeresen törölve!`);
            getCars(); // Újratöltjük az autólistát a törlés után, hogy a törölt autó ne jelenjen meg.
          } else {
            // Ha a törlés nem volt sikeres, feldolgozzuk a hibaüzenetet (ha van) és megjelenítjük azt.
            const error = await response.json();
            console.error('Hiba az autó törlésekor:', error);
            alert('Hiba történt az autó törlésekor!');
          }
        } catch (error) {
          // Ha valamilyen hiba történt a fetch kérés során (pl. hálózati hiba), ezt a blokk kezeli.
          console.error('Hiba az autó törlésekor:', error);
          alert('Hálózati hiba történt az autó törlésekor!');
        }
      }
    }
  
    // Eseményfigyelő a "Vissza a listához" gombhoz.
    // Ez a gomb a részletek nézetben található, és kattintásra a showCarListSection függvényt hívja meg.
    backToListButton.addEventListener('click', showCarListSection);
  
    // Az autók lista betöltése az oldal betöltődésekor.
    // Amikor az oldal betöltődik, azonnal lekérjük és megjelenítjük az autók listáját.
    getCars();
  });
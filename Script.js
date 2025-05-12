document.addEventListener('DOMContentLoaded', () => {
  // Amikor a teljes HTML dokumentum betöltődött és feldolgozásra került,
  // ez a függvény fut le.

  // Lekérjük a HTML elemeket az ID-juk alapján, hogy később manipulálhassuk őket.
  const newTaskInput = document.getElementById('new-task'); // Az új feladat bevitelére szolgáló input mező.
  const addButton = document.getElementById('add-button'); // A feladat hozzáadására szolgáló gomb.
  const taskList = document.getElementById('task-list'); // A feladatok listájának (<ul>) eleme.

  // Betöltjük a tárolt feladatokat a böngésző helyi tárolójából (localStorage).
  // Ha nincsenek tárolt feladatok, egy üres tömböt használunk.
  let tasks = loadTasks();
  // Megjelenítjük a betöltött vagy üres feladatlistát a weboldalon.
  renderTasks();

  // Eseményfigyelőt adunk a "Hozzáadás" gombhoz. Kattintásra az addTask függvény fut le.
  addButton.addEventListener('click', addTask);

  // Függvény a feladatok betöltésére a böngésző helyi tárolójából.
  function loadTasks() {
    // Megpróbáljuk lekérni a 'tasks' nevű elemet a localStorage-ból.
    const storedTasks = localStorage.getItem('tasks');
    // Ha van tárolt adat, akkor azt JSON formátumból JavaScript tömbbé alakítjuk.
    // Ha nincs tárolt adat (storedTasks null), akkor egy üres tömböt adunk vissza.
    return storedTasks ? JSON.parse(storedTasks) : [];
  }

  // Függvény a feladatok mentésére a böngésző helyi tárolójába.
  function saveTasks() {
    // A 'tasks' tömböt JSON formátumba alakítjuk, hogy elmenthessük a localStorage-ba.
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Függvény a feladatok megjelenítésére a weboldalon.
  function renderTasks() {
    taskList.innerHTML = ''; // Először töröljük a meglévő listát, hogy ne duplázódjanak az elemek.
    // Végigmegyünk a 'tasks' tömb minden egyes feladatán és annak indexén.
    tasks.forEach((task, index) => {
      // Létrehozunk egy új listaelem (<li>) a HTML-ben minden feladathoz.
      const listItem = document.createElement('li');
      // Beállítjuk a listaelem belső HTML tartalmát. Ez tartalmaz egy <span> elemet a feladat szövegével
      // és egy "Törlés" gombot, amelynek 'data-index' attribútuma beállítja az aktuális feladat indexét.
      listItem.innerHTML = `
          <span>${task.text}</span>
          <button class="delete-button" data-index="${index}">Törlés</button>
        `;
      // Ha a feladat 'completed' tulajdonsága igaz, akkor hozzáadunk egy 'completed' class-t a listaelemhez
      // a vizuális jelzéshez (pl. áthúzott szöveg).
      if (task.completed) {
        listItem.classList.add('completed');
      }

      // Megkeressük a "Törlés" gombot az aktuális listaelemben a class neve alapján.
      const deleteButton = listItem.querySelector('.delete-button');
      // Eseményfigyelőt adunk a "Törlés" gombhoz. Kattintásra a deleteTask függvény fut le.
      deleteButton.addEventListener('click', deleteTask);

      // Eseményfigyelőt adunk a teljes listaelemhez. Kattintásra a toggleComplete függvény fut le.
      // Ezt arra használjuk, hogy megjelöljük/töröljük a feladatot befejezettként.
      listItem.addEventListener('click', toggleComplete);

      // Hozzáadjuk a létrehozott listaelemet a fő feladat listához (<ul> elemhez).
      taskList.appendChild(listItem);
    });
  }

  // Függvény egy új feladat hozzáadásához a listához.
  function addTask() {
    // Lekérjük a bevitt szöveget az input mezőből és eltávolítjuk a felesleges szóközöket az elejéről és végéről.
    const newTaskText = newTaskInput.value.trim();
    // Ha a bevitt szöveg nem üres:
    if (newTaskText !== '') {
      // Hozzáadunk egy új objektumot a 'tasks' tömbhöz. Az objektum tartalmazza a feladat szövegét
      // és egy 'completed' tulajdonságot, amely alapértelmezés szerint false (nem befejezett).
      tasks.push({ text: newTaskText, completed: false });
      // Elmentjük a frissített feladatlistát a localStorage-ba.
      saveTasks();
      // Újra megjelenítjük a feladatlistát a weboldalon a hozzáadott feladattal.
      renderTasks();
      // Töröljük az input mező tartalmát a hozzáadás után.
      newTaskInput.value = '';
    }
  }

  // Függvény egy feladat törléséhez a listából.
  function deleteTask(event) {
    // Lekérjük a törlendő feladat indexét a gomb 'data-index' attribútumából.
    const indexToDelete = parseInt(event.target.dataset.index);
    // Létrehozunk egy új tömböt, amely csak azokat a feladatokat tartalmazza,
    // amelyeknek az indexe nem egyezik a törlendő indexével.
    tasks = tasks.filter((_, index) => index !== indexToDelete);
    // Elmentjük a frissített feladatlistát a localStorage-ba.
    saveTasks();
    // Újra megjelenítjük a feladatlistát a weboldalon a törölt feladat nélkül.
    renderTasks();
  }

  // Függvény egy feladat befejezett állapotának váltására.
  function toggleComplete(event) {
    // Csak akkor fut le, ha a kattintás a <span> elemen történt (a feladat szövegén).
    if (event.target.tagName === 'SPAN') {
      // Lekérjük a kattintott <span> elem szülő listaelemét (<li>).
      const listItem = event.target.parentNode;
      // Megkeressük a kattintott listaelem indexét a taskList gyerekeinek tömbjében.
      const indexToToggle = Array.from(taskList.children).indexOf(listItem);
      // Megváltoztatjuk a 'completed' tulajdonság értékét az 'tasks' tömb megfelelő indexű elemében
      // az ellentkezőjére (true-ból false, false-ból true).
      tasks[indexToToggle].completed = !tasks[indexToToggle].completed;
      // Elmentjük a frissített feladatlistát a localStorage-ba.
      saveTasks();
      // Újra megjelenítjük a feladatlistát a weboldalon a megváltozott állapottal.
      renderTasks();
    }
  }
});
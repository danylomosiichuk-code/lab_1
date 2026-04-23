const STORAGE_KEY = "lr1_access_requests";
let items = loadFromStorage();

// Знаходимо елементи DOM
const form = document.getElementById("createForm");
const resetBtn = document.getElementById("resetBtn");
const tbody = document.getElementById("itemsTableBody");

// Початковий рендер
renderTable(items);

// 1. Обробка відправки форми
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Скасовуємо стандартне перезавантаження сторінки
  
  const dto = readForm();
  const isValid = validate(dto);
  
  if (!isValid) return;
  
  addItem(dto);
  saveToStorage(items);
  renderTable(items);
  
  form.reset();
  clearAllErrors();
});

// 2. Обробка очищення форми
resetBtn.addEventListener("click", () => {
  form.reset();
  clearAllErrors();
});

// 3. Делегування подій для таблиці (видалення)
tbody.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("delete-btn")) {
    const id = Number(target.dataset.id);
    deleteItemById(id);
    saveToStorage(items);
    renderTable(items);
  }
});

// --- Функції логіки ---

function readForm() {
  return {
    userName: document.getElementById("userNameInput").value.trim(),
    date: document.getElementById("dateInput").value,
    accessType: document.getElementById("accessTypeSelect").value,
    status: document.getElementById("statusSelect").value,
    comments: document.getElementById("commentsInput").value.trim()
  };
}

function validate(dto) {
  clearAllErrors();
  let isValid = true;

  if (dto.userName === "") {
    showError("userNameInput", "userNameError", "Поле є обов'язковим.");
    isValid = false;
  } else if (dto.userName.length < 3) {
    showError("userNameInput", "userNameError", "Мінімальна довжина - 3 символи.");
    isValid = false;
  }

  if (dto.date === "") {
    showError("dateInput", "dateError", "Будь ласка, вкажіть дату та час.");
    isValid = false;
  }

  if (dto.accessType === "") {
    showError("accessTypeSelect", "accessTypeError", "Оберіть тип доступу зі списку.");
    isValid = false;
  }

  return isValid;
}

function addItem(dto) {
  const newItem = {
    id: Date.now(), // Реалізація спосібу згенерувати унікальний ID
    ...dto
  };
  items.push(newItem);
}

function deleteItemById(id) {
  items = items.filter(x => x.id !== id);
}

// Функція відображення
function renderTable(data) {
  const rowsHtml = data.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.userName}</td>
      <td>${item.date.replace('T', ' ')}</td>
      <td>${item.accessType}</td>
      <td>${item.status}</td>
      <td>${item.comments}</td>
      <td>
        <button type="button" class="delete-btn" data-id="${item.id}">Видалити</button>
      </td>
    </tr>
  `).join("");
  
  tbody.innerHTML = rowsHtml;
}

// --- Функції для UI (помилки) ---

function showError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add("invalid");
  document.getElementById(errorId).innerHTML = message;
}

function clearError(inputId, errorId) {
  document.getElementById(inputId).classList.remove("invalid");
  document.getElementById(errorId).innerHTML = "";
}

function clearAllErrors() {
  clearError("userNameInput", "userNameError");
  clearError("dateInput", "dateError");
  clearError("accessTypeSelect", "accessTypeError");
  clearError("statusSelect", "statusError");
  clearError("commentsInput", "commentsError");
}

// --- Функції для localStorage ---

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromStorage() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (json === null) return [];
  try {
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
// --- СОРТУВАННЯ ---

// Змінна для збереження напрямку сортування (за замовчуванням - від найстаріших до найновіших)
let isDateAscending = true;

const sortByDateBtn = document.getElementById("sortByDateBtn");

sortByDateBtn.addEventListener("click", () => {
  // Змінюємо напрямок сортування на протилежний
  isDateAscending = !isDateAscending; 

  // Сортуємо масив items
  items.sort((a, b) => {
    // Перетворюємо рядки дат у мілісекунди для порівняння
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (isDateAscending) {
      return dateA - dateB; // За зростанням
    } else {
      return dateB - dateA; // За спаданням
    }
  });

  // Перемальовуємо таблицю вже з відсортованим масивом
  renderTable(items);

  // Змінюємо іконку в заголовку, щоб користувач бачив напрямок
  sortByDateBtn.innerHTML = isDateAscending ? "Дата і час ↑" : "Дата і час ↓";
});
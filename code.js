/***********************
 * ITEMS (LocalStorage)
 ***********************/
let items = JSON.parse(localStorage.getItem("items")) || [
  { name: "Rice", price: 60 },
  { name: "Wheat", price: 45 },
  { name: "Toor Dal", price: 120 },
  { name: "Pen", price: 10 }
];

let selectedIndex = -1;
let total = 0;

localStorage.setItem("items", JSON.stringify(items));

/***********************
 * PAGE LOAD
 ***********************/
window.onload = function () {
  if (document.getElementById("itemList")) {
    displayItems();
  }

  if (document.getElementById("purchaseList")) {
    displayPurchaseItems();
  }
};

/***********************
 * LOGIN FUNCTIONS
 ***********************/


function customerLogin() {
  let custName = document.getElementById("custName").value;

  if (custName.trim() === "") {
    alert("Please enter customer name");
    return;
  }

  localStorage.setItem("customer", custName);
  window.location.href = "customer.html";
}

function loanLogin() {
  localStorage.setItem("loanCustomer", loanUser.value);
  location = "loan.html";
}

/***********************
 * DISPLAY ITEMS
 ***********************/
function displayItems() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;

    if (index === selectedIndex) {
      li.style.backgroundColor = "#d1e7ff";
    }

    li.onclick = function () {
      selectedIndex = index;
      document.getElementById("newItem").value = item.name;
      document.getElementById("newPrice").value = item.price;
      displayItems();
    };

    list.appendChild(li);
  });
}

/***********************
 * ADD ITEM
 ***********************/
function addItem() {
  const name = document.getElementById("newItem").value.trim();
  const price = document.getElementById("newPrice").value.trim();

  if (!name || !price) {
    alert("Please enter item name and price");
    return;
  }

  items.push({ name, price: Number(price) });
  localStorage.setItem("items", JSON.stringify(items));

  clearInputs();
  selectedIndex = -1;
  displayItems();
}

/***********************
 * EDIT ITEM
 ***********************/
function editSelectedItem() {
  if (selectedIndex === -1) {
    alert("Please select an item to edit");
    return;
  }

  const name = document.getElementById("newItem").value.trim();
  const price = document.getElementById("newPrice").value.trim();

  if (!name || !price) {
    alert("Please enter updated name and price");
    return;
  }

  items[selectedIndex] = { name, price: Number(price) };
  localStorage.setItem("items", JSON.stringify(items));

  clearInputs();
  selectedIndex = -1;
  displayItems();
}

/***********************
 * DELETE ITEM
 ***********************/
function deleteSelectedItem() {
  if (selectedIndex === -1) {
    alert("Please select an item to delete");
    return;
  }

  const confirmDelete = confirm(`Delete "${items[selectedIndex].name}" ?`);

  if (!confirmDelete) return;

  items.splice(selectedIndex, 1);
  localStorage.setItem("items", JSON.stringify(items));

  clearInputs();
  selectedIndex = -1;
  displayItems();
}

/***********************
 * PURCHASE PAGE
 ***********************/
function displayPurchaseItems() {
  let tableBody = document.getElementById("purchaseList");
  tableBody.innerHTML = "";
  total = 0;
  document.getElementById("total").innerText = total;

  items.forEach((item) => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>
        <input type="checkbox" onchange="updateTotal(${item.price}, this)">
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function updateTotal(price, checkbox) {
  if (checkbox.checked) {
    total += Number(price);
  } else {
    total -= Number(price);
  }
  document.getElementById("total").innerText = total;
}


function saveData() {
  if (!displayCustomerName()) return;

  alert("Customer: " + document.getElementById("custDisplay").innerText +
        "\nTotal Purchase Amount: ₹" + total);
}


/***********************
 * HELPERS
 ***********************/
function clearInputs() {
  document.getElementById("newItem").value = "";
  document.getElementById("newPrice").value = "";
}

// Function to display items (with name + price)
function showItems(listItems) {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  listItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;

    li.onclick = function () {
      selectedIndex = index;
      document.getElementById("newItem").value = item.name;
      document.getElementById("newPrice").value = item.price;
      displayItems();
    };

    list.appendChild(li);
  });
}

// Search function (works with object array)
function searchItems() {
  const query = document.getElementById("searchBox").value.toLowerCase();

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query)
  );

  showItems(filtered);
}

// Load items
window.onload = function () {
  let list = document.getElementById("purchaseList");

  items.forEach((item, index) => {
    let row = `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>
          <input type="checkbox" onchange="calculateTotal(${item.price}, this)">
        </td>
      </tr>
    `;
    list.innerHTML += row;
  });

  document.getElementById("cust").innerText = "Customer 1";
};

function calculateTotal(price, checkbox) {
  if (checkbox.checked) {
    total += price;
  } else {
    total -= price;
  }
  document.getElementById("total").innerText = total;
}


window.onload = function () {
  let list = document.getElementById("purchaseList");

  items.forEach((item) => {
    list.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>
          <input type="checkbox" onchange="calculateTotal(${item.price}, this)">
        </td>
      </tr>
    `;
  });
};

function calculateTotal(price, checkbox) {
  total += checkbox.checked ? price : -price;
  document.getElementById("total").innerText = total;
}

// 🖨️ PRINT BILL
function printBill() {
  let billHTML = generateBillHTML();

  let win = window.open("", "", "width=800,height=600");
  win.document.write(`
    <html>
    <head><title>Print Bill</title></head>
    <body>${billHTML}</body>
    </html>
  `);
  win.document.close();
  win.print();
}

// 📱 SEND BILL ON WHATSAPP
function sendWhatsApp() {
  let mobile = document.getElementById("mobile").value.trim();

  if (mobile.length !== 10) {
    alert("Enter valid 10-digit mobile number");
    return;
  }

  let message = generateBillText();
  let whatsappURL = `https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");
}

// 🧾 Generate bill HTML (for print)
function generateBillHTML() {
  let name = document.getElementById("cust").value;
  let bill = `
    <h2>Customer Purchase Bill</h2>
    <p><strong>Name:</strong> ${name}</p>
    <table border="1" cellpadding="8">
      <tr><th>Item</th><th>Price</th></tr>
  `;

  document.querySelectorAll("#purchaseList tr").forEach(row => {
    let checkbox = row.querySelector("input");
    if (checkbox.checked) {
      bill += `
        <tr>
          <td>${row.cells[0].innerText}</td>
          <td>${row.cells[1].innerText}</td>
        </tr>
      `;
    }
  });

  bill += `
    </table>
    <h3>Total: ₹${total}</h3>
  `;

  return bill;
}

// 📝 Generate bill text (for WhatsApp)
function generateBillText() {
  let name = document.getElementById("cust").value;
  let text = `Customer Bill\n\nName: ${name}\n\nItems:\n`;

  document.querySelectorAll("#purchaseList tr").forEach(row => {
    let checkbox = row.querySelector("input");
    if (checkbox.checked) {
      text += `- ${row.cells[0].innerText} : ${row.cells[1].innerText}\n`;
    }
  });

  text += `\nTotal Amount: ₹${total}\n\nThank you!`;

  return text;
}
function displayCustomerName() {
  let name = document.getElementById("cust").value.trim();

  if (name === "") {
    alert("Please enter customer name");
    return false;
  }

  document.getElementById("custDisplay").innerText = name;
  return true;
}


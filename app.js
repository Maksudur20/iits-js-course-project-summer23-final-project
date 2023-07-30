// Your solution goes here
// API -> https://64b2e33138e74e386d55b072.mockapi.io/api/hanover

// Adding developer name
const dev = (document.getElementById('iits-developer').innerHTML =
  "Maksudur Sium");
const adminSection = document.querySelector("#iits-adminSection");
const cartCounterElement = document.getElementById("iits-cart_counter");

// Check if the cart count is available in local storage and update the cart counter
let cartCounter = parseInt(localStorage.getItem("cartCount")) || 0;
updateCounterDisplay();

// Hiding admin section for regular user
const hideAdminSection = adminSection.classList.toggle("d-none");

// Item adding form close button
const closeBtn = document.getElementById("iits-cancelBtn");

// Admin panel function
// Get admin btn
const adminBtn = document.getElementById("iits-adminBtn");

adminBtn.addEventListener("click", () => {
  const uname = prompt("Enter username");
  const pass = prompt("Enter Password");

  // Check username and password
  if (uname === "iits" && pass === "23") {
    // Add item will show when admin will access
    adminSection.classList.remove("d-none");

    // Listening close button click event
    closeBtn.addEventListener("click", () => {
      adminSection.classList.toggle("d-none");
    });
  } else {
    alert("Wrong credentials!");
  }
});

// Fetch items from API and display all items
let requestOptions = {
  method: "GET",
};

fetch("https://64b2e33138e74e386d55b072.mockapi.io/api/hanover", requestOptions)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item) => {
      showItems(item);
    });
  })
  .catch((error) => console.log("error", error));

// Cart button code here
document.querySelector("#iits-items").addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("addToCartBtn")) {
    cartCounter++;
    updateCounterDisplay();
    saveCartCountToLocalStorage();
  }

  if (target.id === "cart_dec") {
    if (cartCounter > 0) {
      cartCounter--;
      updateCounterDisplay();
      saveCartCountToLocalStorage();
    }
  }
});

function updateCounterDisplay() {
  cartCounterElement.textContent = cartCounter;
}

function saveCartCountToLocalStorage() {
  localStorage.setItem("cartCount", cartCounter);
}

// Add new item form handling
const addNewForm = document.getElementById("iits-addNewForm");

addNewForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get form field values
  const name = document.getElementById("name").value.trim();
  const pic = document.getElementById("pic").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const typeItem = document.getElementById("typeItem").value;

  // Validate form fields
  if (!name || !pic || !desc || typeItem === "invalid") {
    alert("Please fill all fields correctly.");
    return;
  }

  // Create a new item object
  const newItem = {
    name,
    url: pic, // Assuming "url" is the correct field for thumbnail image URL
    desc,
    type: typeItem,
  };

  // Add the new item to the UI
  showItems(newItem);

  // Clear the form fields
  addNewForm.reset();
});

// New function to show all items
function showItems(item) {
  const itemElement = document.createElement("div");
  itemElement.classList.add("item", "col-md-6", "col-lg-4", "p-3");
  itemElement.setAttribute("data-category", item.type);

  itemElement.innerHTML = `
    <div class="card">
      <div class="img-container">
        <img src="${item.url || item.pic}" alt=""/>
        <span class="category-pill">${item.type}</span>
      </div>
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text">${item.desc}</p>
        <button class="addToCartBtn btn w-100">Add to cart</button>
      </div>
    </div>`;

  document.querySelector("#iits-items").appendChild(itemElement);
}

// Search functionality
const searchForm = document.getElementById("searchForm");
const searchBox = document.getElementById("iits-searchBox");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchValue = searchBox.value.trim().toLowerCase();
  const items = document.querySelectorAll(".item");

  items.forEach((item) => {
    const itemName = item.querySelector(".card-title").textContent.trim().toLowerCase();
    if (itemName.includes(searchValue)) {
      item.classList.remove("d-none");
    } else {
      item.classList.add("d-none");
    }
  });
});

// Filter functionality
const filterRadioButtons = document.querySelectorAll('input[name="categoryToggle"]');

filterRadioButtons.forEach((radioButton) => {
  radioButton.addEventListener("change", () => {
    const selectedCategory = radioButton.value;
    const items = document.querySelectorAll(".item");

    items.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");

      if (selectedCategory === "all" || itemCategory === selectedCategory) {
        item.classList.remove("d-none");
      } else {
        item.classList.add("d-none");
      }
    });
  });
});

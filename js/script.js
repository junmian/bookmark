const modal = document.getElementById("modal");
const addBookmarkBtn = document.getElementById("show-modal");
const span = document.getElementsByClassName("close-modal")[0];
const websiteName = document.getElementById("website-name");
const websiteUrl = document.getElementById("website-url");
const saveBtn = document.getElementById("save-btn");
const bookmarkForm = document.getElementById("bookmark-form");
const bookmarkGroup = document.getElementById("bookmark-group");
const bookmarkContainer = document.getElementById("bookmark-container");
let errorMsg = document.getElementById("error-msg");
let addedMsg = document.getElementById("added-msg");

let bookmarks = [];

// ----------------- Add Bookmark Modal -------------------- //
// When the user clicks on the button, open the modal.
addBookmarkBtn.onclick = function () {
  modal.style.display = "block";
  websiteName.focus();
  errorMsg.textContent = "";
  addedMsg.textContent = "";
};

// When the user clicks on <span> (x), close the modal.
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it.
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Validate Form
function validateForm(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);

  if (!nameValue || !urlValue) {
    errorMsg.textContent = "Please enter both website name and website URL.";
    addedMsg.textContent = "";
    return false;
  }

  if (!urlValue.match(regex)) {
    errorMsg.textContent = "Please enter a valid website URL.";
    addedMsg.textContent = "";
    return false;
  }
  // Valid
  errorMsg.textContent = "";
  addedMsg.innerHTML = "&#10003; Successfully added!";
  return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
  // Remove all bookmark elements.
  bookmarkContainer.textContent = "";
  // Build items.
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close Icon.
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa-solid", "fa-xmark");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    // Favicon / Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute("src", `https://www.google.com/s2/u/0/favicons?domain=${url}`);
    favicon.setAttribute("alt", "Favicon");
    // Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append to bookmarks container.
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarkContainer.appendChild(item);
  });
}

// Fetch Bookmarks from Local Storage
function fetchBookmarks() {
  // Get bookmarks from localStorage, if available.
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // Create bookmarks array in localStorage.
    bookmarks = [
      {
        name: "Google",
        url: "https://google.com",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// Handle Data from Form
function storeBookmark(event) {
  event.preventDefault();
  const nameValue = websiteName.value;
  let urlValue = websiteUrl.value;
  if (!urlValue.includes("http://", "https://")) {
    urlValue = `https://${urlValue}`;
  }
  // Prevents adding item when values are not validated.
  if (!validateForm(nameValue, urlValue)) {
    return false;
  }
  // validateForm(nameValue, urlValue);
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteName.focus();
}

// Delete Bookmark
function deleteBookmark(url) {
  // Loop through the bookmarks array.
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  // Update bookmarks array in localStorage, re-populate DOM.
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

// Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();

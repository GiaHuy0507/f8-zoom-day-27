const $ = document.querySelector.bind(document);

const editor = $("#code-editor");
const preview = $("#preview");
const contextMenu = $("#context-menu");
const deleteBtn = $("#delete-code");

// 1. LIVE PREVIEW

function updatePreview() {
  preview.srcdoc = editor.value;
}

// Khi nhập code thì cập nhật preview
editor.addEventListener("input", updatePreview);

updatePreview();

// 2. CẢNH BÁO KHI RELOAD HOẶC ĐÓNG TAB

window.addEventListener("beforeunload", function (e) {
  // Chỉ cảnh báo khi editor có code
  if (editor.value.trim() !== "") {
    e.preventDefault();
  }
});

// 3. HIỂN THỊ CONTEXT MENU

document.addEventListener("contextmenu", function (e) {
  if (e.shiftKey) {
    return;
  }

  e.preventDefault();

  contextMenu.classList.add("show");

  // Lấy kích thước menu
  const menuWidth = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;

  // Lấy kích thước viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Vị trí chuột
  let x = e.clientX;
  let y = e.clientY;

  // Nếu menu vượt cạnh phải thì hiển thị sang trái con trỏ
  if (x + menuWidth > viewportWidth) {
    x = x - menuWidth;
  }

  // Nếu menu vượt cạnh dưới thì hiển thị lên trên con trỏ
  if (y + menuHeight > viewportHeight) {
    y = y - menuHeight;
  }

  // Đảm bảo menu không vượt cạnh trái/trên
  x = Math.max(0, x);
  y = Math.max(0, y);

  // Đặt vị trí menu
  contextMenu.style.left = x + "px";
  contextMenu.style.top = y + "px";
});

// 4. XÓA CODE

deleteBtn.addEventListener("click", function () {
  editor.value = "";
  preview.srcdoc = "";

  contextMenu.classList.remove("show");
});

// 5. ẨN CONTEXT MENU

// Click ra ngoài (hoặc vào item trong menu)
document.addEventListener("click", function (e) {
  if (!contextMenu.contains(e.target)) {
    contextMenu.classList.remove("show");
  }
});

// Nhấn Escape thì ẩn menu
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    contextMenu.classList.remove("show");
  }
});

// Cuộn trang thì ẩn menu
window.addEventListener(
  "scroll",
  function () {
    contextMenu.classList.remove("show");
  },
  true,
);

// Thay đổi kích thước cửa sổ thì ẩn
window.addEventListener("resize", function () {
  contextMenu.classList.remove("show");
});

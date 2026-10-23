// Khởi tạo biến
const slides = document.querySelectorAll(".slide-item");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const paginationContainer = document.querySelector(".pagination");

let currentIndex = 0;
let isAnimating = false;
const totalSlides = slides.length;

// 1. Khởi tạo các nút pagination động theo số lượng slide
function initPagination() {
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("pagination-item");
    if (index === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      if (isAnimating || index === currentIndex) return;
      const direction = index > currentIndex ? "next" : "prev";
      showSlide(index, direction);
    });

    paginationContainer.appendChild(dot);
  });
}

// Cập nhật trạng thái active của pagination
function updatePagination() {
  const dots = paginationContainer.querySelectorAll(".pagination-item");
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// 2. Hàm chuyển slide chính
function showSlide(index, direction) {
  if (isAnimating || index === currentIndex) {
    return;
  }

  isAnimating = true;

  const currentSlide = slides[currentIndex];
  const nextSlide = slides[index];

  slides.forEach((slide) => {
    slide.classList.remove("prev", "next", "active");
  });

  if (direction === "next") {
    // Đặt vị trí ban đầu cho slide tiếp theo ở bên phải )
    nextSlide.classList.add("next");
    nextSlide.offsetWidth; // ghi nhận vị trí ban đầu

    // Chuyển slide hiện tại sang trái, slide mới vào giữa active
    currentSlide.classList.add("prev");
    nextSlide.classList.remove("next");
    nextSlide.classList.add("active");
  } else {
    // Đặt vị trí ban đầu cho slide tiếp theo ở bên trái )
    nextSlide.classList.add("prev");
    nextSlide.offsetWidth; //

    // Chuyển slide hiện tại sang phải, slide mới vào giữa active
    currentSlide.classList.add("next");
    nextSlide.classList.remove("prev");
    nextSlide.classList.add("active");
  }

  const oldIndex = currentIndex;
  currentIndex = index;
  updatePagination();

  // Lắng nghe kết thúc transition trên slide hiện tại (currentSlide)
  currentSlide.addEventListener(
    "transitionend",
    function handleTransitionEnd(e) {
      if (e.propertyName !== "transform") return;

      currentSlide.classList.remove("prev", "next");

      isAnimating = false;

      // Tạo Custom Event báo hiệu đã đổi slide thành công
      const event = new CustomEvent("slideshow:change", {
        detail: {
          old: currentSlide,
          current: nextSlide,
          oldIndex: oldIndex,
          currentIndex: currentIndex,
        },
      });

      document.dispatchEvent(event);
    },
    { once: true },
  );
}

// 3. Sự kiện bấm nút Next / Prev
nextBtn.addEventListener("click", () => {
  if (isAnimating) return;
  const nextIndex = (currentIndex + 1) % totalSlides;
  showSlide(nextIndex, "next");
});

prevBtn.addEventListener("click", () => {
  if (isAnimating) return;
  const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  showSlide(prevIndex, "prev");
});

initPagination();

document.addEventListener("slideshow:change", function (e) {
  console.log(
    `Đã chuyển từ slide ${e.detail.oldIndex} sang slide ${e.detail.currentIndex}`,
  );
});

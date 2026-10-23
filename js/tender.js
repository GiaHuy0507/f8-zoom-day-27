const deck = document.getElementById("card-deck");
const emptyState = document.getElementById("empty-state");
const likedCountText = document.getElementById("liked-count");
const dislikedCountText = document.getElementById("disliked-count");
const btnLike = document.getElementById("action-like");
const btnDislike = document.getElementById("action-dislike");
const btnReload = document.getElementById("btn-reload");

// KHỞI TẠO DỮ LIỆU
const initialPlayers = [
  {
    id: 1,
    name: "Trường Giang",
    age: 43,
    bio: "Thích cà phê acoustic, du lịch khám phá và mèo béo 🐱",
    tags: ["Âm nhạc", "Du lịch", "Cà phê"],
    avatar:
      "https://hosongoisao.com/wp-content/uploads/2025/01/truong-giang-56-1704913245711242412702-1.webp?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Nhã Phương",
    age: 36,
    bio: "Thích ông chã Giang, cà phê",
    tags: ["Ca hát", "Fitness", "Hiking"],
    avatar:
      "https://cdn-i.vtcnews.vn/resize/th/upload/2023/11/12/phuong2-14023603.png?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Thiên An",
    age: 23,
    bio: "Mê chụp ảnh film, bảo tàng nghệ thuật và món ăn vặt Sài Gòn ✨",
    tags: ["Nghệ thuật", "J97", "Ẩm thực"],
    avatar:
      "https://cdn-i.doisongphapluat.com.vn/resize/th/upload/2025/09/18/thien-an-1-08385951.png?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Phương Tuấn",
    age: 29,
    bio: "Singer. Sống hướng nội nhưng thích nói chuyện sâu sắc ☕",
    tags: ["Thiên An", "Sáng tác", "Ca hát"],
    avatar:
      "https://symbols.vn/wp-content/uploads/2022/02/Hinh-Jack-Cuoi-dep-trai-nhat.jpg?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    name: "Hà My",
    age: 21,
    bio: "Học ngoại giao, đam mê ngôn ngữ và luôn có playlist hay cho mọi tâm trạng 🎵",
    tags: ["Ngôn ngữ", "Podcasts", "Chill"],
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
  },
];

let players = [...initialPlayers];
const disliked = [];
const liked = [];

// NGƯỠNG QUẸT

const swipeThreshold = 50; // Quẹt >= 50px mới tính là quẹt qua thẻ khác

function updateCounters() {
  likedCountText.innerText = liked.length;
  dislikedCountText.innerText = disliked.length;
}

// RENDER DANH SÁCH CARD

function createCardElement(player, index) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = player.id;

  // Xếp các thẻ: Thẻ trên cùng nằm ngoài cùng
  const stackOffset = Math.min(index, 3) * 4;
  const stackScale = 1 - Math.min(index, 3) * 0.03;
  card.style.transform = `translateY(${stackOffset}px) scale(${stackScale})`;
  card.style.zIndex = 100 - index;

  card.innerHTML = `
        <div class="card-img-wrap">
          <img class="card-img" src="${player.avatar}" alt="${player.name}" loading="lazy" />
          <div class="card-gradient"></div>
          <div class="card-tint"></div>
          
          <div class="stamp stamp-like">THÍCH</div>
          <div class="stamp stamp-nope">BỎ QUA</div>

          <div class="card-info">
            <h2>${player.name} <span>${player.age}</span></h2>
            <p class="bio">${player.bio}</p>
            <div class="tags">
              ${player.tags.map((tag) => `<span class="tag-item">#${tag}</span>`).join("")}
            </div>
          </div>
        </div>
      `;

  return card;
}

function renderDeck() {
  // Dọn dẹp card cũ
  const oldCards = deck.querySelectorAll(".card");
  oldCards.forEach((c) => c.remove());

  if (players.length === 0) {
    emptyState.classList.add("show");
    return;
  }

  emptyState.classList.remove("show");

  // Render từ cuối lên đầu để thẻ đầu tiên nằm trên cùng DOM
  for (let i = players.length - 1; i >= 0; i--) {
    const card = createCardElement(players[i], i);
    deck.appendChild(card);
  }

  // Kích hoạt sự kiện quẹt cho thẻ trên cùng
  attachSwipeToTopCard();
}

// XỬ LÝ QUẸT & HIỆU ỨNG TONE MÀU

function attachSwipeToTopCard() {
  const topCard = deck.querySelector(".card:last-of-type");
  if (!topCard) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  const tint = topCard.querySelector(".card-tint");
  const stampLike = topCard.querySelector(".stamp-like");
  const stampNope = topCard.querySelector(".stamp-nope");

  function onStart(e) {
    isDragging = true;
    topCard.style.transition = "none"; // Bỏ transition khi đang kéo tay/chuột

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;
  }

  function onMove(e) {
    if (!isDragging) return;

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    currentX = clientX - startX;
    currentY = clientY - startY;

    // Góc xoay nghiêng tỷ lệ thuận với quãng đường vuốt
    const rotate = currentX * 0.08;
    topCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;

    //Đổi màu theo tone Đỏ (quẹt trái) hoặc Xanh (quẹt phải)
    const progress = Math.min(Math.abs(currentX) / 120, 1);

    if (currentX > 0) {
      // Sang phải => Tone Xanh lá
      tint.style.backgroundColor = "rgba(32, 201, 151, 0.45)";
      tint.style.opacity = progress;
      stampLike.style.opacity = progress;
      stampNope.style.opacity = 0;
    } else if (currentX < 0) {
      // Sang trái => Tone Đỏ
      tint.style.backgroundColor = "rgba(255, 71, 87, 0.45)";
      tint.style.opacity = progress;
      stampNope.style.opacity = progress;
      stampLike.style.opacity = 0;
    } else {
      tint.style.opacity = 0;
      stampLike.style.opacity = 0;
      stampNope.style.opacity = 0;
    }
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;

    // Kiểm tra ngưỡng swipeThreshold
    if (Math.abs(currentX) >= swipeThreshold) {
      const isLike = currentX > 0;
      dismissCard(topCard, isLike ? "right" : "left");
    } else {
      // Chưa đạt ngưỡng -> Quay về vị trí ban đầu
      topCard.style.transition =
        "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      topCard.style.transform = "translate(0px, 0px) rotate(0deg)";
      tint.style.opacity = 0;
      stampLike.style.opacity = 0;
      stampNope.style.opacity = 0;
    }
  }

  // Hỗ trợ Touch (Mobile)
  topCard.addEventListener("touchstart", onStart, { passive: true });
  topCard.addEventListener("touchmove", onMove, { passive: true });
  topCard.addEventListener("touchend", onEnd);

  // Hỗ trợ Mouse (Desktop)
  topCard.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);
}

// RỜI KHỎI VIEWPORT & XÓA KHỎI DOM

function dismissCard(cardElement, direction) {
  const isLike = direction === "right";
  const flyDistance = window.innerWidth * 1.3;
  const targetX = isLike ? flyDistance : -flyDistance;
  const targetRotate = isLike ? 35 : -35;

  // Card bay ra khỏi viewport
  cardElement.style.transition =
    "transform 0.45s ease-out, opacity 0.45s ease-out";
  cardElement.style.transform = `translate(${targetX}px, ${targetX * 0.2}px) rotate(${targetRotate}deg)`;
  cardElement.style.opacity = "0";

  // Lấy player hiện tại
  const removedPlayer = players.shift();

  if (isLike) {
    liked.push(removedPlayer);
  } else {
    disliked.push(removedPlayer);
  }
  updateCounters();

  // Sử dụng transitionend để dọn dẹp khỏi DOM ngay khi hiệu ứng kết thúc
  cardElement.addEventListener("transitionend", function handleDismiss(e) {
    if (e.propertyName === "transform") {
      cardElement.removeEventListener("transitionend", handleDismiss);
      cardElement.remove();

      updateRemainingCardStyles();
      attachSwipeToTopCard();
    }
  });
}

// Điều chỉnh lại vị trí nổi lên của các card bên dưới
function updateRemainingCardStyles() {
  const remainingCards = deck.querySelectorAll(".card");
  if (remainingCards.length === 0) {
    emptyState.classList.add("show");
    return;
  }

  remainingCards.forEach((card, idx) => {
    // Thứ tự trong DOM: phần tử cuối cùng là trên cùng
    const indexFromTop = remainingCards.length - 1 - idx;
    const stackOffset = Math.min(indexFromTop, 3) * 4;
    const stackScale = 1 - Math.min(indexFromTop, 3) * 0.03;

    card.style.transition = "transform 0.3s ease";
    card.style.transform = `translateY(${stackOffset}px) scale(${stackScale})`;
  });
}

// NÚT BẤM DƯỚI THANH ĐIỀU KHIỂN

function swipeTopCardByButton(direction) {
  const topCard = deck.querySelector(".card:last-of-type");
  if (!topCard) return;

  const tint = topCard.querySelector(".card-tint");
  const stamp = topCard.querySelector(
    direction === "right" ? ".stamp-like" : ".stamp-nope",
  );

  if (direction === "right") {
    tint.style.backgroundColor = "rgba(32, 201, 151, 0.45)";
  } else {
    tint.style.backgroundColor = "rgba(255, 71, 87, 0.45)";
  }
  tint.style.opacity = 0.8;
  stamp.style.opacity = 1;

  dismissCard(topCard, direction);
}

btnLike.addEventListener("click", () => swipeTopCardByButton("right"));
btnDislike.addEventListener("click", () => swipeTopCardByButton("left"));

// Reset lại toàn bộ
btnReload.addEventListener("click", () => {
  players = [...initialPlayers];
  liked.length = 0;
  disliked.length = 0;
  updateCounters();
  renderDeck();
});

// Khởi chạy ban đầu
renderDeck();

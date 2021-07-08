// Your city
const headerCityButton = document.querySelector(".header__city-button");

headerCityButton.textContent =
  localStorage.getItem("lamoda-location") || "Ваш город?";

headerCityButton.addEventListener("click", () => {
  const city = prompt("Укажите ваш город");
  headerCityButton.textContent = city;
  localStorage.setItem("lamoda-location", city);
});

// block scroll - universal functions
const disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth;

  document.body.dbScrollY = window.scrollY;

  document.body.style.cssText = `
  position: fixed;
  top: ${-window.scrollY}px;
  left: 0;
  width: 100%;
  heigth: 100vh;
  overflow: hidden;
  padding-right: ${widthScroll}px;
  `;
};
const enableScroll = () => {
  document.body.style.cssText = "";
  window.scroll({
    top: document.body.dbScrollY,
  });
};

// modal windows

const subheaderСart = document.querySelector(".subheader__cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartBtnClose = document.querySelector(".cart__btn-close");

const cartModalOpen = () => {
  cartOverlay.classList.add("cart-overlay-open");
  disableScroll();
};

const cartModalClose = () => {
  cartOverlay.classList.remove("cart-overlay-open");
  enableScroll();
};

// database request universal function to get data or get error

const getData = async () => {
  const data = await fetch("db2.json");

  if (data.ok) {
    return data.json();
  } else {
    throw new Error(
      `Данные не были получены, ошибка ${data.status} ${data.statusText}`
    );
  }
};

const getGoods = (callback) => {
  getData()
    .then((data) => {
      callback(data);
    })
    .catch((err) => {
      console.error(err);
    });
};

getGoods((data) => {
  console.warn(data);
});

// getData().then(
//   (data) => {
//     console.log(data);
//   },
//   (err) => {
//     console.err(err);
//   }
// );

// Close modal windows by escape
document.addEventListener("keydown", (event) => {
  const keyCode = event.code;
  if (
    keyCode == "Escape" &&
    cartOverlay.classList.contains("cart-overlay-open")
  ) {
    cartModalClose();
  }
});

cartOverlay.addEventListener("click", (event) => {
  const target = event.target;
  if (
    target.classList.contains("cart__btn-close") ||
    target.matches(".cart-overlay")
  ) {
    cartModalClose();
  }
});

subheaderСart.addEventListener("click", cartModalOpen);

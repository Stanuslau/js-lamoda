// Your city
const headerCityButton = document.querySelector(".header__city-button");

let hash = location.hash.substring(1);

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
  const data = await fetch("db.json");

  if (data.ok) {
    return data.json();
  } else {
    throw new Error(
      `Данные не были получены, ошибка ${data.status} ${data.statusText}`
    );
  }
};

const getGoods = (callback, value) => {
  getData()
    .then((data) => {
      if (value) {
        callback(data.filter((item) => item.category === value));
      } else {
        callback(data);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// getGoods((data) => {
//   console.warn(data);
// });

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

try {
  const goodsList = document.querySelector(".goods__list");
  if (!goodsList) {
    throw Error("This is not a goods page");
  }

  const createCard = ({ id, preview, cost, brand, name, sizes }) => {
    const li = document.createElement("li");
    li.classList.add("goods__item");
    li.innerHTML = `
      <article class="good">
          <a class="good__link-img" href="card-good.html#${id}">
              <img class="good__img" src="goods-image/${preview}" alt="">
          </a>
          <div class="good__description">
              <p class="good__price">${cost} &#8381;</p>
              <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
              ${
                sizes
                  ? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(
                      " "
                    )}</span>
              </p>`
                  : ""
              }
              <a class="good__link" href="card-good.html#${id}">Подробнее</a>
          </div>
      </article>
    `;
    return li;
  };

  const renderGoodsList = (data) => {
    // goodsList.innerHTML = ``;
    goodsList.textContent = "";
    data.forEach((item) => {
      const card = createCard(item);
      goodsList.append(card);
    });
  };

  window.addEventListener("hashchange", () => {
    // change goods__title with changing page
    const navLink = document.querySelectorAll(
      `a[href='${location.pathname.substring(1)}${location.hash}']`
    );
    const goodsTitle = document.querySelector(".goods__title");
    goodsTitle.innerHTML = `${navLink[0].innerHTML}`;

    // render page according to has + change hash every time you changes a page
    hash = location.hash.substring(1);
    getGoods(renderGoodsList, hash);
  });
  getGoods(renderGoodsList, hash);
} catch (err) {
  console.warn(err);
}

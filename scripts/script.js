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

const getGoods = (callback, prop, value) => {
  getData()
    .then((data) => {
      if (value) {
        callback(data.filter((item) => item[prop] === value));
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

// goods page
try {
  const goodsList = document.querySelector(".goods__list");
  if (!goodsList) {
    throw Error("This is not a goods page");
  }

  const goodsTitle = document.querySelector(".goods__title");
  const changeTitle = () => {
    goodsTitle.textContent = document.querySelector(
      `[href*="#${hash}"]`
    ).textContent;
  };

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

  // render page according to has + change hash every time you changes a page
  window.addEventListener("hashchange", () => {
    hash = location.hash.substring(1);
    getGoods(renderGoodsList, "category", hash);
    changeTitle();
  });

  getGoods(renderGoodsList, "category", hash);
} catch (err) {
  console.warn(err);
}

// product page

try {
  const cardGood = document.querySelector(".card-good");
  if (!cardGood) {
    throw Error("It's not a product page!");
  }

  const cardGoodImage = document.querySelector(".card-good__image");
  const cardGoodBrand = document.querySelector(".card-good__brand");
  const cardGoodTitle = document.querySelector(".card-good__title");
  const cardGoodPrice = document.querySelector(".card-good__price");
  const cardGoodSelectWrapper = document.querySelectorAll(
    ".card-good__select__wrapper"
  );
  const cardGoodColor = document.querySelector(".card-good__color");
  const cardGoodColorList = document.querySelector(".card-good__color-list");
  const cardGoodSizes = document.querySelector(".card-good__sizes");
  const cardGoodSizesList = document.querySelector(".card-good__sizes-list");
  const cardGoodBuy = document.querySelector(".card-good__buy");

  const generateList = (data) =>
    data.reduce(
      (html, item, index) =>
        html + `<li class="card-good__select-item" data-id=${i}>${item}</li>`,
      ""
    );

  const renderCardGood = ([{ brand, name, cost, color, sizes, photo }]) => {
    cardGoodImage.src = `goods-image/${photo}`;
    cardGoodImage.alt = `${brand} + ${name}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} ₽`;

    if (color) {
      cardGoodColor.textContent = color[0];
      cardGoodColor.dataset.id = 0;
      cardGoodColorList.innerHTML = generateList(color);
    } else {
      cardGoodColor.style.display = "none";
    }

    if (sizes) {
      cardGoodSizes.textContent = sizes[0];
      cardGoodSizes.dataset.id = 0;
      cardGoodSizesList.innerHTML = generateList(sizes);
    } else {
      cardGoodSizes.style.display = "none";
    }
  };

  cardGoodSelectWrapper.forEach((item) => {
    item.addEventListener("click", (e) => {
      const target = e.target;

      if (target.closest(".card-good__select")) {
        target.classList.toggle("card-good__select__open");
      }

      if (target.closest(".card-good__select-item")) {
        const cardGoodSelect = item.querySelector(".card-good__select");
        cardGoodSelect.classList.remove("card-good__select__open");
        cardGoodSelect.textContent = target.textContent;
        cardGoodSelect.dataset.id = target.dataset.id;
      }
    });
  });
  cardGoodSelectWrapper;
  getGoods(renderCardGood, "id", hash);
} catch (err) {
  console.warn(err);
}

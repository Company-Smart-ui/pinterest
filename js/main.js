window.addEventListener('load', function() {

  const __API_URL = 'https://rwizthi03a.execute-api.eu-west-3.amazonaws.com/dev';
  const __API_URL_TEST = '/pinterest/js/products.json';
  const __PRODUCTS_LIMIT = 300;

  let globalProducts = null;
  let globalProductsCache = null;

  let searchDebouncetimer;
  
  try {



    const textMain = document.querySelector('.sliderText');
    const headerBurger = document.querySelector('.header__burger');
    const headerNav = document.querySelector('.header__nav');
    const photoGrid = document.querySelector('.photoGrid');
    const loader = document.querySelector('.loader');
    const productsSearch = document.querySelector('#products_search');
    const clearSearch = document.querySelector('#clear_search');
    

    let text_slider_params = {
      slidesPerView: 1,
      speed: 200,
      effect: 'fade',
      autoplay: {
        delay: 401100,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        renderBullet: function (index, className) {
          return `<div class="${className} bullet"></div>`;
        },
      }
    };


    new Swiper(textMain, text_slider_params);

    headerBurger.addEventListener('click', function() {
      if (headerNav.classList.contains('active')) {
        document.body.classList.remove('no-scroll');
        headerNav.classList.remove('active')
      } else {
        document.body.classList.add('no-scroll');
        headerNav.classList.add('active')
      }
    });

    

    if (productsSearch) {
      productsSearch.addEventListener('input', e => {
        clearTimeout(searchDebouncetimer);
        let fn = search.bind(e.target);
        searchDebouncetimer = setTimeout(fn, 600);   
        
        if (e.target.value) {
          clearSearch.classList.remove('dn');
        } else {
          clearSearch.classList.add('dn');
        }
      });

      clearSearch.addEventListener('click', function() {
        if (productsSearch.value) {
          productsSearch.value = '';
          clearSearch.classList.add('dn');
          render(globalProducts, photoGrid);
        }        
      });
    }

    

    

    getProducts()
      .then(({products}) => {
        globalProducts = products;
        globalProductsCache = products;

        render(products, photoGrid);
      })
      .catch(err => {
        loader.remove();
        alert(err);        
      })





    // utils

    function render(products, wrapper) {
      let counter = 1;
      let productsList = '';

      products.map((item, i) => {       
        if (i >= __PRODUCTS_LIMIT) return false;

        let product = createCard(item, counter);

        counter < 7 ? counter++ : counter = 1;

        productsList += product;
        
      });

      wrapper.innerHTML = productsList;
    }

    function createCard(item, counter) {
      const name = item.name || 'Product';
      const brand = item.brand || 'Brand';
      const image = item.image || './img/placeholder.png';
      const price = item.offers.price || '--.--';
      const lowPrice = item.offers.lowPrice;
      const highPrice = item.offers.highPrice;
      let currency;
      let priceBlock;     

      if (item.offers.priceCurrency == 'EUR') {
        currency = '€';
      } else if (item.offers.priceCurrency == 'USD') {
        currency = '$';
      }

      if (lowPrice && highPrice) {
        priceBlock = `
          <div class="price">
            <span class="lowPrice">${currency} ${lowPrice}</span>
            <span class="highPrice">${currency} ${highPrice}</span>
          </div>`;
      } else {
        priceBlock = `
          <div class="price">
            <span>${currency} ${price}</span>
          </div>`;
      }

      let product = `
        <button class="card button level-${counter}" onclick="window.open('${item['@id']}', '_blank')">
          <img class="lazyload" width="236" height="236" data-src="${image}" src="./img/placeholder.png" alt="${name}">
          <div class="caption">
            <p class="name">${name}</p>
            <p class="brand">${brand}</p>
          </div>
          ${priceBlock}
        </button>
      `;

      return product;
    }

    function search() {
      const val = this.value;

      if (val) {
        let newProducts = globalProducts.filter(item => item.name.toLowerCase().indexOf(val.toLowerCase()) > 0);

        if (newProducts.length) {
          render(newProducts, photoGrid);
        } else {
          photoGrid.innerHTML = 'Not found...';
        }
      } else {
        render(globalProducts, photoGrid);
      }
    }

    async function getProducts() {
      const response = await fetch(__API_URL_TEST);
      const data = await response.json();

      return data;
    };












  } catch(err) {
    console.warn(err);
  }


});
window.addEventListener('load', function() {

  //conf
  const __API_URL = 'https://rwizthi03a.execute-api.eu-west-3.amazonaws.com/dev';
  const __API_URL_TEST = '/js/products.json';
  const __API_URL_GITHUB = '/pinterest/js/products.json';
  const __PRODUCTS_LIMIT = 300;
  const __DEBOUNCE_DELAY = 600;

  let globalProducts = null;
  let searchDebouncetimer;
  

  //wrapper
  try {
    const headerBurger = document.querySelector('.header__burger');
    const headerNav = document.querySelector('.header__nav');
    const photoGrid = document.querySelector('.photoGrid');
    const loader = document.querySelector('.loader');
    const productsSearch = document.querySelector('#products_search');
    const clearSearch = document.querySelector('#clear_search');
    let {pathname: __PATH, search: __QUERY} = location;



    // handlers
    if (headerBurger) {
      headerBurger.addEventListener('click', function() {
        if (headerNav.classList.contains('active')) {
          document.body.classList.remove('no-scroll');
          headerNav.classList.remove('active');
        } else {
          document.body.classList.add('no-scroll');
          headerNav.classList.add('active');
        }
      });
    }    

    if (productsSearch) {
      productsSearch.addEventListener('input', e => {
        clearTimeout(searchDebouncetimer);
        let fn = search.bind(null, e.target.value);
        searchDebouncetimer = setTimeout(fn, __DEBOUNCE_DELAY);   
        
        if (e.target.value) clearSearch.classList.remove('dn');
        else clearSearch.classList.add('dn');
      });

      clearSearch.addEventListener('click', function() {
        if (productsSearch.value) {
          productsSearch.value = '';
          clearSearch.classList.add('dn');
          render(globalProducts, photoGrid);
        }        
      });
    }
    

    
    // fetching products
    getProducts()
      .then(({products}) => {
        globalProducts = products;

        //trigger search if already has query
        if (__PATH.indexOf('search') >= 0) {
          if (__QUERY) {
            const query = __QUERY.split('=')[1];
    
            try {          
              productsSearch.value = query;
              clearSearch.classList.remove('dn');
              search(query);
            } catch(err){
              console.warn(err);
            }
          } else {
            render(products, photoGrid);
          }
        } else {
          render(products, photoGrid);
        }
        
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
      const image = item.image ? item.image.replaceAll('1600', '400') : './img/placeholder.png';
      const price = item.offers.price || '--.--';
      const lowPrice = item.offers.lowPrice;
      const highPrice = item.offers.highPrice;
      let currency;
      let total;     

      if (item.offers.priceCurrency == 'EUR') currency = '€';
      else if (item.offers.priceCurrency == 'USD') currency = '$';

      lowPrice && highPrice ? total = lowPrice : total = price;

      let product = `
        <button class="card button level-${counter}" onclick="window.open('${item['@id']}', '_blank')">
          <div class="cardImage">
            <img class="lazyload" width="236" height="236" data-src="${image}" src="./img/placeholder.png" alt="${name}">
          </div>
          <div class="caption">
            <p class="name">${name}</p>
            <p class="brand">${brand}</p>
          </div>
          <div class="price">
            <span>${currency} ${total}</span>
          </div>
        </button>
      `;

      return product;
    }

    function search(val) {
      if (val) {
        console.log('begin search by', val);
        let newProducts = globalProducts.filter(item => item.name.toLowerCase().indexOf(val.toLowerCase()) > 0);
        if (newProducts.length) render(newProducts, photoGrid); 
        else photoGrid.innerHTML = 'Not found...';
      } 
      else render(globalProducts, photoGrid);
    }

    async function getProducts() {
      const response = await fetch(__API_URL_GITHUB);
      const data = await response.json();

      return data;
    };












  } catch(err) {
    console.warn(err);
  }


});
window.addEventListener('load', function() {
  //conf
  const __API_OPENSEARCH = "https://search-dev-tapscovery-u7upkx7fsf5rokr6a3sw6sgv24.eu-west-3.es.amazonaws.com/products/_search"
  const __PRODUCTS_LIMIT = 50;
  const __DEBOUNCE_DELAY = 600;
  const __AUTOSCROLL_OFFSET = 1000;
  const __AUTOSCROLL_LOADER = true;

  let globalProducts = null;
  let searchDebouncetimer;

  let openSearchHeaders = new Headers();
  openSearchHeaders.append("Content-Type", "application/json");
  openSearchHeaders.append("Authorization", "Basic dGFwc2NvdmVyeTphbjNBcDRQTm1QQVpjN1hA");


  //wrapper
  try {
    const headerBurger = document.querySelector('.header__burger');
    const headerNav = document.querySelector('.header__nav');
    const photoGrid = document.querySelector('.photoGrid');
    const loader = document.querySelector('.loader');
    const productsSearch = document.querySelector('#products_search');
    const clearSearch = document.querySelector('#clear_search');
    const modalCard = document.querySelector('.modal-card');
    const modalTitle = document.querySelector('.modal-card__title');
    const modalDescription = document.querySelector('.modal-card__text');
    const modalImage = document.querySelector('.modal-card__img img');
    const modalShop = document.querySelector('.modal-card__site');
    const modalPrice = document.querySelector('.modal-card__price');
    const modalButton = document.querySelector('.modal-card__button');

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

    // global clicks handler
    document.addEventListener('click', e => {

      if (e.target.closest('.card')) {
        cardClickHandler(e.target.closest('.card'));
      }

      if (e.target.closest('.modal-card__close')) {
        modalProductCloseHandler();  
      }  

    });

    // card detail modal utils begin
    function cardClickHandler(node) {
      if (!node) return;
      
      const nodeOffset = (node.getBoundingClientRect().top + scrollY).toFixed();
      const {id} = node.dataset;
      const [filteredProduct] = globalProducts.filter(({_id}) => _id === id);

      if (filteredProduct._id) {
        const modalData = { title, description, image, shop, price, currency, url } = filteredProduct._source;   
        
        // enable autoscroll to card if scrolled offset more than we set 
        window.scrollY > __AUTOSCROLL_OFFSET ? sessionStorage.setItem('node-offset', nodeOffset) : sessionStorage.setItem('node-offset', '0');

        scroller();
        smoothLoader();  
        showProductModal(modalData);
      }
      
    }

    function modalProductCloseHandler() {
      const nodeOffset = parseInt(sessionStorage.getItem('node-offset'));

      modalTitle.innerHTML = null;
      modalDescription.innerHTML = null;
      modalImage.src = null;
      modalShop.innerHTML = null;
      modalPrice.innerHTML = null;
      modalButton.href = null;

      modalCard.classList.remove('active');      

      if (nodeOffset) {
        scroller(nodeOffset);
        smoothLoader();
        sessionStorage.removeItem('node-offset');
      }
    }

    function showProductModal(modalData) {
      if (!modalData) return;

      const { title, description, image, shop, price, currency, url } = modalData;

      modalTitle.innerHTML = title;
      modalDescription.innerHTML = description;
      modalImage.src = image;
      modalShop.innerHTML = shop;
      modalPrice.innerHTML = `${price} ${currency}`;
      modalButton.href = url;

      modalCard.classList.add('active');
    }   



    // fetching products
    getProducts()
      .then((products) => {
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

      console.log(products.length)
      products.map((item, i) => {
        if (i >= __PRODUCTS_LIMIT) return false;

        const payload = {id: item._id, data: item._source};

        let product = createCard(payload, counter);

        counter < 7 ? counter++ : counter = 1;

        productsList += product;
      });

      wrapper.innerHTML = productsList;
    }

    function createCard({id, data: item}, counter) {
      var title = item.title || ""
      var image = item.image
      var description = item.description;
      var brand = item.brand || ""
      var price = item.price
      var currency = item.currency

      let product = `
      <button class="card button level-${counter}" data-id="${id}">
        <div class="cardImage">
          <img class="lazyload" width="236" height="236" data-src="${image}" src="./img/placeholder.png" alt="${title}">
        </div>
        <div class="caption">
          <p class="name">${title}</p>
          <p class="brand">${brand}</p>
        </div>
        <div class="price">
          <span>${currency} ${price}</span>
        </div>
      </button>
      `;

      return  product;
    }

    async function search(val) {
      if (val) {
        console.log('begin search by', val);
        let newProducts = await getProducts(val)
        if (newProducts.length) render(newProducts, photoGrid);
        else photoGrid.innerHTML = 'Not found...';
      }
      else render(globalProducts, photoGrid);
    }

    async function getProducts(search_term="*", from=1, size=__PRODUCTS_LIMIT) {
      var raw = JSON.stringify({
          "from": from,
          "size": size,
          "query": {
            "query_string": {
              "query": search_term
            }
          }
        })
      var requestOptions = {
        method: 'POST',
        headers: openSearchHeaders,
        body: raw,
        redirect: 'follow'
      };
      const response = await fetch(__API_OPENSEARCH, requestOptions);
      const data = await response.json();

      return data.hits.hits;
    };

    // smooth duration loader
    function smoothLoader() {
      if (__AUTOSCROLL_LOADER) {
        document.body.classList.add('loading');
        setTimeout(() => document.body.classList.remove('loading'), 600);
      } 
    }

    // scroller
    function scroller(offset_top) {
      window.scrollTo({ top: offset_top || 0, behavior: "smooth" });
    }

  } catch(err) {
    console.warn(err);
  }


});

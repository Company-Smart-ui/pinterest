window.addEventListener('load', function() {

  const __API_URL = 'https://rwizthi03a.execute-api.eu-west-3.amazonaws.com/dev';
  const __API_URL_TEST = 'http://w99762ln.beget.tech/pinterest0303/products.json';
  
  try {

    const textMain = document.querySelector('.sliderText');
    const headerBurger = document.querySelector('.header__burger');
    const headerNav = document.querySelector('.header__nav');

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

    async function getProducts() {
      const response = await fetch(__API_URL, {method: 'POST'});
      const data = await response.json();
      return data;
    };

    getProducts()
      .then(data => {
        console.log(data);
      });



  } catch(err) {
    console.warn(err);
  }

});
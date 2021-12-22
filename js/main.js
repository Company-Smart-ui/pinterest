window.addEventListener('load', function() {
  
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



  } catch(err) {
    console.warn(err);
  }

});
$(function () {

    $('.header__btn').on('click', function (){
        $('.rightside-menu').removeClass('rightside-menu--close');
    });
    $('.rightside-menu__close').on('click', function (){
        $('.rightside-menu').addClass('rightside-menu--close');
    });

    $('.header__btn-menu').on('click', function (){
        $('.menu').toggleClass('menu--open');
    });

    if ($(window).width() < 651) {
        $('.works-path__item--tape').appendTo($('.works-path__items-box'));
    }


    $('.top__slider').slick({
        dots:true,
        arrows:false,
        fade:true,
        autoplay: true
    });

    $('.contact-slider').slick({
        slidesToShow: 10,
        slidesToScroll: 10,
        dots:true,
        arrows:false,
        responsive: [
            {
              breakpoint: 1701,
              settings: {
                slidesToShow: 8,
                slidesToScroll: 8,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 1501,
              settings: {
                slidesToShow: 6,
                slidesToScroll: 6
              }
            },
            {
              breakpoint: 1201,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4
              }
            },
            {
                breakpoint: 841,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3
                }
              },
              {
                breakpoint: 551,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              },
              {
                breakpoint: 376,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              },
        ]
    });

    $('.article-slider__box').slick({
        prevArrow: '<button type="button" class="article-slider__arrow article-slider__arrowleft"><img src="./img/icons/icon_arrow_slide_left.svg" alt="arrow left"></button>',
        nextArrow: '<button type="button" class="article-slider__arrow article-slider__arrowright"><img src="./img/icons/icon_arrow_slide_right.svg" alt="arrow right"></button>'
    });



    let mixer = mixitup('.gallery__inner', {
        load: {
            filter: '.category-office-furniture'
        }
    });
})
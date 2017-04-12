var Zalando = {
    //variables
    URL: 'https://api.zalando.com/articles/',
    $PRODUCTS: $('#products'),
    $CATEGORY_LINK: $('.category-link'),
    $PRODUCTS_SECTION: $('.products-section'),
    PRODUCT_DETAIL: 'product-detail',
    $BTN_PREV: $('.btn-prev'),
    LOCAL: JSON.parse(localStorage.getItem('products')) || [],

    //init
    init: function () {
        Zalando.getProducts(false);
        Zalando.onInitTrueFunction(Zalando.$CATEGORY_LINK);
    },
    initSubpageDetail: function () {
        var id = Zalando.getProductId();
        Zalando.getProductDetail(id);
        Zalando.getPreviouslyPage(Zalando.$BTN_PREV);
    },

    initSubpageCart: function () {
        Zalando.getPreviouslyPage(Zalando.$BTN_PREV);
        Zalando.drawCartDetail();
    },

    //function
    /**
     * get products from proper url
     * @param isFilter
     * @param endpoint
     */
    getProducts: function (isFilter, endpoint) {
        var filters = (isFilter == true) ? endpoint : "";
        $.ajax({
            url: Zalando.URL + filters,
            method: 'get',
            dataType: 'JSON',
            headers: {
                'Accept-Language': 'en'
            },
            success: function (response) {
                console.log(response);
                $('.product-link').remove();
                Zalando.getSingleElement(response);
            },
            error: function () {
                alert("Error getting data")
            }
        });
    },

    /**
     * init function when is true (have extra endpoint)
     * @param btn
     */
    onInitTrueFunction: function (btn) {
        btn.on('click', function (e) {
            e.preventDefault();
            Zalando.getProducts(true, Zalando.returnFilteredDataUrl(this));
        })
    },

    /**
     * create proper endpoint by 'param' and 'dataset' functions
     * @param btn
     * @returns {string}
     */
    returnFilteredDataUrl: function (btn) {
        return '?' + $.param(btn.dataset);
    },

    /**
     * get single product after map function
     * @param data
     */
    getSingleElement: function (data) {
        $.map(data.content, function (product) {
            Zalando.renderedMustache(product, Zalando.$PRODUCTS, Zalando.$PRODUCTS_SECTION)
        });
    },

    /**
     * draw products on page content by mustache
     * @param data
     */
    renderedMustache: function (data, addedElement, elementPlace) {
        var template = addedElement.html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        elementPlace.append(rendered);
    },

    /**
     * back to previously page
     * @param btn
     */
    getPreviouslyPage: function (btn) {
        btn.on('click', function () {
            window.history.back();
        })
    },

    //functions to subpage product detail

    /**
     * get product id by window.location.hash method
     * @returns {*}
     */
    getProductId: function () {
        var hash = window.location.hash;
        var id = hash.split('#');
        return id[1];
    },

    /**
     * draw product details
     * @param data
     */
    renderedMustacheProduct: function (data) {
        var template = $('#product-detail').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('.product-detail').html(rendered);
    },

    renderedMustacheOwlCarousel: function (data) {
        var template = $('#owl-carousel').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#owl-product').append(rendered);
    },

    /**
     * get products from proper url
     * @param isFilter
     * @param endpoint
     */
    getProductDetail: function (id) {
        $.ajax({
            url: Zalando.URL + id,
            method: 'get',
            dataType: 'JSON',
            headers: {
                'Accept-Language': 'en'
            },
            success: function (response) {
                console.log(response);
                Zalando.renderedMustacheProduct(response);
                Zalando.renderedMustacheOwlCarousel(response);
                localStorage.setItem('id', JSON.stringify(response.id));
                Zalando.owlCarousel();
                Zalando.owlRefresh();

                //init cart page functions
                Zalando.drawCartDetail();
                Zalando.onPutToCart($('.add-link'));
            },
            error: function () {
                alert("Error getting data");
            }
        });
    },

    /**
     * init carousel and properties
     */
    owlCarousel: function () {
        $('.owl-carousel').owlCarousel({
            items: 1,
            singleItem: true,
            autoplay: true,
            autoplayHoverPause: true,
            dots: false,
            loop: true,
            margin: 10,
            mouseDrag: true,
            nav: true,
            smartSpeed: 1000,
            navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>',
                '<i class="fa fa-chevron-right" aria-hidden="true"></i>']
        });
    },

    owlRefresh: function () {
        $('.owl-carousel').trigger('refresh.owl.carousel');
    },

    /**
     * function on subpage cart
     */
    addProductToCart: function (data) {
        var products = Zalando.LOCAL;
        var productDetails = {
            name: data.name,
            price: data.units[0].price.formatted,
            img: data.media.images[0].thumbnailHdUrl
        };
        products.push(productDetails);
        Zalando.drawCartDetail();
        localStorage.setItem('products', JSON.stringify(products));
    },

    drawCartDetail: function () {
      var products = Zalando.LOCAL;
      var block = '';
        $.map(products, function (item) {
            block += '<div class="cart-product-detail">';
            block += '<span>' + item.name + '</span>';
            block += '<span><img src="' + item.img + '">' + '</img></span>';
            block += '<span>' + item.price + '</span>';
            block += '</div>';
          $('.cart-block').html(block);
      });
    },

    getProductDetailToCart: function (id) {
        $.ajax({
            url: Zalando.URL + id,
            method: 'get',
            dataType: 'JSON',
            headers: {
                'Accept-Language': 'en'
            },
            success: function (response) {
                Zalando.addProductToCart(response);
            },
            error: function () {
                alert("Error getting data");
            }
        });
    },

    onPutToCart: function (btn) {
        btn.on('click', function (e) {
            e.preventDefault();
            var id = localStorage.getItem('id').replace(/['"]+/g, '');
            Zalando.scrollToTop();
            Zalando.getProductDetailToCart(id)
        });
    },

    scrollToTop: function () {
        $("html, body").animate({scrollTop: 0}, "slow");
        // Zalando.showMessage();
    }

    // showMessage: function () {
    //     console.log('jajaj')
    //     $('.cart-message').addClass('show');
    //
    //     setTimeout(function () {
    //         $('.cart-message').removeClass('show');
    //     }, 3000);
    // },


};
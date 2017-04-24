var ProductControl = {
    $OWL_CAROUSEL: $('.owl-carousel'),
    $CART_MODAL: $('.cart-modal'),
    $ADD_LINK: $('.add-link'),

    //Init
    init: function () {
        var id = ProductControl.getProductId();
        ProductControl.getProductDetail(id);
        Zalando.getPreviouslyPage(Zalando.$BTN_PREV);
    },

    //Functions
    /**
     * Get product id by window.location.hash method
     * @returns {*}
     */
    getProductId: function () {
        var hash = window.location.hash;
        var id = hash.split('#');
        return id[1];
    },

    /**
     * Draw product details
     * @param data
     */
    renderedMustacheProduct: function (data) {
        var template = $('#product-detail').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('.product-detail').html(rendered);
    },

    /**
     * Draw owl carousel
     * @param data
     */
    renderedMustacheOwlCarousel: function (data) {
        var template = $('#owl-carousel').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('#owl-product').append(rendered);
    },

    /**
     * Get products from proper url
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
                ProductControl.renderedMustacheProduct(response);
                ProductControl.renderedMustacheOwlCarousel(response);
                localStorage.setItem('id', JSON.stringify(response.id));
                ProductControl.owlCarousel();
                ProductControl.owlRefresh();

                //Init cart page functions
                CartControl.drawCartDetail();
                CartControl.onPutToCart($('.add-link'));
            },
            error: function () {
                alert("Error getting data");
            }
        });
    },

    /**
     * show message after add product to basket
     */
    showMessage: function () {
        ProductControl.$CART_MODAL.addClass('show');

        setTimeout(function () {
            ProductControl.$CART_MODAL.removeClass('show');
        }, 4000);
    },

    activeLoader: function () {
        $('.add-link').css('pointer-events', 'none');
        $('.spinner').removeClass('hide');
    },

    inactiveLoader: function () {
        $('.add-link').css('pointer-events', 'auto');
        $('.spinner').addClass('hide');
    },

    /**
     * Init carousel and properties
     */
    owlCarousel: function () {
        ProductControl.$OWL_CAROUSEL.owlCarousel({
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

    /**
     * Refresh owl after loaded
     */
    owlRefresh: function () {
        ProductControl.$OWL_CAROUSEL.trigger('refresh.owl.carousel');
    }

};
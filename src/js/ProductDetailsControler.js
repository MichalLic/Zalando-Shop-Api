var ProductControl = {

    //init
    initSubpageDetail: function () {
        var id = ProductControl.getProductId();
        ProductControl.getProductDetail(id);
        Zalando.getPreviouslyPage(Zalando.$BTN_PREV);
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

    /**
     * draw owl carousel
     * @param data
     */
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
                ProductControl.renderedMustacheProduct(response);
                ProductControl.renderedMustacheOwlCarousel(response);
                localStorage.setItem('id', JSON.stringify(response.id));
                ProductControl.owlCarousel();
                ProductControl.owlRefresh();

                //init cart page functions
                CartControl.drawCartDetail();
                CartControl.onPutToCart($('.add-link'));
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

    /**
     * refresh owl after loaded
     */
    owlRefresh: function () {
        $('.owl-carousel').trigger('refresh.owl.carousel');
    }

};
var Zalando = {
    //variables
    URL: 'https://api.zalando.com/articles/',
    $PRODUCTS: $('#products'),
    $CATEGORY_LINK: $('.category-link'),
    $PRODUCTS_SECTION: $('.products-section'),
    PRODUCT_DETAIL: 'product-detail',

    //init
    init: function () {
        Zalando.getProducts(false);
        Zalando.onInitTrueFunction(Zalando.$CATEGORY_LINK);
    },
    initDetail: function () {
        var id = Zalando.getProductId();
        Zalando.getProductDetail(id);
        Zalando.owlCarousel();
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
            success: function (response) {
                console.log(response);
                $('.product-link').remove();
                Zalando.getSingleElement(response);
            },
            error: function () {
                alert ("Error getting data")
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
        return  '?' + $.param(btn.dataset);
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


    //functions to subpage
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
     * get products from proper url
     * @param isFilter
     * @param endpoint
     */
    getProductDetail: function (id) {
        $.ajax({
            url: Zalando.URL + id,
            method: 'get',
            dataType: 'JSON',
            success: function (response) {
                    console.log(response);
                    Zalando.renderedMustacheProduct(response)
            },
            error: function () {
                alert ("Error getting data");
            }
        });
    },

    owlCarousel: function () {
        $('.owl-product').owlCarousel({
            items: 1,
            autoPlay: true,
            dots: true,
            loop: true,
            mouseDrag: false,
            nav: true,
            smartSpeed: 1000,
            autoPlayHoverPause: true,
            navText:['kkgkg','kakaka']
        });
    }


};
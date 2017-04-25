var Zalando = {
    //variables
    URL: 'https://api.zalando.com/articles/',
    $PRODUCTS: $('#products'),
    $CATEGORY_LINK: $('.category-link'),
    $PRODUCTS_SECTION: $('.products-section'),
    PRODUCT_DETAIL: 'product-detail',
    $BTN_PREV: $('.btn-prev'),
    PRODUCTS_LOCAL_STORAGE: JSON.parse(localStorage.getItem('products')) || [],

    //Init
    init: function () {
        Zalando.getProducts(false);
        Zalando.onInitTrueFunction(Zalando.$CATEGORY_LINK);
    },

    //Function
    /**
     * get products from proper url
     * @param isFilter
     * @param endpoint
     */
    getProducts: function (isFilter, endpoint) {
        var filters = (isFilter === true) ? endpoint : "";
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
                Filter.init(response)
            },
            error: function () {
                alert("Error getting data")
            }
        });
    },

    /**
     * Init function when is true (have extra endpoint)
     * @param btn
     */
    onInitTrueFunction: function (btn) {
        btn.on('click', function (e) {
            e.preventDefault();
            Zalando.getProducts(true, Zalando.returnFilteredDataUrl(this));
        })
    },

    /**
     * Create proper endpoint by 'param' and 'dataset' functions
     * @param btn
     * @returns {string}
     */
    returnFilteredDataUrl: function (btn) {
        return '?' + $.param(btn.dataset);
    },

    /**
     * Get single product after map function
     * @param data
     */
    getSingleElement: function (data) {
        $.map(data.content, function (product) {
            Zalando.renderedMustache(product, Zalando.$PRODUCTS, Zalando.$PRODUCTS_SECTION)
        });
    },

    /**
     * Draw products on page content by mustache
     * @param data
     */
    renderedMustache: function (data, addedElement, elementPlace) {
        var template = addedElement.html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        elementPlace.append(rendered);
    },

    /**
     * Back to previously page
     * @param btn
     */
    getPreviouslyPage: function (btn) {
        btn.on('click', function () {
            window.history.back();
        })
    },

    /**
     * Scroll page to top
     */
    scrollToTop: function () {
        $("html, body").animate({scrollTop: 0}, "slow");
    },

    refreshProductsCollection: function () {
        Zalando.PRODUCTS_LOCAL_STORAGE = JSON.parse(localStorage.getItem('products'));
    }
};
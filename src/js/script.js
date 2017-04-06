var Zalando = {
    //variables
    URL: 'https://api.zalando.com/articles',
    $CATEGORY_LINK: $('.category-link'),
    $PRODUCT_SECTION: $('.products-section'),

    //init
    init: function () {
        Zalando.getProducts(false);
        Zalando.onInitTrueFunction(Zalando.$CATEGORY_LINK);
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
            Zalando.drawMustache(product);
        });
    },

    /**
     * draw products on page content by mustache
     * @param data
     */
    drawMustache: function (data) {
        var template = $('#products').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        Zalando.$PRODUCT_SECTION.append(rendered);
    }
};

$(document).ready(function () {
    Zalando.init();
});
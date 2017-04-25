var Filter = {

    //variables
    $FILTER_INPUT: $('#filter-input'),
    $PRODUCT_SECTION: $('.products-section'),

    init: function (data) {
        Filter.filterProducts(data);
        Filter.createArrayProducts(data);
    },

    filterProducts: function (products) {
        //init function after enter chars
        Filter.$FILTER_INPUT.on('keyup', function () {
            var inputVal = this.value;
            Filter.$PRODUCT_SECTION.empty();
            if (inputVal !== '') {
                var myRegex = new RegExp(inputVal, 'gi');
                var productArray = Filter.createArrayProducts(products);
                //filter products by single object
                productArray.filter(function (item) {
                    if (item.name.match(myRegex)) {
                        Filter.renderProduct(item);
                    }
                });
            } else {
                Zalando.getSingleElement(products);
            }
        })
    },

    renderProduct: function (data) {
        var template = $('#filter-product').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('.products-section').append(rendered);
    },

    createArrayProducts: function (products) {
        var productArray = new Array;
        $.map(products.content, function (item) {
            productArray.push(item);
        });
        return productArray;
    }
};
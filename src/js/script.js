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
    initSubpageDetail: function () {
        var id = Zalando.getProductId();
        Zalando.getProductDetail(id);
        Zalando.getPreviouslyPage($('.btn-prev'));
    },

    initSubpageCart: function () {
        var id = localStorage.getItem('id').replace(/['"]+/g, '');
        Zalando.getProductDetailToCart(id);
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
            },
            error: function () {
                alert("Error getting data");
            }
        });
    },

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

    getPreviouslyPage: function (btn) {
        btn.on('click', function () {
            window.history.back();
        })
    },


    /**
     * function on subpage cart
     */
    addToCart: function (data) {
        console.log('kskskks');
        var products = JSON.parse(localStorage.getItem('products')) || [];
        console.log(products);
        var productDetails = {
            name: data.name,
            price: data.units[0].price.formatted,
            img: data.media.images[0].thumbnailHdUrl
        };
        console.log(productDetails);
        products.push(productDetails);
        localStorage.setItem('products', JSON.stringify(products));

        $.map(products, function (item) {
            console.log(item);
            var block = '';
            block += '<span>' + item.name + '</span>';
            block += '<span><img src="'+item.img+'">'+ '</img></span>';
            block += item.price;
            $('.cart-section').append(block)
        })
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
                console.log(response);
                Zalando.addToCart(response);
                // Zalando.renderedMustacheToCart(response);
            },
            error: function () {
                alert ("Error getting data");
            }
        });
    }

};
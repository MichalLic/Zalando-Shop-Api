var CartControl = {

    //init
    initSubpageCart: function () {
        Zalando.getPreviouslyPage(Zalando.$BTN_PREV);
        CartControl.drawCartDetail();
    },

    //function in cart page
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
        CartControl.drawCartDetail();
        localStorage.setItem('products', JSON.stringify(products));
    },

    /**
     * draw product detail in cart page
     */
    drawCartDetail: function () {
        var products = Zalando.LOCAL;
        var block = '';
        $.map(products, function (item) {
            block += '<div class="cart-product-detail">';
            block += '<span>' + item.name + '</span>';
            block += '<span><b>' + item.price + '</b></span>';
            block += '<span><img src="' + item.img + '">' + '</img></span>';
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
                CartControl.addProductToCart(response);
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
            CartControl.getProductDetailToCart(id)
        });
    }

};
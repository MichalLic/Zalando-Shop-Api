var CartControl = {

    //Init
    init: function () {
        Zalando.getPreviouslyPage(Zalando.$BTN_PREV);
        CartControl.drawCartDetail();
        CartControl.onRemoveLocalStorageItem($('.btn-remove-item'));
        CartControl.emptyCartMessage();
    },

    //Functions
    /**
     * Function on subpage cart
     */
    addProductToCart: function (data) {
        var products = Zalando.LOCAL;
        console.log(products);
        var productDetails = {
            id: data.id,
            name: data.name,
            price: data.units[0].price.formatted,
            img: data.media.images[0].thumbnailHdUrl
        };
        products.push(productDetails);
        localStorage.setItem('products', JSON.stringify(products));
        CartControl.drawCartDetail();
    },

    /**
     * Draw product detail in cart page
     */
    drawCartDetail: function () {
        var products = Zalando.LOCAL;
        var block = '';
        $.map(products, function (item) {
                block += '<div class="cart-product-detail">';
                block += '<span>' + item.name + '</span>';
                block += '<span><b>' + item.price + '</b></span>';
                block += '<span><img src="' + item.img + '">' + '</img></span>';
                block += '<a href="#" data-id="' + item.id + '" class="btn-remove-item"><i class="fa fa-times" aria-hidden="true"></i></a>';
                block += '</div>';
            });
            $('.cart-block').html(block);
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
    },

    emptyCartMessage: function () {
      if($('.cart-block').is(':empty')){
          $('.cart-block').append('<p class="cart-message-empty">Your cart is currently empty!</p>');
      }
    },

    onRemoveLocalStorageItem: function (btn) {
        btn.on('click', function (e) {
            e.preventDefault();
            var product = Zalando.LOCAL;
            CartControl.drawCartDetail();
            for (var i = 0; i < product.length; i++) {
                console.log(product[i].id);
                if (product[i].id === $(this).attr('data-id')) {
                    // console.log(product.splice(i,1));
                    console.log(this);
                    console.log(product);
                    localStorage.removeItem(product.splice(i, 1));
                    localStorage.setItem('products', JSON.stringify(product));
                    CartControl.drawCartDetail();
                }
            }
        })
    }


};
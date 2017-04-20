var CartControl = {
    $CART_BLOCK: $('.cart-block'),

    //Init
    init: function () {
        Zalando.getPreviouslyPage(Zalando.$BTN_PREV);
        CartControl.drawCartDetail();
        CartControl.onRemoveLocalStorageItem();
        CartControl.removeAllItems();
    },

    //Functions
    /**
     * Function on subpage cart
     */
    addProductToCart: function (data) {
        var productDetails = {
            id: data.id,
            name: data.name,
            price: data.units[0].price.formatted,
            img: data.media.images[0].thumbnailHdUrl
        };
        
        Zalando.PRODUCTS_LOCAL_STORAGE.push(productDetails);
        localStorage.setItem('products', JSON.stringify(Zalando.PRODUCTS_LOCAL_STORAGE));
        CartControl.drawCartDetail();
    },

    /**
     * Draw product detail in cart page
     */
    drawCartDetail: function () {
        var block = '';
        $.map(Zalando.PRODUCTS_LOCAL_STORAGE, function (item) {
            block += '<div class="cart-product-detail">';
            block += '<span>' + item.name + '</span>';
            block += '<span><b>' + item.price + '</b></span>';
            block += '<span><img src="' + item.img + '"></span>';
            block += '<a href="#" data-id="' + item.id + '" class="btn-remove-item"><i class="fa fa-times" aria-hidden="true"></i></a>';
            block += '</div>';
        });
        CartControl.$CART_BLOCK.html(block);
        CartControl.emptyCartMessage();
        if (block != '') {
            CartControl.addRemovedButton();
        } else {
            $('.btn-remove-items').remove();
        }
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
            CartControl.getProductDetailToCart(id);
        });
    },

    emptyCartMessage: function () {
        if (CartControl.$CART_BLOCK.is(':empty')) {
            CartControl.$CART_BLOCK.append('<p class="cart-message-empty">Your basket is currently empty!</p>');
        }
    },

    onRemoveLocalStorageItem: function () {
        CartControl.$CART_BLOCK.on('click', '.btn-remove-item', function (e) {
            e.preventDefault();
            for (var i = 0; i < Zalando.PRODUCTS_LOCAL_STORAGE.length; i++) {
                if (Zalando.PRODUCTS_LOCAL_STORAGE[i].id === $(this).attr('data-id')) {
                    console.log(this);
                    console.log(Zalando.PRODUCTS_LOCAL_STORAGE);
                    localStorage.removeItem(Zalando.PRODUCTS_LOCAL_STORAGE.splice(i, 1));
                    localStorage.setItem('products', JSON.stringify(Zalando.PRODUCTS_LOCAL_STORAGE));
                    CartControl.drawCartDetail();
                }
            }
        })
    },

    addRemovedButton: function () {
        var block = '<a href="#" class="btn-remove-items">Remove all</a>';
        $('.remove-block').html(block);
    },

    removeAllItems: function () {
        $('main').on('click','.btn-remove-items', function (e) {
            e.preventDefault();
            localStorage.setItem('products', JSON.stringify(''));
            Zalando.refreshProductsCollection();
            CartControl.drawCartDetail();
        })
    }


};
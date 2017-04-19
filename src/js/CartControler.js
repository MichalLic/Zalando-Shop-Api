var CartControl = {

    //Init
    init: function () {
        Zalando.getPreviouslyPage(Zalando.$BTN_PREV);
        CartControl.drawCartDetail();
        CartControl.emptyCartMessage();
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
        Zalando.LOCAL.push(productDetails);
        localStorage.setItem('products', JSON.stringify(Zalando.LOCAL));
        CartControl.drawCartDetail();
    },

    /**
     * Draw product detail in cart page
     */
    drawCartDetail: function () {
        var block = '';
        $.map(Zalando.LOCAL, function (item) {
            block += '<div class="cart-product-detail">';
            block += '<span>' + item.name + '</span>';
            block += '<span><b>' + item.price + '</b></span>';
            block += '<span><img src="' + item.img + '">' + '</img></span>';
            block += '<a href="#" data-id="' + item.id + '" class="btn-remove-item"><i class="fa fa-times" aria-hidden="true"></i></a>';
            block += '</div>';
        });
        $('.cart-block').html(block);
        CartControl.onRemoveLocalStorageItem($('.btn-remove-item'));
        CartControl.emptyCartMessage();
        if (block != '') {
            CartControl.addRemovedButton();
        } else {
            $('.btn-remove-items').remove();
        }
        CartControl.removeAllItems($('.btn-remove-items'));
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
        if ($('.cart-block').is(':empty')) {
            $('.cart-block').append('<p class="cart-message-empty">Your basket is currently empty!</p>');
        }
    },

    onRemoveLocalStorageItem: function (btn) {
        btn.on('click', function (e) {
            e.preventDefault();
            for (var i = 0; i < Zalando.LOCAL.length; i++) {
                if (Zalando.LOCAL[i].id === $(this).attr('data-id')) {
                    console.log(this);
                    console.log(Zalando.LOCAL);
                    localStorage.removeItem(Zalando.LOCAL.splice(i, 1));
                    localStorage.setItem('products', JSON.stringify(Zalando.LOCAL));
                    CartControl.drawCartDetail();
                }
            }
        })
    },

    addRemovedButton: function () {
        var block = '<a href="#" class="btn-remove-items">Remove all</a>';
        $('.removed-block').html(block);
    },

    removeAllItems: function (btn) {
        btn.on('click', function (e) {
            e.preventDefault();
            localStorage.setItem('products', JSON.stringify(''));
            Zalando.refreshProductsCollection();
            CartControl.drawCartDetail();
        })
    }


};
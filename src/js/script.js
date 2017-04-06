var Zalando = {
    //variables


    //init
    init: function () {
        Zalando.getProducts();
    },
    //function
    getProducts: function () {
        $.ajax({
            url: 'https://api.zalando.com/articles',
            method: 'get',
            dataType: 'JSON',
            success: function (response) {
                console.log(response);
                Zalando.getSingleElement(response);
            },
            error: function () {
                console.log('upsss')
            }
        });
    },

    getSingleElement: function (data) {
        $.map(data.content, function (product) {
            Zalando.drawMustache(product);
        });
    },

    drawMustache: function (data) {
        var template = $('#template').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('.products-section').append(rendered);
    }


};

$(document).ready(function () {
    Zalando.init();
});
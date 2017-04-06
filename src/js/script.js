var Zalando = {
    //variables


    //init
    init: function () {
        Zalando.getProducts();

    },
    //function
    getProducts: function () {
        $.ajax({
            url: 'https://api.zalando.com/categories',
            method: 'get',
            dataType: 'JSON',
            success: function (response) {
                console.log(response);
                Zalando.drawMustache(response);
            },
            error: function () {
                console.log('upsss')
            }
        });
    },

    drawMustache: function (data) {
        var template = $('#template').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        $('.musta').html(rendered);
    }


};

$(document).ready(function () {
    Zalando.init();
});
function aa (){
    $.ajax({
        url: "https://api.zalando.com/categories",
        method: 'get',
        dataType: 'JSON',
        success: function (response) {
            console.log(response);
        },
        error: function () {
            console.log('upsss')
        }
    });
}
aa();
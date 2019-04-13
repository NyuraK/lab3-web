let api = "http://api.forismatic.com/api/1.0/";
// let api = "http://quotes.rest/quote/random.json";
$.ajaxPrefilter(function(options) {
    if (options.crossDomain && $.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});
$.ajax({
    type: 'GET',
    url: api,
    data: {method: 'getQuote', format : 'json', lang: 'ru'},
    success: [
        function(response) {
            document.write(response.quoteText);
        }
    ],
    dataType: 'json'
});

// let canvas = document.createElement("canvas");
// canvas.width = 300;
// canvas.height = 300;
// let ctx = canvas.getContext("2d");
//
// ctx.fillStyle = "rgb(200,0,0)";
// ctx.fillRect (10, 10, 55, 50);
//
// ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
// ctx.fillRect (30, 30, 55, 50);
//
// document.body.appendChild(canvas);
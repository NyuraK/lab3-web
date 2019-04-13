let api = "http://api.forismatic.com/api/1.0/";
let api_img = "https://source.unsplash.com/random";
// let api_img = "https://api.unsplash.com/photos/random";

$.ajaxPrefilter(function(options) {
    if (options.crossDomain && $.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

function getLines(ctx, text, maxWidth) {
    var words = text.split(' '),
        lines = [],
        line = "";
    if (ctx.measureText(text).width < maxWidth) {
        return [text];
    }
    while (words.length > 0) {
        while (ctx.measureText(words[0]).width >= maxWidth) {
            var tmp = words[0];
            words[0] = tmp.slice(0, -1);
            if (words.length > 1) {
                words[1] = tmp.slice(-1) + words[1];
            } else {
                words.push(tmp.slice(-1));
            }
        }
        if (ctx.measureText(line + words[0]).width < maxWidth) {
            line += words.shift() + " ";
        } else {
            lines.push(line);
            line = "";
        }
        if (words.length === 0) {
            lines.push(line);
        }
    }
    return lines;
}

function f(callback) {
    $.ajax({
        type: 'GET',
        url: api,
        data: {method: 'getQuote', format: 'json', lang: 'ru'},
        success: [
            function (response) {
                callback(response.quoteText);
            }
        ],
        dataType: 'json'
    });
}

function fillContent(canvas, context, text) {
    // let canvas = document.createElement("canvas");
    // let context = canvas.getContext("2d");
    //
    // canvas.width = screen.width;
    // canvas.height = screen.height;
    let fontsize = '16px';
    context.font = fontsize + ' Verdana';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#ccc';
    let lines = getLines(context, text, canvas.width - parseInt(fontsize,0));
    lines.forEach(function(line, i) {
        context.fillText(line, canvas.width / 2, (i + 1) * parseInt(fontsize,0) + canvas.height/3);
    });
    context.restore();

    document.body.appendChild(canvas);
}

f(function(text) {
    processImage(text);
});

function processImage(text) {
    let img = new Image();
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    img.onload = function() {
        canvas.width = screen.width;
        canvas.height = screen.height;
        fitImageToCanvas(img, canvas, ctx, text, fillContent);
    };

    img.src = api_img;
}

const fitImageToCanvas = (image, canvas, canvasContext, text, callback) => {
    const ratio = image.width / image.height;
    let newWidth = canvas.width;
    let newHeight = newWidth / ratio;
    if (newHeight < canvas.height) {
        newHeight = canvas.height;
        newWidth = newHeight * ratio;
    }
    const xOffset = newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0;
    const yOffset =
        newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
    canvasContext.drawImage(image, xOffset, yOffset, newWidth, newHeight);
    callback(canvas, canvasContext, text);
};

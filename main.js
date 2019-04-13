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
    let fontsize = '32px';
    context.font = 'bold ' + fontsize + ' Verdana';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#f1f5f1';
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
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = screen.width;
    canvas.height = screen.height*5/6;
    managePic(canvas, ctx, text);
    // let img = new Image();
    // img.onload = function() {
    //     fitImageToCanvas(img, canvas, ctx, text, fillContent);
    // };
    //
    // img.src = api_img;
}

function managePic(canvas, ctx, text) {
    let images = [];
    for (let i=0; i < 4; i++) {
        images[i] = new Image;
        images[i].onload = function () {
            images[i] = resize(images[i], canvas);
            if (i===0)
                fitImageToCanvas(images[i], canvas, ctx, 0, 0, text, fillContent);
            else if (i===1)
                fitImageToCanvas(images[i], canvas, ctx, images[0].width, 0, text, fillContent);
            else if (i===2)
                fitImageToCanvas(images[i], canvas, ctx, 0, images[0].height, text, fillContent);
            else
                fitImageToCanvas(images[i], canvas, ctx, images[2].width, images[1].height, text, fillContent);
        };
        images[i].src = api_img + '?sig=' + i+100+33*i;
    }
}

// function drawImageRot(img,x,y,width,height,deg){
//
//     var c=document.getElementById("myCanvas");
//     var ctx=c.getContext("2d");
//     var rad = deg * Math.PI / 180;
//
//     ctx.save();
//     ctx.translate(x + width / 2, y + height / 2);
//     ctx.rotate(rad);
//     ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);
//     ctx.restore();
// }
//
// const fitImageToCanvas = (image, canvas) => {
//     const ratio = image.width / image.height;
//     let newWidth = canvas.width/4;
//     let newHeight = newWidth / ratio;
//     if (newHeight < canvas.height/4) {
//         newHeight = canvas.height/4;
//         newWidth = newHeight * ratio;
//     }
//
//     // xOffset += newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0;
//     // yOffset +=
//     //     newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
//     // canvasContext.drawImage(image, xOffset, yOffset, newWidth, newHeight);
//     // callback(canvas, canvasContext, text);
// };

const resize = (image, canvas)=> {
    const ratio = image.width / image.height;
    let newWidth = canvas.width/3;
    let newHeight = newWidth / ratio;
    if (newHeight < canvas.height) {
        newHeight = canvas.height/3;
        newWidth = newHeight * ratio;
    }
    image.width = newWidth;
    image.height = newHeight;
    return image;
};

const fitImageToCanvas = (image, canvas, canvasContext, xOffset, yOffset, text, callback) => {

    xOffset += image.width > canvas.width ? (canvas.width - image.width) / 2 : 0;
    yOffset +=
        image.height > canvas.height ? (canvas.height - image.height) / 2 : 0;
    canvasContext.drawImage(image, xOffset, yOffset,image.width, image.height);
    callback(canvas, canvasContext, text);
};

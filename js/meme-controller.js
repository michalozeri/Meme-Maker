'use strict'


var gElCanvas;
var gCtx;

function onInit() {
    console.log("Hi canvas");
    gElCanvas = document.querySelector('.my-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderImgGallery();
}

function renderCanvas() {
    var meme = getMemeForDisplay()

    drawImgFromlocal(meme.selectedImgId)
}

function renderImgGallery() {
    var images = getImgsForDisplay();
    console.log(images);

    const strHtml = images.map((image) => {
        return `<img src="memes-imgs/${image.url}" alt="" onclick="onCreateMeme(${image.id})"></img>`
    })
    document.querySelector('.images-gallery').innerHTML = strHtml.join('')
}

function onCreateMeme(imgId) {
    createMeme(imgId)
    document.querySelector('.main-container').style.display = 'flex'
        // document.querySelector('.menu-container').hidden = false
    document.querySelector('.images-gallery').style.display = 'none'
    renderCanvas();
}

function drawImgFromlocal(imgId) {
    var meme = getMemeForDisplay()
    var img = new Image()
    img.src = `memes-imgs/${imgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        meme.lines.forEach((line) => {
            var txt = line.txt;
            var font = line.font
            var stroke = line.stroke
            var color = line.color
            var size = line.size;
            var x = line.pos.posX;
            var y = line.pos.posY;
            onDrawText(txt, font, stroke, color, size, x, y);
        })
    }
}

function onAddLine() {
    var elTxt = document.querySelector('[name="text"]');
    elTxt.value = ''
    var txt = document.querySelector('[name="text"]')
    addLine(txt);
    renderCanvas()
}

function onRemoveLine() {
    removeLine();
    renderCanvas();
}

function onChangeFont(fontType) {
    changeFont(fontType);
    renderCanvas();
}

function onUpdateTxt(elTxt) {

    elTxt = document.querySelector('[name="text"]').value;
    updateTxt(elTxt)
    renderCanvas();
}

function onChangeFontColor() {
    var fontColor = document.querySelector('[name="font-color"]').value
    changeFontColor(fontColor)
    renderCanvas();
}

function onChangeStrokeColor() {
    var strokeColor = document.querySelector('[name="stroke-color"]').value
    changestrokeColor(strokeColor)
    renderCanvas();
}

function onChangeFontSize(diff) {
    changeFontSize(diff)
    console.log(diff);
    renderCanvas();
}

function onMoveLineX(align) {
    moveLineX(align)
    renderCanvas();
}

function onMoveLineY(diff) {

    moveLineY(diff)
    renderCanvas();
}

function onDrawText(txt, font, stroke, color, size, x, y) {

    gCtx.lineWidth = 1;
    gCtx.strokeStyle = stroke;
    gCtx.fillStyle = color;
    gCtx.font = `${size}px ${font}`;
    gCtx.fillText(txt, x, y);
    gCtx.strokeText(txt, x, y);
}
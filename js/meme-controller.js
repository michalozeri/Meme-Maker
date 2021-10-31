'use strict'


var gElCanvas;
var gCtx;
var gStartPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

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
        return `<img src="img/${image.url}" alt="" onclick="onCreateMeme(${image.id})"></img>`
    })
    document.querySelector('.images-gallery').innerHTML = strHtml.join('')

    document.querySelector('.images-gallery').style.display = 'grid';
    document.querySelector('.filter-area').style.display = 'flex'
    document.querySelector('footer').style.display = 'block';
    document.querySelector('.main-gallery').style.display = "block"
    document.querySelector('.main-container').style.display = 'none';
}

function onCreateMeme(imgId) {
    createMeme(imgId)
    document.querySelector('.main-container').style.display = 'flex'
    document.querySelector('.main-gallery').style.display = 'none'
    document.querySelector('.filter-area').style.display = 'none'
    document.querySelector('.images-gallery').style.display = 'none'
    document.querySelector('footer').style.display = 'none';
    renderCanvas();
    addListeners()
}

function drawImgFromlocal(imgId) {
    var meme = getMemeForDisplay()
    var img = new Image()
    img.src = `img/${imgId}.jpg`;
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

function onSwitchLine() {
    var meme = getMemeForDisplay();
    switchLine();
    if (meme.selectedLineIdx === meme.lines.length - 1) {
        meme.selectedLineIdx = 0
    } else {
        meme.selectedLineIdx++
    }
    var txt = meme.lines[meme.selectedLineIdx].txt;

    document.querySelector('[placeholder="Add Text Here"]').value = txt

    renderCanvas();
}

function onChangeSpanSize(elSpan) {

    var elSpans = document.querySelectorAll('.filter-by span');
    elSpans.forEach((elSpan) => {
        elSpan.style.fontSize++
    })
}


function onDownloadImg(elLink) {
    var imgContent = gElCanvas.toDataURL('image.jpg"')
    elLink.href = imgContent
}

function onAddLine() {
    var elTxt = document.querySelector('[name="text"]');
    elTxt.value = ''
    var txt = document.querySelector('[name="text"]')
    addLine(txt);
    renderCanvas()
}

function onRemoveLine() {
    var elTxt = document.querySelector('[name="text"]');
    elTxt.value = ''
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
    renderCanvas();
}

function onMoveLineX(align) {
    moveLineX(align)
    renderCanvas();
}


function openMenu(elBtn) {
    document.body.classList.add('menu-open')
    elBtn.style.display = 'none'
}

function closeMenu() {
    document.body.classList.remove('menu-open')
    document.querySelector('.btn-open').style.display = 'block'
}

function onDrawText(txt, font, stroke, color, size, x, y) {

    gCtx.lineWidth = 1;
    gCtx.strokeStyle = stroke;
    gCtx.fillStyle = color;
    gCtx.font = `${size}px ${font}`;
    let txtParms = gCtx.measureText(txt);
    console.log('txtParms.width', txtParms.width);
    //start x , end - x+txtParms.width 
    //start y , end - y + size 
    gCtx.fillText(txt, x, y);
    gCtx.strokeText(txt, x, y);
}
// function onMoveLineY(diff) {

//     moveLineY(diff)
//     renderCanvas();
// }
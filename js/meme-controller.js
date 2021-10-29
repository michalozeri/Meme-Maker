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
        return `<img src="memes-imgs/${image.url}" alt="" onclick="onCreateMeme(${image.id})"></img>`
    })
    document.querySelector('.images-gallery').innerHTML = strHtml.join('')
}

function onCreateMeme(imgId) {
    createMeme(imgId)
    document.querySelector('.main-container').style.display = 'flex'
    document.querySelector('.main-gallery').style.backgroundColor = '#22252c'
    document.querySelector('.filter-area').style.display = 'none'
    document.querySelector('.images-gallery').style.display = 'none'
    renderCanvas();
    addListeners()
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

function isMemeClicked(clickedPos) {
    const meme = getMemeForDisplay()
    const pos = meme.lines[meme.selectedLineIdx].pos;
    const distance = Math.sqrt((pos.posX - clickedPos.x) ** 2 + (pos.posY - clickedPos.y) ** 2)
    console.log(meme.lines[meme.selectedLineIdx].size);
    return distance <= 250;
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    console.log('false');
    if (!isMemeClicked(pos)) return
    console.log('true');
    setMemeDrag(true)
    gStartPos = pos
    console.log(pos);
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const meme = getMemeForDisplay();
    if (meme.isDrag) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        gStartPos = pos
        moveMeme(dx, dy)
        renderCanvas()
        console.log(meme);
    }
}

function onUp() {
    setMemeDrag(false)
    document.body.style.cursor = 'grab'
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
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
    gCtx.measureText((txt).width, x, y);
    gCtx.fillText(txt, x, y);
    gCtx.strokeText(txt, x, y);
}

function onUploadToShare() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg");

    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)

        document.querySelector('.btn-share').innerHTML = `
        <a  href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">  
        Share</a>`
    }
    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData();
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then((url) => {
            console.log('Got back live url:', url);
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}

function onUploadFromDesk(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()

    reader.onload = function(event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    // addImg(img)
}
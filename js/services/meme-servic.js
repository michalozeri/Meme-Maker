'use strict'
const KEY = 'memeDB'

var gMeme;
var gKeywords = { 'happy': 12, 'funny puk': 1 }

var gImgs = [{ id: 1, url: '1.jpg', keywords: ['happy'] },
    { id: 2, url: '2.jpg', keywords: ['happy'] },
    { id: 3, url: '3.jpg', keywords: ['happy'] },
    { id: 4, url: '4.jpg', keywords: ['happy'] },
    { id: 5, url: '5.jpg', keywords: ['happy'] },
    { id: 6, url: '6.jpg', keywords: ['happy'] },
    { id: 7, url: '7.jpg', keywords: ['happy'] },
    { id: 8, url: '8.jpg', keywords: ['happy'] },
    { id: 9, url: '9.jpg', keywords: ['happy'] },
    { id: 10, url: '10.jpg', keywords: ['happy'] },
    { id: 11, url: '11.jpg', keywords: ['happy'] },
    { id: 12, url: '12.jpg', keywords: ['happy'] },
    { id: 13, url: '13.jpg', keywords: ['happy'] },
    { id: 14, url: '14.jpg', keywords: ['happy'] },
    { id: 15, url: '15.jpg', keywords: ['happy'] },
    { id: 16, url: '16.jpg', keywords: ['happy'] },
    { id: 17, url: '17.jpg', keywords: ['happy'] },
    { id: 18, url: '18.jpg', keywords: ['happy'] }
];

function createMeme(imgId) {
    var meme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [{
            txt: '',
            size: 20,
            font: 'Impact',
            align: 'left',
            color: 'white',
            stroke: 'black',
            pos: { posX: 50, posY: 50 }
        }]
    }
    gMeme = meme;
    saveMemeToStorage()
}

function moveLineX(align) {
    if (align === 'left') {
        gMeme.lines[gMeme.selectedLineIdx].pos.posX = 10;
    } else if (align === 'center') {
        gMeme.lines[gMeme.selectedLineIdx].pos.posX = 150;
    } else if (align === 'right') {
        gMeme.lines[gMeme.selectedLineIdx].pos.posX = 280;
    }
    gMeme.lines[gMeme.selectedLineIdx].align = align
    saveMemeToStorage()
}

function changeFont(fontType) {
    gMeme.lines[gMeme.selectedLineIdx].font = fontType;
    saveMemeToStorage()
}

function changestrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].stroke = color;
    saveMemeToStorage()
}

function changeFontColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
    saveMemeToStorage()
}

function changeFontSize(size) {
    gMeme.lines[gMeme.selectedLineIdx].size += size;
    saveMemeToStorage()
}

function moveLineY(posY) {
    gMeme.lines[gMeme.selectedLineIdx].pos.posY += posY;

    saveMemeToStorage()
}

function updateTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
    saveMemeToStorage()
}

function updateImgId(imgId) {
    var imgIdx = gImgs.findIndex((img) => {
        imgId === img.id
    })
    return imgIdx
}

function getMemeForDisplay() {
    return loadFromStorage(KEY)
}

function getImgsForDisplay() {
    return gImgs;
}

function saveMemeToStorage() {
    saveToStorage(KEY, gMeme)
}
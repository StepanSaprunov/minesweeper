import {generateEmptyField} from "./create_field.js"

function generateField(width, height, difficult, x, y){
    let field = [];
    let minesField = [];
    let mines = Math.floor(width*height*0.10*difficult);
    for (let i = 0; i < width; i++) {
        let row = [];
        for (let j = 0; j < height; j++) {
            row.push(0);
            if (x!= i && y!= j){
                minesField.push({
                    x: i, y: j,
                });
            }
            
        }
        field.push(row);
    }
    for (let i = 0; i < mines; i++) {
        let index = Math.floor(Math.random() * minesField.length);
        let c = minesField[index];
        field[c.x][c.y] = 9;
        minesField.splice(index, 1);
    }
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (field[i][j] == 9) continue;
            let counter = 0;
            for (let ii = i-1; ii < i+2; ii++){
                for (let jj = j-1; jj < j + 2; jj++){
                    try {
                        if (field[ii][jj] == 9) counter++;
                    } catch (error) {
                    }
                }
            }
            field[i][j] = counter;
        }
    }
    return field;
}

function openCell(x, y) {
    console.log(x, y, field[x][y]?field[x][y]:"???");
    if (x >= 0 && y>=0 && y <= h && x<=w && !openedCells.includes(`${x}x${y}`)) {
        let type = field[x][y];
        let image = new Image();
        image.addEventListener("load", ()=> {
            context.drawImage(image, x*25, y*25, 25, 25);
            openedCells+=(` ${x}x${y} `);
            console.log('done')
            if (type == 0) {
                for (let i = x-1; i <= x+1; i++){
                    for (let j = y-1; j <= y+1; j++) {
                        openCell(i, j);
                    }
                }
            }
        })
        image.src = `img/opened_cell_${type}.png`;
    }
}


let canvas = document.querySelector("#field");
let context = canvas.getContext("2d");
let firstClick = true;
let field;
let openedCells = "";
let w = document.querySelector("#field-width").value;
let h = document.querySelector("#field-height").value;
let d = document.querySelector("#field-mines").value;

canvas.addEventListener("click", (event)=> {
    let mouseX = event.clientX - (canvas.getBoundingClientRect().x + window.scrollX);
    let mouseY = event.clientY - (canvas.getBoundingClientRect().y + window.scrollY);
    let cellX = Math.floor(mouseX/25);
    let cellY = Math.floor(mouseY/25);
    if (firstClick) {
        field = generateField(w, h, d, cellX, cellY);
        firstClick = false;
    }
    openCell(cellX, cellY);
})

document.querySelector("#field-width").addEventListener("change", ()=> {
    firstClick = true;
    generateEmptyField();
});
document.querySelector("#field-height").addEventListener("change", ()=> {
    firstClick = true;
    generateEmptyField();
});
document.querySelector("#field-mines").addEventListener("change", ()=> {
    firstClick = true;
    generateEmptyField();
});
/* 
    1. Считать информацию со слайдеров
    2. Рассчитать размеры ячеек
    3. Рассчитать размеры канваса
    4. Сгенерировать поле
    5. Нарисовать поле
*/

function generateMines(width, height, difficult){
    let field = [];
    let minesField = [];
    let mines = Math.floor(width*height*0.10*difficult);
    for (let i = 0; i < width; i++) {
        let row = [];
        for (let j = 0; j < height; j++) {
            row.push(0);
            minesField.push({
                x: i, y: j,
            });
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

function generateField() {
    let canvas = document.querySelector("#field");
    let width = document.querySelector("#field-width").value;
    let height = document.querySelector("#field-height").value;
    let mines = document.querySelector("#field-mines").value;
    let cellSize = 25;
    canvas.width = width * cellSize;
    canvas.height = height * cellSize;
    let context = canvas.getContext("2d");
    let field = generateMines(width, height, mines);

    let images = [
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
        new Image(),
    ]

    images[0].src = "./img/opened_cell_empty.png";
    for (let i = 1; i < 9; i++) {
        images[i].src = `./img/opened_cell_${i}.png`;
    }
    images[9].src = "./img/opened_cell_mine.png";

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            context.drawImage(images[field[i][j]], i*cellSize, j*cellSize, cellSize, cellSize);
        }
    }
}

let width = document.querySelector("#field-width");
let height = document.querySelector("#field-height");
let mines = document.querySelector("#field-mines");


width.addEventListener("change", ()=> generateField());
height.addEventListener("change", ()=> generateField());
mines.addEventListener("change", ()=> generateField());

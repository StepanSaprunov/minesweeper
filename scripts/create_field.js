 function generateEmptyField() {
    let canvas = document.querySelector("#field");
    let width = document.querySelector("#field-width").value;
    let height = document.querySelector("#field-height").value;
    let cellSize = 25;
    canvas.width = width * cellSize;
    canvas.height = height * cellSize;
    let context = canvas.getContext("2d");

    let closedCell = new Image();
    closedCell.addEventListener("load", ()=>{
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                context.drawImage(closedCell, i*cellSize, j*cellSize, cellSize, cellSize);
            }
        }
    })
    closedCell.src = "img/closed_cell.png";
}

export {generateEmptyField}

let width = document.querySelector("#field-width");
let height = document.querySelector("#field-height");

width.addEventListener("change", ()=> generateEmptyField());
height.addEventListener("change", ()=> generateEmptyField());

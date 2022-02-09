export class Field {
    static images;
    static context;
    static allfields = [];

    constructor (canvas, width, height, difficult, cellSize) {
        this.canvas = canvas;
        Field.context = canvas.getContext("2d");
        this.width = +width;
        this.height = +height;
        this.cellSize = cellSize;
        this.openedCells = new Array(+width).fill(0).map(el => el = new Array(+height).fill(false));
        this.firstClick = true;
        if (!Field.images) {
            Field.images = this.#loadImages();
        }
        this.field = [];
        this.difficult = +difficult;
        this.cursor = {
            x:undefined,
            y:undefined
        };
        this.activeCell = {
            x: undefined,
            y: undefined
        };
        this.#drawClosedField();
        this.count = 0;
        this.handler = (event) => {
            this.cursor = {
                x: event.clientX - (this.canvas.getBoundingClientRect().x + window.scrollX),
                y: event.clientY - (this.canvas.getBoundingClientRect().y + window.scrollY)
            };
            this.activeCell = {
                x: Math.floor(this.cursor.x/this.cellSize),
                y: Math.floor(this.cursor.y/this.cellSize)
            };
            if (this.firstClick) {
                this.field = this.#generateField(this.activeCell.x, this.activeCell.y);
                this.firstClick = false;
            }
            this.openCell(this.activeCell.x, this.activeCell.y);
        }
        this.firstClick = true;
        this.canvas.addEventListener("click", this.handler)
    }

    reGenerate(canvas, width, height, difficult, cellSize) {
        this.canvas = canvas;
        Field.context = canvas.getContext("2d");
        this.width = +width;
        this.height = +height;
        this.cellSize = cellSize;
        this.openedCells = new Array(+width).fill(0).map(el => el = new Array(+height).fill(false));
        this.firstClick = true;
        if (!Field.images) {
            Field.images = this.#loadImages();
        }
        this.field = [];
        this.difficult = +difficult;
        this.cursor = {
            x:undefined,
            y:undefined
        };
        this.activeCell = {
            x: undefined,
            y: undefined
        };
        this.#drawClosedField();
    }

    //Добавить обработку ошибки загрузки картинки
    async #loadImages(){
        let imPaths = [
            'img/opened_cell_0.png',
            'img/opened_cell_1.png',
            'img/opened_cell_2.png',
            'img/opened_cell_3.png',
            'img/opened_cell_4.png',
            'img/opened_cell_5.png',
            'img/opened_cell_6.png',
            'img/opened_cell_7.png',
            'img/opened_cell_8.png',
            'img/opened_cell_9.png',
            'img/closed_cell.png',
            'img/marked_cell.png',]
        const loadImage = src =>
            new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        return await Promise.all(imPaths.map(loadImage)).then(images => {
            return images;
        })
        
    }

    #drawClosedField() {
        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize;
        Field.images.then((images) => {
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    Field.context.drawImage(images[10], i*this.cellSize, j*this.cellSize, this.cellSize, this.cellSize);
                }
            }
            return images;
        })
    }

    #generateField(x, y) {
        let field = [];
        let minesField = [];
        let mines = Math.floor(this.width*this.height*0.10*this.difficult);
        for (let i = 0; i < this.width; i++) {
            let row = [];
            for (let j = 0; j < this.height; j++) {
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
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
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
    
    openCell(x, y) {
        //console.log(x, y, this.field[x][y], this.openedCells[x][y]);
        this.count+=1;
        if (!this.openedCells[x][y])  {
            let type = this.field[x][y];
            Field.images.then((images)=>{
                function openNumberedCell() {
                    drawCell.apply(this, [x,y]);
                }
                function openMine() {
                    drawCell.apply(this, [x,y]);
                }
                function openEmptyCell() {
                    drawCell.apply(this, [x,y]);
                    openAround.apply(this, [x,y]);
                }
                function openAround(x, y) {
                    if (x-1 >= 0) {
                        if (y-1 >= 0) {
                            if (!this.openedCells[x-1][y-1]) {
                                drawCell.apply(this, [x-1,y-1]);
                                if (this.field[x-1][y-1] == 0) openAround.apply(this, [x-1,y-1]); 
                            }
                        }
                        if (!this.openedCells[x-1][y]) {
                            drawCell.apply(this, [x-1,y]);
                            if (this.field[x-1][y] == 0) openAround.apply(this, [x-1,y]); 
                        }
                        if (y+1 < this.height) {
                            if (!this.openedCells[x-1][y+1]) {
                                drawCell.apply(this, [x-1,y+1]);
                                if (this.field[x-1][y+1] == 0) openAround.apply(this, [x-1,y+1]); 
                            }
                        }
                    }
                    if (y-1 >= 0) {
                        if (!this.openedCells[x][y-1]) {
                            drawCell.apply(this, [x,y-1]);
                            if (this.field[x][y-1] == 0) openAround.apply(this, [x,y-1]); 
                        }
                    }
                    if (y+1 < this.height) {
                        if (!this.openedCells[x][y+1]) {
                            drawCell.apply(this, [x,y+1]);
                            if (this.field[x][y+1] == 0) openAround.apply(this, [x,y+1]); 
                        }
                    }
                    if (x+1 < this.width) {
                        if (y-1 >= 0) {
                            if (!this.openedCells[x+1][y-1]) {
                                drawCell.apply(this, [x+1,y-1]);
                                if (this.field[x+1][y-1] == 0) openAround.apply(this, [x+1,y-1]); 
                            }
                        }
                        if (!this.openedCells[x+1][y]) {
                            drawCell.apply(this, [x+1,y]);
                            if (this.field[x+1][y] == 0) openAround.apply(this, [x+1,y]); 
                        }
                        if (y+1 < this.height) {
                            if (!this.openedCells[x+1][y+1]) {
                                drawCell.apply(this, [x+1,y+1]);
                                if (this.field[x+1][y+1] == 0) openAround.apply(this, [x+1,y+1]); 
                            }
                        }
                    }
                }
                function drawCell(x, y) {
                    Field.context.drawImage(images[this.field[x][y]], x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize);
                    this.openedCells[x][y] = true;
                }

                if ((type > 0) && (type < 9)) {
                    openNumberedCell.apply(this);
                }
                if (type == 9) {
                    openMine.apply(this);
                }
                if (type == 0) {
                    openEmptyCell.apply(this);
                }
                return images;
            })
        }
    }
    

}
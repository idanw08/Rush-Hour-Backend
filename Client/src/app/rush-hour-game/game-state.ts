import Phaser, { Button } from 'phaser-ce';

export class GameState extends Phaser.State {
    
    // rendered text
    private timeText;
    private carMovesText;
    private carMoved;

    // buttons
    private resetBtn:Button;
    private undoBtn:Button;
    
    // number of moves
    private moves:number;
    
    // game filed
    private levelArray;
    
    // game board
    private gameInstance;
    private gameLevel;

    // stacks
    private gameStack;
    private gameLog;

    private bonus:number;
    
    // if game over by win or time's Up
    private win:boolean;
    private timesUp:boolean;
    // two variables to represent "horizontal" and "vertical" cars. Better using HORIZONTAL and VERTICAL rather than 0 and 1
    private HORIZONTAL = 0;
    private VERTICAL = 1;

    // size of each tile, in pixels
    private tileSize = 80;

    private timeLeft:number;
    private gameTime:number;
    
    private example = [
        {
            name: "R",
            row: 3,
            col: 2,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "A",
            row: 4,
            col: 5,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "B",
            row: 1,
            col: 6,
            dir: this.VERTICAL,
            len: 3,
            spr: "truck"
        },
        {
            name: "C",
            row: 3,
            col: 4,
            dir: this.VERTICAL,
            len: 2,
            spr: "car"
        }
    ];

    private easyLevel = [
        {
            name: "R",
            row: 3,
            col: 2,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "A",
            row: 1,
            col: 1,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "B",
            row: 1,
            col: 6,
            dir: this.VERTICAL,
            len: 3,
            spr: "truck"
        },
        {
            name: "C",
            row: 2,
            col: 1,
            dir: this.VERTICAL,
            len: 3,
            spr: "truck"
        },
        {
            name: "D",
            row: 2,
            col: 4,
            dir: this.VERTICAL,
            len: 3,
            spr: "truck"
        },
        {
            name: "E",
            row: 5,
            col: 1,
            dir: this.VERTICAL,
            len: 2,
            spr: "car"
        },
        {
            name: "F",
            row: 5,
            col: 5,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "G",
            row: 6,
            col: 3,
            dir: this.HORIZONTAL,
            len: 3,
            spr: "truck"
        }
    ];

    private mediumLevel = [
        {
            name: "R",
            row: 3,
            col: 3,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "A",
            row: 1,
            col: 2,
            dir: this.VERTICAL,
            len: 3,
            spr: "truck"
        },
        {
            name: "B",
            row: 1,
            col: 3,
            dir: this.VERTICAL,
            len: 2,
            spr: "car"
        },
        {
            name: "C",
            row: 1,
            col: 4,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "D",
            row: 2,
            col: 6,
            dir: this.VERTICAL,
            len: 2,
            spr: "car"
        },
        {
            name: "E",
            row: 3,
            col: 5,
            dir: this.VERTICAL,
            len: 2,
            spr: "car"
        },
        {
            name: "F",
            row: 4,
            col: 1,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "G",
            row: 4,
            col: 3,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "H",
            row: 4,
            col: 6,
            dir: this.VERTICAL,
            len: 2,
            spr: "car"
        },
        {
            name: "I",
            row: 5,
            col: 3,
            dir: this.VERTICAL,
            len: 2,
            spr: "car"
        },
        {
            name: "J",
            row: 5,
            col: 4,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "K",
            row: 6,
            col: 1,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        }
    ];

    private hardLevel = [
        {
            name: "R",
            row: 3,
            col: 3,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "A",
            row: 1,
            col: 2,
            dir: this.VERTICAL,
            len: 3,
            spr: "truck"
        },
        {
            name: "B",
            row: 1,
            col: 3,
            dir: this.VERTICAL,
            len: 2,
            spr: "car"
        },
        {
            name: "C",
            row: 1,
            col: 4,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "D",
            row: 3,
            col: 5,
            dir: this.VERTICAL,
            len: 2,
            spr: "car"
        },
        {
            name: "E",
            row: 4,
            col: 1,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "F",
            row: 4,
            col: 6,
            dir: this.VERTICAL,
            len: 3,
            spr: "truck"
        },
        {
            name: "G",
            row: 5,
            col: 5,
            dir: this.VERTICAL,
            len: 2,
            spr: "car"
        },
        {
            name: "H",
            row: 6,
            col: 1,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        },
        {
            name: "I",
            row: 6,
            col: 3,
            dir: this.HORIZONTAL,
            len: 2,
            spr: "car"
        }
    ];

    constructor(gameInst) {
        super();
        this.gameLevel = gameInst;
        this.gameTime = 600;
        this.timeLeft = this.gameTime;
        this.gameLog = [];
        this.win = false;
        this.bonus = 0;
        this.timesUp = false;
        this.moves = 0;
        this.carMoved = "";
        // game board, it's a 6x6 array, initially all its items are set to zero = empty
        this.levelArray = [
            //0    1    2    3    4    5    6    7
            ["X", "X", "X", "X", "X", "X", "X", "X"],//0
            ["X", 0, 0, 0, 0, 0, 0, "X"],//1
            ["X", 0, 0, 0, 0, 0, 0, "X"],//2
            ["X", 0, 0, 0, 0, 0, 0, 0],//3
            ["X", 0, 0, 0, 0, 0, 0, "X"],//4
            ["X", 0, 0, 0, 0, 0, 0, "X"],//5
            ["X", 0, 0, 0, 0, 0, 0, "X"],//6
            ["X", "X", "X", "X", "X", "X", "X", "X"] //7
        ];
        this.gameStack = [];
        if(gameInst == 'example')
            this.gameInstance = this.example;
        else if(gameInst == 'easy')
            this.gameInstance = this.easyLevel;
        else if(gameInst == 'medium')
            this.gameInstance = this.mediumLevel;
        else if(gameInst == 'hard')
            this.gameInstance = this.hardLevel;
    }

    preload() {
        // preloading graphic assets
        this.load.image("field", "assets/field.jpg");
        this.load.image("car", "assets/car.png");
        this.load.image("truck", "assets/truck.png");
        this.load.image("resetButton", "assets/reset.png");
        this.load.image("undoButton", "assets/undo.png");
        this.load.image("winImg", "assets/youWin.png");
        this.load.image("timesup", "assets/timesup.png");
    }

    create() {
        // some car colors to be randomly assigned to cars
        const carColors = [0x006800, 0x0000ff, 0xCCCC00, 0x00A3A3, 0xff00ff];
        // adding the sprite representing the game field
        this.add.sprite(0, 0, "field");
        //let gameInstance = gameInstances.pop();
        for (let i = 0; i < this.gameInstance.length; i++) {
            // to keep the code clear, I assign carsArray[i] to a variable simply called "car"
            let car = this.gameInstance[i];
            // looping through car length
            for (let j = 0; j < car.len; j++) {
                // if the car is horizontal
                if (car.dir == this.HORIZONTAL) {
                    // setting levelArray items overlapped by the car to 1 (not empty);
                    this.levelArray[car.row][car.col + j] = car.name;
                }
                // if the car is vertical... (I know I could have used "else" but being a tutorial it looks better this way)
                if (car.dir == this.VERTICAL) {
                    // setting levelArray items overlapped by the car to 1 (not empty);
                    this.levelArray[car.row + j][car.col] = car.name;
                }
            }
            // adding the sprite representing the car
            // notice car direction (car.dir) is also involved in the placement.
            let carSprite = this.add.sprite(this.tileSize * car.col + this.tileSize * car.dir, this.tileSize * car.row, car.spr);
            // car sprite will be rotated by 90 degrees if the car is VERTICAL and by 0 degrees if the car is HORIZONTAL
            carSprite.angle = 90 * car.dir;
            // Assigning to car sprite some custom data, adding them as an object. We'll store car position, direction and length
            carSprite.data = {
                name: car.name,
                row: car.row,
                col: car.col,
                dir: car.dir,
                len: car.len
            };
            // assigning a random color to the car
            carSprite.tint = carColors[this.game.rnd.between(0, carColors.length - 1)];
            if (carSprite.data.name == "R")
                carSprite.tint = 0xff0000;
            // the car has input enabled
            carSprite.inputEnabled = true;
            // the car can be dragged
            carSprite.input.enableDrag();
            // the car will snap to a tileSize * tileSize grid but only when it's released
            carSprite.input.enableSnap(this.tileSize, this.tileSize, false, true);
            // when the car starts to be dragged, call startDrag function
            carSprite.events.onDragStart.add(this.startDrag);
            // when the car stops to be dragged, call stopDrag function
            carSprite.events.onDragStop.add(this.stopDrag);
            // add a name over the car
            var style = { font: "30px Arial", fill: "white", wordWrap: true, wordWrapWidth: carSprite.width, align: "center" };
            let text = this.game.add.text(carSprite.width/2-20, carSprite.height/2-20, carSprite.data.name , style);
            carSprite.addChild(text)
            // if car direction is VERTICAL then prevent the sprite to be dragged horizontally
            if (car.dir == this.VERTICAL) {
                carSprite.input.allowHorizontalDrag = false;
                text.x = carSprite.width/2-30;
                text.y = carSprite.height/2+7;
                text.angle = 270;
            }
            // if car direction is HORIZONTAL then prevent the sprite to be dragged vertically
            if (car.dir == this.HORIZONTAL) {
                carSprite.input.allowVerticalDrag = false;
            }
        }
        this.resetBtn = this.add.button(this.world.centerX + 50, 0, 'resetButton', this.Reset);
        this.undoBtn = this.add.button(this.world.centerX + 170, 0, 'undoButton', this.Undo);
        this.timeText = this.add.text(50, 2, "", {
            font: "20px Comic Sans MS",
            fill: "white",
        }
        );
        this.carMovesText = this.add.text(51, 25, "", {
            font: "20px Comic Sans MS",
            fill: "white",
        }
        );

    }

    render() {
        if(this.gameLevel == 'example'){
            this.timeText.setText("Time Remaining: 10:00");
            this.carMovesText.setText("Number of Moves: " + this.moves, 50, 40);
            return;
        }
        if (this.timeLeft > 0) {
            this.timeText.setText("Time Remaining: " + this.timeRemaining(this.game.time.totalElapsedSeconds()));
            this.carMovesText.setText("Number of Moves: " + this.moves, 50, 40);
        }
        else if(!this.timesUp && !this.win){
            this.timeIsUp();
        }
    }

    private stopGame() {
        this.resetBtn.inputEnabled = false;
        this.undoBtn.inputEnabled = false;
        this.game.paused = true;
        setTimeout(()=>{this.game.lockRender = true},100);
    }

    private timeRemaining = (totalElapsedSeconds) => {
        this.timeLeft = this.gameTime - totalElapsedSeconds;
        let minutes = (this.timeLeft / 60) | 0;
        let seconds = (this.timeLeft % 60) | 0;
        let timeStr = minutes + ":" + seconds;
        if (seconds < 10)
            timeStr = minutes + ":0" + seconds;
        if(this.timeLeft <= 0)
            return "0:00";
        return timeStr;
    }

    // function to be called when a car is dragged. "s" is the reference of the car itself
    private startDrag = (s) => {
        // declaring some variables here because I am using them
        let i;
        let from;
        let to;
        // if the car is horizontal...
        if (s.data.dir == this.HORIZONTAL) {
            // from is the leftmost column occupied by the car
            from = s.data.col;
            // to is the rightmost column occupied by the car
            to = s.data.col + s.data.len - 1;
            // now we are going from the leftmost column backward until column zero, the first column
            for (i = s.data.col - 1; i >= 0; i--) {
                // if it's an empty spot, then we update "from" position
                if (this.levelArray[s.data.row][i] == 0) {
                    from = i;
                }
                // otherwise we exit the loop
                else {
                    break;
                }
            }
            // now we are going from the rightmost column forward until column five, the last column
            for (i = s.data.col + s.data.len; i < 8; i++) {
                // if it's an empty spot, then we update "to" position
                if (this.levelArray[s.data.row][i] == 0) {
                    to = i;
                }
                // otherwise we exit the loop
                else {
                    break;
                }
            }
            // at this time, we assign the car a bounding box which will limit its movements. Think about it as a fence,
            // the car cannot cross the fence
            s.input.boundsRect = new Phaser.Rectangle(from * this.tileSize, s.y, (to - from + 1) * this.tileSize, this.tileSize);
        }
        // the same thing applies to vertical cars, just remember this time they are rotated by 90 degrees
        if (s.data.dir == this.VERTICAL) {
            from = s.data.row;
            to = s.data.row + s.data.len - 1;
            for (i = s.data.row - 1; i >= 0; i--) {
                if (this.levelArray[i][s.data.col] == 0) {
                    from = i;
                } else {
                    break;
                }
            }
            for (i = s.data.row + s.data.len; i < 8; i++) {
                if (this.levelArray[i][s.data.col] == 0) {
                    to = i;
                } else {
                    break;
                }
            }
            s.input.boundsRect = new Phaser.Rectangle(s.x, from * this.tileSize, s.x + s.data.len * this.tileSize, (to - from + 2 - s.data.len) * this.tileSize);
        }
    }

    // function to be called when a car is not dragged anymore. "s" is the reference of the car itself
    private stopDrag = (s) => {
        if ((s.data.dir == this.HORIZONTAL && s.x / this.tileSize == s.data.col) || (s.data.dir == this.VERTICAL && s.y / this.tileSize == s.data.row))
            return;
        this.moves++;
        let data =
        {
            carObj: s,
            row: s.data.row,
            col: s.data.col,
            lastRow: s.y / this.tileSize,
            lastCol: s.x / this.tileSize,
        };
        if (s.data.dir == this.VERTICAL) {
            data.lastCol = data.col;
        }

        this.gameStack.push(data);
        //this.firstCarsMoves();
        this.gameLog.push("move-carName:" + s.data.name + "-from:" + data.row + "," + data.col + "-to:" + data.lastRow + "," + data.lastCol + "-time:" + this.game.time.totalElapsedSeconds().toFixed(2));
        // here we just update levelArray items according to the car we moved.
        // first, we set to zero all items where the car was initially placed
        for (let i = 0; i < s.data.len; i++) {
            if (s.data.dir == this.HORIZONTAL) {
                this.levelArray[s.data.row][s.data.col + i] = 0;
            }
            if (s.data.dir == this.VERTICAL) {
                this.levelArray[s.data.row + i][s.data.col] = 0;
            }
        }
        // then we set to 1 all items where the car is placed now
        if (s.data.dir == this.HORIZONTAL) {
            this.updateCar(s, s.x / this.tileSize);
            for (let i = 0; i < s.data.len; i++) {
                this.levelArray[s.data.row][s.data.col + i] = s.data.name;
            }
        }
        if (s.data.dir == this.VERTICAL) {
            this.updateCar(s, s.y / this.tileSize);
            for (let i = 0; i < s.data.len; i++) {
                this.levelArray[s.data.row + i][s.data.col] = s.data.name;
            }
        }
        if (s.data.name == "R" && s.data.col == 6) {
            this.winning();
        }
    }

    private updateCar = (s, num) => {
        if (s.data.dir == this.HORIZONTAL) {
            s.data.col = num;
        }
        if (s.data.dir == this.VERTICAL) {
            s.data.row = num;
        }
    }

    private winning = () => {
        this.gameLog.push("win-time:" + this.game.time.totalElapsedSeconds().toFixed(2) + "-moves:" + this.moves);
        this.win = true;
        this.updateBonus();
        this.game.add.sprite(120, 131, "winImg");
        this.stopGame();
    }

    private timeIsUp = () => {
        this.gameLog.push("timesUp-moves:" + this.moves);
        this.timesUp = true;
        this.updateBonus();
        this.game.add.sprite(186, 211, "timesup");
        this.stopGame();
    }

    public getGameLog = () =>{
        return this.gameLog;
    }

    private Reset = () => {
        if (this.gameStack.length == 0)
            return;
        this.gameLog.push("reset-time:" + this.game.time.totalElapsedSeconds().toFixed(2));
        while (this.gameStack.length > 0) {
            this.Undo(true);
        }
        //this.moves = 0;
        //this.firstCarsMoves();
    }

    private Undo = (rst:boolean) => {
        if (this.gameStack.length == 0)
            return;
        let lastState = this.gameStack.pop();
        this.moves--;
        if(!rst)
            this.gameLog.push("undo-carName:" + lastState.carObj.data.name + "-from:" + lastState.lastRow + "," + lastState.lastCol  + "-to:" + lastState.row + "," + lastState.col + "-time:" + this.game.time.totalElapsedSeconds().toFixed(2));
        for (let i = 0; i < lastState.carObj.data.len; i++) {
            if (lastState.carObj.data.dir == this.HORIZONTAL) {
                this.levelArray[lastState.lastRow][lastState.lastCol + i] = 0;
            }
            if (lastState.carObj.data.dir == this.VERTICAL) {
                this.levelArray[lastState.lastRow + i][lastState.lastCol] = 0;
            }
        }
        // then we set to 1 all items where the car is placed now
        if (lastState.carObj.data.dir == this.HORIZONTAL) {
            this.updateCar(lastState.carObj, lastState.col);
            for (let i = 0; i < lastState.carObj.data.len; i++) {
                this.levelArray[lastState.row][lastState.col + i] = lastState.carObj.data.name;
            }
            lastState.carObj.x = this.tileSize * lastState.col + this.tileSize * lastState.carObj.data.dir;
            lastState.carObj.y = this.tileSize * lastState.row;
        }
        if (lastState.carObj.data.dir == this.VERTICAL) {
            this.updateCar(lastState.carObj, lastState.row);
            for (let i = 0; i < lastState.carObj.data.len; i++) {
                this.levelArray[lastState.row + i][lastState.col] = lastState.carObj.data.name;
            }
            lastState.carObj.x = this.tileSize * lastState.col + this.tileSize * lastState.carObj.data.dir;
            lastState.carObj.y = this.tileSize * lastState.row;
        }
        //this.firstCarsMoves();
    }
    
    public isDone = () =>{
        return this.win||this.timesUp;
    }

    private updateBonus = () =>{
        if(this.timesUp == true)
            return 0;
        if(this.gameLevel == 'example')
            return 0;
        else if(this.gameLevel == 'easy'){
            let x = 0;
            if(this.moves == 8) x += 100;
            else if(this.moves == 9) x += 50;
            x += (100 * ( 1 / Number(this.game.time.totalElapsedSeconds().toFixed(2)) ));
            this.bonus += parseFloat((x*0.2).toFixed(2))
            return;
        }
        else if(this.gameLevel == 'medium'){
            let x = 0;
            if(this.moves == 15) x += 100;
            else if(this.moves == 16) x += 50;
            x += (100 * ( 1 / Number(this.game.time.totalElapsedSeconds().toFixed(2)) ));
            this.bonus += parseFloat((x*0.35).toFixed(2))
            return;
        }
        else if(this.gameLevel == 'hard'){
            let x = 0;
            if(this.moves == 18) x += 100;
            else if(this.moves == 19) x += 50;
            x += (100 * ( 1 / Number(this.game.time.totalElapsedSeconds().toFixed(2)) ));
            this.bonus += parseFloat((x*0.45).toFixed(2))
            return;
        }
    }

    public getBonus = () =>{
        return this.bonus;
    }
/*
    private firstCarsMoves = () => {
        if (this.gameStack.length != 0) {
            this.carMoved = "";
            for (let i = 0; i < this.gameStack.length && this.carMoved.length < 12; i++) {
                if (i > 0 && this.gameStack[i].carObj.data.name == this.gameStack[i-1].carObj.data.name)
                    continue;
                this.carMoved += this.gameStack[i].carObj.data.name + ", ";
            }
            this.carMoved = this.carMoved.substring(0, this.carMoved.length-2);
        }
        else this.carMoved = "";
    }*/
}

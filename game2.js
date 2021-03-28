let width;
let height;
let fps;
let tileSize;
let canvas;
let ctx;
let snake;
let food;
let score=0;
let isPaused;
let interval;
let lives=3;
let starttime=new Date();
let timer;
let startpause;
let pausedtime=0;
let maxtime=120000;//120s==2 mins
// Loading the browser window.
window.addEventListener("load",function(){

     game();

});

window.addEventListener("click", function(){
    isPaused = !isPaused;
    if(isPaused) startpause=new Date();
    else pausedtime+=new Date()- startpause;
    showPaused();
});

window.addEventListener("keydown", function (evt) {
    if (evt.key === " ") {
        evt.preventDefault();
        isPaused = !isPaused;
        if(isPaused) startpause=new Date();
        else pausedtime+=new Date()- startpause;
        showPaused();
    }
    else if (evt.key === "ArrowUp" && !(snake.velx==0 && snake.vely==1)) {
        evt.preventDefault();
        if (snake.vely != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, -1);
    }
    else if (evt.key === "ArrowDown") {
        evt.preventDefault();
        if (snake.vely != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, 1);
    }
    else if (evt.key === "ArrowLeft") {
        evt.preventDefault();
        if (snake.velx != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(-1, 0);
    }
    else if (evt.key === "ArrowRight") {
        evt.preventDefault();
        if (snake.velx != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(1, 0);
    }

});

function spawnLocation()
{
    // Breaking the entire canvas into a grid of tiles.
    let rows = width / tileSize-8;
    let cols = height / tileSize-8;

    let xPos, yPos;

    xPos = Math.floor(Math.random() * rows) * tileSize+4* tileSize;
    yPos = Math.floor(Math.random() * cols) * tileSize+4* tileSize;

    return { x: xPos, y: yPos };

}
function drawBoundary()
{
    ctx.strokeStyle = 'red';
    ctx.lineWidth=3
    ctx.strokeRect(tileSize*4-3, tileSize*4-3, width-tileSize*8+3, height-tileSize*8+3 );
}

function showScore()
{
    ctx.beginPath();
        ctx.rect(width-130-220, 10, 260, 50);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0;
        ctx.stroke();
        ctx.closePath();
    ctx.textAlign="center";
    ctx.font = "25px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("SCORE: " + score+"  LIVES: " + lives, width - 220, 45);
}
/*function showlives()
{
    ctx.textAlign="center";
    ctx.font = "25px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("LIVES: " + lives, width - 120, 70);
}*/
function showTimer(time)
{
    time=Math.floor(time/1000);
    ctx.textAlign="center";
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("TIME: " + Math.floor(time/60) +":"+time%60 +" secs",width/2, 50);
}
function showPaused() 
{

    ctx.textAlign = "center";
    ctx.font = "35px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("PAUSED", width / 2, height / 2);

}

class Snake {

    // Initialization of object properties.
    constructor(pos, color) {

        this.x = pos.x;
        this.y = pos.y;
        this.tail = [{ x: pos.x - tileSize, y: pos.y }, { x: pos.x - tileSize * 2, y: pos.y }];
        this.velx = 1;
        this.vely = 0;
        this.color = color;

    }

    // Drawing the snake on the canvas.
    draw() {

        // Drawing the head of the snake.
        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        // Drawing the tail of the snake.
        for (var i = 0; i < this.tail.length; i++) {

            ctx.beginPath();
            ctx.rect(this.tail[i].x, this.tail[i].y, tileSize, tileSize);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();

        }


    }

    // Moving the snake by updating position.
    move() {

        // Movement of the tail.    
        for (var i = this.tail.length - 1; i > 0; i--) {

            this.tail[i] = this.tail[i - 1];

        }

        // Updating the start of the tail to acquire the position of head.
        if (this.tail.length != 0)
            this.tail[0] = { x: this.x, y: this.y };

        // Movement of the head.   
        this.x += this.velx * tileSize;
        this.y += this.vely * tileSize;

    }

    // Changing the direction of movement of the snake.
    dir(dirX, dirY) {

        this.velx = dirX;
        this.vely = dirY;

    }

    // Determining whether the snake has eaten a piece of food.
    eat() {

        if (Math.abs(this.x - food.x) < tileSize && Math.abs(this.y - food.y) < tileSize) {

            // Adding to the tail.
            this.tail.push({});
            return true;
        }

        return false;

    }

    // Checking if the snake has died.
    die() {

        if(timer>=maxtime) return true;

        for (var i = 0; i < this.tail.length; i++) {

            if (Math.abs(this.x - this.tail[i].x) < tileSize && Math.abs(this.y - this.tail[i].y) < tileSize) {
                return true;
            }

        }

        return false;

    }

    border() {

        if (this.x + tileSize > width - tileSize*4 && this.velx != -1 )
            this.x = width - this.x;
        else if (this.x < tileSize*4 && this.velx != 1) 
            this.x=width-5*tileSize;
        else if (this.y + tileSize > height- tileSize*4 && this.vely != -1)  
            this.y = height - this.y;
        if (this.vely != 1 && this.y < tileSize*4)
            this.y=height-5*tileSize;
    }

}
class Food
{
    constructor(pos,color)
    {
        this.x=pos.x;
        this.y=pos.y;
        this.color=color;
    }
    draw() {

        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

    }
}
// Initialization of the game objects.
function init() {

    tileSize = 20;
    // Dynamically controlling the size of canvas.
    width = tileSize * Math.floor(window.innerWidth / tileSize);
    height = tileSize * Math.floor(window.innerHeight / tileSize);
    fps=10;
    canvas = document.getElementById("game-area");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    isPaused = false;
    //snake head starts from centre of canvas
    snake = new Snake({ x: tileSize * Math.floor(width / (2 * tileSize)), y: tileSize * Math.floor(height / (2 * tileSize)) }, "#39ff14");
    food= new Food(spawnLocation(),"red");
}



function update() 
{

        // Checking if game is paused.
    timer=new Date() - starttime-pausedtime;
    if (isPaused) {
        return;
    }

    if (snake.die()) {
        if (timer>=maxtime)
        {
        alert("TIME OVER!!!\n your score:"+score);
        clearInterval(interval);
        window.location.reload();
        }
        else if(lives==0)
        {
        alert("GAME OVER!!!\n your score:"+score);
        clearInterval(interval);
        window.location.reload();
        }
        else
        {
            init();
            lives=lives-1;
        }
    }

    snake.border();

    if (snake.eat()) {
        score += 10;
        food = new Food(spawnLocation(), "red");
    }

    // Clearing the canvas for redrawing.
    ctx.clearRect(0, 0, width, height);
    drawBoundary();
    food.draw();
    snake.draw();
    snake.move();
    showScore();
    showTimer(timer);
    //showlives();
}
function game() {

    init();

    // The game loop.
    interval = setInterval(update,1000/fps);//frame rate is 1000 frames per second

}

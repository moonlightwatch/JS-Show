/**
 * Created by moonlightwatch on 15-4-10.
 */

var WIDTH;
var HEIGHT;
var mouseX;
var basisWidth;
var Board;
var Ball;
var Bricks = [];
var start = false;
var score;


var p;
var canvas;
var context;

window.onload = function(){
    var div = document.getElementById('div');
    p = document.getElementById('p');
    canvas = document.getElementById('canvas');
    //Initialization
    //size
    WIDTH = div.clientWidth;
    HEIGHT = div.clientHeight;
    canvas.width = WIDTH.toString();
    canvas.height = HEIGHT.toString();
    basisWidth = WIDTH/11;
    mouseX = WIDTH/2;
    //board
    Board = {
        width: basisWidth * 1.5,
        height: basisWidth/8,
        x: mouseX-basisWidth * 1.5/2,
        y: HEIGHT-basisWidth/8-2,
        color: '#000080'
    }
    //ball
    Ball = {
        r: basisWidth/6,
        x: mouseX,
        y: HEIGHT-Board.height-2-basisWidth/4,
        vx: 0,
        vy: -4
    }
    for(var i=1; i<16; i++){
        for(var j=1; j<5; j++){
            var brick = {
                x: (basisWidth+2)*j,
                y: (basisWidth/4+2)*i,
                width: basisWidth,
                height: basisWidth/4,
                isEnable: true,
                color: "rgb("+Math.floor(Math.random()*200+50)+","+Math.floor(Math.random()*200+50)+","+Math.floor(Math.random()*200+50)+")"
            }
            Bricks.push(brick);
        }
        for(var j=6; j<10; j++){
            var brick = {
                x: (basisWidth+2)*j,
                y: (basisWidth/4+2)*i,
                width: basisWidth,
                height: basisWidth/4,
                isEnable: true,
                color: "rgb("+Math.floor(Math.random()*200+50)+","+Math.floor(Math.random()*200+50)+","+Math.floor(Math.random()*200+50)+")"
            }
            Bricks.push(brick);
        }
    }

    //mouseMove
    canvas.addEventListener('mousemove', MouseMove, false);
    canvas.addEventListener('mouseup', MouseUp, false);
    context = canvas.getContext('2d');
    InitializationGame(context);

    setInterval(
        function(){
            show(context);
            update();
        }
        ,
        10
    );
}

function InitializationGame(ctx){
    score = 0;
    Ball.x = mouseX;
    Ball.y = HEIGHT-Board.height-2-basisWidth/4;
    ctx.beginPath();
    ctx.fillStyle = Board.color;
    ctx.rect(Board.x, Board.y, Board.width, Board.height);
    ctx.fill();

    for(var i=0; i<Bricks.length; i++){
        Bricks[i].isEnable = true;
        ctx.beginPath();
        ctx.fillStyle = Bricks[i].color;
        ctx.rect(Bricks[i].x, Bricks[i].y, Bricks[i].width, Bricks[i].height);
        ctx.fill();
    }

}

function show(ctx){
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.beginPath();
    ctx.fillStyle = Board.color;
    ctx.rect(Board.x, Board.y, Board.width, Board.height);
    ctx.arc(Ball.x, Ball.y, Ball.r, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();

    for(var i=0; i<Bricks.length; i++){
        if(!Bricks[i].isEnable)
        {
            continue;
        }
        ctx.beginPath();
        ctx.rect(Bricks[i].x, Bricks[i].y, Bricks[i].width, Bricks[i].height);
        ctx.fillStyle = Bricks[i].color;
        ctx.fill();
        ctx.closePath();
    }

}

function update(){
    if(!start) {
        Ball.x = mouseX;
        return;
    }
    //Ball location check
    if(Ball.y < Ball.r) {
        Ball.vy = Math.abs(Ball.vy);
    }
    if(Ball.x < Ball.r) {
        Ball.vx = Math.abs(Ball.vx);
    }
    if(Ball.x > canvas.clientWidth-Ball.r) {
        Ball.vx = -Math.abs(Ball.vx);
    }
    if(Ball.y > (Board.y-Ball.r) && Ball.x<(Board.x+Board.width) && Ball.x>Board.x){
        Ball.vy = -Math.abs(Ball.vy);
        var po = Board.width/10;
        for(var i=-10; i<10; i++){
            if( Ball.x > (mouseX+po*i) && Ball.x < (mouseX+po*(i+1))){
                Ball.vx = 0.8*i+1;
            }
        }
    }
    //kick a brick
    for(var i=0; i<Bricks.length; i++){
        if(!Bricks[i].isEnable)
        {
            continue;
        }
        if(Ball.x>Bricks[i].x && Ball.x<(Bricks[i].x+basisWidth)){
            if(Ball.y>(Bricks[i].y+Bricks[i].height) && Ball.y<(Bricks[i].y+Bricks[i].height+Ball.r)){
                Ball.vy = Math.abs(Ball.vy);
                Bricks[i].isEnable = false;
                score++;
            }
            if(Ball.y<Bricks[i].y && Ball.y>(Bricks[i].y-Ball.r)){
                Ball.vy = -Math.abs(Ball.vy);
                Bricks[i].isEnable = false;
                score++;
            }
        }
        if(Ball.y>Bricks[i].y && Ball.y<(Bricks[i].y+Bricks[i].height)){
            if(Ball.x>(Bricks[i].x+Bricks[i].width) && Ball.x<(Bricks[i].x+Bricks[i].width+Ball.r)){
                Ball.vx = Math.abs(Ball.vx);
                Bricks[i].isEnable = false;
                score++;
            }
            if(Ball.x<Bricks[i].x && Ball.x>(Bricks[i].x-Ball.r)){
                Ball.vx = -Math.abs(Ball.vx);
                Bricks[i].isEnable = false;
                score++;
            }
        }
    }
    //end
    if(Ball.y>canvas.clientHeight)
    {
        p.innerHTML = 'Game Over !';
        start=false;
        InitializationGame(context);
    }
    //ball move
    Ball.x += Ball.vx;
    Ball.y += Ball.vy;
    p.innerHTML = 'Score: '+score.toString();
}

function MouseMove(e){
    mouseX = e.clientX - canvas.offsetLeft;
    Board.x = mouseX-Board.width/2;
    //p.innerHTML = mouseX;
}

function MouseUp(e){
    start = true;
    p.innerHTML = score;
}
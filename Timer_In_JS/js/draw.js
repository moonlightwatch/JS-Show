/**
 * Created by moonlightwatch on 15-3-27.
 */

var WINDOW_WIDTH = 1366;
var WINDOW_HEIGHT = 768;

var MARGIN_TOP = 200;
var MARGIN_LEFT = 0;

var RADIUS = 8;

var balls = [];
var colors = ['#33B5E5','#0099CC','#AA66CC','#9933CC','#99CC00','#669900','#FFBB33','#FF8800','#FF4444','#CC0000'];

var curTime = new Date();

window.onload = function(){
    WINDOW_HEIGHT = document.body.clientHeight;
    WINDOW_WIDTH = document.body.clientWidth;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
    MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
    RADIUS = Math.round(WINDOW_WIDTH*4/5/130)-1;

    var canvas = document.getElementById('canvas');
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    var context = canvas.getContext('2d');

    curTime = new Date();

    setInterval(
        function(){
            show(context);
            updateBalls();
        },
        30
    );

}

function updateBalls(){
    for(var i=0; i<balls.length; i++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if(balls[i].y >= WINDOW_HEIGHT-RADIUS){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = -balls[i].vy*0.75;
        }
        if(balls[i].x > WINDOW_WIDTH+RADIUS || balls[i].x < 0-RADIUS)
        {
            balls.splice(i,1);
        }
    }

}

function show(ctx){
    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    var new_time = new Date();
    showTime(new_time.getHours(), new_time.getMinutes(), new_time.getSeconds(), ctx);

    var x = MARGIN_LEFT;
    var y = MARGIN_TOP;

    if(parseInt(new_time.getHours()/10) != parseInt(curTime.getHours()/10)){
        addBalls(x, y, parseInt(curTime.getHours()/10));
    }
    x += (16*(RADIUS+1));
    if(parseInt(new_time.getHours()%10) != parseInt(curTime.getHours()%10)){
        addBalls(x, y, parseInt(curTime.getHours()%10));
    }
    x += (26*(RADIUS+1));
    if(parseInt(new_time.getMinutes()/10) != parseInt(curTime.getMinutes()/10)){
        addBalls(x, y, parseInt(curTime.getMinutes()/10));
    }
    x += (16*(RADIUS+1));
    if(parseInt(new_time.getMinutes()%10) != parseInt(curTime.getMinutes()%10)){
        addBalls(x, y, parseInt(curTime.getMinutes()%10));
    }
    x += (26*(RADIUS+1));
    if(parseInt(new_time.getSeconds()/10) != parseInt(curTime.getSeconds()/10)){
        addBalls(x, y, parseInt(curTime.getSeconds()/10));
    }
    x += (16*(RADIUS+1));
    if(new_time.getSeconds()%10 != curTime.getSeconds()%10){
        addBalls(x, y, parseInt(curTime.getSeconds()%10));
    }
    showBalls(ctx);
    curTime = new_time;
}


function showBalls(ctx){
    for(var i=0; i<balls.length; i++){
        ctx.fillStyle = balls[i].color;
        //ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}

function addBalls(left, top, num)
{
    for(var i=0; i<dotnum[num].length; i++){
        for(var j=0; j<dotnum[num][i].length; j++){
            if(1 == dotnum[num][i][j]){
                var ball = {
                    x:left+(RADIUS+1)+j*2*(RADIUS+1),
                    y:top+(RADIUS+1)+i*2*(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow(-1, Math.ceil(Math.random()*1000))*4,
                    vy:-(Math.ceil(Math.random()*1000)%30),
                    color:colors[Math.floor(Math.random()*colors.length)]
                    }
                balls.push(ball);
            }
        }
    }
}

function showTime(hours, minutes, seconds, ctx){
    var hour = hours%100;
    var minute = minutes%100;
    var second = seconds%100;

    var x = MARGIN_LEFT;
    var y = MARGIN_TOP;

    //show hour
    putDotNum(x, y, parseInt(hour/10), ctx);
    x += (16*(RADIUS+1));
    putDotNum(x, y, parseInt(hour%10), ctx);
    x += (16*(RADIUS+1));
    putDotNum(x, y, 10, ctx);
    x += (10*(RADIUS+1));
    putDotNum(x, y, parseInt(minute/10), ctx);
    x += (16*(RADIUS+1));
    putDotNum(x, y, parseInt(minute%10), ctx);
    x += (16*(RADIUS+1));
    putDotNum(x, y, 10, ctx);
    x += (10*(RADIUS+1));
    putDotNum(x, y, parseInt(second/10), ctx);
    x += (16*(RADIUS+1));
    putDotNum(x, y, parseInt(second%10), ctx);
    x += (16*(RADIUS+1));
}


function putDotNum(x, y, num, ctx)
{
    ctx.fillStyle = 'rgb(50, 150, 250)';

    for(var i=0; i<dotnum[num].length; i++){
        for(var j=0; j<dotnum[num][i].length; j++){
            if(1 == dotnum[num][i][j]){
                ctx.beginPath();
                ctx.arc(x+(RADIUS+1)+j*2*(RADIUS+1), y+(RADIUS+1)+i*2*(RADIUS+1), RADIUS, 0, 2*Math.PI);
                ctx.fill();
            }
        }
    }

}

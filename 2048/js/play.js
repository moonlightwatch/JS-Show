
//图形矩阵
var map = new Array();

//绘图上下文
var context;

//积分
var score = 0;

//页面加载函数
function PageLoad() 
{
    var can = document.getElementById("can");
    context = can.getContext('2d');
    
    //初始化
    Init();
}

//按键事件处理函数
function KeyDown()
{
    var moved = false;
    //左
    if (event.keyCode == 37) 
    {
        moved = MoveLeft();
    }
    //上
    if (event.keyCode == 38) 
    {
        moved = MoveUp();
    }
    //右
    if (event.keyCode == 39)
    {
        moved = MoveRight();
    }
    //下
    if (event.keyCode == 40) 
    {
        moved = MoveDown();
    }
    if(moved)
    {
        //在矩阵空余处产生一个数字
        PutNewNumber();
    }
    
    //显示得分
    document.getElementById("score").innerHTML = "得分：" + score;
    
    //重绘矩阵
    RepaintMap()
}

//重绘矩阵
function RepaintMap() 
{
    for(var i=0; i<4; i++)
    {
        for(var j=0; j<4; j++)
        {
            var n = map[i][j];
            if(n != 0)
            {
                context.drawImage(document.getElementById("img"+n),15 + 10 + i * (180 + 10),15 + 10 + j * (180 + 10), 180, 180);
            }
            else
            {
                var location_X = 15 + 10 + 180 * i + 10 * i;
                var location_Y = 15 + 10 + 180 * j + 10 * j;
                context.fillRect(location_X, location_Y, 180, 180);
            }
        }
    }
}

//在矩阵空余处产生一个数字
function PutNewNumber() 
{
    for(;;)
    {
        for(var i=0; i<4; i++)
        {
            for(var j=0; j<4; j++)
            {
                //选择空余处
                if(map[i][j] == 0)
                {
                    var randomNum = Math.random() * 10;
                    //30%几率产生2
                    if(randomNum < 4 && randomNum > 1)
                    {
                        map[i][j] = 2;
                        return;
                    }
                    //10%几率产生4
                    else if(randomNum <= 1)
                    {
                        map[i][j] = 4;
                        return;
                    }
                }
            }
        }
    }
    
}
 
//重新来过~
function restart() 
{
    Init();
}

//初始化
function Init() 
{
    //绑定按键事件,keyPress事件检测不到方向键
    document.onkeydown = KeyDown;
    
    score = 0;
    //显示得分
    document.getElementById("score").innerHTML = "得分：" + score;
    
    //初始化图形矩阵
    for(var i=0; i<4; i++)
    {
        map[i] = new Array();
        for(var j=0; j<4; j++)
        {
            map[i][j] = 0;
        }
    }
    
    //生成两个数字
    PutNewNumber();
    PutNewNumber();
    
    //绘制背景
    PrintBack();
    
    //重绘矩阵
    RepaintMap();
}

//绘制背景
function PrintBack() 
{
    context.fillStyle = "#cc9999";
    context.fillRect(15,15,770,770);//背景
    context.fillStyle = "#dd6688";
    for(var i=0; i<4; i++)//占位方块
    {
        for(var j=0; j<4; j++)
        {
            var location_X = 15 + 10 + 180 * i + 10 * i;
            var location_Y = 15 + 10 + 180 * j + 10 * j;
            context.fillRect(location_X, location_Y, 180, 180);
        }
    }
}

//向上移动
function MoveUp() 
{
    var moved = false;//移动标记
    for(var k=0; k<3; k++)//重复三次（三次足以保证充分移动）
    for(var i=0; i<4; i++)
    {
        for(var j=0; j<3; j++)
        {
            if(map[i][j] == map[i][j+1])//数字相等的合并
            {
                map[i][j] += map[i][j+1];
                if(map[i][j+1] != 0)//移动了非零项
                {
                    moved = true;
                }
                map[i][j+1] = 0;
                score += map[i][j];
            }
            if(map[i][j] == 0)//检查空项
            {
                map[i][j] += map[i][j+1];
                if(map[i][j+1] != 0)//移动了非零项
                {
                    moved = true;
                }
                map[i][j+1] = 0;
            }
        }
    }
    return moved;
}

//向下移动
function MoveDown() 
{
    var moved = false;
    for(var k=0; k<3; k++)
    for(var i=0; i<4; i++)
    {
        for(var j=3; j>0; j--)
        {
            if(map[i][j] == map[i][j-1])
            {
                map[i][j] += map[i][j-1];
                if(map[i][j-1] != 0)//移动了非零项
                {
                    moved = true;
                }
                map[i][j-1] = 0;
                score += map[i][j];
            }
            if(map[i][j] == 0)
            {
                map[i][j] += map[i][j-1];
                if(map[i][j-1] != 0)//移动了非零项
                {
                    moved = true;
                }
                map[i][j-1] = 0;
            }
        }
    }
    return moved;
}

//向左移动
function MoveLeft() 
{
    var moved = false;
    for(var k=0; k<3; k++)
    for(var i=0; i<3; i++)
    {
        for(var j=0; j<4; j++)
        {
            if(map[i][j] == map[i+1][j])
            {
                map[i][j] += map[i+1][j];
                if(map[i+1][j] != 0)//移动了非零项
                {
                    moved = true;
                }
                map[i+1][j] = 0;
                score += map[i][j];
            }
            if(map[i][j] == 0)
            {
                map[i][j] += map[i+1][j];
                if(map[i+1][j] != 0)//移动了非零项
                {
                    moved = true;
                }
                map[i+1][j] = 0;
            }
        }
    }
    return moved;
}

//向右移动
function MoveRight() 
{
    var moved = false;
    for(var k=0; k<3; k++)
    for(var i=3; i>0; i--)
    {
        for(var j=0; j<4; j++)
        {
            if(map[i][j] == map[i-1][j])
            {
                map[i][j] += map[i-1][j];
                if(map[i-1][j] != 0)//移动了非零项
                {
                    moved = true;
                }
                map[i-1][j] = 0;
                score += map[i][j];
            }
            if(map[i][j] == 0)
            {
                map[i][j] += map[i-1][j];
                if(map[i-1][j] != 0)//移动了非零项
                {
                    moved = true;
                }
                map[i-1][j] = 0;
            }
        }
    }
    return moved;
}

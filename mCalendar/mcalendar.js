//数据矩阵
var DataMap = new Array();
//Canvase标签
var CanvaseElement;
//Canvase绘图上下文
var CanvaseContext;
//Canvase元素宽度
var Width = 0;
//Canvase元素高度
var Height = 0;
//当前显示的日期
var CurrentDate;

//初始化各路内容
function Init() {
    for (var line = 0; line < 6; line++) {
        DataMap[line] = new Array();
    }
    InitToCurrentMonth();
    CanvaseElement = document.getElementById("mcalendar");
    CanvaseContext = CanvaseElement.getContext('2d');
    Resize();
    CanvaseElement.onclick = ClickCanvase;
    CanvaseElement.onresize = Resize;
}

//Canvase上的点击操作
function ClickCanvase(event) {
    var mouseX = event.clientX - CanvaseElement.getBoundingClientRect().left;
    var mouseY = event.clientY - CanvaseElement.getBoundingClientRect().top;
    var blockHeight = (Height - 7) / 8;
    var blockWidth = (Width - 6) / 7;
    if (mouseY > blockHeight) {
        return;
    }
    var baseWidth = 1 + blockWidth;
    if (mouseX > baseWidth * 4 && mouseX < baseWidth * 5) {
        UpdateToPrevMonth();
        DrawDataToView();
    }
    else if (mouseX > baseWidth * 5 && mouseX < baseWidth * 6) {
        InitToCurrentMonth();
        DrawDataToView();
    }
    else if (mouseX > baseWidth * 6 && mouseX < baseWidth * 7) {
        UpdateToNextMonth();
        DrawDataToView();
    }
}

//将数据绘制到视图
function DrawDataToView() {
    var blockHeight = (Height - 7) / 8;
    var blockWidth = (Width - 6) / 7;
    CanvaseContext.fillStyle = "#cccccc";
    for (var line = 0; line < 8; line++) {
        for (var col = 0; col < 7; col++) {
            var x = (1 + blockWidth) * col;
            var y = (1 + blockHeight) * line;
            if (line == 0 && col == 0) {
                CanvaseContext.fillRect(x, y, blockWidth * 4 + 3, blockHeight);
            }
            else {
                CanvaseContext.fillRect(x, y, blockWidth, blockHeight);
            }
        }
    }

    CanvaseContext.font = " " + (blockWidth.toString() / 2) + "px Console";
    CanvaseContext.textBaseline = "middle";
    CanvaseContext.fillStyle = "#000000";

    var dateString = CurrentDate.getFullYear() + "年" + (CurrentDate.getMonth() + 1) + "月"
    var dateWidth = CanvaseContext.measureText(dateString).width;
    CanvaseContext.fillText(dateString, (blockWidth * 4 + 3 - dateWidth) / 2, blockHeight / 2, blockWidth * 4 + 3);

    var signString = "◀";//▶ ◈
    var signWidth = CanvaseContext.measureText(signString).width;
    CanvaseContext.fillText(signString, (1 + blockWidth) * 4 + (blockWidth - signWidth) / 2, blockHeight / 2, blockWidth);
    signString = "◈";//▶ ◈
    signWidth = CanvaseContext.measureText(signString).width;
    CanvaseContext.fillText(signString, (1 + blockWidth) * 5 + (blockWidth - signWidth) / 2, blockHeight / 2, blockWidth);
    signString = "▶";//▶ ◈
    signWidth = CanvaseContext.measureText(signString).width;
    CanvaseContext.fillText(signString, (1 + blockWidth) * 6 + (blockWidth - signWidth) / 2, blockHeight / 2, blockWidth);

    for (var line = 1; line < 8; line++) {
        if (line == 1) {
            var textWidth = CanvaseContext.measureText("一").width;
            var y = (1 + blockHeight) * line + blockHeight / 2;
            var x_offset = (blockWidth - textWidth) / 2;
            CanvaseContext.fillText("一", (1 + blockWidth) * 0 + x_offset, y, blockWidth);
            CanvaseContext.fillText("二", (1 + blockWidth) * 1 + x_offset, y, blockWidth);
            CanvaseContext.fillText("三", (1 + blockWidth) * 2 + x_offset, y, blockWidth);
            CanvaseContext.fillText("四", (1 + blockWidth) * 3 + x_offset, y, blockWidth);
            CanvaseContext.fillText("五", (1 + blockWidth) * 4 + x_offset, y, blockWidth);
            CanvaseContext.fillText("六", (1 + blockWidth) * 5 + x_offset, y, blockWidth);
            CanvaseContext.fillText("日", (1 + blockWidth) * 6 + x_offset, y, blockWidth);
        }
        else {
            for (var col = 0; col < 7; col++) {
                var x = (1 + blockWidth) * col;
                var y = (1 + blockHeight) * line + blockHeight / 2;
                var text = DataMap[line - 2][col].toString();
                if (text.indexOf("t") > 0) {
                    text = DataMap[line - 2][col].toString().replace("t", "");
                    CanvaseContext.fillStyle = "#0099cc"
                    CanvaseContext.fillRect(x, y - blockHeight / 2, blockWidth, blockHeight);
                    CanvaseContext.fillStyle = "#000000"
                    CanvaseContext.font = "bold " + (blockWidth.toString() / 2) + "px Console";
                    var textWidth = CanvaseContext.measureText(text).width;
                    x += (blockWidth - textWidth) / 2;
                    CanvaseContext.fillText(text, x, y, blockWidth);
                    CanvaseContext.font = " " + (blockWidth.toString() / 2) + "px Console";
                }
                else if (text.indexOf("b") > 0) {
                    text = DataMap[line - 2][col].toString().replace("b", "");
                    CanvaseContext.font = "bold " + (blockWidth.toString() / 2) + "px Console";
                    var textWidth = CanvaseContext.measureText(text).width;
                    x += (blockWidth - textWidth) / 2;
                    CanvaseContext.fillText(text, x, y, blockWidth);
                    CanvaseContext.font = " " + (blockWidth.toString() / 2) + "px Console";
                }
                else {
                    var textWidth = CanvaseContext.measureText(text).width;
                    x += (blockWidth - textWidth) / 2;
                    CanvaseContext.fillText(text, x, y, blockWidth);
                }
            }
        }
    }

}

//按新的尺寸进行调整
function Resize() {
    Width = CanvaseElement.width;
    Height = CanvaseElement.height;
    DrawDataToView();
}

//初始化数据到当前月份
function InitToCurrentMonth() {
    var date = new Date();
    CurrentDate = new Date();
    var dateTicks = (date - 0) - (date.getDate() - 1) * 86400000;
    RefreshDateMap(new Date(dateTicks));
}

//更新数据到上一个月，并刷新
function UpdateToPrevMonth() {
    CurrentDate.setDate(1);
    CurrentDate = new Date((CurrentDate - 0) - 86400000);
    RefreshDateMap(new Date(CurrentDate - 0));
}

//更新数据到下一个月，并刷新
function UpdateToNextMonth() {
    CurrentDate.setDate(28);
    CurrentDate = new Date((CurrentDate - 0) + 5 * 86400000);
    RefreshDateMap(new Date(CurrentDate - 0));
}

function RefreshDateMap(date) {
    var now = new Date();
    var dateTicks = (date - 0) - (date.getDate() - 1) * 86400000;
    date = new Date(dateTicks);
    if (date.getDay() != 1) {
        dateTicks = (date - 0) - (date.getDay() == 0 ? 6 : (date.getDay() - 1)) * 86400000;
        date = new Date(dateTicks);
    }
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 7; j++) {
            DataMap[i][j] = date.getDate();
            if (date.getFullYear() == now.getFullYear() &&
                date.getMonth() == now.getMonth() &&
                date.getDate() == now.getDate()) {
                DataMap[i][j] += "t";
            }
            else if (date.getMonth() == CurrentDate.getMonth()) {
                DataMap[i][j] += "b";
            }
            date = new Date((date - 0) + 86400000);
        }
    }
}

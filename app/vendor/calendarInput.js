/*----------------------------可以放到外部JS中，DateInputControl.js--------------------*/

/*
* Added by LiuXiaoChong 2005.4.25
* 限制输入的日期控件
* Param: txtName 为要限制输入的文本框的名称
*
* 功能描述：1，只能输入数字
*                    2，左右键可以移动编辑焦点
*                    3，上下键可以对数据进行微调
*                    4，控件包含了对日期的合法校验
*/
var isNS = navigator.appName.indexOf("Netscape") != -1; //NS，FF
var isIE = navigator.appName.indexOf("Microsoft") != -1;
var fontWidth = 7; //字体宽度跟显示器像素无关，跟文本框的字体大小有关系，现在常用的几个字体大小记录如下：
                   //12pt - W6
                   //13pt - W7 默认字体大小
                   //14pt - W7
                   //15pt - W8
                   //如果是IE可以用程序计算出来，但是NS，FF没找到对应的解决方案，只能有手工来测了：（

function regDateControl(txtName,defaultStartDate)
{	
    var oInput = document.getElementById(txtName);
    oInput.middleChar = "-";
    oInput.selectIndex = 1; //默认选中年
    oInput.maxLength = 10;
    oInput.style.imeMode = "disabled";
    if(oInput.value==''&&oInput.disabled==false){
    	if(defaultStartDate!=null&&defaultStartDate!=''){
    		oInput.value = defaultStartDate;
    	}else{
    		oInput.value = specialText_GetDate(oInput.middleChar);	
    	}
    }
    //如果是IE，则自己计算
    if(isIE)
        oInput.charWidth = oInput.createTextRange().boundingWidth / oInput.maxLength;
    //否则，用自己定义的宽度
    else
        oInput.charWidth = fontWidth;

    //注册单击事件
    oInput.onclick = specialText_ClickEvent;
    if(isIE)
        oInput.onkeydown = specialText_KeyEvent;
    else
        oInput.onkeypress = specialText_KeyEvent;
    oInput.onfocus = function(){specialText_SelectYear(this);};
    specialText_validYear(oInput);
    specialText_validMonth(oInput);
    specialText_validDate(oInput);
    oInput.onblur = function()
    {
        specialText_validYear(this);
        specialText_validMonth(this);
        specialText_validDate(this);
    };
    
    //屏蔽鼠标右键和拖动操作
    oInput.oncontextmenu = function(){return false;}
    oInput.ondrop = function(){return false;} //###################
}

//鼠标单击，根据位置对日期进行分体选择
function specialText_ClickEvent(oEvent)
{
    
    if(isIE)
    {
        event.cancelBubble = true;
        oEvent = window.event;
    }
    else if(isNS)
        oEvent.stopPropagation();
    specialText_validYear(this);
    specialText_validMonth(this);
    specialText_validDate(this);
    
    var offX,offY;
    
    if(isIE)
        offX = oEvent.offsetX;
    else if(isNS)
           offX = oEvent.pageX - this.offsetLeft;

    if(offX <= specialText_getCharWidth(this.charWidth,4))
        specialText_SelectYear(this);
    else if(offX > specialText_getCharWidth(this.charWidth,4)
            && offX <= specialText_getCharWidth(this.charWidth,7))
        specialText_SelectMonth(this);
    else if(offX > specialText_getCharWidth(this.charWidth,7))
        specialText_SelectDate(this);
}
//选中年份
function specialText_SelectYear(oInput)
{
    if(isIE)
    {
        var oRange = oInput.createTextRange();
        oRange.moveStart("character",0);
        oRange.moveEnd("character",-6);
        //代表选中了年
        oInput.selectIndex = 1;
        oRange.select();
    }
    else if(isNS)
    {
        oInput.setSelectionRange(0,4);
        //代表选中了年
        oInput.selectIndex = 1;
    }
}
//选中月份
function specialText_SelectMonth(oInput)
{
    if(isIE)
    {
        var oRange = oInput.createTextRange();
        oRange.moveStart("character",5);
        oRange.moveEnd("character",-3);
        //代表选中了月
        oInput.selectIndex = 2;
        oRange.select();
    }
    else if(isNS)
    {
        oInput.setSelectionRange(5,7);
        //代表选中了月
        oInput.selectIndex = 2;
    }
}
//选中日期
function specialText_SelectDate(oInput)
{
    if(isIE)
    {
        var oRange = oInput.createTextRange();
        oRange.moveStart("character",8);
        //代表选中了日期
        oInput.selectIndex = 3;
        oRange.select();
    }
    else if(isNS)
    {
        oInput.setSelectionRange(8,10);
        //代表选中了日期
        oInput.selectIndex = 3;
    }
}
//校验年份有效性
function specialText_validYear(oInput)
{
	if(oInput.value=='')
		regDateControl(oInput.name);
    var arrValue = oInput.value.split(oInput.middleChar);
    var strYear = arrValue[0];

    if(parseInt(strYear,10) == 0)
        arrValue[0] = 2000;
    //如果年份小于4位，则在2000基础上增加
    else if(strYear.length < 4)
        arrValue[0] = 2000 + parseInt(strYear,10);
    oInput.value = arrValue.join(oInput.middleChar);
}
//校验月份有效性
function specialText_validMonth(oInput)
{
    var arrValue = oInput.value.split(oInput.middleChar);
    var strMonth = arrValue[1];
    if(parseInt(arrValue[1],10) == 10)
    	strMonth = parseInt(arrValue[1],10);
    arrValue[1] = strMonth;
    //如果月份输入了0，则按1月处理
    if(parseInt(strMonth,10) == 0)
         arrValue[1] = "01";
    //如果月份是一位，则前面补0
    else if(strMonth.length < 2)
        arrValue[1] = "0" + strMonth;
    //如果月份大于12月，自动转为12月
    else if(parseInt(strMonth,10) > 12)
        arrValue[1] = "12";
    oInput.value = arrValue.join(oInput.middleChar);
}
//校验日期有效性
function specialText_validDate(oInput)
{
    var arrValue = oInput.value.split(oInput.middleChar);
    var strYear = arrValue[0];
    var strMonth = arrValue[1];
    var strDate = arrValue[2];
    var intMonth = parseInt(strMonth,10);
    if(parseInt(strDate,10) == 0)
        arrValue[2] = "01";
    else if(strDate.length < 2)
        arrValue[2] = "0" + strDate;
    else
    {
        //如果超过了月份的最大天数，则置为最大天数
        var monthMaxDates = specialText_getMonthDates(strYear,strMonth);
        if(parseInt(strDate,10) > monthMaxDates)
            arrValue[2] = monthMaxDates;
    }
    oInput.value = arrValue.join(oInput.middleChar);
}

function specialText_YearAdd(oInput,isMinus)
{
    var arrValue = oInput.value.split(oInput.middleChar);
    var strYear = arrValue[0];
    if(isMinus)
    {
        arrValue[0] = parseInt(strYear,10) - 1;
        if(parseInt(arrValue[0],10) < 1)
            arrValue[0] = "0001";
    }
    else
        arrValue[0] = parseInt(strYear,10) + 1;
    oInput.value = arrValue.join(oInput.middleChar);
    specialText_validYear(oInput);
    specialText_SelectYear(oInput);
}

function specialText_MonthAdd(oInput,isMinus)
{
    var arrValue = oInput.value.split(oInput.middleChar);
    var strMonth = arrValue[1];
    if(isMinus)
    {
        arrValue[1] = parseInt(strMonth,10) - 1;
        if(parseInt(arrValue[1],10) == 0)
            arrValue[1] = "12";
    }
    else
    {
        arrValue[1] = parseInt(strMonth,10) + 1;
        if(parseInt(arrValue[1],10) == 13)
            arrValue[1] = "01";
    }
    if (strMonth.length < 2) {
    	arrValue[1] = "0" + arrValue[1];
    }
    oInput.value = arrValue.join(oInput.middleChar);
    specialText_validMonth(oInput);
    specialText_SelectMonth(oInput);
}

function specialText_DateAdd(oInput,isMinus)
{
    var arrValue = oInput.value.split(oInput.middleChar);
    var strYear = arrValue[0];
    var strMonth = arrValue[1];
    var strDate = arrValue[2];
    var monthMaxDates = specialText_getMonthDates(strYear,strMonth);

    if(isMinus)
    {
        arrValue[2] = parseInt(strDate,10) - 1;
        if(parseInt(arrValue[2],10) == 0)
            arrValue[2] = monthMaxDates;
    }
    else
    {
        arrValue[2] = parseInt(strDate,10) + 1;
        if(parseInt(arrValue[2],10) == (monthMaxDates + 1))
            arrValue[2] = "01";
    }
    oInput.value = arrValue.join(oInput.middleChar);
    specialText_validDate(oInput);
    specialText_SelectDate(oInput);
}

function specialText_KeyEvent(oEvent)
{
    if(window.event)
        oEvent = window.event;

    //如果按了数字键
    if((oEvent.keyCode >= 48 && oEvent.keyCode <= 57) ||
       (oEvent.keyCode >= 96 && oEvent.keyCode <= 105))
    {     
        if(isIE)
        {
            var oRange = document.selection.createRange();
            if(oRange.text.indexOf(this.middleChar) != -1)
                oEvent.returnValue = false;
        }
        else if(isNS)
        {
            var txtVal = this.value.substring(oInput.selectionStart,oInput.selectionEnd)
            if(txtVal.indexOf(this.middleChar) != -1)
                oEvent.preventDefault();
        }
    }
    //如果按了方向键
    else if(oEvent.keyCode >= 37 && oEvent.keyCode <= 40)
    {
        if(isIE)
            oEvent.returnValue = false;
        else if(isNS)
            oEvent.preventDefault();
            
        var keyCode = oEvent.keyCode;
        //按了左键
        if(keyCode == 37)
        {
            if(this.selectIndex == 1)
            {
                specialText_validYear(this);
                specialText_SelectDate(this);
            }
            else if(this.selectIndex == 2)
            {
                specialText_validMonth(this);
                specialText_SelectYear(this);
            }
            else if(this.selectIndex == 3)
            {
                specialText_validDate(this);
                specialText_SelectMonth(this);
            }
        }
        //按了右键
        if(keyCode == 39)
        {
            if(this.selectIndex == 1)
            {
                specialText_validYear(this);
                specialText_SelectMonth(this);
            }
            else if(this.selectIndex == 2)
            {
                specialText_validMonth(this);
                specialText_SelectDate(this);
            }
            else if(this.selectIndex == 3)
            {
                specialText_validDate(this);
                specialText_SelectYear(this);
            }
        }

        //按了上键
        if(keyCode == 38)
        {
            if(this.selectIndex == 1)
            {
                specialText_validYear(this);
                specialText_YearAdd(this,true);
            }
            else if(this.selectIndex == 2)
            {
                specialText_validMonth(this);
                specialText_MonthAdd(this,true);
            }
            else if(this.selectIndex == 3)
            {
                specialText_validDate(this);
                specialText_DateAdd(this,true);
            }
        }

        //按了下键
        if(keyCode == 40)
        {
            if(this.selectIndex == 1)
            {
                specialText_validYear(this);
                specialText_YearAdd(this,false);
            }
            else if(this.selectIndex == 2)
            {
                specialText_validMonth(this);
                specialText_MonthAdd(this,false);
            }
            else if(this.selectIndex == 3)
            {
                specialText_validDate(this);
                specialText_DateAdd(this,false);
            }
        }
    }
    //如果按了F5 或 TAB，shift,ctrl不屏蔽
    else if(oEvent.keyCode == 116 || oEvent.keyCode == 9 ||oEvent.ctrlKey ||oEvent.shiftKey)
    {
        oEvent.returnValue = true;
    }
    else
    {
    	oEvent.keyCode = 0;
        if(isIE)
        {
            oEvent.returnValue = false;
        }
        else if(isNS)
        {
            oEvent.preventDefault();
        }
    }
}

/*---------------------辅助函数-----------------------*/
//得到默认日期
function specialText_GetDate(middleChar)
{
    var oDate = new Date();
    return oDate.getFullYear() + middleChar
           + (oDate.getMonth() < 10 ? ("0" + (oDate.getMonth()+1)) : (oDate.getMonth()+1)) + middleChar
           + (oDate.getDate() < 10 ? ("0" + oDate.getDate()) : oDate.getDate());
}
//得到字符像素宽度
function specialText_getCharWidth(charWidth,charNum)
{
    return charNum * charWidth;
}
//得到某年某月的最大天数
function specialText_getMonthDates(strYear,strMonth)
{
    var intMonth = parseInt(strMonth,10);
    if(intMonth == 1 || intMonth == 3 || intMonth == 5 || intMonth == 7
       || intMonth == 8 || intMonth == 10 || intMonth == 12)
        return 31;
    //处理30天的月份
    else if(intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11)
        return 30;
    //处理2月份
    else
    {
        //闰年
        if(specialText_isLeapYear(strYear))
            return 29;
        //平年
        else
            return 28;
    }
}
//判断是否是闰年
function specialText_isLeapYear(strYear)
{
    var intYear = parseInt(strYear,10);
    if((intYear % 4 == 0 && intYear % 100 != 0) ||
       (intYear % 100 == 0 && intYear % 400 == 0))
        return true;
    else
        return false;
}

/*----------------------------可以放到外部JS中 DateInputControl.js--------------------*/

var InputFile, IntervalTimer;
var ConvertAgain = false;
var StuckTime = 0;

//頁面讀取完成時
window.onload = function()
{
	Initialization();
}

//進行拖曳時的動作
function DrapOver(DragOverFile)
{
	DragOverFile.preventDefault(); //停止拖曳後所執行的事件
};

//拖曳檔案後的動作
function DropFile(DragOverFile)
{
	DragOverFile.preventDefault();
	var InputFileTemp = DragOverFile.dataTransfer.files[0]; //將拖曳的檔案先暫存
	if (InputFileTemp != null)
	{
		InputFile = InputFileTemp;
		FileCheck();
	}
};

//選取檔案後的動作
function SelectFile()
{
	var InputFileTemp = event.target.files[0]; //將選取的檔案先暫存
	if (InputFileTemp != null)
	{
		InputFile = InputFileTemp;
		FileCheck();
	}
};

//當字型調整數值有變動的動作
function FontSetChange()
{
	var FontSizeSet = document.getElementById("InputFontOptionsSize").value; //字型大小設定值
	
	if (FontSizeSet != "" && FontSizeSet < 1)
	{
		document.getElementById("InputFontOptionsSize").value = 1; //使字型大小始終大於1
	}
	
	if (InputFile != null)
	{
		ConvertAgain = true;
		Convert();
	}
}

//重置為初始狀態
function Initialization()
{
	document.getElementById("PIDFileSelectArea").innerHTML = "點擊此處選取檔案，或將檔案拖曳至頁面上即開始轉換";
	document.getElementById("PIDFileSelectArea").style.color = "rgb(255,255,255)";
	document.getElementById("DivIDOutputArea").style.display = "none";
};

//檢查檔案
function FileCheck()
{
	Initialization();
		
	if (InputFile.name.substr(InputFile.name.lastIndexOf(".")) != ".fnt") //假如檔案不是FNT檔
	{
		InputFile = null; //清空檔案
		document.getElementById("PIDFileSelectArea").innerHTML = "檔案類型不符合";
		document.getElementById("PIDFileSelectArea").style.color = "rgb(255,0,0)";
		TextEffecter();
	}
	else if (InputFile.size > 10485760) //假如檔案大小超過 10MB
	{
		InputFile = null;
		document.getElementById("PIDFileSelectArea").innerHTML = "檔案大小不能超過 10MB";
		document.getElementById("PIDFileSelectArea").style.color = "rgb(255,0,0)";
		TextEffecter();
	}
	else
	{		
		//使用FileReader以Text格式解析輸入的檔案
		var FNTReader = new FileReader();
		
		document.getElementById("PIDFileSelectArea").innerHTML = "正在讀取檔案";
		
		FNTReader.readAsText(InputFile);
		FNTReader.onload = function()
		{
			document.getElementById("TextareaIDInput").value = this.result; //將解析內容儲存到TextareaIDInput
			Convert();
		}
	}
};

//轉換程式
function Convert()
{
	Initialization();
	
	document.getElementById("PIDFileSelectArea").innerHTML = "正在解析檔案";
	
	var FileError = false;
	
	//使用DOMParser以XML格式解析內容
	var Parser = new DOMParser();
	var ParserData = document.getElementById("TextareaIDInput").value;
	
	try
	{
		var ParserResult = Parser.parseFromString(ParserData, "text/xml");
	}
	catch (e)
	{
		FileError = true;
	}
	
	document.getElementById("PIDFileSelectArea").innerHTML = "正在轉換";
	
	var OutputXMLCharacter = "";
	
	var InputFNTChar = ParserResult.getElementsByTagName("char");
	var InputFNTInfo = ParserResult.getElementsByTagName("info")[0];
	var InputFNTCommon = ParserResult.getElementsByTagName("common")[0];
	
	//字型調整
	var FontSettingError = 0; //用於判斷字型設定是否有誤
	var FontSizeSet = document.getElementById("InputFontOptionsSize").value; //字型大小設定值
	var FontSpacingSet = document.getElementById("InputFontOptionsSpacing").value; //字型間距設定值
	var FontVerticalOffsetSet = document.getElementById("InputFontOptionsVerticalOffset").value; //垂直位移設定值
	
	try
	{
		var FontSizeOutput = InputFNTInfo.attributes["size"].value; //字型大小預設值
	}
	catch (e)
	{
		FileError = true;
	}
		
	var FontSpacingOutput = 0;
	var FontVerticalOffsetOutput = 0;
		
	//字型大小的數值結果
	if (FontSizeSet > 0) { FontSizeOutput = FontSizeSet; }
	else if (FontSizeSet != "") { FontSettingError += 1; }
		
	//字型間距的數值結果
	if (FontSpacingSet >= 0 || FontSpacingSet < 0) { FontSpacingOutput = FontSpacingSet; }
	else if (FontSpacingSet != "") { FontSettingError += 1; }
		
	//垂直位移的數值結果
	if (FontVerticalOffsetSet >= 0 || FontVerticalOffsetSet < 0) { FontVerticalOffsetOutput = FontVerticalOffsetSet; }
	else if (FontVerticalOffsetSet != "") { FontSettingError += 1; }
		
	if (FileError == true)
	{
		document.getElementById("PIDFileSelectArea").innerHTML = "檔案格式不相容";
		document.getElementById("PIDFileSelectArea").style.color = "rgb(255,0,0)";
		TextEffecter();
	}
	else
	{
		//轉換char的格式
		for (obj in InputFNTChar)
		{
			if (typeof(InputFNTChar[obj]) == "object")
			{
				var char_code = InputFNTChar[obj].attributes["id"].value;
				var page = InputFNTChar[obj].attributes["page"].value;
				var u = InputFNTChar[obj].attributes["x"].value;
				var v = InputFNTChar[obj].attributes["y"].value;
				var w = (InputFNTChar[obj].attributes["x"].value * 1) + (InputFNTChar[obj].attributes["width"].value * 1);
				var h = (InputFNTChar[obj].attributes["y"].value * 1) + (InputFNTChar[obj].attributes["height"].value * 1);
				var preshift = InputFNTChar[obj].attributes["xoffset"].value;
				var base = (+InputFNTCommon.attributes["base"].value);
				var spac = (+InputFNTInfo.attributes["spacing"].value.split(",")[0] * 2)
				var yoff = (+InputFNTChar[obj].attributes["yoffset"].value);
				var yadjust = (-yoff) + (base-spac);
				var postshift = (+InputFNTChar[obj].attributes["xadvance"].value);
				
				OutputXMLCharacter += '<character code='+char_code+' u='+u+' v='+v+' w='+w+' h='+h+' preshift='+preshift+' yadjust='+(yadjust+(FontVerticalOffsetOutput * 1))+' postshift='+(postshift+(FontSpacingOutput * 1))+' />\n';
			}
		}
		
		//輸出所有轉換結果
		document.getElementById("TextareaIDOutput").value = '<?xml version=1.0 encoding=UTF-8 ?>\n'
		+ '<FontData width='+InputFNTCommon.attributes["scaleW"].value+' height='+InputFNTCommon.attributes["scaleH"].value+' padding='+InputFNTInfo.attributes["padding"].value.split(',')[0] * 2+' font_size='+FontSizeOutput+' font_scale=100 line_spacing=100>\n'
		+ '<FontDetails> \n'
		+ OutputXMLCharacter
		+ '</FontDetails>\n'
		+ '</FontData>';
	
		if (ConvertAgain == true)
		{
			document.getElementById("PIDFileSelectArea").innerHTML = "重新轉換完畢";
		}
		else
		{
			document.getElementById("PIDFileSelectArea").innerHTML = "轉換完畢";
		}
		
		ConvertAgain = false;
		
		//字型調整的輸入有誤
		if (FontSettingError > 0)
		{
			document.getElementById("PIDFileSelectArea").innerHTML += "<br />字型調整的設定值無效，已自動改用預設值。";
			document.getElementById("PIDFileSelectArea").style.color = "rgb(255,255,0)";
			TextEffecter();
		}
		else
		{
			document.getElementById("PIDFileSelectArea").style.color = "rgb(100,200,100)";
			TextEffecter();
		}
		
		//顯示轉換結果
		document.getElementById("DivIDOutputArea").style.display = "inline";
		
		//當瀏覽器是Chrome或Firefox時顯示儲存按鈕	
		if (navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.indexOf("Firefox") != -1)
		{
			document.getElementById("InputIDSaveButton").style.display = "inline";
		}
	}
};

//文字特效器
function TextEffecter()
{
	document.getElementById("TextareaIDOutput").style.opacity = 0.1;
	
	StuckTime = 0; //重置停頓時間
	clearInterval(IntervalTimer); //清除計時器
	IntervalTimer = setInterval(TextEffects, 50); //使用計時器
}

//文字特效內容
function TextEffects()
{
	//檔案選取區訊息的顏色變化
	var FileSelectTextColorData = document.getElementById("PIDFileSelectArea").style.color.replace("rgb","").replace("(","").replace(")","").split(",");
	var FileSelectTextColorR = FileSelectTextColorData[0];
	var FileSelectTextColorG = FileSelectTextColorData[1];
	var FileSelectTextColorB = FileSelectTextColorData[2];
	
	if (StuckTime > 40)
	{
		if (FileSelectTextColorR < 255) { FileSelectTextColorR = Number(FileSelectTextColorR) + 4; }
		if (FileSelectTextColorG < 255) { FileSelectTextColorG = Number(FileSelectTextColorG) + 4; }
		if (FileSelectTextColorB < 255) { FileSelectTextColorB = Number(FileSelectTextColorB) + 4; }
		
		//防止溢出
		if (FileSelectTextColorR > 255) { FileSelectTextColorR = 255; }
		if (FileSelectTextColorG > 255) { FileSelectTextColorG = 255; }
		if (FileSelectTextColorB > 255) { FileSelectTextColorB = 255; }
		
		var FontColorNew = "rgb(" + FileSelectTextColorR + "," + FileSelectTextColorG + "," + FileSelectTextColorB + ")";
		
		document.getElementById("PIDFileSelectArea").style.color = FontColorNew;
	}
	else
	{
		StuckTime += 1;
	}
	
	//轉換結果區的文字透明度變化
	var OutputTextOpacity = document.getElementById("TextareaIDOutput").style.opacity;
	
	if (OutputTextOpacity < 1)
	{
		document.getElementById("TextareaIDOutput").style.opacity = Number(OutputTextOpacity) + 0.01;
	}
	else
	{
		document.getElementById("TextareaIDOutput").style.opacity = 1;
	}
	
	if (FileSelectTextColorR == 255 && FileSelectTextColorG == 255 && FileSelectTextColorB == 255)
	{
		clearInterval(IntervalTimer);
	}
}

//複製內容
function CopyText()
{
	var OutputText = document.createRange();
	var TextareaOutput = document.getElementById("TextareaIDOutput");
	
	OutputText.selectNode(TextareaOutput); //先執行第一種選取方式
	var Select = window.getSelection();
	Select.removeAllRanges();
	Select.addRange(OutputText);
	
	TextareaOutput.select(); //再執行第二種選取方式，以防部分瀏覽器不支援第一種選取方式
	
	document.execCommand("copy");
};

//儲存檔案
function AutoClick(Object)
{
	var ClickEvent = document.createEvent("MouseEvents");
	ClickEvent.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	Object.dispatchEvent(ClickEvent);
}

function SaveFile(FileName)
{
	var URLObject = window.URL || window.webkitURL || window;
	var DataText = new Blob([document.getElementById("TextareaIDOutput").value]);
	var SaveLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
	SaveLink.href = URLObject.createObjectURL(DataText);
	SaveLink.download = FileName;
	AutoClick(SaveLink);
}

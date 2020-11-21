var InputFile, IntervalTimer, IntervalTimer2;
var LanguageString = [];
var LanguageStringNumber = [];
var ConvertAgain = false;
var StuckTime, OutputTextOpacity = 0;
var SpanFontOptions = [];

//變更字串為中文
function LanguageTC()
{
	LanguageString[0] = "點擊此處選取檔案，或將檔案拖曳至頁面上即開始轉換";
	LanguageString[1] = "檔案類型不符合";
	LanguageString[2] = "檔案大小不能超過 10MB";
	LanguageString[3] = "正在讀取檔案";
	LanguageString[4] = "正在解析檔案";
	LanguageString[5] = "正在轉換";
	LanguageString[6] = "重新轉換完畢";
	LanguageString[7] = "轉換完畢";
	LanguageString[8] = "轉換完畢<br /><br />字型調整的設定值無效，已自動改用預設值";
	LanguageString[9] = "轉換失敗<br /><br />檔案內容可能有誤";
	LanguageString[10] = "字型大小調整：";
	LanguageString[11] = "字型間距調整：";
	LanguageString[12] = "垂直位移調整：";
	LanguageString[13] = "全選並複製";
	LanguageString[14] = "儲存檔案";
}

//變更字串為英文
function LanguageEN()
{
	LanguageString[0] = "Click here to select a file, or drag a file on page to start convert.";
	LanguageString[1] = "File type doesn't match.";
	LanguageString[2] = "File size requires less than 10 MB.";
	LanguageString[3] = "Loading file...";
	LanguageString[4] = "Parsing file...";
	LanguageString[5] = "Converting...";
	LanguageString[6] = "Reconvert done.";
	LanguageString[7] = "Convert done.";
	LanguageString[8] = "Convert done.<br /><br />Font setting invalid. The setting has been changed to default.";
	LanguageString[9] = "Convert failed.<br /><br />The file contents may incorrectly.";
	LanguageString[10] = "Font Size: ";
	LanguageString[11] = "Spacing: ";
	LanguageString[12] = "Vertical Offset:";
	LanguageString[13] = "Copy All";
	LanguageString[14] = "Save File";
}

//頁面讀取完成時
window.onload = function()
{	
	Initialization();

	//取得字型調整選項的原始Span內容
	SpanFontOptions[0] = document.getElementById("SpanIDFontOptionsSize").innerHTML;
	SpanFontOptions[1] = document.getElementById("SpanIDFontOptionsSpacing").innerHTML;
	SpanFontOptions[2] = document.getElementById("SpanIDFontOptionsVerticalOffset").innerHTML;

	//偵測並決定語言
	if (navigator.language.toLowerCase() == "zh-tw")
	{
		document.getElementById("SelectIDLanguage").value = "tc";
	}
	else
	{
		document.getElementById("SelectIDLanguage").value = "en";
	}
	
	LanguageSelected();
}

//選擇語言後的動作
function LanguageSelected()
{
	var SelectedLanguage = document.getElementById("SelectIDLanguage").value;
	
	if (SelectedLanguage == "tc")
	{
		LanguageTC();
	}
	else
	{
		LanguageEN();
	}
	
	//字型調整選項的文字
	document.getElementById("SpanIDFontOptionsSize").innerHTML = LanguageString[10] + SpanFontOptions[0];
	document.getElementById("SpanIDFontOptionsSpacing").innerHTML = LanguageString[11] + SpanFontOptions[1];
	document.getElementById("SpanIDFontOptionsVerticalOffset").innerHTML = LanguageString[12] + SpanFontOptions[2];
	
	//全選複製按鈕、儲存檔案按鈕
	document.getElementById("InputIDCopyButton").value = LanguageString[13];
	document.getElementById("InputIDSaveButton").value = LanguageString[14];
	
	StringChange();
}

//當文字選取區的訊息編號變動
function StringChange()
{
	var FileSelectAreaTextStringNumber = document.getElementById("InputIDStringFileSelectArea").value;
	document.getElementById("PIDFileSelectArea").innerHTML = LanguageString[FileSelectAreaTextStringNumber];
}

//進行拖曳時的動作
function DrapOver(DragOverFile)
{
	DragOverFile.preventDefault(); //停止拖曳後所執行的事件
}

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
}

//選取檔案後的動作
function SelectFile()
{
	var InputFileTemp = event.target.files[0]; //將選取的檔案先暫存
	if (InputFileTemp != null)
	{
		InputFile = InputFileTemp;
		FileCheck();
	}
}

//當字型調整數值有變動的動作
function FontSetChange()
{
	var FontSizeSet = document.getElementById("InputIDFontOptionsSize").value; //字型大小設定值
	
	if (FontSizeSet != "" && FontSizeSet < 1)
	{
		document.getElementById("InputIDFontOptionsSize").value = 1; //使字型大小始終大於1
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
	document.getElementById("InputIDStringFileSelectArea").value = 0;
	StringChange();
	document.getElementById("PIDFileSelectArea").style.color = "rgb(255,255,255)";
	document.getElementById("DivIDOutputArea").style.display = "none";
}

//檢查檔案類型及大小
function FileCheck()
{
	Initialization();
		
	if (InputFile.name.substr(InputFile.name.lastIndexOf(".")) != ".fnt") //假如檔案不是FNT檔
	{
		InputFile = null; //清空檔案
		document.getElementById("InputIDSelectFile").value = null;
		document.getElementById("InputIDStringFileSelectArea").value = 1;
		StringChange();
		document.getElementById("PIDFileSelectArea").style.color = "rgb(255,0,0)";
		FileSelectTextEffecter();
	}
	else if (InputFile.size > 10485760) //假如檔案大小超過 10MB
	{
		InputFile = null;
		document.getElementById("InputIDSelectFile").value = null;
		document.getElementById("InputIDStringFileSelectArea").value = 2;
		StringChange();
		document.getElementById("PIDFileSelectArea").style.color = "rgb(255,0,0)";
		FileSelectTextEffecter();
	}
	else
	{		
		//使用FileReader以Text格式解析輸入的檔案
		var FNTReader = new FileReader();
		
		document.getElementById("InputIDStringFileSelectArea").value = 3;
		StringChange();
		
		FNTReader.readAsText(InputFile);
		FNTReader.onload = function()
		{
			document.getElementById("TextareaIDInput").value = this.result; //將解析內容儲存到TextareaIDInput
			Convert();
		}
	}
}

//轉換程式
function Convert()
{
	Initialization();
	
	document.getElementById("InputIDStringFileSelectArea").value = 4;
	StringChange();
	
	var OutputXMLCharacter = "";
	
	//使用DOMParser以XML格式解析內容
	var Parser = new DOMParser();
	var ParserData = document.getElementById("TextareaIDInput").value; //從TextareaIDInput讀取內容
	
	document.getElementById("InputIDStringFileSelectArea").value = 5;
	StringChange();
	
	//開始轉換
	try
	{
		var ParserResult = Parser.parseFromString(ParserData, "text/xml");
	
		var InputFNTChar = ParserResult.getElementsByTagName("char");
		var InputFNTInfo = ParserResult.getElementsByTagName("info")[0];
		var InputFNTCommon = ParserResult.getElementsByTagName("common")[0];
		
		
		//字型調整
		var FontSettingError = 0; //用於判斷字型設定是否有誤
				
		var FontSizeOutput = InputFNTInfo.attributes["size"].value; //字型大小預設值
		var FontSpacingOutput = 0;
		var FontVerticalOffsetOutput = 0;
		
		var FontSizeSet = document.getElementById("InputIDFontOptionsSize").value; //字型大小設定值
		var FontSpacingSet = document.getElementById("InputIDFontOptionsSpacing").value; //字型間距設定值
		var FontVerticalOffsetSet = document.getElementById("InputIDFontOptionsVerticalOffset").value; //垂直位移設定值
		
		//字型大小的數值結果
		if (FontSizeSet > 0) { FontSizeOutput = FontSizeSet; }
		else if (FontSizeSet != "") { FontSettingError += 1; }
		
		//字型間距的數值結果
		if (FontSpacingSet >= 0 || FontSpacingSet < 0) { FontSpacingOutput = FontSpacingSet; }
		else if (FontSpacingSet != "") { FontSettingError += 1; }
		
		//垂直位移的數值結果
		if (FontVerticalOffsetSet >= 0 || FontVerticalOffsetSet < 0) { FontVerticalOffsetOutput = FontVerticalOffsetSet; }
		else if (FontVerticalOffsetSet != "") { FontSettingError += 1; }
		
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
		
		//判斷是否為重新轉換
		if (ConvertAgain == true)
		{
			document.getElementById("InputIDStringFileSelectArea").value = 6;
		}
		else
		{
			document.getElementById("InputIDStringFileSelectArea").value = 7;
		}
		
		ConvertAgain = false;
		
		document.getElementById("PIDFileSelectArea").style.color = "rgb(100,200,100)";
		
		//字型調整的輸入有誤
		if (FontSettingError > 0)
		{
			document.getElementById("InputIDStringFileSelectArea").value = 8;
			document.getElementById("PIDFileSelectArea").style.color = "rgb(255,255,0)";
		}
		
		StringChange();
		document.getElementById("InputIDSelectFile").value = null;
		
		//檔案選取區的文字訊息特效
		FileSelectTextEffecter();
		
		//顯示轉換結果輸出區
		document.getElementById("DivIDOutputArea").style.display = "inline";
		
		//轉換結果文字特效
		OutputFileSelectTextEffecter();
		
		//當瀏覽器是Chrome或Firefox時顯示儲存按鈕	
		if (navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.indexOf("Firefox") != -1)
		{
			document.getElementById("InputIDSaveButton").style.display = "inline";
		}
	}
	catch (e)
	{
		InputFile = null;
		document.getElementById("InputIDSelectFile").value = null;
		document.getElementById("InputIDStringFileSelectArea").value = 9;
		document.getElementById("PIDFileSelectArea").style.color = "rgb(255,0,0)";
		StringChange();
		FileSelectTextEffecter();
	}
}

//文字特效器
function FileSelectTextEffecter()
{	
	StuckTime = 0; //重置停頓時間
	clearInterval(IntervalTimer); //重置計時器
	IntervalTimer = setInterval(FileSelectTextEffects, 100); //使用計時器
}

//檔案選取區的文字特效
function FileSelectTextEffects()
{
	//取得文字顏色資料
	var FileSelectTextColorData = document.getElementById("PIDFileSelectArea").style.color.replace("rgb","").replace("(","").replace(")","").split(",");
	var FileSelectTextColorR = FileSelectTextColorData[0];
	var FileSelectTextColorG = FileSelectTextColorData[1];
	var FileSelectTextColorB = FileSelectTextColorData[2];
	
	if (StuckTime > 20)
	{
		if (FileSelectTextColorR < 255) { FileSelectTextColorR = Number(FileSelectTextColorR) + 10; }
		if (FileSelectTextColorG < 255) { FileSelectTextColorG = Number(FileSelectTextColorG) + 10; }
		if (FileSelectTextColorB < 255) { FileSelectTextColorB = Number(FileSelectTextColorB) + 10; }
		
		//防止溢出
		if (FileSelectTextColorR > 255) { FileSelectTextColorR = 255; }
		if (FileSelectTextColorG > 255) { FileSelectTextColorG = 255; }
		if (FileSelectTextColorB > 255) { FileSelectTextColorB = 255; }
		
		document.getElementById("PIDFileSelectArea").style.color = "rgb(" + FileSelectTextColorR + "," + FileSelectTextColorG + "," + FileSelectTextColorB + ")";
	}
	else
	{
		StuckTime += 1;
	}
		
	if (FileSelectTextColorR == 255 && FileSelectTextColorG == 255 && FileSelectTextColorB == 255)
	{
		clearInterval(IntervalTimer);
	}
}

//輸出內容特效
function OutputFileSelectTextEffecter()
{
	OutputTextOpacity = 0.01; //重置透明度
	clearInterval(IntervalTimer2); //重置計時器
	IntervalTimer2 = setInterval(OutputFileSelectTextEffects, 100); //使用計時器
}

function OutputFileSelectTextEffects()
{
	if (OutputTextOpacity < 1)
	{
		OutputTextOpacity += 0.07;
		if (OutputTextOpacity > 1) { OutputTextOpacity = 1; } //防止溢位
		document.getElementById("TextareaIDOutput").style.color = "rgba(255,255,255," + OutputTextOpacity + ")";
	}
	else
	{
		clearInterval(IntervalTimer2);
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
}

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
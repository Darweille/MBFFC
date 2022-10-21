var InputFile, IntervalTimer, IntervalTimer2;
var LanguageString = [];
var LanguageStringNumber = [];
var ConvertAgain = false;
var StuckTime, OutputTextOpacity = 0;
var SpanFontOptions = [];

//變更字串為中文
function LanguageTC()
{
	LanguageString[0] = "";
	LanguageString[1] = "檔案類型不符合。";
	LanguageString[2] = "檔案大小不能超過10MB。";
	LanguageString[3] = "正在讀取檔案。";
	LanguageString[4] = "正在解析檔案。";
	LanguageString[5] = "正在轉換。";
	LanguageString[6] = "已重新轉換完畢。";
	LanguageString[7] = "轉換完畢。";
	LanguageString[8] = "轉換完畢。<br /><br />字型調整的設定值無效，已自動改用預設值。";
	LanguageString[9] = "轉換失敗！<br /><br />檔案內容可能有誤。";
	LanguageString[10] = "字型大小：";
	LanguageString[11] = "字型間距：";
	LanguageString[12] = "垂直位移：";
	LanguageString[13] = "全選並複製";
	LanguageString[14] = "儲存檔案";
	LanguageString[15] = "行距調整：";
	LanguageString[16] = "點擊此處選取檔案或者拖曳檔案至頁面上即可開始轉換";
	LanguageString[17] = "轉換內容已複製至剪貼簿。";
	LanguageString[18] = "已自動生成 font_data.xml 檔案並下載。";
}

//變更字串為英文
function LanguageEN()
{
	LanguageString[0] = "";
	LanguageString[1] = "The file format or extension don't match.";
	LanguageString[2] = "The file size requires less than 10 MB.";
	LanguageString[3] = "Loading file...";
	LanguageString[4] = "Parsing file...";
	LanguageString[5] = "Processing...";
	LanguageString[6] = "Processing is finished.<br /><br />The contents of the file has been converted again.";
	LanguageString[7] = "Processing is finished.<br /><br />The contents of the file has been converted.";
	LanguageString[8] = "Processing is finished.<br /><br />The font settings have an invalid value, it has already been reset to the default.";
	LanguageString[9] = "Processing failed!<br /><br />The contents of the file may be incorrect.";
	LanguageString[10] = "Font Size: ";
	LanguageString[11] = "Spacing: ";
	LanguageString[12] = "Vertical Offset: ";
	LanguageString[13] = "Copy All";
	LanguageString[14] = "Save File";
	LanguageString[15] = "Line Spacing: ";
	LanguageString[16] = "Click here to select a file, or drag a file on page to start";
	LanguageString[17] = "The contents already copied to clipboard.";
	LanguageString[18] = "The file 'font_data.xml' has created and downloading.";

}

//頁面讀取完成時
window.onload = function()
{	
	Initialization();

	//取得字型調整選項的原始Span內容
	SpanFontOptions[0] = document.getElementById("spanFontSize").innerHTML;
	SpanFontOptions[1] = document.getElementById("spanFontSpacing").innerHTML;
	SpanFontOptions[2] = document.getElementById("spanFontVerticalOffset").innerHTML;
	SpanFontOptions[3] = document.getElementById("spanFontLineSpacing").innerHTML;

	//判斷Cookie裡面有無語言紀錄
	var AllCookieArray = document.cookie.split(";"); //取得全部Cookie並解析為陣列
	
	var CookieNumber = -1;
	var CookieData = 0;
	
	//搜尋全部的Cookie
	for (count=0; count<AllCookieArray.length; count++)
	{
		var CookieName = AllCookieArray[count].split("=");
		if (CookieName[0] == "language")
		{
			CookieNumber = count;
		}
	}

	//若有找到Cookie
	if (CookieNumber != -1)
	{
		CookieData = AllCookieArray[CookieNumber].split("=")[1]; //讀取數值
	}

	//Cookie內沒有資料
	if (CookieData != 1)
	{
		//偵測並決定語言
		if (navigator.language.toLowerCase() == ("zh-tw"||"zh-cn"||"zh-hk"||"zh-sg"))
		{
			document.getElementById("selectLanguage").value = "tc";
			document.cookie = 'language=tc; max-age=3600'; //使用Cookie記錄使用語言
		}
		else
		{
			document.getElementById("selectLanguage").value = "en";
			document.cookie = 'language=en; max-age=3600'; //使用Cookie記錄使用語言
		}
		
		LanguageSelected();
	}
}

//選擇語言後的動作
function LanguageSelected()
{
	var SelectedLanguage = document.getElementById("selectLanguage").value;

	if (SelectedLanguage == "tc")
	{
		LanguageTC();
	}
	else
	{
		LanguageEN();
	}
	
	//字型調整選項的文字
	document.getElementById("spanFontSize").innerHTML = LanguageString[10] + SpanFontOptions[0];
	document.getElementById("spanFontSpacing").innerHTML = LanguageString[11] + SpanFontOptions[1];
	document.getElementById("spanFontVerticalOffset").innerHTML = LanguageString[12] + SpanFontOptions[2];
	document.getElementById("spanFontLineSpacing").innerHTML = LanguageString[15] + SpanFontOptions[3];
	
	//全選複製按鈕、儲存檔案按鈕
	document.getElementById("inputCopyButton").value = LanguageString[13];
	document.getElementById("inputSaveButton").value = LanguageString[14];
	
	StringChange();
}

//當文字選取區的訊息編號變動
function StringChange()
{
	document.getElementById("pFileSelecter").innerHTML = LanguageString[16];
	var FileSelectAreaTextStringNumber = document.getElementById("numberMessage").value;
	document.getElementById("pMessage").innerHTML = LanguageString[FileSelectAreaTextStringNumber];
	
	if (FileSelectAreaTextStringNumber == 0)
	{
		document.getElementById("divMessage").style.display = "none";
	}
	else
	{
		document.getElementById("divMessage").style.display = "inline-flex";
	}
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
	var FontSizeSet = document.getElementById("inputFontSize").value; //字型大小設定值
	var FontLineSpacingSet = document.getElementById("inputFontLineSpacing").value; //行距設定值
	
	if (FontSizeSet != "" && FontSizeSet < 1)
	{
		document.getElementById("inputFontSize").value = 1; //使字型大小始終大於1
	}
	
	if (FontLineSpacingSet < 1)
	{
		document.getElementById("inputFontLineSpacing").value = 100;
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
	document.getElementById("numberMessage").value = 0;
	StringChange();
	document.getElementById("pMessage").style.color = "rgb(255,255,255)";
	document.getElementById("divResult").style.display = "none";
}

//檢查檔案類型及大小
function FileCheck()
{
	Initialization();
		
	if (InputFile.name.substr(InputFile.name.lastIndexOf(".")) != ".fnt") //假如檔案不是FNT檔
	{
		InputFile = null; //清空檔案
		document.getElementById("inputFileSelecter").value = null;
		document.getElementById("numberMessage").value = 1;
		StringChange();
		document.getElementById("pMessage").style.color = "rgb(255,0,0)";
		FileSelectTextEffecter();
	}
	else if (InputFile.size > 10485760) //假如檔案大小超過 10MB
	{
		InputFile = null;
		document.getElementById("inputFileSelecter").value = null;
		document.getElementById("numberMessage").value = 2;
		StringChange();
		document.getElementById("pMessage").style.color = "rgb(255,0,0)";
		FileSelectTextEffecter();
	}
	else
	{		
		//使用FileReader以Text格式解析輸入的檔案
		var FNTReader = new FileReader();
		
		document.getElementById("numberMessage").value = 3;
		StringChange();
		
		FNTReader.readAsText(InputFile);
		FNTReader.onload = function()
		{
			document.getElementById("textareaContents").value = this.result; //將解析內容儲存到textareaContents
			Convert();
		}
	}
}

//轉換程式
function Convert()
{
	Initialization();
	
	document.getElementById("numberMessage").value = 4;
	StringChange();
	
	var OutputXMLCharacter = "";
	
	//使用DOMParser以XML格式解析內容
	var Parser = new DOMParser();
	var ParserData = document.getElementById("textareaContents").value; //從textareaContents讀取內容
	
	document.getElementById("numberMessage").value = 5;
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
		var FontLineSpacingOutput = 100;
		
		var FontSizeSet = document.getElementById("inputFontSize").value; //字型大小設定值
		var FontSpacingSet = document.getElementById("inputFontSpacing").value; //字型間距設定值
		var FontVerticalOffsetSet = document.getElementById("inputFontVerticalOffset").value; //垂直位移設定值
		var FontLineSpacingSet = document.getElementById("inputFontLineSpacing").value; //行距設定值
		
		//字型大小的數值結果
		if (FontSizeSet > 0) { FontSizeOutput = FontSizeSet; }
		else if (FontSizeSet != "") { FontSettingError += 1; }
		
		//字型間距的數值結果
		if (FontSpacingSet >= 0 || FontSpacingSet < 0) { FontSpacingOutput = FontSpacingSet; }
		else if (FontSpacingSet != "") { FontSettingError += 1; }
		
		//垂直位移的數值結果
		if (FontVerticalOffsetSet >= 0 || FontVerticalOffsetSet < 0) { FontVerticalOffsetOutput = FontVerticalOffsetSet; }
		else if (FontVerticalOffsetSet != "") { FontSettingError += 1; }
		
		//垂直位移的數值結果
		if (FontLineSpacingSet > 0) { FontLineSpacingOutput = FontLineSpacingSet; }
		else if (FontLineSpacingSet != "") { FontSettingError += 1; }
		
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
		document.getElementById("textareaResult").value = '<?xml version=1.0 encoding=UTF-8 ?>\n'
		+ '<FontData width='+InputFNTCommon.attributes["scaleW"].value+' height='+InputFNTCommon.attributes["scaleH"].value+' padding='+InputFNTInfo.attributes["padding"].value.split(',')[0] * 2+' font_size='+FontSizeOutput+' font_scale=100 line_spacing='+FontLineSpacingOutput+'>\n'
		+ '<FontDetails> \n'
		+ OutputXMLCharacter
		+ '</FontDetails>\n'
		+ '</FontData>';
		
		//判斷是否為重新轉換
		if (ConvertAgain == true)
		{
			document.getElementById("numberMessage").value = 6;
		}
		else
		{
			document.getElementById("numberMessage").value = 7;
		}
		
		ConvertAgain = false;
		
		document.getElementById("pMessage").style.color = "rgb(100,200,100)";
		
		//字型調整的輸入有誤
		if (FontSettingError > 0)
		{
			document.getElementById("numberMessage").value = 8;
			document.getElementById("pMessage").style.color = "rgb(255,255,0)";
		}
		
		StringChange();
		document.getElementById("inputFileSelecter").value = null;
		
		//檔案選取區的文字訊息特效
		FileSelectTextEffecter();
		
		//顯示轉換結果輸出區
		document.getElementById("divResult").style.display = "block";
		
		//轉換結果文字特效
		OutputFileSelectTextEffecter();		
	}
	catch (e)
	{
		InputFile = null;
		document.getElementById("inputFileSelecter").value = null;
		document.getElementById("numberMessage").value = 9;
		document.getElementById("pMessage").style.color = "rgb(255,0,0)";
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
	var FileSelectTextColorData = document.getElementById("pMessage").style.color.replace("rgb","").replace("(","").replace(")","").split(",");
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
		
		document.getElementById("pMessage").style.color = "rgb(" + FileSelectTextColorR + "," + FileSelectTextColorG + "," + FileSelectTextColorB + ")";
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
		document.getElementById("textareaResult").style.color = "rgba(255,255,255," + OutputTextOpacity + ")";
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
	var TextareaOutput = document.getElementById("textareaResult");
	
	OutputText.selectNode(TextareaOutput); //先執行第一種選取方式
	var Select = window.getSelection();
	Select.removeAllRanges();
	Select.addRange(OutputText);
	
	TextareaOutput.select(); //再執行第二種選取方式，以防部分瀏覽器不支援第一種選取方式
	
	document.execCommand("copy");
	
	document.getElementById("numberMessage").value = 17;
	StringChange();
}

//儲存檔案
function SaveFile(FileName)
{
	var DataText = new Blob([document.getElementById("textareaResult").value]);
	
	//若為IE
	if (navigator.msSaveBlob)
	{
		window.navigator.msSaveOrOpenBlob(DataText, "font_data.xml");
	}
	else
	{
		var URLObject = window.URL || window.webkitURL || window;
		var SaveLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
		SaveLink.href = URLObject.createObjectURL(DataText);
		SaveLink.download = FileName;
		AutoClick(SaveLink);
	}
	
	document.getElementById("numberMessage").value = 18;
	StringChange();
}

function AutoClick(Object)
{
	var ClickEvent = document.createEvent("MouseEvents");
	ClickEvent.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	Object.dispatchEvent(ClickEvent);
}

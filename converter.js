var LanguageString = [];
var ShowingMessage = 0;
var FNTsize = null;

//頁面讀取完成時
window.onload = function()
{
	//定義並抓取網頁內數值
	inputFontSize = document.getElementById("inputFontSize");
	inputFontCharacterSpacing = document.getElementById("inputFontCharacterSpacing");
	inputFontVerticalOffset = document.getElementById("inputFontVerticalOffset");
	inputFontLineSpacing = document.getElementById("inputFontLineSpacing");
	divMessage = document.getElementById("divMessage");
	pMessage = document.getElementById("pMessage");
	divResult = document.getElementById("divResult");
	textareaResult = document.getElementById("textareaResult");
	selectLanguage = document.getElementById("selectLanguage");
	
	//若Cookie內有語言紀錄
	if (GetCookie("language") != null)
	{
		if (GetCookie("language") == "")
		{
			DetectLanguage();
		}
		else
		{
			//自動選取Cookie指定的語言
			selectLanguage.value = GetCookie("language");
		}
	}
	else
	{
		DetectLanguage();
	}
	
	LanguageChanged(selectLanguage.value);
	
	//讓開啟JavaScript者顯示出語言選擇器及字型調整區
	document.getElementById("pLanguage").style.visibility = "visible";
	document.getElementById("divFontSetting").style.display = "block";
}

function DetectLanguage()
{
	//自動偵測並選取語言
	switch (navigator.language.toLowerCase())
	{
		case "zh-cn":
		case "zh-hk":
		case "zh-mo":
		case "zh-sg":
		case "zh-tw":
		case "zh-chs":
		case "zh-cht":
			selectLanguage.value = "zh-cht";
			break;
		default:
			selectLanguage.value = "en-us";
	}
}

//讀取Cookie
function GetCookie(CookieName)
{
	AllCookieArray = document.cookie.split(";"); //取得全部Cookie並解析為陣列
		
	//搜尋全部的Cookie
	for (count=0; count<AllCookieArray.length; count++)
	{
		var AllCookieName = AllCookieArray[count].split("=");
		if (AllCookieName[0] == CookieName)
		{
			return AllCookieName[1];
		}
	}
}

//設定語言
function LanguageSet(LanguageID)
{
	if (LanguageID == "zh-cht")
	{
		LanguageString[0] = "";
		LanguageString[1] = "檔案類型不符合！";
		LanguageString[2] = "檔案大小不能超過10MB！";
		LanguageString[3] = "正在讀取檔案…";
		LanguageString[4] = "轉換完畢。";
		LanguageString[5] = "已重新轉換完畢。";
		LanguageString[6] = "轉換失敗！檔案內容可能有誤。";
		LanguageString[7] = "點擊此處選取檔案<br /><br />或直接拖曳檔案至頁面上即可開始轉換";
		LanguageString[8] = "字型大小：";
		LanguageString[9] = "字距：";
		LanguageString[10] = "垂直位移：";
		LanguageString[11] = "行距：";
		LanguageString[12] = "重新轉換";
		LanguageString[13] = "全選並複製";
		LanguageString[14] = "儲存檔案";
		LanguageString[15] = "轉換內容已複製至剪貼簿。";
		LanguageString[16] = "已自動生成 font_data.xml 檔案並下載。";
		LanguageString[17] = "正在轉換…";
		LanguageString[18] = "預設值";
	}
	else
	{
		LanguageString[0] = "";
		LanguageString[1] = "The file extension don't match.";
		LanguageString[2] = "The file size requires less than 10 MB.";
		LanguageString[3] = "Loading file...";
		LanguageString[4] = "The conversion is completed.";
		LanguageString[5] = "The conversion is done again.";
		LanguageString[6] = "The conversion is failed! The file contents may incorrectly.";
		LanguageString[7] = "Click here to select a file<br /><br />or drag a file on page to start";
		LanguageString[8] = "Font Size: ";
		LanguageString[9] = "Spacing: ";
		LanguageString[10] = "Vertical Offset: ";
		LanguageString[11] = "Line Spacing: ";
		LanguageString[12] = "Reconvert";
		LanguageString[13] = "Copy Contents";
		LanguageString[14] = "Save As";
		LanguageString[15] = "The contents already copied to clipboard.";
		LanguageString[16] = "The file 'font_data.xml' has started download to your device.";
		LanguageString[17] = "Converting...";
		LanguageString[18] = "Default";
	}
}

//選擇語言後
function LanguageChanged(LanguageID)
{
	LanguageSet(LanguageID);
		
	//套入檔案選取區的文字
	document.getElementById("pFileSelecter").innerHTML = LanguageString[7];
	
	//套入字型調整區的文字
	document.getElementById("spanFontSize").innerHTML = LanguageString[8];
	document.getElementById("spanFontCharacterSpacing").innerHTML = LanguageString[9];
	document.getElementById("spanFontVerticalOffset").innerHTML = LanguageString[10];
	document.getElementById("spanFontLineSpacing").innerHTML = LanguageString[11];
	
	//套入字型調整區的欄位背景值
	if (FNTsize == null)
	{
		inputFontSize.placeholder = "(" + LanguageString[18] + ")";
	}
	
	//套入按鈕的文字
	document.getElementById("inputRestartButton").value = LanguageString[12];
	document.getElementById("inputCopyButton").value = LanguageString[13];
	document.getElementById("inputSaveButton").value = LanguageString[14];
	
	//套入顯示的訊息
	pMessage.innerHTML = LanguageString[ShowingMessage];
	
	//將選擇的語言寫入Cookie
	document.cookie = "language="+LanguageID+"; max-age=2592000; path=/; SameSite=Lax";
}

//顯示訊息
function ShowMessage(MessageNumber)
{
	//先重置，將訊息區隱藏並取消特效動畫
	divMessage.style.display = "none";
	divMessage.style.animationName = "";
	
	//當字串內容不為空白時
	if (LanguageString[MessageNumber] != "")
	{
		pMessage.innerHTML = LanguageString[MessageNumber];
		
		//延遲執行的內容
		function DelayRun()
		{
			//顯示出訊息區
			divMessage.style.display = "inline-flex";
			
			//使用淡入特效動畫
			divMessage.style.animationDuration = "1.3s";
			divMessage.style.animationDelay = "0s";
			divMessage.style.animationIterationCount = "1";
			divMessage.style.animationName = "FadeIn";
		}
		
		setTimeout(DelayRun, 100);
	}
	
	clearTimeout(DelayRun); //嘗試清除計時器以防意外
	ShowingMessage = MessageNumber;
}

//進行拖曳時
function DrapOver(DragOverFile)
{
	DragOverFile.preventDefault(); //取消事件以防頁面跳轉
}

//拖曳檔案後
function DropFile(DragOverFile)
{
	DragOverFile.preventDefault();
	UploadedFile = DragOverFile.dataTransfer.files[0];
	CheckFile();
}

//選取檔案後
function SelectFile()
{
	UploadedFile = event.target.files[0];
	CheckFile();
}

//檢查檔案類型及大小
function CheckFile()
{	
	if (UploadedFile != null)
	{
		ShowMessage(0);
		divResult.style.display = "none";
		
		if (UploadedFile.name.substr(UploadedFile.name.lastIndexOf(".")) != ".fnt") //假如副檔名不是FNT
		{
			ClearFile();
			ShowMessage(1);
		}
		else if (UploadedFile.size > 10485760) //假如檔案大小超過10MB
		{
			ClearFile();
			ShowMessage(2);
		}
		else
		{
			ShowMessage(3);
			
			var FNTReader = new FileReader();
			FNTReader.readAsText(UploadedFile);
			FNTReader.onload = function()
			{
				FNTContents = this.result;
				FirstConvert = true;
				Convert();
			}
		}
	}
}

//清空檔案
function ClearFile()
{
	UploadedFile = null;
	document.getElementById("inputFileSelecter").value = null;
}

//檢查並校正指定值
function FontSettingCheck()
{
	if (inputFontSize.value != "" && inputFontSize.value < 1)
	{
		inputFontSize.value = "";
	}
}

//轉換程式
function Convert()
{
	var XMLcharacter = "";
	var parserFNT = new DOMParser();
	
	ShowMessage(17);
	
	//開始轉換
	try
	{
		var parserResult = parserFNT.parseFromString(FNTContents, "text/xml");
	
		var FNTchar = parserResult.getElementsByTagName("char");
		var FNTinfo = parserResult.getElementsByTagName("info")[0];
		var FNTcommon = parserResult.getElementsByTagName("common")[0];
		
		FNTsize = FNTinfo.attributes["size"].value;
		var FNTspacing = FNTinfo.attributes["spacing"].value.split(",")[0];
				
		//設定字型初始值
		var setFontSize = FNTsize;
		var setFontVerticalOffset = 0;
		var setFontCharacterSpacing = FNTspacing;
		var setFontLineSpacing = 100;
		
		//套入欄位背景值
		inputFontSize.placeholder = FNTsize + " px";
		inputFontCharacterSpacing.placeholder = FNTspacing;
		
		//若有指定值則套入
		if (inputFontSize.value != "")
		{
			setFontSize = Number(inputFontSize.value);
		}
		
		if (inputFontCharacterSpacing.value != "")
		{
			setFontCharacterSpacing = Number(inputFontCharacterSpacing.value);
		}
		
		if (inputFontVerticalOffset.value != "")
		{
			setFontVerticalOffset = Number(inputFontVerticalOffset.value);
		}
		
		if (inputFontLineSpacing.value != "")
		{
			setFontLineSpacing = Number(inputFontLineSpacing.value);
		}
						
		//轉換Char的格式
		for (obj in FNTchar)
		{
			if (typeof(FNTchar[obj]) == "object")
			{
				var code = FNTchar[obj].attributes["id"].value;
				var u = Number(FNTchar[obj].attributes["x"].value);
				var v = Number(FNTchar[obj].attributes["y"].value);
				var w = u + Number(FNTchar[obj].attributes["width"].value);
				var h = v + Number(FNTchar[obj].attributes["height"].value);
				var preshift = FNTchar[obj].attributes["xoffset"].value;
				
				var yoffset = (+FNTchar[obj].attributes["yoffset"].value);
				var base = Number(FNTcommon.attributes["base"].value);
				var spacing = Number(FNTspacing * 2);
				
				var yadjust = (-yoffset)+(base-spacing);
				var postshift = (+FNTchar[obj].attributes["xadvance"].value);			
				
				XMLcharacter += '<character code='+code+' u='+u+' v='+v+' w='+w+' h='+h+' preshift='+preshift+' yadjust='+(yadjust + Number(setFontVerticalOffset))+' postshift='+(postshift + Number(setFontCharacterSpacing))+' />\n';
			}
		}
		
		//輸出所有轉換結果
		textareaResult.value = '<?xml version=1.0 encoding=UTF-8 ?>\n'
		+ '<FontData width='+FNTcommon.attributes["scaleW"].value+' height='+FNTcommon.attributes["scaleH"].value+' padding='+FNTinfo.attributes["padding"].value.split(',')[0] * 2+' font_size='+setFontSize+' font_scale=100 line_spacing='+setFontLineSpacing+'>\n'
		+ '<FontDetails> \n'
		+ XMLcharacter
		+ '</FontDetails>\n'
		+ '</FontData>';
		
		//判斷是否為初次轉換
		if (FirstConvert == true)
		{
			ShowMessage(4);
		}
		else
		{
			ShowMessage(5);
		}
		
		FirstConvert = false;
				
		//顯示轉換結果輸出區
		divResult.style.display = "block";
	}
	catch (e)
	{
		ShowMessage(6);
		
		inputFontSize.placeholder = "(" + LanguageString[18] + ")";
		inputFontCharacterSpacing.placeholder = "0";
		
		console.log(e);
	}
}

//複製內容
function CopyResult()
{	
	textareaResult.select();
	document.execCommand("copy");
	ShowMessage(15);
}

//儲存檔案
function SaveFile(FileName)
{
	var ResultText = new Blob([textareaResult.value]);
	
	//若為IE
	if (navigator.msSaveBlob)
	{
		navigator.msSaveOrOpenBlob(ResultText, "font_data.xml");
	}
	else
	{
		var URLObject = window.URL || window.webkitURL || window;
		var SaveLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
		SaveLink.href = URLObject.createObjectURL(ResultText);
		SaveLink.download = FileName;
		
		var ClickEvent = document.createEvent("MouseEvents");
		ClickEvent.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);		
		SaveLink.dispatchEvent(ClickEvent);
	}
	
	ShowMessage(16);
}
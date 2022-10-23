var LanguageString = [];
var ShowingMessage = 0;
var IntervalTimer;

//變更字串為中文
function LanguageTC()
{
	LanguageString[0] = "";
	LanguageString[1] = "檔案類型不符合！";
	LanguageString[2] = "檔案大小不能超過10MB！";
	LanguageString[3] = "正在讀取檔案…";
	LanguageString[4] = "轉換完畢。";
	LanguageString[5] = "已重新轉換完畢。";
	LanguageString[6] = "轉換失敗！檔案內容可能有誤。";
	LanguageString[7] = "<p>點擊此處選取檔案<p/><p/>或直接拖曳檔案至頁面上即可開始轉換</p>";
	LanguageString[8] = "字型大小：";
	LanguageString[9] = "垂直位移：";
	LanguageString[10] = "間距：";
	LanguageString[11] = "行距：";
	LanguageString[12] = "重新轉換";
	LanguageString[13] = "全選並複製";
	LanguageString[14] = "儲存檔案";
	LanguageString[15] = "轉換內容已複製至剪貼簿。";
	LanguageString[16] = "已自動生成 font_data.xml 檔案並下載。";
	LanguageString[17] = "正在轉換…";
}

//變更字串為英文
function LanguageEN()
{
	LanguageString[0] = "";
	LanguageString[1] = "The file extension don't match.";
	LanguageString[2] = "The file size requires less than 10 MB.";
	LanguageString[3] = "Loading file...";
	LanguageString[4] = "Processing finished.";
	LanguageString[5] = "Processing is done again.";
	LanguageString[6] = "Processing failed! The contents of the file may be incorrect.";
	LanguageString[7] = "<p>Click here to select a file</p><p>or drag a file on page to start</p>";
	LanguageString[8] = "Font Size: ";
	LanguageString[9] = "Vertical Offset: ";
	LanguageString[10] = "Spacing: ";
	LanguageString[11] = "Line Spacing: ";
	LanguageString[12] = "Restart";
	LanguageString[13] = "Copy All";
	LanguageString[14] = "Save File";
	LanguageString[15] = "The contents already copied to clipboard.";
	LanguageString[16] = "The file 'font_data.xml' has started download to your device.";
	LanguageString[17] = "Processing...";
}

//頁面讀取完成時
window.onload = function()
{
	selectLanguage = document.getElementById("selectLanguage");
	divResult = document.getElementById("divResult");
	textareaResult = document.getElementById("textareaResult");
	inputFontSize = document.getElementById("inputFontSize");
	inputFontVerticalOffset = document.getElementById("inputFontVerticalOffset");
	inputFontSpacing = document.getElementById("inputFontSpacing");
	inputFontLineSpacing = document.getElementById("inputFontLineSpacing");

	//自動偵測並選取語言
	if (navigator.language.toLowerCase() == ("zh-tw"||"zh-cn"||"zh-hk"||"zh-sg"))
	{
		selectLanguage.value = "tc";
	}
	else
	{
		selectLanguage.value = "en";
	}
	
	LanguageSelected();
	
	//顯示字型調整區
	document.getElementById("divFontSetting").style.display = "block";
	
	FirstConvert = false;
}

//選擇語言後
function LanguageSelected()
{
	//讀取選擇的語言
	if (selectLanguage.value == "tc")
	{
		LanguageTC();
	}
	else
	{
		LanguageEN();
	}
	
	//設定檔案選取區的文字
	document.getElementById("pFileSelecter").innerHTML = LanguageString[7];
	
	//設定字型調整的文字
	document.getElementById("spanFontSize").innerHTML = LanguageString[8];
	document.getElementById("spanFontVerticalOffset").innerHTML = LanguageString[9];
	document.getElementById("spanFontSpacing").innerHTML = LanguageString[10];
	document.getElementById("spanFontLineSpacing").innerHTML = LanguageString[11];
	
	//設定按鈕文字
	document.getElementById("inputRestartButton").value = LanguageString[12];
	document.getElementById("inputCopyButton").value = LanguageString[13];
	document.getElementById("inputSaveButton").value = LanguageString[14];
	
	//轉換正在顯示的訊息
	ShowMessage(ShowingMessage);
}

//顯示訊息
function ShowMessage(MessageNumber)
{
	var divMessage = document.getElementById("divMessage");
	
	//重置
	divMessage.style.display = "none";
	divMessage.style.visibility = "hidden";
	divMessage.style.animationName = "";
	
	//當字串內容不為空白時
	if (LanguageString[MessageNumber] != "")
	{
		clearInterval(IntervalTimer); //重置計時器
		IntervalTimer = setInterval(IntervalTimer2, 30); //使用計時器
		IntervalTimerNumber = 0;
		
		function IntervalTimer2()
		{
			if (IntervalTimerNumber < 4)
			{
				IntervalTimerNumber += 1;
			}
			else
			{
				divMessage.style.display = "inline-flex";
				divMessage.style.visibility = "visible";
				
				//使用淡入特效
				divMessage.style.animationName = "FadeIn";
				divMessage.style.animationDuration = "1.2s";
				divMessage.style.animationDelay = "0s";
				divMessage.style.animationIterationCount = "1";

				clearInterval(IntervalTimer); //清除計時器
			}
		}
		
		document.getElementById("pMessage").innerHTML = LanguageString[MessageNumber];
	}
	
	ShowingMessage = MessageNumber;
}

//進行拖曳時
function DrapOver(DragOverFile)
{
	DragOverFile.preventDefault(); //停止拖曳後所執行的事件
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
	ShowMessage(0);
	divResult.style.display = "none";
	
	if (UploadedFile != null)
	{
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
		
		var setFontSize = FNTinfo.attributes["size"].value;
		var setFontVerticalOffset = 0;
		var setFontSpacing = 0;
		var setFontLineSpacing = 100;
		
		if (inputFontSize.value != "")
		{
			setFontSize = Number(inputFontSize.value);
		}
		if (inputFontVerticalOffset.value != "")
		{
			setFontVerticalOffset = Number(inputFontVerticalOffset.value);
		}
		if (inputFontSpacing.value != "")
		{
			setFontSpacing = Number(inputFontSpacing.value);
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
				var spacing = Number(FNTinfo.attributes["spacing"].value.split(",")[0] * 2);
				var yadjust = (-yoffset)+(base-spacing);
				
				var postshift = (+FNTchar[obj].attributes["xadvance"].value);			
				
				XMLcharacter += '<character code='+code+' u='+u+' v='+v+' w='+w+' h='+h+' preshift='+preshift+' yadjust='+(yadjust + Number(setFontVerticalOffset))+' postshift='+(postshift + Number(setFontSpacing))+' />\n';
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
	}
	
	ClearFile();
}

//檢查並校正指定值
function FontSettingCheck()
{
	if (inputFontSize.value != "" && inputFontSize.value < 1)
	{
		inputFontSize.value = "";
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
		window.navigator.msSaveOrOpenBlob(ResultText, "font_data.xml");
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
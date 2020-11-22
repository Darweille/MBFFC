//轉址間隔

var AllCookieArray = document.cookie.split(";"); //取得全部Cookie並解析為陣列
var CookieMobileNumber = -1;
var CookieMobileData = 0;

//搜尋全部的Cookie
for (count=0; count<AllCookieArray.length; count++)
{
	var CookieName = AllCookieArray[count].split("=");
	if (CookieName[0] == "RedirectionInterval")
	{
		CookieMobileNumber = count;
	}
}

//若有找到Cookie
if (CookieMobileNumber != -1)
{
	CookieMobileData = AllCookieArray[CookieMobileNumber].split("=")[1]; //讀取數值
}

if (CookieMobileData != 1)
{
	//判斷解析度的寬度
	if (screen.width < 768)
	{
		document.cookie = 'RedirectionInterval=1; max-age=60'; //使用Cookie記錄來間隔
		location.replace("mobile.html");
	}
}
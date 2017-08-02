   // 这个方法用来储存每个文本对象
    function TextContent(x, y, textContent, maxLenght,fontName,fontSize,color,contentType) {
      this.x = Number(x);//canvas横向定位左标
      this.y = Number(y);//canvas纵向定位左标
      this.color ="black";//文本颜色
      if(color)
      	this.color =color;
      this.textContent=textContent;//文本内容
      this.contentType=contentType;//无素类型
      this.imageMode;
      this.isSelected = false;//是否被选中
      this.maxLenght=10;//文本最大长度
      this.textAreaWidth=0;//文本总宽度
      this.textAreaHeight=0;//文本总高度
      this.fontName="serif";//字体名称
      if(fontName)
      	this.fontName=fontName;
      this.fontSize=10;//字体大小
      if(fontSize)
      	this.fontSize=Number(fontSize);
      this.font=this.fontSize.toString()+"px "+this.fontName;//文本字体定义
    }

    // 保存画布上所有的文本对象集合
    var textModels = [];
    var canvas;//canvas对象
    var context2d;//canvas2d绘图上下文
 		var previousSelectedText;//被选中的文本对象
 		
 		//注册canvas事件
    window.onload = function() {
    	
      canvas = document.getElementById("canvas");
      context2d = canvas.getContext("2d");
      canvas.onmousedown = canvasClick;
      canvas.onmouseup = stopDragging;
      //canvas.onmouseout = stopDragging;
      canvas.onmousemove = dragCircle;
    };
 
 		//添加文本内容至要绘制的数组中
    function addTextContent() {
    	
    	textModels=[];
    	//遍历文本内容集合区域
    	$("#textList div").each(function(){
    		//获得待绘制内容类型
    		var contentType=$(this).attr("data-type");
    		var textContent;
    		if(contentType=="text")
    		{
	    		var txtcontent=$(this).find("[name='txtcontent']").val();//文本内容
	    		var x_axis=$(this).find("[name='x_axis']").val();//横坐标
	    		var y_axis=$(this).find("[name='y_axis']").val();//纵坐标
	    		var maxwidth=$(this).find("[name='maxwidth']").val();//文本最大宽度
	    		var fontname=$(this).find("[name='fontname']").val();//字体样式
	    		var fontsize=$(this).find("[name='fontsize']").val();//字体大小
	    		//todo:资料验证
    		
	    		//加入待绘制文本对列
	    		textContent = new TextContent(x_axis,y_axis,txtcontent,maxwidth,fontname,fontsize,"blue",contentType);
	    		//计算文本需要的宽度及高度
	    		context2d.font=fontsize.toString()+"px "+fontname;
	    		var textRealWidth=context2d.measureText(txtcontent).width;
	    		var textAreaWidth=maxwidth;
	    		var textAreaHeight=fontsize;
	    		if(textRealWidth<maxwidth)
	    		{
	    			textAreaWidth=Number(textRealWidth)+Number(fontsize);
	    		}
	    		else
	    		{
	    			var linewrapnum=Math.ceil(textRealWidth/maxwidth);
	    			textAreaHeight=fontsize*linewrapnum;
	    		}
	    		textContent.textAreaWidth=Number(textAreaWidth);
	    		textContent.textAreaHeight=Number(textAreaHeight);
    		}
    		else if(contentType=="qrcode")
    		{
    			var txtcontent=$(this).find("[name='txtcontent']").val();//二维码内容
	    		var x_axis=$(this).find("[name='x_axis']").val();//横坐标
	    		var y_axis=$(this).find("[name='y_axis']").val();//纵坐标
	    		var imgwidth=$(this).find("[name='imgwidth']").val();//二维码宽度
	    		var imgheight=$(this).find("[name='imgheight']").val();//二维码高度
	    		//todo:资料验证
    		
	    		//加入待绘制二维码到队列
	    		textContent = new TextContent(x_axis,y_axis,txtcontent,0,"",0,"",contentType);
	    		textContent.textAreaWidth=Number(imgwidth);
	    		textContent.textAreaHeight=Number(imgheight);
    		}
    		// 把它保存在数组中
      		textModels.push(textContent);
    		
  		});
  		// 重新绘制画布
      drawtextModels();
    	
    	/*
      // 为圆圈计算一个随机大小和位置
      var radius = randomFromTo(10, 60);
      var x = randomFromTo(0, canvas.width);
      var y = randomFromTo(0, canvas.height);
	    // 为圆圈计算一个随机颜色
	    var colors = ["green", "blue", "red", "yellow", "magenta", "orange", "brown", "purple", "pink"];
	    var color = colors[randomFromTo(0, 8)];
      // 创建一个新圆圈
      var textContent = new TextContent(x, y, "北京市西城区新街口外大街28号院 15号楼 100088", color);
      // 把它保存在数组中
      textModels.push(textContent);
      // 重新绘制画布
      drawtextModels();
			*/
    }
 
 		// 重新绘制画布中的文本对象集合
    function drawtextModels() {
      // 清除画布，准备绘制
      context2d.clearRect(0, 0, canvas.width, canvas.height);
      // 遍历所有文本内容
      for(var i=0; i<textModels.length; i++) {
        var textModel = textModels[i];
        
        if(textModel.contentType=="text")
        {
	        //绘制文本
	        //画布透明度
	        context2d.globalAlpha = 1;
	        context2d.font=textModel.font;
	        context2d.fillStyle=textModel.color;
			//文本被选中时显示红色外框线
	        if (textModel.isSelected) {
	        	//绘制选中文本的外框线
		        context2d.strokeStyle = "red";
		        context2d.lineWidth=1;  
		        context2d.font=textModel.font;
		        context2d.strokeRect(textModel.x-3,(textModel.y-textModel.fontSize),textModel.textAreaWidth+textModel.fontSize/2,textModel.textAreaHeight+3);
	        }
		      //计算每行可显示的字数
	      	var fontNum=Math.floor(textModel.textAreaWidth/(textModel.fontSize/2))+1;//加1是为了多出半个字符的宽度
	      	writeTextOnCanvas(context2d,textModel.fontSize,fontNum,textModel.textContent,textModel.x, textModel.y);
      	}
        else if(textModel.contentType=="qrcode")
        {
        	if(textModel.imageMode)
        	{
        		context2d.drawImage(textModel.imageMode, textModel.x, textModel.y); 
        	}
        	else
        	{
	        	setQrCode(textModel.textContent, textModel.textAreaWidth,textModel.textAreaHeight, "qrcodeW");
	        	var codeImg = $("#qrcodeW").find('img')[0];
	        	//浏览器加载图片完毕后再绘制图片
			    codeImg.onload = function(){
			    	textModel.imageMode=codeImg;
			    	//alert($("#qrcodeW").find('img')[0].src);
			    	context2d.drawImage(textModel.imageMode, textModel.x, textModel.y);  
			    }
		    }
        	if (textModel.isSelected) {
	        	//绘制选中文本的外框线
		        context2d.strokeStyle = "red";
		        context2d.lineWidth=1; 
		        context2d.strokeRect(textModel.x,textModel.y,textModel.textAreaWidth,textModel.textAreaHeight);
	        }
        }
      }
    }
 /*
 * 功能:生成二维码
 * 创建人：syy
 * 创建时间：2016-9-22
 */
function setQrCode(contentText, imgwidth,imgheight, codeElement) {
	var urlCode = "";
	$("#"+codeElement).html('');
	var qrcode = new QRCode(document.getElementById(codeElement), {
		width: Number(imgwidth), //设置宽高
		height: Number(imgheight)
	});
	qrcode.makeCode(contentText);
}

 function dataURLtoBlob(dataurl) {
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while(n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {
		type: mime
	});
}
 
    function canvasClick(e) {
      // 取得画布上被单击的点
      var clickX = e.pageX - canvas.offsetLeft;
      var clickY = e.pageY - canvas.offsetTop;
 
      // 查找被单击的文本
      for(var i=textModels.length-1; i>=0; i--) {
        var textModel = textModels[i];
        //使用勾股定理计算这个点与圆心之间的距离
        //var distanceFromCenter = Math.sqrt(textModel.x + textModel.y)
        // 判断这个点是否在圆圈中
        //if (distanceFromCenter <= textModel.radius)
        //alert(clickX);858
        //alert(textModel.x);32
        //测量文本宽度
        //alert(context2d.measureText(textModel.textModel.substr(0, 1)).width);
        
//      alert(textModel.y+textModel.fontSize);
//      alert(clickY);
//      alert(textModel.y+textModel.fontSize-textModel.textAreaHeight);
        
        //判断鼠标点击坐标内是否有文本对象
        if(textModel.x<=clickX&&clickX<=textModel.x+textModel.textAreaWidth && textModel.y-textModel.fontSize<=clickY&&clickY<=textModel.y-textModel.fontSize+textModel.textAreaHeight)
        {
          // 清除之前选择的圆圈
          if (previousSelectedText != null)
          {
          	previousSelectedText.isSelected = false;
          }
          previousSelectedText = textModel;
          //选择新文本
          textModel.isSelected = true;
          // 使圆圈允许拖拽
          isDragging = true;
          //更新显示
          drawtextModels();
 
 
          //停止搜索
          return;
        }
        else
        {
        	//选择新圆圈
          textModel.isSelected = false;
        }
        
      }
      //更新显示
      drawtextModels();
    }
 
 		//同步设置操作文本对应的文本框坐标值
 		function SetTextXYinput(x,y)
 		{
   			//判断当前操作文本对象
   			for(var i=textModels.length-1; i>=0; i--) {
        if(textModels[i].isSelected)
        {
        	//遍历文本内容集合区域
    			$("#textList div").eq(i).find("[name='x_axis']").val(x);//横坐标
    			$("#textList div").eq(i).find("[name='y_axis']").val(y);//纵坐标
        	return;
        }
      }
 		}
 
    //在某个范围内生成随机数
    function randomFromTo(from, to) {
      return Math.floor(Math.random() * (to - from + 1) + from);
    }
    
    var isDragging = false;
 
    function stopDragging() {
      isDragging = false;
      previousSelectedText=null;
      realx=0;
 			realy=0;
 			for(var i=textModels.length-1; i>=0; i--) {
        textModels[i].isSelected = false;
      }
			
 			drawtextModels();
    }
 
 var realx=0;
 var realy=0;
    function dragCircle(e) {
      // 判断圆圈是否开始拖拽
      if (isDragging == true) {
        // 判断拖拽对象是否存在
        if (previousSelectedText != null) {
          // 取得鼠标位置
          var x = e.pageX - canvas.offsetLeft;
          var y = e.pageY - canvas.offsetTop;

if(realx==0||realy==0)
{
realx=x-previousSelectedText.x;
realy=y-previousSelectedText.y;
}
//else
//{
//	realx=x-previousSelectedText.x-realx;
//	realy=y-previousSelectedText.y-realy;
//}
          // 将圆圈移动到鼠标位置
          previousSelectedText.x = x-realx;
          previousSelectedText.y = y-realy;
 					SetTextXYinput(previousSelectedText.x,previousSelectedText.y);
         // 更新画布
         drawtextModels();
        }
      }
     }
      
    //清空画布
    function clearCanvas() {
      // 去除所有圆圈
      textModels = [];
      // 重新绘制画布.
      drawtextModels();
    }
    
 
//ctx_2d		getcontext2d("2d") 对象
//lineheight	段落文本行高
//bytelength	设置单字节文字一行内的数量
//text			写入画面的段落文本
//startleft		开始绘制文本的 x 坐标位置（相对于画布）
//starttop		开始绘制文本的 y 坐标位置（相对于画布）
function writeTextOnCanvas(ctx_2d, lineheight, bytelength, text ,startleft, starttop){
	function getTrueLength(str){//获取字符串的真实长度（字节长度）
		var len = str.length, truelen = 0;
		for(var x = 0; x < len; x++){
			if(str.charCodeAt(x) > 128){
				truelen += 2;
			}else{
				truelen += 1;
			}
		}
		return truelen;
	}
	function cutString(str, leng){//按字节长度截取字符串，返回substr截取位置
		var len = str.length, tlen = len, nlen = 0;
		for(var x = 0; x < len; x++){
			if(str.charCodeAt(x) > 128){
				if(nlen + 2 < leng){
					nlen += 2;
				}else{
					tlen = x;
					break;
				}
			}else{
				if(nlen + 1 < leng){
					nlen += 1;
				}else{
					tlen = x;
					break;
				}
			}
		}
		return tlen;
	}
	for(var i = 1; getTrueLength(text) > 0; i++){
		var tl = cutString(text, bytelength);
		ctx_2d.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), startleft, (i-1) * lineheight + starttop);
		text = text.substr(tl);
	}
}

function setCanvas()
{
    canvas.width=$("#canvaswidth").val();//注意：没有单位
    canvas.height=$("#canvasheight").val();//注意：没有单位
    context2d= canvas.getContext("2d");
    //更新画布
    drawtextModels();
}
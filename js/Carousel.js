;(function($){
	var Carousel=function(pictures){//对于同一个接口，用new object（）创建对象户产生大量重复代码，所以选用构造函数模式，用构造函数创建对象，函数名开头需大写，用以区分其他函数（也不是必要），说是构造函数其实就是有着和其它函数调用方式不同的唯一区别，但使用构造函数定义对象有着它的缺点，即会构造函数的每一个创建方法，但也可以把方法写到全局作用域里，但这样会让大码没有丝毫封装性可言，所以选用与原型模式结合。
		var self=this;
		// 保存单个旋转木马对象
		this.pictures=pictures;
		//保存ul标签
		this.picturesUl=pictures.find("ul.picture-list");
		//保存按钮
		this.picturesLeftBtn=pictures.find("div.left-btn");
		//保存右按钮
		this.picturesRightBtn=pictures.find("div.right-btn");
		//获取所有帧
		this.picturesItems=pictures.find("li.picture-item");
		if(this.picturesItems.size()%2==0){//如果为偶数帧则克隆第一帧构成奇数帧
				this.picturesUl.append(this.picturesItems.eq(0).clone());
				this.picturesItems =this.picturesUl.children();
			};
		//保存第一帧
		this.picturesFirstItem=this.picturesItems.first();
		//保存最后一帧
		this.picturesLastItem=this.picturesItems.last();
		this.flag=true;
		//默认的配置参数
		this.setting={
			"width":1200,
			"height":500,
			"picturewidth":800,
			"pictureheight":500,
			"type":"mid",//top,botttom
			"speed":500,//切换速度@
			"autoPlay":true,//是否执行自动播放
			"delay":1000,//自动播放速度
			"percent":0.9//后面帧与前面帧的比例关系
		 };
		 //配置参数添加到默认参数中
		$.extend(this.setting,this.getSetting());
		//设置参数的值
		this.setSettingValue();
		//设置各帧的位置
		this.setPicturesPos();
		//点击左右按钮的播放效果(flag用于防止连续快速点击多次出现的bug)
		this.picturesLeftBtn.click(function(){
			if(self.flag){
				self.flag=false;
				self.setAnimate("left");
			};
		}
		
			);
		this.picturesRightBtn.click(
		function(){
			if(self.flag){
				self.flag=false;
				self.setAnimate("right");
			};
		}
			);
		//自动播放
		if(this.setting.autoPlay){
			this.autoPlay();
			this.pictures.hover(function(){
										window.clearInterval(self.timer);//如果鼠标放上去则停止
										},function(){
										self.autoPlay();//如果鼠标离开就执行
										});
		}
	};
	Carousel.prototype={//构造函数模式与原型模式相结合
	//自动播放效果
		autoPlay:function(){
		var self=this;//保存this防止this漂移
		this.timer=window.setInterval(function(){
				self.picturesRightBtn.click();
			},this.setting.delay);//执行点击右按钮事件并设置时间间隔
		},
		//设置左旋右旋
		setAnimate:function(dir){
			var _this_=this;
			var zIndexArr = [];
			if(dir==="left"){
				this.picturesItems.each(function(){
					var self = $(this),
					prev=self.prev().get(0)?self.prev():_this_.picturesLastItem,//有上一帧取上一帧否则拿到最后一帧
					width = prev.width(),
				  	height =prev.height(),
				   	zIndex = prev.css("zIndex"),
				   	opacity = prev.css("opacity"),
				   	left = prev.css("left"),
				   	top = prev.css("top");
				   	zIndexArr.push(zIndex);
				   	self.animate({
							   					width:width,
												height:height,
												opacity:opacity,
												left:left,
												top:top
												},_this_.setting.speed,function(){
				   		_this_.flag=true;//变成按钮可点击模式
				   	});
				   	});
				this.picturesItems.each(function(i){//zIdex的设置不用时间过度
					$(this).css("zIndex",zIndexArr[i]);
				});
			}

			else if(dir==="right"){
				this.picturesItems.each(function(){
					var self = $(this),
					next=self.next().get(0)?self.next():_this_.picturesFirstItem,
					width = next.width(),
				  	height =next.height(),
				   	zIndex = next.css("zIndex"),
				   	opacity = next.css("opacity"),
				   	left =next.css("left"),
				   	top = next.css("top");
				   	zIndexArr.push(zIndex);
				   	self.animate({
							   					width:width,
												height:height,
												zIndex:zIndex,
												opacity:opacity,
												left:left,
												top:top
												},_this_.setting.speed,function(){
				   		_this_.flag=true;
				   	});
				   	
				   	});
					this.picturesItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
				};

		},
		//设置配置参数值去控制基本的宽度高度等
		setSettingValue:function(){
			this.pictures.css({
				width:this.setting.width,
				height:this.setting.height
			});
			this.picturesUl.css({
				width:this.setting.width,
				height:this.setting.height
			});
			var wid=(this.setting.width-this.setting.picturewidth)/2;
			this.picturesLeftBtn.css({
				width:wid,
				height:this.setting.height,
				zIndex:Math.ceil(this.picturesItems.size()/2)
			});
			this.picturesRightBtn.css({
				width:wid,
				height:this.setting.height,
				zIndex:Math.ceil(this.picturesItems.size()/2)
			});
			this.picturesFirstItem.css({
				left:wid,
				width:this.setting.picturewidth,
				height:this.setting.pictureheight,
				zIndex:Math.floor(this.picturesItems.size()/2)

			});


		},
		//设置剩余的帧的位置关系
		setPicturesPos:function(){
			var self=this;
			var slicePictures=this.picturesItems.slice(1),//除去第一层级第一帧剩下的帧
			 slicePicturesSize=slicePictures.size()/2,//计算右边和左边帧的剩余个数
			 sliceRightPictures=slicePictures.slice(0,slicePicturesSize),//取出右边的帧
			 sliceLeftPictures=slicePictures.slice(slicePicturesSize),//取出左边的帧
			 level=Math.floor(this.picturesItems.size()/2);//计算剩余层级
			//设置右边帧的css属性
			var rw=this.setting.picturewidth,
				rh=this.setting.pictureheight,
			 	gap=((this.setting.width-this.setting.picturewidth)/2)/level;//每层多出来的边的长度
			var firstLeft=(this.setting.width-this.setting.picturewidth)/2;//第一帧的left值
			 	fixLeft= firstLeft+rw;//第一帧的left值+自身的宽度
			var i=0,j=0;
			sliceRightPictures.each(function(){
				level--;
				rw=rw*self.setting.percent;
				rh=rh*self.setting.percent;
				var j = i;
				$(this).css(
				{
					zIndex:level,
					width:rw,
					height:rh,
					opacity:1/(++j),
					left:fixLeft+(++i)*gap-rw,
					top:self.setStyle(rh)//垂直对齐函数
					

				});
			});
			//设置左边帧的css属性
			var lw=liceRightPictures.last().width(),s
			 lh=sliceRightPictures.last().height(),
			 oloop = Math.floor(this.picturesItems.size()/2);
			sliceLeftPictures.each(function(i){
				$(this).css(
				{
					zIndex:i,
					width:lw,
					height:lh,					
					left:i*gap,
					opacity:1/oloop,
					top:self.setStyle(lh)

				});
				lw=lw/self.setting.percent;
				lh=lh/self.setting.percent;
				oloop--;
			});

		},
		//设置左右帧和中间帧的对齐方式
		setStyle:function(h){

			if(this.setting.type==="top"){
				return 0;
			}
			else if (this.setting.type==="mid") {
				return (this.setting.height-h)/2;
			}
			else if (this.setting.type==="bottom") {
				return this.setting.height-h;
			}
			else {
				return (this.setting.height-h)/2;
			}

		},
		// 获取人工配制的参数
		getSetting:function(){
			
			var setting = this.pictures.attr("data-setting");//attr() 方法设置或返回被选元素的属性值。

			if(setting&&setting!=""){
				return $.parseJSON(setting);//返回JSON对象，json里的数据是key：value，它们必须用双引号。
			}else{
				return {};
			};
		}

	};
	//接收"J_picture-container"类名的div集合
	Carousel.init=function(pictures){
		var _this_=this;
		pictures.each(function(){
			new _this_($(this));
		});
	};
	//全局声明
	window["Carousel"]=Carousel;
})(jQuery);
//(function(){　})(jQuery)定义并立即调用匿名函数
//相当于var someFunction=function(){};
//someFonction();
//将someFunction用function(){}替换（需要加上括号）。
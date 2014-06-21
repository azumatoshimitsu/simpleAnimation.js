//***************************************
//SimpleAnimation.js
//MIT license. 
//Copyright (c) 2014 Azuma Toshimitsu
//vosegus.org

var SimpleAnimation = function(arg) {
	this.flg       = true;
	this.roopcount = 0;//ループの階数
	this.path      = arg.path || 0;//始点,通過点1,通過点2,終点{startx,starty,p1x,p1y,p2x,p2y,endx,endy}
	this.angleRad  = arg.angle * Math.PI / 180;//方向
	this.speed     = arg.speed || 5;//速度
	this.friction  = arg.friction || 0;//摩擦
	this.point     = (this.path.startx && this.path.starty) ? { x: this.path.startx, y: this.path.starty } : { x: 0, y: 0 };//戻り値の座標軸
	this.callback  = arg.callback || function(){};//コールバック関数
	this.count     = 0;
	this.spriteObj = arg.sprite || {};
	this.spriteObj = (this.spriteObj.width && this.spriteObj.height && this.spriteObj.peekWidth && this.spriteObj.peekHeight ) ? 
	               { index:0, width:this.spriteObj.width, height:this.spriteObj.height, peekWidth:this.spriteObj.peekWidth, peekHeight:this.spriteObj.peekHeight, x:0, y:0 } :   
	               { index:0,width:100,height:100,peekWidth:10,peekHeight:10, x:0, y:0 };
	               //{ index:画像のインデックス, width:画像の幅 ,height:画像の高さ, peekWidth:切抜の幅,peekHeight:切抜の高さ}
	this.spriteObj.row = this.spriteObj.width / this.spriteObj.peekWidth;
	this.spriteObj.col = this.spriteObj.height / this.spriteObj.peekHeight;
	this.spriteObj.maxIndex = this.spriteObj.row * this.spriteObj.col;
	this.spriteObj.position = {x:0, y:0, max:0};
	this.rad       = arg.rad || 180;
	this.vertical  = arg.vertical || 100;
};

	SimpleAnimation.prototype.set = function(setarg) {
		this.flg       = (setarg.flg) ? setarg.flg : this.flg;
		this.roopcount = (setarg.roopcount) ? setarg.roopcount : this.roopcount;
		this.path      = (setarg.path) ? setarg.path : this.path;
		this.speed     = (setarg.speed) ? setarg.speed : this.speed;
		this.friction  = (setarg.friction) ? setarg.friction : this.friction;
		this.point     = (setarg.start) ? { x:path.startx,y:path.starty } : this.point;
		this.callback  = (setarg.callback) ? setarg.callback : this.callback;
		this.spriteObj.index = (setarg.spriteIndex) ? setarg.spriteIndex : this.spriteObj.index;
		this.rad       = (setarg.rad) ? setarg.rad : this.rad;
	};
	SimpleAnimation.prototype.get = function(propName) {
		return this[propName];
	};
	//2地点間の移動
	SimpleAnimation.prototype.movePoint = function() {
		//距離を計算
		var dx = this.path.endx - this.path.startx;
		var dy = this.path.endy - this.path.starty;
		var distance = Math.sqrt((dx * dx + dy * dy));
		var step = Math.floor(distance / this.speed);
		//ステップ数を繰り返す階数に代入
		if(this.flg) {
			this.roopcount = step;
			this.flg = false;
		}
		//一度に移動する距離を算出
		var xUnit = (this.path.endx - this.path.startx) / step;
		var yUnit = (this.path.endy - this.path.starty) / step;
		if(this.roopcount > 0) {
			this.roopcount -= 1;
			this.point.x += xUnit - (this.point.x * this.friction);
			this.point.y += yUnit - (this.point.y * this.friction);
		} else if(this.roopcount == 0 && this.callback){
			this.callback();
		}
		return this.point;
	};
	//ベジェ移動
	SimpleAnimation.prototype.bezier = function() {
		var t  = this.count;
		var cx = 3 * (this.path.p1x - this.path.startx);
		var bx = 3 * (this.path.p2x - this.path.p1x) - cx;
		var ax = this.path.endx - this.path.startx - cx - bx;
		var cy = 3 * (this.path.p1y - this.path.starty);
		var by = 3 * (this.path.p2y - this.path.p1y) - cy;
		var ay = this.path.endy - this.path.starty - cy - by;
		this.point.x = ax*(t*t*t) + bx*(t*t) + cx*t + this.path.startx;
		this.point.y = ay*(t*t*t) + by*(t*t) + cy*t + this.path.starty;
		this.count += this.speed;
		if(this.count > 1 && !this.callback){
			this.count = 1;
		}
		if(this.count > 1 && this.callback){
			this.count = 0;
			this.callback();
		}
		return this.point;
	};
	//カーブ移動
	SimpleAnimation.prototype.curve = function() {
		var step = (this.path.endx - this.path.startx) / (180 / this.speed);
		if( this.rad < 359 ) {
			this.rad += this.speed;
			this.point.x += step;
			this.point.y = Math.sin( this.rad * Math.PI / 180) * this.vertical + (this.path.starty / 2);
		} else {
			this.callback();
		}
		return this.point;
	};
	//スプライト
	SimpleAnimation.prototype.sprite = function() {//画像のインデックス,画像の幅,画像の高さ,切抜の幅,切抜の高さ
		this.spriteObj.x = (this.spriteObj.index % this.spriteObj.row) * this.spriteObj.peekWidth;
		this.spriteObj.y = Math.floor(this.spriteObj.index / this.spriteObj.col) * this.spriteObj.peekHeight;
		this.spriteObj.position = {x:this.spriteObj.x, y:this.spriteObj.y, max:this.spriteObj.maxIndex};
		return this.spriteObj.position;
	};


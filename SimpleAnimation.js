//***************************************
//SimpleAnimation.js
//MIT license. 
//Copyright (c) 2014 Azuma Toshimitsu
//vosegus.org

var SimpleAnimation = function(arg) {
	var flg       = true;
	var roopcount = 0;//ループの階数
	var pass      = arg.pass || 0;//始点,通過点1,通過点2,終点{startx,starty,p1x,p1y,p2x,p2y,endx,endy}
	var angleRad  = arg.angle * Math.PI / 180;//方向
	var speed     = arg.speed || 5;//速度
	var friction  = arg.friction || 0;//摩擦
	var point     = (pass.startx && pass.starty) ? { x:pass.startx, y:pass.starty } : { x:0, y:0 };//戻り値の座標軸
	var callback  = arg.callback || undefined;//コールバック関数
	var count     = 0;
	var spriteObj = arg.sprite || 0;
		spriteObj = (spriteObj.width && spriteObj.height && spriteObj.peekWidth && spriteObj.peekHeight ) ? 
	               { index:0, width:spriteObj.width, height:spriteObj.height, peekWidth:spriteObj.peekWidth, peekHeight:spriteObj.peekHeight, x:0, y:0 } :   
	               { index:0,width:100,height:100,peekWidth:10,peekHeight:10, x:0, y:0 };
	               //{ index:画像のインデックス, width:画像の幅 ,height:画像の高さ, peekWidth:切抜の幅,peekHeight:切抜の高さ}
		spriteObj.row = spriteObj.width / spriteObj.peekWidth;
		spriteObj.col = spriteObj.height / spriteObj.peekHeight;
		spriteObj.maxIndex = spriteObj.row * spriteObj.col;
		spriteObj.position = {x:0, y:0, max:0};
             
	//*******************
	//公開メソッド
	return {
	//------------------
	//フィールドセット
		set : function(setarg) {
			flg       = (setarg.flg) ? setarg.flg : flg;
			roopcount = (setarg.roopcount) ? setarg.roopcount : roopcount;
			pass      = (setarg.pass) ? setarg.pass : pass;
			speed     = (setarg.speed) ? setarg.speed : speed;
			friction  = (setarg.friction) ? setarg.friction : friction;
			point     = (setarg.start) ? { x:pass.startx,y:pass.starty } : point;
			callback  = (setarg.callback) ? setarg.callback : callback;
			spriteObj.index = (setarg.spriteIndex) ? setarg.spriteIndex : spriteObj.index;
		},
		//------------------
		//フィールドゲット
		get : function() {
			var obj = {
				flg       : flg,
				roopcount : roopcount,
				pass      : pass,
				speed     : speed,
				friction  : friction,
				point     : point,
				width     : width,
				height    : height,
				callback  : callback,
				spriteObj : spriteObj
			};
			return obj;
		},
		//------------------
		//2地点間の移動
		movePoint : function () {//開始,終了,摩擦,コールバック
			 //距離を計算
			var dx = pass.endx - pass.startx;
			var dy = pass.endy - pass.starty;
			var distance = Math.sqrt((dx*dx + dy*dy));
			var step = Math.floor(distance / speed);
			//ステップ数を繰り返す階数に代入
			if(flg) {
				roopcount = step;
				flg = false;
			}
			//一度に移動する距離を算出
			var xUnit = (pass.endx - pass.startx) / step;
			var yUnit = (pass.endy - pass.starty) / step;
			if(roopcount > 0) {
				roopcount -= 1;
				point.x += xUnit - (point.x * friction);
				point.y += yUnit - (point.y * friction);
			} else if(roopcount == 0 && callback){
				callback();
			}
			return point;
		},
		//------------------
		//ベジェ移動
		bezier : function () {//開始,終了,コールバック
			var t  = count;
			var cx = 3 * (pass.p1x - pass.startx);
			var bx = 3 * (pass.p2x - pass.p1x) - cx;
			var ax = pass.endx - pass.startx - cx - bx;
			var cy = 3 * (pass.p1y - pass.starty);
			var by = 3 * (pass.p2y - pass.p1y) - cy;
			var ay = pass.endy - pass.starty - cy - by;
			point.x = ax*(t*t*t) + bx*(t*t) + cx*t + pass.startx;
			point.y = ay*(t*t*t) + by*(t*t) + cy*t + pass.starty;
			count += speed;
			if(count > 1 && !callback){
				count = 1;
			}
			if(count > 1 && callback){
				count = 0;
				callback();
			}
			return point;
		},
		//------------------
		//スプライト
		sprite : function () {//画像のインデックス,画像の幅,画像の高さ,切抜の幅,切抜の高さ}
			spriteObj.x = (spriteObj.index % spriteObj.row) * spriteObj.peekWidth;
			spriteObj.y = Math.floor(spriteObj.index / spriteObj.col) * spriteObj.peekHeight;
			spriteObj.position = {x:spriteObj.x,y:spriteObj.y,max:spriteObj.maxIndex};
			return spriteObj.position;
		}
	};
};


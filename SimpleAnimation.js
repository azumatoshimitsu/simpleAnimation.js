//***************************************
//SimpleAnimation.js
//MIT license. 
//Copyright (c) 2014 Azuma Toshimitsu
//vosegus.org

var SimpleAnimation = function(arg) {
	var flg       = true;
	var roopcount = 0;//ループの階数
	var path      = arg.path || 0;//始点,通過点1,通過点2,終点{startx,starty,p1x,p1y,p2x,p2y,endx,endy}
	var angleRad  = arg.angle * Math.PI / 180;//方向
	var speed     = arg.speed || 5;//速度
	var friction  = arg.friction || 0;//摩擦
	var point     = (path.startx && path.starty) ? { x:path.startx, y:path.starty } : { x:0, y:0 };//戻り値の座標軸
	var callback  = arg.callback || function(){};//コールバック関数
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
	var rad       = arg.rad || 180;
	var vertical  = arg.vertical || 100;
             
	//*******************
	//公開メソッド
	return {
		//------------------
		//フィールドセット
		set : function(setarg) {
			flg       = (setarg.flg) ? setarg.flg : flg;
			roopcount = (setarg.roopcount) ? setarg.roopcount : roopcount;
			path      = (setarg.path) ? setarg.path : path;
			speed     = (setarg.speed) ? setarg.speed : speed;
			friction  = (setarg.friction) ? setarg.friction : friction;
			point     = (setarg.start) ? { x:path.startx,y:path.starty } : point;
			callback  = (setarg.callback) ? setarg.callback : callback;
			spriteObj.index = (setarg.spriteIndex) ? setarg.spriteIndex : spriteObj.index;
			rad       = (setarg.rad) ? setarg.rad : rad;
		},
		get : function() {
			return rad;
		},
		//------------------
		//2地点間の移動
		movePoint : function () {//開始,終了,摩擦
			 //距離を計算
			var dx = path.endx - path.startx;
			var dy = path.endy - path.starty;
			var distance = Math.sqrt((dx * dx + dy * dy));
			var step = Math.floor(distance / speed);
			//ステップ数を繰り返す階数に代入
			if(flg) {
				roopcount = step;
				flg = false;
			}
			//一度に移動する距離を算出
			var xUnit = (path.endx - path.startx) / step;
			var yUnit = (path.endy - path.starty) / step;
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
		bezier : function () {//開始,終了
			var t  = count;
			var cx = 3 * (path.p1x - path.startx);
			var bx = 3 * (path.p2x - path.p1x) - cx;
			var ax = path.endx - path.startx - cx - bx;
			var cy = 3 * (path.p1y - path.starty);
			var by = 3 * (path.p2y - path.p1y) - cy;
			var ay = path.endy - path.starty - cy - by;
			point.x = ax*(t*t*t) + bx*(t*t) + cx*t + path.startx;
			point.y = ay*(t*t*t) + by*(t*t) + cy*t + path.starty;
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
		//カーブ移動
		curve : function () {//開始,終了,移動の高さ
			var step = (path.endx - path.startx) / (180 / speed);
			if( rad < 359 ) {
				rad += speed;
				point.x += step;
				point.y = Math.sin( rad * Math.PI / 180) * vertical + (path.starty / 2);
			} else {
				callback();
			}
			return point;
		},
		//------------------
		//スプライト
		sprite : function () {//画像のインデックス,画像の幅,画像の高さ,切抜の幅,切抜の高さ
			spriteObj.x = (spriteObj.index % spriteObj.row) * spriteObj.peekWidth;
			spriteObj.y = Math.floor(spriteObj.index / spriteObj.col) * spriteObj.peekHeight;
			spriteObj.position = {x:spriteObj.x, y:spriteObj.y, max:spriteObj.maxIndex};
			return spriteObj.position;
		}
	};
};

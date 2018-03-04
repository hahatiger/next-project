// 工具函数

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();


function calLength2(x1, y1, x2, y2) {    //计算两个点之间的距离，，， 先求平方和，再开平方
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}


function lerpAngle(a, b, t) {     //每一次旋转的角度
	var d = b - a;
	if (d > Math.PI) d = d - 2 * Math.PI;
	if (d < -Math.PI) d = d + 2 * Math.PI;
	return a + d * t;
}

function lerpDistance(aim, cur, ratio) {   //aim：目标   cur：当前   ratio：百分比     每一次趋近的距离
	var delta = cur - aim;
	return aim + delta * ratio;
}

function distance(x1, y1, x2, y2, l) {
	var x = Math.abs(x1 - x2);
	var y = Math.abs(y1 - y2);
	if (x < l && y < l) {
		return true;
	}
	return false;
}

var util = {
  calLength2: calLength2,
  lerpAngle: lerpAngle,
  lerpDistance: lerpDistance,
  distance: distance,
}

// 暴露 util

module.exports = util;
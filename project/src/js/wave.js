// 大鱼吃果实波浪类

// 依赖 global
var global = require('./global.js');
var ctx1 = global.ctx1;
var canWid = global.canWid;
var canHei = global.canHei;

var Wave = function(){
  this.num = 10;
  this.x = [];
  this.y = [];
  this.r = [];   //半径
  this.status = [];   //当前圆圈的使用状态
}
Wave.prototype.init = function(){
  for(var i = 0;i< this.num;i++){
    this.x[i] = canWid * 0.5;
    this.y[i] = canHei * 0.5;
    this.status[i] = false;    //初始化圆圈未被使用
    this.r[i] = 0;
  }
}
Wave.prototype.drawWave = function(){    //绘制一个圆圈
  ctx1.save();
  ctx1.lineWidth = 3;
  for(var i = 0;i< this.num; i++){
    if(this.status[i]){     //如果圆圈是使用状态，则绘制圆圈
      this.r[i] += global.diffframetime * 0.04;
      if(this.r[i] > 60){
        this.status[i] = false;
        return false;
      }
      var alpha = 1 - this.r[i] / 60;

      ctx1.strokeStyle = "rgba(255, 255, 255, "+ alpha +")";
      ctx1.beginPath();
      ctx1.arc(this.x[i], this.y[i], this.r[i], 0, 2 * Math.PI);   //画圆，
      ctx1.stroke();
    }
  }
  ctx1.restore();
}
Wave.prototype.born = function(index){     //出生一个圆圈。
  var fruitOb = global.fruitOb;
  for(var i = 0; i< this.num; i++){
    if(!this.status[i]){
      this.status[i] = true;   //把圆圈状态设为使用状态
      this.x[i] = fruitOb.x[index];
      this.y[i] = fruitOb.y[index];
      this.r[i] = 10;
      return false;   //找到一个未使用的圆圈，就结束。
    }
  }
}

module.exports = Wave;
// 大鱼喂小鱼的光环类

// 依赖 global
var global = require('./global.js');
var ctx1 = global.ctx1;
var canWid = global.canWid;
var canHei = global.canHei;

var Halo = function(){
  this.num = 5;
  this.x = [];
  this.y = [];
  this.r = [];   //半径
  this.status = [];   //当前光环的使用状态
}
Halo.prototype.init = function(){
  for(var i = 0;i< this.num;i++){
    this.x[i] = canWid * 0.5;
    this.y[i] = canHei * 0.5;
    this.status[i] = false;    //初始化光环未被使用
    this.r[i] = 0;
  }
}
Halo.prototype.drawHalo = function(){
  ctx1.save();
  ctx1.lineWidth = 4;
  for(var i = 0;i< this.num; i++){
    if(this.status[i]){     //如果光环是使用状态，则绘制光环
      this.r[i] += global.diffframetime * 0.08;
      if(this.r[i] > 100){
        this.status[i] = false;
        return false;
      }
      var alpha = 1 - this.r[i] / 100;

      ctx1.strokeStyle = "rgba(203, 91, 0, "+ alpha +")";
      ctx1.beginPath();
      ctx1.arc(this.x[i], this.y[i], this.r[i], 0, 2 * Math.PI);   //画圆，
      ctx1.stroke();
    }
  }
  ctx1.restore();
}
Halo.prototype.born = function(){
  var babyOb = global.babyOb;
  for(var i = 0; i< this.num; i++){
    if(!this.status[i]){
      this.status[i] = true;   //把光环状态设为使用状态
      this.x[i] = babyOb.x;   //光环的位置是小鱼的位置。
      this.y[i] = babyOb.y;
      this.r[i] = 10;
      return false;   //找到一个未使用的光环，就结束。
    }
  }
}

module.exports = Halo;

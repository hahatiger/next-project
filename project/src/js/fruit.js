// 果实类

// 依赖 global
var global = require('./global.js');
var ctx2 = global.ctx2;
var imgUrl = global.imgUrl;

var Fruit = function(){
  this.num = 30;
  this.x = [];
  this.y = [];
  this.size = [];   //果实大小（直径）
  this.type = [];   //果实的类型
  this.speed = [];  //果实漂浮速度
  this.grow = [];   //果实是否长大
  this.alive = [];  //bool，是否活着
  this.orange = new Image();
  this.blue = new Image();
}
Fruit.prototype.init = function(){
  this.orange.src = imgUrl + 'fruit.png';
  this.blue.src = imgUrl + 'blue.png';
  for(var i = 0; i< this.num; i++){
    this.x[i] = this.y[i] = 0;
    this.speed[i] = Math.random() * 0.015 + 0.005;   //[0.005  ,  0.02)
    this.alive[i] = false;   //初始值都为false
    this.grow[i] = false;   //初始为“未长大”;
    this.type[i]  = "";
  }
}
Fruit.prototype.drawFruit = function(){
  for(var i =0;i< this.num; i++){
    if(this.alive[i]){
      //find an ane, grow, fly up...
      if(this.size[i] <= 16){   //长大状态
        this.grow[i] = false;
        this.size[i] += this.speed[i] * global.diffframetime * 0.8;
      }else{   //已经长大,向上漂浮
        this.grow[i] = true;
        this.y[i] -= this.speed[i] * 5 * global.diffframetime;
      }
      var pic = this.orange;
      if(this.type[i] == 'blue')   pic = this.blue;

      ctx2.drawImage(pic, this.x[i] - this.size[i] * 0.5, this.y[i] - this.size[i] * 0.5, this.size[i], this.size[i]);
      if(this.y[i] < 8){
        this.alive[i] = false;
      }
    }
  }
}
Fruit.prototype.born = function(i){
  var aneOb = global.aneOb;
  var aneId = Math.floor(Math.random() * aneOb.num);
  this.x[i] = aneOb.headx[aneId];    //果实的横坐标
  this.y[i] = aneOb.heady[aneId];    // 果实的总坐标
  this.size[i] = 0;
  this.alive[i] = true;
  var flag = Math.random();
  if(flag < 0.1){
    this.type[i] = "blue";
  }else{
    this.type[i] = "orange";
  }
}
Fruit.prototype.dead = function(i){
  this.alive[i] = false;
}
Fruit.prototype.computeFruit = function() {           //计算屏幕上的果实数量
  var fruitOb = global.fruitOb;
  var count = 0;
  for(var i = 0; i < fruitOb.num; i++){
    if(fruitOb.alive[i])  count ++;
  }
  if(count < 15){
    bornFruit();		//出生一个果实
    return false;
  }
}
function bornFruit() {     //循环30个果实，如果状态为false，则让它出生
  var fruitOb = global.fruitOb;
  for(var i = 0;i< fruitOb.num; i++){
    if(!fruitOb.alive[i]){
      fruitOb.born(i);
      return false;
    }
  }
}

module.exports = Fruit;

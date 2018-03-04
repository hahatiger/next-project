// 全局函数、初始化、判断等

// 依赖 global, util, ane, baby, dust, fruit, halo, mom, score, wave

var aneOb;
var fruitOb;
var momOb;
var babyOb;
var scoreOb;
var waveOb;
var haloOb;
var dustOb;
var global = require('./global.js');
var util = require('./util.js');
var Ane = require('./ane.js');
var Baby = require('./baby.js');
var Dust = require('./dust.js');
var Fruit = require('./fruit.js');
var Halo = require('./halo.js');
var Mom = require('./mom.js');
var Score = require('./score.js');
var Wave = require('./wave.js');
var can1 = global.can1;
var ctx1 = global.ctx1;
var ctx2 = global.ctx2;
var canWid = global.canWid;
var canHei = global.canHei;
var calLength2 = util.calLength2;

var lastframetime;

var Controller = {};
Controller.startgame = function(){
  Controller.init();

  lastframetime = Date.now();
  Controller.gameLoop();

}

Controller.drawBackgorund = function() {
  var img = new Image();
  img.src= global.imgUrl + 'background.jpg';
  ctx2.drawImage(img,0,0,canWid,canHei);
}

Controller.init = function(){

  ctx1.fillStyle = 'white';
  ctx1.font = '20px 微软雅黑';
  ctx1.textAlign = 'center';
  can1.addEventListener('mousemove', Controller.onMouseMove, false);
  can1.addEventListener('click', Controller.onClick, false);


  global.mx = canWid * 0.5;
  global.my = canHei * 0.5;

  aneOb = global.aneOb = new Ane();  //new 一个海葵类
  aneOb.init();  //初始化海葵的属性

  fruitOb = global.fruitOb = new Fruit();
  fruitOb.init();

  momOb = global.momOb = new Mom();
  momOb.init();

  babyOb = global.babyOb = new Baby();
  babyOb.init();

  scoreOb = global.scoreOb = new Score();   //创建的时候已经初始化

  waveOb = global.waveOb = new Wave();
  waveOb.init();

  haloOb = global.haloOb = new Halo();
  haloOb.init();

  dustOb = global.dustOb = new Dust();
  dustOb.init();
}
Controller.gameLoop = function(){   //使用帧绘画，一直在画的东西
  requestAnimFrame(Controller.gameLoop);
  var now = Date.now();    //1970 00:00:00 到现在的毫秒数
  global.diffframetime = now - lastframetime;
  lastframetime = now;
  if(global.diffframetime > 40){
    global.diffframetime = 40;   //防止切换浏览器，differ时间变长，果实长到无限大
  }

  ctx2.clearRect(0, 0, canWid, canHei);    //清除画布2
  Controller.drawBackgorund();
  aneOb.drawAne();  // 画海葵部分
  fruitOb.computeFruit();  //根据果实出现个数再出生果实
  fruitOb.drawFruit();  //画果实部分

  ctx1.clearRect(0, 0, canWid, canHei);    //清除画布1
  momOb.drawMom();   //画鱼妈妈
  babyOb.drawBaby();  //画小鱼
  if(!scoreOb.gameOver){  //如果游戏没有结束
    Controller.momEatFruit();  //随时判断果实是否被吃掉
    Controller.momFoodBaby();  //判断大鱼喂小鱼
  }
  scoreOb.drawScore();

  waveOb.drawWave();
  haloOb.drawHalo();
  dustOb.drawDust();
}
Controller.onMouseMove = function(e){     //鼠标移动事件，layerX是FF浏览器特有的。
  if(!scoreOb.gameOver){  //如果游戏没有结束
    if(e.offsetX || e.layerX){
      global.mx = e.offsetX == undefined ? e.layerX : e.offsetX;
      global.my = e.offsetY == undefined ? e.layerY : e.offsetY;
    }
  }
}
Controller.onClick = function(){
  if(scoreOb.gameOver){   //如果游戏为结束状态
    scoreOb.gameOver = false;
    // aneOb.init();
    fruitOb.init();
    momOb.init();
    babyOb.init();
    scoreOb.init();
  }
}
Controller.momEatFruit = function(){     //判断果实和大鱼之间的距离，小于30说明被吃掉
  for(var i = 0;i < fruitOb.num; i++ ){
    if(fruitOb.alive[i] && fruitOb.grow[i]){
      var len = calLength2(fruitOb.x[i], fruitOb.y[i], momOb.x, momOb.y);
      if(len < 30){
        fruitOb.dead(i);    //如果距离小于30，则被吃掉
        waveOb.born(i);     //吃掉的时候，产生圆圈
        scoreOb.fruitNum ++;
        momOb.momBodyIndex = momOb.momBodyIndex == 7 ? momOb.momBodyIndex : (momOb.momBodyIndex + 1);
        if(fruitOb.type[i] == 'blue'){
          scoreOb.doubleNum ++;
        }
      }
    }
  }
}
Controller.momFoodBaby = function(){    //判断大鱼和小鱼之间的距离，小于30，小鱼的颜色变深
  if(scoreOb.fruitNum > 0){
    var len = calLength2(momOb.x, momOb.y, babyOb.x, babyOb.y);
    if(len < 30){   //距离小于30，而且大鱼吃到了果实，才能喂小鱼
      haloOb.born();
      momOb.momBodyIndex = 0;     //大鱼体力变0
      var num = scoreOb.doubleNum * scoreOb.fruitNum;
      var index = babyOb.babyBodyIndex - num;
      if(index < 0){
        index = 0;  //如果下标小于0， 则等于0
      }

      var strength = scoreOb.strength + (index/2).toFixed(0);
      if(strength > 10){
        strength = 10;
      }
      scoreOb.strength = strength;
      babyOb.babyBodyIndex = index;  //小鱼身体图片下标减小，身体变红
      scoreOb.computeScore();   //计算总分,
    }
  }
}

module.exports = Controller;
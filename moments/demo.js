/*var arr = [1,2,3,4,5];
var sum = arr.reduce(function(pre,cur,index,arr){
	return pre+cur;
})
console.log(sum);*/

/*var arr = [1,2,3,4,5];
var arr2 = arr.filter(function(val){
	return val>3
})

console.log(arr2)*/
/*

var arr = [1,2,3,4,5,40];
var n = arr.find(function(n){
	return n>10;
})
console.log(n)*/
/*
var arr = [1,2,3,4,5,40];

var i = arr.findIndex(function(val){
	return val>10
})
console.log(i)*/

// var arr = [1,2,3,4,5,40];

/*for(var val of arr){
	console.log(val)
}*/
/*for(var key of arr.keys()){
	console.log(key)
}*/
/*for(var [key,val] of arr.entries()){
	console.log(key+ ' :' +val);
}*/
/*
var arr = [1, 2, 3, 4, 5]; 
{
	let set = new Set(arr);
	// console.log(set)
	set.add(40);
	set.delete(2);
	console.log(set.has(40));
	set.clear();
	console.log(set)
}*/

/*
var arr = [1,2,1,2,3,4,3,4,6,6,2];

var set  =new Set(arr);

var newArr = new Array(...set);
console.log(newArr);*/

/*let map = new Map([['1','one'],['2','two'],['3','three']]);
map.set('4','four');
console.log(map.size);
console.log(map.get('4'));
console.log(map.has('1'));
map.delete('3');
console.log(map.size);
console.log(map.keys());
console.log(map.values());
console.log(map.entries());
map.clear();
console.log(map.size);*/

/*class point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	toString(){
		console.log(`x:${this.x},y:${this.y}`);
	}
}

var p1=new point(5,6);
p1.toString();*/

/*class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	toString() {
		console.log(`x:${this.x},y:${this.y}`);
	}
}

class colorPointer extends Point {
	constructor(x,y,color){
		super(x,y);
		this.color = color;
	}

	getData(){
		console.log(this.x+','+this.y+','+this.color);
	       return this.x+','+this.y+','+this.color;

	}
}

var p2 = new colorPointer(7,8,'red');
p2.toString();
console.log(p2.getData())*/

/*var arr = [2,3,4,5,6,7]
var num = arr.reduce(function(pre,cur,index,array){
	return pre*cur
})
console.log(num);*/
/*var str = '2,3,4,5,6,7';
str=str.replace(/,/g,'*');
console.log(str)
console.log(eval(str))*/

// var arr = [2,4,6,3,7,8,5];


function* gen(x) {
	var y = yield x + 2;
	return y;
}
var g = gen(1);
console.log(g.next());
console.log(g.next());
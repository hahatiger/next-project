# 使用 Webpack 构建一个项目

在本章中，我们学习了一些网络的知识，知道了一些前端的性能指标，也初步认识了 Node.js 和 npm，分析了前端的模块化，最后学习了 Webpack 构建工具的使用。有了这些知识，我们在构建项目的时候就知其然，也知其所以然了，明白我们构建的每个任务背后都是出于某个目的的。当然，本章最重要的目的还是让大家学会使用构建去优化我们项目目录和开发体验，下面我们就来实践下如何去构建一个完整的项目吧。

## 项目说明
- 概述： 我们提供的项目`src` 目录下的代码虽然本身能正常运行，但是代码存在大量全局变量，js文件也很多，并且没有经过优化，在本项目我们希望大家使用 [Webpack](https://webpack.js.org/) 将项目的代码模块化，并且对代码进行打包，压缩等操作，自己动手构建出一个前端工程化的项目。

- 目标：将原始项目改造成使用 Webpack 构建的前端工程化的项目。

## 具体要求
1. 使用 CommonJS 进行对 `src/js` 目录下的 js 代码进行模块化，所有模块都不产生全局变量，只通过 require 声明依赖，以及通过 module.exports 暴露模块接口。

2. 根目录增加 `webpack.config.js` 配置文件，使用 Webpack 对 js 进行打包, 入口文件为 `src/js/index.js`, 打包输出到 `dist/bundle.js`。

3. 使用 `css-loader` 和 `style-loader`, 将 `src/css/style.css` 也加入打包。

4. 使用 `html-webpack-plugin` 将 `src/index.html` 作为模板，删掉index.html 里面所有的 `script` 和 `link` 标签，最终在 `dist/` 目录自动生成引用打包后文件的 `index.html` 。

5. 使用 `copy-webpack-plugin` 将 `src/images` 下的所有图片复制到 `dist/images` 目录 (具体使用方式查看[文档](https://github.com/kevlened/copy-webpack-plugin))。

6. 使用 `webpack.optimize.UglifyJsPlugin` 对代码进行压缩

7. 经过上面的构建后，构建结果应该是在 `dist` 目录下有 `index.html`，`bundle.js` 和 `images` 目录，直接运行 `dist/index.html` 可以正常运行游戏。

8. 要求上面用到的 npm 包都装到本地，并且所有依赖都记录到 `package.json` 文件的 `devDependencies` 里面，其他人将代码 `clone` 下来之后运行 `npm install` 命令后会自动将所有依赖安装下来，运行 `webpack` 命令就可以成功构建。

## 提示

### Webpack 里的 CommonJS
Webpack 打包本身支持 CommonJS, AMD 甚至 ES6 Modules，而且不需要引用额外的库，只需要直接修改 js 文件，声明依赖和暴露接口就可以了，打包后的模块也会有自己单独的作用域，模块中声明的变量如 `var a = 1` 不会影响全局环境，除非通过 `window.a = 1` 声明，这样才会挂到全局变量。

所以我们修改源代码的 js 文件只需要根据注释在 ***头部声明依赖*** 以及 ***最后声明本模块暴露的接口或对象*** 即可。如 `src/dust.js`, 修改成下面代码即可：
 
```js
// 灰尘类

// 依赖 global
var global = require('./global');  // 头部声明依赖

// 中间代码不用修改
var Dust = function(){
}
Dust.prototype.init = function(){
}
Dust.prototype.drawDust = function(){
}

module.exports = Dust;   // 最后暴露 Dust 类
```

## 加分项
1. 可以使用 `extract-text-webpack-plugin` 将 CSS 文件分离出来，构建后目录单独有一个 `style.css` 文件

2. 使用 `clean-webpack-plugin`， 每次构建之前删掉 `dist` 目录，避免上一次构建的影响

3. 使用 `webpack-dev-server` 可以开启本地服务器，保存代码后页面自动刷新。

4. `webpack` 和 `webpack-dev-server` 只需装到项目本地，不需要全局安装，使用 [`npm scripts`](https://doc.webpack-china.org/guides/getting-started/#npm-npm-scripts-) 运行构建任务，比如`npm run build` 运行 `webpack` 命令, `npm run server` 可以开启本地服务器。

5. 将打包后 `dist` 目录代码直接放到 Gitlab Pages, 提交 Merge Request 的时候在评论贴上可以直接访问的链接。

## 最后
只会三大语言而不懂工程化已经不能算一个合格的前端开发了，工程化当然也是面试官必问的问题。

我知道大家在上手工程化的时候很困难，但你想一想，不正是因为困难才值得你去学习和掌握么。

耐心，细致，多琢磨下工程化的目的、工具和涉及的目录结构，难不住你的。


## 链接
* [项目源码地址](https://github.com/luckykun/tinyHeart)(经修改)
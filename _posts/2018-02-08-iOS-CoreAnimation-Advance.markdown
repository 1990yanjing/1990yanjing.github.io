---
layout: post
title: CC02 《iOS核心动画高级技巧》读书笔记
date: 2018-02-08
tags: 双百计划
categories: ios
---
[《iOS核心动画高级技巧》](https://zsisme.gitbooks.io/ios-/content/index.html)

- Core Animation,实际上是从一个叫做Layer Kit的东西演变而来的，所以做动画支持CoreAnimation特性的冰山一角
- Core Animation 是一个复合引擎，他的职责就是尽可能快地组合屏幕上不同的可视内容是被分解成独立的图层，存储在一个叫做图层树的体系之中。于是这个树性工程了UIKit以及在iOS应用中你所能在屏幕上看见的一切的基础
- 每一个UIView都有一个CALayer实例的图层属性，也就是所谓的Backing layer，视图的职责就是创建并管理这个图层，以确保当子视图在层级关系中添加或者被移除的时候，他们关联的图层也同样对应在层级关系树当中有相同的操作
- ==实际上这些背后关联的图层才是真正用来在屏幕上显示和做动画，UIView仅仅是对它的一个封装，提供一些iOS类似于处理触摸的具体功能，以及Core Animation 底层方法的高级接口==
- 寄宿图，CALayer有一个属性叫做Contents，这个属性被定义为id，以为着它可以是任何类型的对象。但是，在实践中给Contents赋值的如果不是CGImage，那么得到的图层将会是空白的。
- UIView大多数的视觉操作相关的属性比如ContentMode，对这些属性的操作其实是对对应图层的操作；与contentMode相对应的CALayer的属性是contentsGravity
- UIView的clipsBounds和CALayer的masksToBounds是相对应的
- 当图层显示在屏幕上的时候，CALayer不会主动的重绘她的内容。它把重绘的决定权交给了开发者
- 当使用寄宿了视图的图层的时候，通常做法是实现UIView的-drawRect:方法，UIView就会帮你做完剩下的工作，包括在需要重绘的时候调用-display方法。
- 视图的frame，bounds和center属性仅仅是存取方法，当操纵视图的frame，实际上是在改变位于视图下方CALayer的frame，不能够独立于图层之外改变视图的frame
- 对于视图或者图层来说，frame并不是一个非常清晰的属性，它其实是一个虚拟属性，是根据bounds，position和transform计算而来，所以当其中任何一个值发生改变，frame都会变化。相反，改变frame的值同样会影响到他们当中的值
- 记住当对图层做变换的时候，比如旋转或者缩放，frame实际上代表了覆盖在图层旋转之后的整个轴对齐的矩形区域，也就是说frame的宽高可能和bounds的宽高不再一致了
![image](https://zsisme.gitbooks.io/ios-/content/chapter3/3.2.jpeg)

- **UIView的center，CAlayer的position，以及anchorPoint**
    - anchorPoint默认为{0.5，0.5}，anchorPoint描述的是position的位置与视图哪个单位坐标点重合，从而确定center的位置，position不随着anchorPoint的改变而改变，而center就是“视图中心点”
- zPosition最实用的功能就是改变图层的显示顺序
- CGAffineTransform中的“仿射”的意思是无论变换矩阵用什么值，图层中平行的两条线在变换之后任然保持平行，CGAffineTransform可以做出任意符合上述标注的变换

---
未完待续。。。。。。
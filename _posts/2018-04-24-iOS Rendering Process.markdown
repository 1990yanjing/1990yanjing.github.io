---
layout: post
title: iOS Rendering Process
date: 2018-04-24
tags: 读博笔记、性能优化
categories: ios
---

![Rendering Process 技术框架](http://lc-cpc8kfpb.cn-n1.lcfile.com/14c8292a78b80ab347ed.png)

- UIKit自身不具备在屏幕成像的能力，主要负责对用户操作时间的响应
- 由UIView组成的是视图树，由CALayer组成的是图层树
- 视图的职责就是创建并管理这个图层，以确保当子视图在层级关系中添加或者被移除的时候，他们关联的图层也同样对应在层级关系树当中有相同的操作。
- Core Animation 是从Layer Kit演变而来的，所以做动画仅仅是 Core Animation 特性的冰山一角
- Core Animation 本质上可以理解为是一个复合引擎，旨在尽可能快的组合屏幕上不同的显示内容。这些显示内容被分解成独立的图层，即 CALayer，CALayer 才是你所能在屏幕上看见的一切的基础
- OpenGL ES 简称 GLES，即 OpenGL for Embedded Systems，是 OpenGL 的子集，通常面向**图形硬件加速处理单元（GPU）**渲染 2D 和 3D 计算机图形，例如视频游戏使用的计算机图形。
- Core Graphics Framework 基于 Quartz 高级绘图引擎。它提供了具有无与伦比的输出保真度的低级别轻量级 2D 渲染。您可以使用此框架来处理基于路径的绘图，转换，颜色管理，离屏渲染，图案，渐变和阴影，图像数据管理，图像创建和图像遮罩以及 PDF 文档创建，显示和分析
- Graphics Hardware 译为图形硬件，iOS 设备中也有自己的图形硬件设备，也就是我们经常提及的 GPU。
- Core Animation 图层，即 CALayer 中包含一个属性 contents，我们可以通过给这个属性赋值来控制 CALayer 成像的内容。这个属性的类型定义为 id，在程序编译时不论我们给 contents 赋予任何类型的值，都是可以编译通过的。但实践中，如果 contents 赋值类型不是 CGImage，那么你将会得到一个空白图层。
- Core Animation Pipeline：
    - 在 Application中布局UIKit视图控件间接的关联Core Animation图层
    - Core Animation图层相关的数据提交到 iOS Render Server，即 OpenGL ES & Core Graphics
    - Render Server 将与GPU通信把数据经过处理之后传递给GPU
    - GPU 调用 iOS 当前设备渲染相关的图形设备 Display

- Core Animation Pipeline 的整个管线中 iOS 常规开发一般可以影响到的范围也就仅仅是在 Application 中布局 UIKit 视图控件间接的关联 Core Animation 图层这一级，即 Commit Transaction 之前的一些操作，
    - Layout，构建视图，减少视图对于视图树中同等级兄弟视图的约束依赖
    - Display，绘制视图，重载drawRect：，使用CPU和内存进行计算，使用不当会造成CPU负载过重
    - Prepare，额外的 Core Animation 工作
    - Commit，打包图层并将它们发送到 Render Server

![基本完整的渲染过程](https://user-gold-cdn.xitu.io/2018/4/16/162cbeb54d34f354?imageView2/0/w/1280/h/960/ignore-error/1)

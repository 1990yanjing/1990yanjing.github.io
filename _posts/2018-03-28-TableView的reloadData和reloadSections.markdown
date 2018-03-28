---
layout: post
title: 由TableView的reloadData和reloadSections想出去。。。
date: 2018-03-28
tags: 读书笔记
categories: ios
---

由于搬砖中偶遇使用reloadSections造成的显示异常的问题，发现了一下reloadSections的小猫腻~~

- reloadData;
>Reloads the rows and sections of the table view.
Call this method to reload all the data that is used to construct the table, including cells, section headers and footers, index arrays, and so on. For efficiency, the table view redisplays only those rows that are visible. It adjusts offsets if the table shrinks as a result of the reload. The table view’s delegate or data source calls this method when it wants the table view to completely reload its data. It should not be called in the methods that insert or delete rows, especially within an animation block implemented with calls to beginUpdates and endUpdates.

- reloadSections:(NSIndexSet *)sections withRowAnimation:(UITableViewRowAnimation)animation;
>Reloads the specified sections using a given animation effect.
Calling this method causes the table view to ask its data source for new cells for the specified sections. The table view animates the insertion of new cells in as it animates the old cells out. Call this method if you want to alert the user that the values of the designated sections are changing. If, however, you just want to change values in cells of the specified sections without alerting the user, you can get those cells and directly set their new values.
When this method is called in an animation block defined by the beginUpdates and endUpdates methods, it behaves similarly to deleteSections:withRowAnimation:. The indexes that UITableView passes to the method are specified in the state of the table view prior to any updates. This happens regardless of ordering of the insertion, deletion, and reloading method calls within the animation block.

- 通过验证以及结合苹果官方的函数注释，当调用reloadSections的时候，会将reload的cell替换掉，并重新新建*newCells*，并将oldCells放入重用池中

## 从而引申到tableView的重用原理
- 通过实验的现象，可以推测tableView中存在两个数据结构
	- visibleCells 存放当前可见的cell的实例
	- reuseCells 存放缓存的实例

- 初始绘制，tabelView通过结合屏幕的大小、row的高度、header以及footer的高度计算处于显示范围的内容，通过调用cell:forRow的方法将显示范围内的cells绘制出来，并且将这些cells放入visibleCells中
- 在屏幕滚动或者用户主动调用reloadData的时候，触发tableView的重新绘制和回收；tableView将离屏不在显示的cell实例，放入reuseCells中缓存，并将其hide；通过cell:forRow获取需要显示出来的cells实例，并将是否复用cells的选择全交给开发者；一般我们在开发的时候均会首先调用dequeueReusableCellWithIdentifier:获取可复用的cell
- dequeueReusableCellWithIdentifier：的实现会首先从visibleCells中出队相同ID的cell实例；如果找不到或者使用完了，就会从reuseCells的缓存池中寻找相同ID的cell实例；如果仍然找不到则会返回nil，由开发者自行创建返回
- tableView会将绘制过程中通过cell:forRow获取的cell入队visibleCells
- tableView的绘制均在layoutSubviews中完成；故此，列表的滚动会触发绘制；reloadData等刷新操作中，会调用setNeedsLayout以及layoutIfNeed，使得layoutSubviews在下一个RunLoop中被触发


## 从而又引申出reloadData与RunLoop的关系

- 线程与RunLoop是一一对应
- 在RunLoop中事件是排队串行执行的
- 我们会发现，如果需要在[tableView reloadData]后立即获取tableview的cell、高度，或者需要滚动tableview，那么，直接在reloadData后执行代码是会有问题的，这并不是异步造成的而是由于RunLoop造成的

> 当在操作 UI 时，比如改变了 Frame、更新了 UIView/CALayer 的层次时，或者手动调用了 UIView/CALayer 的 setNeedsLayout/setNeedsDisplay方法后，这个 UIView/CALayer 就被标记为待处理，并被提交到一个全局的容器去。 苹果注册了一个 Observer 监听 BeforeWaiting(即将进入休眠) 和 Exit (即将退出Loop) 事件，回调去执行一个很长的函数： _ZN2CA11Transaction17observer_callbackEP19__CFRunLoopObservermPv()。这个函数里会遍历所有待处理的 UIView/CAlayer 以执行实际的绘制和调整，并更新 UI 界面。

- 因为[tableview reloaddata] 中只是调用了setNeedsLayout，即向全局容器提交了一个任务，需要在当前方法在runloop中执行完后它在下一个Runloop中执行更新UI的操作
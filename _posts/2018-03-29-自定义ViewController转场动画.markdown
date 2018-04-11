---
layout: post
title: 自定义ViewController转场动画
date: 2018-03-29
tags: 日常
categories: ios
---

- Step.1 创建UINavigationControllerDelegate的代理实现类
- Step.2 实现```func navigationController(_ navigationController: UINavigationController, animationControllerFor operation: UINavigationControllerOperation, from fromVC: UIViewController, to toVC: UIViewController) -> UIViewControllerAnimatedTransitioning?```,返回自定义动画对象
- Step.3 创建实现UIViewControllerAnimatedTransitioning的Animator类
- Step.4 实现UIViewControllerAnimatedTransitioning指定的协议方法
- Step.5 在调用push方法前，指定UINavigationController的delegate为自定义的对象

```Objective-C
//
//  WYCustomNavigationDelegate.swift
//  HXFundManager
//
//  Created by wangyan on 2018/3/29.
//  Copyright © 2018年 China Asset Management Co., Ltd. All rights reserved.
//

import Foundation

class WYCustomNavigationDelegate: NSObject, UINavigationControllerDelegate {
    
    func navigationController(_ navigationController: UINavigationController, animationControllerFor operation: UINavigationControllerOperation, from fromVC: UIViewController, to toVC: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        
        return WYTransitionAnimator()
    }
}

class WYTransitionAnimator: NSObject, UIViewControllerAnimatedTransitioning, CAAnimationDelegate {
    
    weak var transitionContext: UIViewControllerContextTransitioning?
    
    func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
        
        return 0.5
    }
    
    func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
        
        self.transitionContext = transitionContext
        
        let containerView = transitionContext.containerView
        if let toVC = transitionContext.viewController(forKey: UITransitionContextViewControllerKey.to) {
            
            containerView.addSubview(toVC.view)
            
            let frame = CGRect(x: 0, y: 0, width: 100, height: 100)
            let circleMaskPathInitial = UIBezierPath(ovalIn: frame)
            let extremePoint = CGPoint(x: frame.midX, y: toVC.view.bounds.height - frame.midY)
            let radius = sqrt((extremePoint.x * extremePoint.x) + (extremePoint.y * extremePoint.y))
            let circleMaskPathFinal = UIBezierPath(ovalIn: frame.insetBy(dx: -radius, dy: -radius))
            
            let maskLayer = CAShapeLayer()
            maskLayer.path = circleMaskPathFinal.cgPath
            toVC.view.layer.mask = maskLayer
            
            let maskLayerAnimation = CABasicAnimation(keyPath: "path")
            maskLayerAnimation.fromValue = circleMaskPathInitial.cgPath
            maskLayerAnimation.toValue = circleMaskPathFinal.cgPath
            maskLayerAnimation.duration = self.transitionDuration(using: transitionContext)
            maskLayerAnimation.delegate = self
            maskLayer.add(maskLayerAnimation, forKey: "path")
        }
        
    }
    
    func animationDidStop(_ anim: CAAnimation, finished flag: Bool) {
        
        self.transitionContext?.completeTransition(!self.transitionContext!.transitionWasCancelled)
        self.transitionContext?.viewController(forKey: UITransitionContextViewControllerKey.to)?.view.layer.mask = nil
    }
}
```
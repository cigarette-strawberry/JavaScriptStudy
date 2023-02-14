/**
 * 什么是面向对象[OOP]
 *    + 对象、类、实例
 *    + JS本身就是基于面向对象研发出来的编程语言[内置类]
 * 构造函数执行 VS 普通函数执行
 * prototype & __proto__
 */

/**
 * 面向对象是一种非常方便的、强大的、用来构建和管理整个知识体系的思想
 * 具象化OOP
 *    + 类
 *    + 实例
 *    @1 每个实例都有自己私有的属性和方法
 *    @2 每个实例也都具备类赋予他们的公共的属性和方法[公有化]
 */

/**
 * JS语言本身就是基于类和实例构建和组成的 => 内置类
 *    数据类型所属的类
 *       Number 每一个number类型的值都是这个类的一个实例
 *       String
 *       Boolean
 *       Symbol
 *       BigInt
 *       Object 每一个对象都是Object类的实例
 *          + Object
 *          + Array
 *          + RegExp
 *          + Date
 *          + Error
 *          + Function
 *       ......
 *
 *    DOM元素/集合所属的类
 *       #box元素对象 -> HTMLDivElement
 *                   -> HTMLParagraphElement -> HTMLElement -> Element -> Node -> EventTarget -> 0bject
 *                   ...
 *       document文档对象 -> HTMLDocument -> Document -> Node -> EventTarget -> 0bject
 *       节点集合 -> NodeList -> Object
 *       ...
 *       每一个元素标签对象基本都有自己所属的类
 *
 *    ...
 */

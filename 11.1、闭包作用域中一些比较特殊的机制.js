/**
 * EC(G)
 *   VO(G)/AO
 *   foo
 * 变量提升 function foo() 此时只声明不定义
 */
{
    /**
     * EC(BLOCK)
     *   AO(BLOCK)
     *   foo -> 0x000 [[scope]]:EC(BLOCK)
     * 作用域链:<EC(BLOCK),EC(G)>
     * 变量提升:function foo() = 0x000
     */
    function foo() {
        // => 把之前对foo的操作同步给全局一份 window.foo=0x000
        // 之后的代码无关
        foo = 1; // => 私有的foo=1
    }
}
console.log(foo); // => [Function: foo]

// ---------------------------------------------

/**
 * EC(G)
 *   VO(G)/AO
 *   foo
 * 变量提升:function foo() 此时只声明不定义
 *         function foo() 此时只声明不定义
 */
{
    /**
     * EC(BLOCK)
     *   AO(BLOCK)
     *   foo -> 0x001 [[scope]]:EC(BLOCK)
     *   foo -> 0x002 [[scope]]:EC(BLOCK)
     * 作用域链:<EC(BLOCK),EC(G)>
     * 变量提升:function foo() = 0x001
     *         function foo() = 0x002
     */
    function foo() {} // => 把之前对foo的操作同步给全局一份 window.foo=0x001
    foo = 1; // => 私有的foo=1
    function foo() {} // => 把之前对foo的操作同步给全局一份 window.foo=1
    // 之后的代码无关
}
console.log(foo); // => 1

// ---------------------------------------------

/**
 * EC(G)
 *   VO(G)/AO
 *   foo
 * 变量提升:function foo() 此时只声明不定义
 *         function foo() 此时只声明不定义
 */
{
    /**
     * EC(BLOCK)
     *   AO(BLOCK)
     *   foo -> 0x003 [[scope]]:EC(BLOCK)
     *   foo -> 0x004 [[scope]]:EC(BLOCK)
     * 作用域链:<EC(BLOCK),EC(G)>
     * 变量提升:function foo() = 0x003
     *         function foo() = 0x004
     */
    function foo() {} // => 把之前对foo的操作同步给全局一份 window.foo=0x003
    foo = 1; // => 私有的foo=1
    function foo() {} // => 把之前对foo的操作同步给全局一份 window.foo=1
    // 之后的代码无关
    foo = 2; // => 私有的foo=2
}
console.log(foo); // => 1

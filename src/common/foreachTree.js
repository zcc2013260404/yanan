class ForeachTree {//栈  后入先出
    
    constructor () {
        this.top = 0, // 栈的长度
        this.list = []
    }

    push(item) {
        this.top++;
        this.list.push(item) // 入栈操作
    }

    pop () {
        --this.top;
        return this.list.pop() // 出栈操作
    }

    peek () {
        return this.list[this.top -1] // 查询栈顶元素
    }

}
export default  ForeachTree;
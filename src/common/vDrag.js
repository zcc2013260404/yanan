export const vDrag = {
  update: function (el, value) {
    const on = value.value.isUse // 开关
    const header = el.childNodes[0].childNodes[0]
    const dragDom = el.querySelector('.el-dialog')
    let firstUse = true // 初始化
    let startX = el.offsetLeft
    let startY = el.offsetTop
    let disX = 0
    let disY = 0
    header.onmousedown = function (e) {
      if (on && firstUse) {
        firstUse = false
        // 记录dom初始位置
        startX = header.offsetLeft
        startY = header.offsetTop

        // 鼠标按下，计算当前元素距离可视区的距离
        disX = e.clientX - header.offsetLeft
        disY = e.clientY - header.offsetTop
      } else if (on) {
        disX = e.clientX - header.offsetLeft
        disY = e.clientY - header.offsetTop
      }

      const dragDomWidth = dragDom.offsetWidth
      const dragDomHeight = dragDom.offsetHeight
      console.log(dragDomWidth, dragDomHeight)
      const screenWidth = document.body.clientWidth
      const screenHeight = document.body.clientHeight
      console.log(screenWidth, screenHeight)
      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
      console.log(minDragDomLeft, maxDragDomLeft)
      const minDragDomTop = dragDom.offsetTop
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight
      console.log(minDragDomTop, maxDragDomTop)
      document.onmousemove = function (e) {
        if (on) {
          // 通过事件委托，计算移动的距离
          let left = e.clientX - disX
          let top = e.clientY - disY
          console.log(left, top)
          // 移动当前元素
          el.childNodes[0].style.transition = 'all .0.3s ease-out'
          el.childNodes[0].style.left = left + 'px'
          el.childNodes[0].style.top = top + 'px'
          console.log(el.childNodes[0].style.left)
        }
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
        e.preventDefault()
      }
    }
  }
}
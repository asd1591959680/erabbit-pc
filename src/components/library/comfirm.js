import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'

const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }

    const vnode = createVNode(XtxConfirm, { title, text, submitCallback, cancelCallback })
    render(vnode, div)
  })
}

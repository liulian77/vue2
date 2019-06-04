import Vue from 'vue';
/*import { on } from '@/mixins/dom';*/


//当前 Vue 实例是否运行于服务器。
const isServer = Vue.prototype.$isServer;


//jq的事件绑定
const on = (function() {
    if (!isServer && document.addEventListener) {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler);
            }
        };
    }
})();

const nodeList = [];
const ctx = '@@clickoutsideContext';

let startClick;  //点击的dom的event
let seed = 0;



!Vue.prototype.$isServer && on(document, 'mousedown', e => (startClick = e));
!Vue.prototype.$isServer && on(document, 'mouseup', e => {
    nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
});

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
      (vnode.context.popperElm.contains(mouseup.target) ||
      vnode.context.popperElm.contains(mousedown.target)))) return;

    if (binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-ui-clickoutside="handleClose">
 * ```
 */
export default {
  //钩子函数
  //只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
  bind(el, binding, vnode) {
  /**
       el：指令所绑定的元素，可以用来直接操作 DOM 。
       binding：一个对象，包含以下属性：
             name：指令名，不包括 v- 前缀。
             value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
             oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
             expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
             arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
             modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
       vnode：Vue 编译生成的虚拟节点。移步 VNode api 来了解更多详情。
              oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。
   * */
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    };
  },


  //所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },
    //只调用一次，指令与元素解绑时调用。
  unbind(el) {
    let len = nodeList.length;

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  }
};

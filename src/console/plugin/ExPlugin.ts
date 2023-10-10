import {
  createApp,
  createVNode,
  ref,
  VNode,
  onMounted,
  Ref,
  PropType,
  defineComponent,
} from 'vue'
import { Drawer as TDrawer, Dialog as TDialog } from 'tdesign-vue-next'

/* 公共代码 用来控制VNode挂载和销毁 */

interface GhostTrigger {
  visible: Ref
  build(node: VNode): void
  show(): void
  close(): void
}

const useGhostTrigger = (): GhostTrigger => {
  const visible = ref(false)
  let app: any
  let mountNode: any

  const build = (node: VNode) => {
    mountNode = document.createElement('div')
    app = createApp(node)
    app.mount(mountNode)
    document.body.appendChild(mountNode)
  }
  const show = () => {
    visible.value = true
  }
  const close = () => {
    visible.value = false
    setTimeout(() => {
      deotory()
    }, 1000)
  }
  const deotory = () => {
    app && app.unmount()
    document.body.removeChild(mountNode) //把根节点也删掉
  }
  return {
    visible: visible,
    build: build,
    show: show,
    close: close,
  }
}

/* 抽屉组件 */

export interface DrawerOption {
  title: string
  width?: string
}

const DrawerPanel = defineComponent({
  props: {
    opiton: {
      type: Object as PropType<DrawerOption>,
      default: {
        title: '',
        width: '500px',
      },
    },
    trigger: {
      type: Object as PropType<GhostTrigger>,
    },
  },
  setup(props, { slots }) {
    const visible = ref(props.trigger?.visible)
    onMounted(() => {
      /*动画正常*/
      setTimeout(() => {
        props.trigger?.show()
      }, 1)
    })
    return () =>
      createVNode(
        TDrawer,
        {
          header: props.opiton.title,
          visible: visible.value,
          size: props.opiton.width,
          cancelBtn: null,
          confirmBtn: null,
          // showOverlay: false,
          onClose() {
            props.trigger?.close()
          },
          onCloseBtnClick() {
            props.trigger?.close()
          },
        },
        () => slots.default && [slots.default()]
      )
  },
})

const DrawerMethod = (option: DrawerOption, node: VNode): void => {
  const trigger = useGhostTrigger()
  //当被嵌套的子对象传来finish事件，就把爸爸干掉
  node.props = {
    ...node.props,
    onFinish: () => {
      trigger.close()
    },
  }
  //自己套自己，close触发后通过爸爸干掉自己
  const drawerProps = {
    ...option,
    trigger,
  }
  trigger.build(createVNode(DrawerPanel, drawerProps, () => [node]))
}

/* 对话框组件 */

export interface DialogOption {
  title: string
  width?: string
}

const ExPlugin = {
  drawer: DrawerMethod,
}

export { ExPlugin }

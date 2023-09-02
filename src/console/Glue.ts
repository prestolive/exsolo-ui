import { createApp, createVNode, ref, VNode, onMounted } from 'vue'
import { Drawer as TDrawer } from 'tdesign-vue-next'

interface DestroyTrigger {
  deotory(): void
}

const GlueDrawer = {
  props: {
    title: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '500px',
    },
    switcher: {
      type: Object,
    },
  },
  setup(props, { slots }) {
    const visible = ref(props.switcher.visible)
    onMounted(() => {
      /*动画正常*/
      setTimeout(() => {
        props.switcher.open()
      }, 1)
    })
    return () =>
      createVNode(
        TDrawer,
        {
          header: props.title,
          visible: visible.value,
          size: props.width,
          cancelBtn: null,
          confirmBtn: null,
          // showOverlay: false,
          onClose() {
            props.switcher.close()
          },
          onCloseBtnClick() {
            props.switcher.close()
          },
        },
        () => [slots.default()]
      )
  },
}
interface DrawerOption {
  title: string
  width?: string
}
const drawer: (option: DrawerOption, node: VNode) => void = (
  option: DrawerOption,
  node: VNode
) => {
  const visible = ref(false)
  const open = () => {
    visible.value = true
  }
  const close = () => {
    visible.value = false
    setTimeout(() => {
      trigger.deotory()
    }, 1000)
  }
  const switcher = { visible, open, close }
  node.props = {
    ...node.props,
    onFinish: () => {
      switcher.close()
    },
  }
  const drawerProps = {
    ...option,
    switcher,
  }
  const trigger: DestroyTrigger = renderBox(
    createVNode(GlueDrawer, drawerProps, () => [node])
  )
}

const renderBox = (node: VNode): DestroyTrigger => {
  const mountNode = document.createElement('div')
  const app = createApp(node)
  app.mount(mountNode)
  document.body.appendChild(mountNode)
  const trigger: DestroyTrigger = {
    deotory() {
      app.unmount()
      document.body.removeChild(mountNode) //把根节点也删掉
    },
  }
  return trigger
}
export default {
  drawer: drawer,
}

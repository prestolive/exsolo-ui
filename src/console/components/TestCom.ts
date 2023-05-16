import { defineComponent, h } from 'vue'
export default defineComponent({
  name: 'Demo',
  props: {
    name: {
      type: String,
      default: '1',
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'h1',
        {
          class: 'demoClass',
          name: 'ceshi',
          style: { color: 'red' },
          onclick: () => console.log(this),
        },
        [props.name, slots.default()]
      )
  },
})

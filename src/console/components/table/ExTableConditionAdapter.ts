import { h, toRef } from 'vue'

import { CloseCircleFilledIcon } from 'tdesign-icons-vue-next'
export default {
  props: ['value', 'title', 'compare', 'editMode'],
  emits: ['reset'],
  setup(props, { slots, emit }) {
    const mode = toRef(props, 'editMode')
    const val = toRef(props, 'value')
    //≠= > > >=  <=  lk lkl lkr
    return () => [
      h(
        'li',
        {},
        mode.value
          ? h('div', { class: 'ex-cond-item' }, [slots.default()])
          : h('div', { class: 'ex-cond-item desc' }, [
              h(
                'div',
                { class: 'ex-cond-title ' + props.compare },
                props.title
              ),
              h('div', { class: 'ex-cond-value' }, val.value),
              h(
                CloseCircleFilledIcon,
                {
                  size: '16px',
                  class: 'ex-cond-close',
                  onClick() {
                    emit('reset')
                  },
                },
                { default: () => 'x' }
              ),
            ])
      ),
    ]
  },
}

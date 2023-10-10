import { ref, createVNode, inject, VNode } from 'vue'
import { BaseConditionCol, ConditionItem } from '@/console/index.d'
import ExTableConditionAdapter from './ExTableConditionAdapter'
import { Input as TInput, InputValue } from 'tdesign-vue-next'

export default {
  props: [],
  emits: ['change', 'query'],
  setup(props, { slots, emit }) {
    const conditions: Array<BaseConditionCol> = inject('conditions') || []
    const nodes: Array<VNode> = []
    const items: Array<ConditionItem> = []
    let currConditionStr = ''
    let wait = false
    const handleValue = (key: string, val: string) => {
      //根据key找到配置
      const conditionCfg = conditions.find((row) => row.key == key)
      const existIndex = items.findIndex((row) => row.key == key)
      if (val && conditionCfg) {
        const item: ConditionItem = {
          key: key,
          action: conditionCfg.compare || 'eq',
          value: val,
        }
        if (existIndex >= 0) {
          items.splice(existIndex, 1, item)
        } else {
          items.push(item)
        }
      } else {
        items.splice(existIndex, 1)
      }
      const str = items
        .map((row) => row.key + row.action + row.value)
        .sort()
        .join('')
      if (str != currConditionStr) {
        if (!wait) {
          wait = true
          setTimeout(() => {
            emit('change', items)
            wait = false
          }, 150)
        }
        currConditionStr = str
      }

      //FIXME 防抖处理
    }

    const options = [
      {
        content: '选项一',
        value: 1,
        children: [
          {
            content: '选项九',
            value: 9,
          },
        ],
      },
      {
        content: '选项二',
        value: 2,
        children: [
          {
            content: '选项五',
            value: 5,
          },
          {
            content: '选项六',
            value: 6,
          },
        ],
      },
    ]
    nodes.push(
      createVNode(
        'ul',
        {
          style:
            'display: flex;flex-direction: row;justify-content: flex-start;',
        },
        conditions.map((row) => {
          const refVal = ref('')
          const editMode = ref(true)
          if (row.schema == 'text') {
            return createVNode(
              ExTableConditionAdapter,
              {
                value: refVal,
                title: row.title,
                compare: row.compare,
                editMode: editMode,
                onReset() {
                  editMode.value = true
                  refVal.value = ''
                  handleValue(row.key, '')
                },
              },
              () => [
                createVNode(TInput, {
                  placeholder: row.title,
                  clearable: true,
                  autoWidth: true,
                  style: 'min-width: 144px ',
                  value: refVal.value,
                  'onUpdate:value': (val: InputValue) => {
                    refVal.value = val
                  },
                  onEnter: (val: InputValue) => {
                    refVal.value = val
                    if (val) {
                      editMode.value = false
                    }
                    if (val) {
                      handleValue(row.key, val)
                    }
                  },
                  onBlur(val: InputValue) {
                    if (val) {
                      editMode.value = false
                    }
                    if (val) {
                      handleValue(row.key, val)
                    }
                  },
                }),
              ]
            )
          }
        })
      )
    )
    return () => nodes
  },
}

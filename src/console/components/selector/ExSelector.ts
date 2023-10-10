import { ref, onMounted } from 'vue'
import { usePubDataStore } from '@/console/store/PubDataStore'
import { SelectValue } from 'tdesign-vue-next'
import { CommItemVO } from '@/console/api/PubDataAPI'

export interface ChangeCallBack {
  onChange(value: string): void
}

export function useExSelector(tag: string, callback: ChangeCallBack) {
  const pubDataStore = usePubDataStore()

  const selectValue = ref()

  const options = ref<CommItemVO[]>([])

  const loadData = () => {
    options.value = []
    if (tag) {
      pubDataStore.getSelectListData(tag).then((data) => {
        options.value = data
      })
    }
  }
  const onSelectChange = (value: SelectValue) => {
    selectValue.value = value ? value.toString() : ''
    callback.onChange(selectValue.value)
  }

  const onValueInit = (value: string) => {
    selectValue.value = value
  }

  onMounted(() => {
    loadData()
  })

  return {
    selectValue,
    options,
    onValueInit,
    onSelectChange,
  }
}

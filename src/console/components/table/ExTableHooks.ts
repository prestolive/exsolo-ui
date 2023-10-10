import { ref, reactive, onMounted } from 'vue'
import {
  BaseTableCol,
  PageObject,
  Pagination,
  BaseConditionCol,
  PageInfo,
} from '@/console/index.d'
export interface ExTableHooks<T> {
  columns: Array<BaseTableCol>
  pageObject?: PageObject<T>
  conditions: Array<BaseConditionCol>
  loading?: boolean
  loadData: (
    param: object,
    pagination: Pagination
  ) => Promise<PageObject<T>> | undefined
  handlePageChange?: (pageInfo: PageInfo) => void
  handleConditionChange?: (params: object) => void
  handleRefresh?: () => void
}
export function useExTable<T>(props: ExTableHooks<T>) {
  const { loadData } = props

  const pageObject = ref<PageObject<T>>({
    values: [],
    pagination: {
      pageSize: 10,
      current: 1,
    },
  })

  const loading = ref(false)
  let currParams = {}

  const handleLoadData = (params: object) => {
    loading.value = true
    currParams = params
    const p = loadData(currParams, pageObject?.value?.pagination)
    if (p) {
      p?.then((data) => {
        pageObject.value = data
      }).finally(() => [(loading.value = false)])
    } else {
      loading.value = false
    }
  }
  if (props.handlePageChange == undefined) {
    props.handlePageChange = (pageInfo: PageInfo) => {
      pageObject.value = {
        ...pageObject.value,
        pagination: {
          pageSize: pageInfo.pageSize,
          current: pageInfo.current,
        },
      }
      handleLoadData(currParams)
    }
  }
  if (props.handleConditionChange == undefined) {
    props.handleConditionChange = (params: object) => {
      //刷新条件默认返回第一页
      pageObject.value.pagination.current = 1
      handleLoadData(params)
    }
  }
  if (props.handleRefresh == undefined) {
    props.handleRefresh = () => {
      handleLoadData(currParams)
    }
  }
  onMounted(() => {
    handleLoadData({})
  })
  // return ref({ ...props, pageObject })
  return reactive({ ...props, pageObject, loading })
}

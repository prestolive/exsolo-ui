import { defineStore } from 'pinia'
import { post, CommItemVO } from '@/console/api/PubDataAPI'

export const usePubDataStore = defineStore('pub-data-store', () => {
  const cache: Map<string, CommItemVO[]> = new Map()

  /* FIXME 抖动处理，当同时多个发起相同的数据时，只请求一次 */
  const waitingFlag: Map<string, boolean> = new Map()

  const getSelectListData = (tag: string): Promise<CommItemVO[]> => {
    const exists = cache.get(tag)
    if (!exists) {
      const isWaiting = waitingFlag.get(tag)
      if (!isWaiting) {
        waitingFlag.set(tag, true)
        return post('api/console/select/list', { tag: tag }).then((data) => {
          cache.set(tag, data)
          waitingFlag.delete(tag)
          return Promise.resolve(data)
        })
      } else {
        return new Promise((resolve, reject) => {
          //如果发现已经有在途查询，则等待，每100毫秒看下结果有没，有就继续
          let retryCount = 0
          const timer = setInterval(() => {
            retryCount++
            const cacheList = cache.get(tag)
            if (!cacheList && retryCount > 30) {
              clearInterval(timer)
              reject()
            }
            if (cacheList) {
              clearInterval(timer)
              resolve(cacheList)
            }
          }, 100)
        })
      }
    } else {
      return Promise.resolve(exists)
    }
  }

  return {
    getSelectListData,
  }
})

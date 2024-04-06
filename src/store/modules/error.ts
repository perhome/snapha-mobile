import { defineStore } from 'pinia'
import { store } from '@/store'
import { errorGlobal } from '@/config/error'
import type { ErrorState } from '@/config/error'

export const useErrorStore = defineStore({
  id: 'error',
  state: (): ErrorState => errorGlobal,
  getters: {
    getErrorCode(): number {
      return this.errorCode
    },
    getErrorMsg(): string {
      return this.errorMsg
    },
    getErrorShow(): boolean {
      return this.errorShow
    }
  },
  actions: {
    setErrorCode(errorCode: number) {
      this.errorCode = errorCode
    },
    setErrorMsg(errorMsg: string) {
      this.errorMsg = errorMsg
    },
    setErrorShow(errorShow: boolean) {
      this.errorShow = errorShow
    }
  }
})

export const useErrorStoreWithOut = () => {
  return useErrorStore(store)
}

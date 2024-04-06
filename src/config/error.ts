export interface ErrorState {
  errorCode: number
  errorMsg: string
  errorShow: boolean
}

export const errorGlobal: ErrorState = {
  errorCode: 0,
  errorMsg: '',
  errorShow: false
}

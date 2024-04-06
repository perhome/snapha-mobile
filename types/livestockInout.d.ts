declare interface eventAmountScheme {
  id: number
  eventId: number | undefined
  amount: number | undefined
  eventName: string | undefined
}

declare interface livestockInoutScheme {
  productId: number | undefined
  livestockSn: any | undefined
  eventAmount: eventAmountScheme[] | undefined
  hitDate: string | undefined
  remark: string | undefined
  flowableEnable: boolean | undefined
  photo: Array<string>
}

declare interface livestockWeightRatioScheme {
  amount: number | undefined
  weight: number | undefined
  ratio: number | undefined
}

declare interface livestockFeedingScheme {
  productId: number | undefined
  livestockSn: string | undefined
  amount: number | undefined
  latestAmount: number | undefined
  hitDate: string | undefined
  weight: number | undefined
  realWeight: number | undefined
  remark: string | undefined
}

declare interface livestockWeightScheme {
  productId: number | undefined
  livestockSn: string | undefined
  amount: number | undefined
  hitDate: string | undefined
  weight: number | undefined
  remark: string | undefined
}

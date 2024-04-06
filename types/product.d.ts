declare interface productScheme {
  pid: number | undefined
  name: string | undefined
  nameSpell: string | undefined
  nameAbbr: string | undefined
}

declare interface livestockScheme {
  lid: number | undefined
  lsn: string | undefined
  productName: string | undefined
  latestAmount: number | undefined
}

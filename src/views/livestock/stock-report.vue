<script setup lang="ts">
import { reactive, ref } from 'vue'
import { closeToast, showLoadingToast } from 'vant'
import { useAxios } from '@/hooks/useAxios'
import moment from 'moment'

defineOptions({
  name: 'LivestockStockReport'
})

const queryForm = reactive({
  startDate: '',
  endDate: '',
  productId: undefined
})

const request = useAxios()
const queryDateText = moment().format()

const stockReportList = ref<any>([])

const getLivestockStockReport = async () => {
  showLoadingToast('获取中...')
  const res = await request.get({
    url: 'api/v2/livestock/stock-report',
    params: queryForm
  })
  if (res.data.list && res.data.list.length > 0) {
    stockReportList.value = res.data.list
  }
  closeToast()
}
getLivestockStockReport()
</script>
<template>
  <van-notice-bar wrapable :scrollable="false" text="当前实时数据" />
  <van-cell title="当前日期" :value="queryDateText" />

  <van-cell-group v-if="stockReportList.length > 0">
    <van-cell
      v-for="item in stockReportList"
      :title="item.productName"
      :label="item.lsn"
      :key="item"
      :value="item.totalAmount"
    />
  </van-cell-group>
  <van-empty v-else description="未发现统计数字" />
</template>

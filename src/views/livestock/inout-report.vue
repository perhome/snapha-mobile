<script setup lang="ts">
import { reactive, ref } from 'vue'
import { closeToast, showLoadingToast } from 'vant'
import { useAxios } from '@/hooks/useAxios'
import moment from 'moment'

defineOptions({
  name: 'LivestockInoutReport'
})

const queryForm = reactive({
  startDate: '',
  endDate: '',
  productId: undefined
})

const request = useAxios()
const queryDateText = ref('')
const queryDate = ref([new Date().setDate(1), new Date()])
const showDate = ref(false)
const minDate = new Date(2022, 0, 1)
const formatDate = (date: any) => `${date.getMonth() + 1}/${date.getDate()}`
const onConfirm = (values: any) => {
  const [start, end] = values

  queryForm.startDate = moment(start).format('YYYY-MM-DD')
  queryForm.endDate = moment(end).format('YYYY-MM-DD')
  console.log('queryForm => ', queryForm)
  showDate.value = false
  queryDateText.value = `${formatDate(start)} - ${formatDate(end)}`
  getLivestockInoutReport()
}
const inoutReportList = ref<any>([])

const getLivestockInoutReport = async () => {
  showLoadingToast('获取中...')
  const res = await request.get({
    url: 'api/v2/livestock/inout-report',
    params: queryForm
  })
  if (res.data.list && res.data.list.length > 0) {
    inoutReportList.value = res.data.list
  }
  closeToast()
}
// getLivestockInoutReport()
</script>
<template>
  <van-notice-bar wrapable :scrollable="false" text="输入开始日期-结束日期 统计出栏数据" />
  <van-cell title="选择日期区间" :value="queryDateText" @click="showDate = true" />
  <van-calendar
    v-model:show="showDate"
    safe-area-inset-bottom
    type="range"
    @confirm="onConfirm"
    :min-date="minDate"
  />
  <van-cell-group v-if="inoutReportList.length > 0">
    <van-cell
      v-for="item in inoutReportList"
      :title="item.productName + '-' + item.eventName"
      :key="item"
      :value="item.totalAmount"
    />
  </van-cell-group>
  <van-empty v-else description="未发现统计数字" />
</template>

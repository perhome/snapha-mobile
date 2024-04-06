<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { ImagePreview, Col, Row, Dialog, Toast, Cell } from 'vant'
defineOptions({
  name: 'MyGoods'
})

const request = useAxios()
const queryForm = reactive({
  goodsCategory: null,
  pageSize: 20,
  currentPage: 1
})
const activeRecordId = ref(undefined)

const myGoodsCategoryOptions = ref([
  { text: '全部类型', value: '' },
  { text: '工资主表', value: 'ZHU' },
  { text: '我的津贴', value: 'JT' }
])

const generateTitle = (item: any) => {
  let title = '薪资类型：'
  switch (item.salaryType) {
    case 'ZHU':
      title += '主表'
      break
    case 'JT':
      title += '津贴'
      break
    case 'GCKH':
      title += '过程性考核'
      break
    case 'JGKH':
      title += '结果性考核'
      break
  }
  title += ' - ' + item.yearMonth
  return title
}

const mySalaryList = ref<any[]>([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const onLoad = async () => {
  loading.value = true
  const res = await request.get({
    url: 'api/v2/user/salary',
    params: queryForm
  })
  if (res.data.list && res.data.list.length > 0) {
    mySalaryList.value.push(...res.data.list)
    queryForm.currentPage += 1
  } else {
    finished.value = true
  }
  loading.value = false
}
const onRefresh = () => {
  queryForm.currentPage = 1
  mySalaryList.value = []
  refreshing.value = true
  finished.value = false
  onLoad()
  refreshing.value = false
}
</script>
<template>
  <van-empty description="暂未公开" />
</template>

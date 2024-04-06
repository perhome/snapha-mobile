<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { ImagePreview, Col, Row, Dialog, Toast, Cell } from 'vant'
defineOptions({
  name: 'MySalary'
})

const request = useAxios()
const queryForm = reactive({
  yearMonth: null,
  salaryType: null,
  pageSize: 20,
  currentPage: 1
})
const activeSalaryId = ref(undefined)
const myYearMonthOptions = ref([
  { text: '全部', value: '' },
  { text: '2022-09', value: '2022-09' },
  { text: '2022-08', value: '2022-08' },
  { text: '2022-07', value: '2022-07' },
  { text: '2022-06', value: '2022-06' }
])
const mySalaryTypeOptions = ref([
  { text: '全部', value: '' },
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
  <van-sticky>
    <van-dropdown-menu>
      <van-dropdown-item
        v-model="queryForm.yearMonth"
        title="选择年月"
        :options="myYearMonthOptions"
      />
      <van-dropdown-item
        v-model="queryForm.salaryType"
        title="工资类型"
        :options="mySalaryTypeOptions"
      />
    </van-dropdown-menu>
  </van-sticky>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="到这里就没有了"
      @load="onLoad"
    >
      <van-collapse v-model="activeSalaryId" accordion>
        <van-collapse-item
          v-for="item in mySalaryList"
          :key="item.usid"
          :title="generateTitle(item)"
          :name="item.usid"
        >
          <van-cell-group>
            <van-cell
              v-for="key in Object.keys(item.salary)"
              :key="key"
              :title="key"
              :value="item.salary[key]"
            />
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </van-list>
    <van-skeleton v-if="loading == false && mySalaryList.length == 0" title :row="3" />
  </van-pull-refresh>
</template>

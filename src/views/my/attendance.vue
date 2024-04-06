<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { reactive, ref, watch } from 'vue'
import { formatTime } from '@/utils'

defineOptions({
  name: 'MyAttendance'
})

const request = useAxios()
const queryForm = reactive({
  yearMonth: formatTime(new Date(), 'yyyy-MM'),
  dayType: '',
  pageSize: 20,
  currentPage: 1
})
const activeAttendanceId = ref(undefined)

const myYearMonthOptions = ref([
  { text: '2022-12', value: '2022-12' },
  { text: '2022-11', value: '2022-11' },
  { text: '2022-10', value: '2022-10' },
  { text: '2022-09', value: '2022-09' },
  { text: '2022-08', value: '2022-08' }
])
const myAttendanceExceptionOptions = ref([
  { text: '全部记录', value: '' },
  { text: '缺卡记录', value: 'noHitExceptionDay' },
  { text: '迟到记录', value: 'lateExceptionDay' },
  { text: '早退记录', value: 'earlExceptionDay' },
  { text: '休班记录', value: 'beakDay' }
])

const myAttendanceList = ref<any[]>([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const getAttendanceList = async () => {
  loading.value = true
  const res = await request.get({
    url: 'api/v2/user/attendance',
    params: queryForm
  })

  // console.log(queryForm)

  if (res.data.list.length > 0) {
    myAttendanceList.value.push(...res.data.list)
  } else {
    finished.value = true
  }
  // console.log(finished.value, res.data.list.length, res.data)
  loading.value = false
}
const onRefresh = () => {
  queryForm.currentPage = 1
  myAttendanceList.value = []
  refreshing.value = true
  finished.value = false
  getAttendanceList()
  refreshing.value = false
}
const generateTitle = (item: any) => {
  let attendanceType = item.hitDate + ' '
  switch (item.attendanceType) {
    case 'H':
      attendanceType += '休班' + ' ' + item.day + '天'
      break
    case 'W':
      attendanceType += '工作日'
      break
    default:
  }
  return attendanceType
}
const onLoad = () => {
  queryForm.currentPage += 1
  getAttendanceList()
}
watch([() => queryForm.yearMonth, () => queryForm.dayType], (val) => onRefresh(), {
  immediate: true
})

// getAttendanceList()
</script>
<template>
  <van-sticky>
    <van-dropdown-menu>
      <van-dropdown-item v-model="queryForm.yearMonth" :options="myYearMonthOptions" />
      <van-dropdown-item v-model="queryForm.dayType" :options="myAttendanceExceptionOptions" />
    </van-dropdown-menu>
  </van-sticky>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="到这里就没有了"
      @load="onLoad"
      v-if="myAttendanceList.length > 0"
    >
      <van-collapse v-model="activeAttendanceId" accordion>
        <van-collapse-item
          v-for="item in myAttendanceList"
          :key="item.utid"
          :title="generateTitle(item)"
          :name="item.utid"
        >
          <van-cell-group v-if="item.attendanceType == 'W'">
            <van-cell title="上午 上班" v-if="item.time1 != '00:00:00'" :value="item.time1" />
            <van-cell title="上午 下班" v-if="item.time2 != '00:00:00'" :value="item.time2" />
            <van-cell title="下午 上班" v-if="item.time3 != '00:00:00'" :value="item.time3" />
            <van-cell title="下午 下班" v-if="item.time4 != '00:00:00'" :value="item.time4" />
            <van-cell title="夜勤 上班" v-if="item.time5 != '00:00:00'" :value="item.time5" />
            <van-cell title="夜勤 下班" v-if="item.time6 != '00:00:00'" :value="item.time6" />
          </van-cell-group>
          <van-cell-group v-else>
            <van-cell
              title="休班 上午"
              v-if="item.time1 && item.time1 != '00:00:00'"
              :value="item.time1"
            />
            <van-cell
              title="休班 上午"
              v-if="item.time2 && item.time2 != '00:00:00'"
              :value="item.time2"
            />
            <van-cell
              title="休班 下午"
              v-if="item.time3 && item.time3 != '00:00:00'"
              :value="item.time3"
            />
            <van-cell
              title="休班 下午"
              v-if="item.time4 && item.time4 != '00:00:00'"
              :value="item.time4"
            />
            <van-cell
              title="休班 夜勤"
              v-if="item.time5 && item.time5 != '00:00:00'"
              :value="item.time5"
            />
            <van-cell
              title="休班 夜勤"
              v-if="item.time6 && item.time6 != '00:00:00'"
              :value="item.time6"
            />
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </van-list>
    <div v-else>
      <van-empty description="暂时未发现数据" />
      <van-skeleton title :row="3" />
    </div>
  </van-pull-refresh>
</template>

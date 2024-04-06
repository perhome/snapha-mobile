<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { useRouter } from 'vue-router'
import { computed, reactive, ref, watch } from 'vue'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
import { useAppStoreWithOut } from '@/store/modules/app'

defineOptions({
  name: 'MyAttendanceExceptionCheckin'
})

const router = useRouter()
const request = useAxios()
const queryForm = reactive({
  yearMonth: null,
  pageSize: 31,
  currentPage: 1
})
const refreshing = ref(false)

const appStore = useAppStoreWithOut()
const userRole = appStore.getUserRole
const stepMonthList = ref([])
const getStepMonthList = async () => {
  const res = await request.get({
    url: 'api/v1/step-month'
  })
  stepMonthList.value = res.data.list
  // TODO 处理默认开放月度
  queryForm.yearMonth = res.data.list[0]['yearMonth']
}
const absenceDaysList = ref<any>([])
const getAbsenceDays = async () => {
  const res = await request.get({
    url: '/api/v2/user/attendance/absence-day',
    params: queryForm
  })
  absenceDaysList.value = res.data.list
  refreshing.value = false
}

const myStepMonthOptions = computed(() => {
  let ret: any = []
  stepMonthList.value.forEach((item: any) => {
    const textYearMonth = item.yearMonth + (item.closed == 0 ? ' (开放)' : ' (完成)')
    ret.push({ text: textYearMonth, value: item.yearMonth })
  })
  return ret
})
const formCheckin = reactive({
  hitDate: undefined,
  time: undefined,
  timeName: '',
  checkinType: undefined,
  checkinRemark: undefined
})
const showAbsenceConfirm = ref(false)
const handleBreakDay = (item: any) => {
  router.push({ name: 'ToolsBreakAdd', query: { hitDate: item.hitDate } })
}
const handleCheckin = (item: any, timeName: string) => {
  formCheckin.hitDate = item.hitDate
  formCheckin.timeName = timeName
  showAbsenceConfirm.value = true
}

const onSubmit = () => {
  // console.log('formCheckin => ', formCheckin)
  if (!formCheckin.checkinType) {
    showFailToast('未填写缺卡类型')
    return
  } else if (formCheckin.checkinType == '工作原因' && !formCheckin.checkinRemark) {
    showFailToast('工作原因缺卡未填写工作内容')
    return
  } else {
  }

  showConfirmDialog({
    title: '补卡确认',
    message: '确认提交 ' + formCheckin.checkinType + ' 补卡信息'
  }).then(async () => {
    const res = await request.post({
      url: 'api/v2/user/attendance/absence-day',
      data: formCheckin
    })
    if (res) {
      showSuccessToast('保存成功！')
      showAbsenceConfirm.value = false
      await getAbsenceDays()
    }
  })
}
const activeDay = ref('')
const init = () => {
  getStepMonthList().then(() => getAbsenceDays())
}

init()
watch(
  () => queryForm.yearMonth,
  () => getAbsenceDays()
)
</script>
<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="queryForm.yearMonth" :options="myStepMonthOptions" />
  </van-dropdown-menu>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="getAbsenceDays">
    <van-collapse v-model="activeDay" accordion v-if="absenceDaysList.length > 0">
      <van-collapse-item
        :key="item.hitDate"
        :title="item.hitDate"
        :name="item.hitDate"
        v-for="item in absenceDaysList"
      >
        <van-field
          v-model="item.time1"
          label="上午上班"
          readonly
          placeholder="缺卡"
          v-if="item.time1 != '00:00:00' && !userRole.includes('NIGHT_DUTY')"
        >
          <template #button>
            <van-space v-if="item.time1 == ''">
              <van-button @click="handleBreakDay(item)" type="success">休班</van-button>
              <van-button @click="handleCheckin(item, 'time1')" type="primary">补卡</van-button>
            </van-space>
          </template>
        </van-field>
        <van-field
          v-model="item.time2"
          readonly
          label="上午下班"
          placeholder="缺卡"
          v-if="item.time2 != '00:00:00' && !userRole.includes('NIGHT_DUTY')"
        >
          <template #button v-if="item.time2 == ''">
            <van-space>
              <van-button @click="handleCheckin(item, 'time2')" type="primary">补卡</van-button>
            </van-space>
          </template>
        </van-field>
        <van-field
          v-model="item.time3"
          readonly
          label="下午上班"
          placeholder="缺卡"
          v-if="item.time3 != '00:00:00' && !userRole.includes('NIGHT_DUTY')"
        >
          <template #button v-if="item.time3 == ''">
            <van-space>
              <van-button @click="handleBreakDay(item)" type="success">休班</van-button>
              <van-button @click="handleCheckin(item, 'time3')" type="primary">补卡</van-button>
            </van-space>
          </template>
        </van-field>
        <van-field
          v-model="item.time4"
          label="下午下班"
          readonly
          placeholder="缺卡"
          v-if="item.time4 != '00:00:00' && !userRole.includes('NIGHT_DUTY')"
        >
          <template #button v-if="item.time4 == ''">
            <van-button @click="handleCheckin(item, 'time4')" type="primary">补卡</van-button>
          </template>
        </van-field>
        <van-field
          v-model="item.time5"
          label="夜勤下班"
          readonly
          placeholder="缺卡"
          v-if="item.time5 != '00:00:00' && userRole.includes('NIGHT_DUTY')"
        >
          <template #button v-if="item.time5 == ''">
            <van-button @click="handleCheckin(item, 'time5')" type="primary">补卡</van-button>
          </template>
        </van-field>
        <van-field
          v-model="item.time6"
          label="夜勤上班"
          readonly
          placeholder="缺卡"
          v-if="item.time6 != '00:00:00' && userRole.includes('NIGHT_DUTY')"
        >
          <template #button v-if="item.time6 == ''">
            <van-button @click="handleBreakDay(item)" type="success">休班</van-button>
            <van-button @click="handleCheckin(item, 'time6')" type="primary">补卡</van-button>
          </template>
        </van-field>
      </van-collapse-item>
    </van-collapse>
    <van-empty v-else description="考勤记录正常，无需任何操作" />
  </van-pull-refresh>
  <van-popup v-model:show="showAbsenceConfirm" position="bottom" :style="{ height: '80%' }">
    <van-notice-bar wrapable :scrollable="false" text="选择缺卡属于个人原因还是工作原因？" />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formCheckin.hitDate"
          readonly
          label="补卡日期"
          placeholder="补卡日期"
          :rules="[{ required: true, message: '请填写补卡日期' }]"
        />
        <van-cell>
          <van-radio-group v-model="formCheckin.checkinType" direction="horizontal">
            <van-radio name="个人原因">个人原因</van-radio>
            <van-radio name="工作原因">工作原因</van-radio>
          </van-radio-group>
        </van-cell>
        <van-field
          v-model="formCheckin.checkinRemark"
          name="原因"
          rows="2"
          type="textarea"
          label="填写原因"
          placeholder="填写原因"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </van-popup>
</template>

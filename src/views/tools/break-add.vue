<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { useRoute, useRouter } from 'vue-router'
import { computed, reactive, ref } from 'vue'
import { formatTime } from '@/utils'
import { Dialog, showConfirmDialog, showSuccessToast, Toast } from 'vant'
import { useAppStoreWithOut } from '@/store/modules/app'

defineOptions({
  name: 'ToolsBreakAdd'
})

const router = useRouter()
const route = useRoute()
const request = useAxios()
const appStore = useAppStoreWithOut()
const userCode = appStore.getUserCode
const breakEntity: any = {
  hitDate: route.query.hitDate ? route.query.hitDate : formatTime(new Date(), 'yyyy-MM-dd'),
  holidayId: 17,
  holidayName: '周末',
  breakType: undefined
}
const temp = reactive({ ...breakEntity })
const minDate = new Date(new Date().getTime() - 45 * 24 * 3600 * 1000)
const maxDate = new Date(new Date().getTime() + 31 * 24 * 3600 * 1000)
const showHitDate = ref(false)
const showPicker = ref(false)
const holidaySelect = ref([17])
const onHitDateConfirm = (date: Date) => {
  showHitDate.value = false
  temp.hitDate = formatTime(date, 'yyyy-MM-dd')
}
const onHolidayConfirm = ({ selectedValues, selectedOptions }: any) => {
  showPicker.value = false
  // console.log(selectedOptions)
  temp.holidayId = selectedValues[0]
  temp.holidayName = selectedOptions[0].name
}
const holidayList = ref([])
const holidayLCustomFieldName = {
  text: 'name',
  value: 'hid'
}
const getHolidayList = async () => {
  const res = await request.get({
    url: 'api/v2/user/holiday'
  })
  if (res) {
    holidayList.value = res.data.list
  }
}
const usedHolidayList = ref([])
const getUsedHolidayList = async () => {
  const res = await request.get({
    url: 'api/v1/my/attendance/getUsedHoliday',
    params: {
      hitDate: temp.hitDate
    }
  })
  if (res.data.list) {
    usedHolidayList.value = res.data.list
  }
}
const myHolidayList = computed(() => {
  let ret: any = []
  holidayList.value.forEach((item: any) => {
    const found: any = usedHolidayList.value.find((val: any) => val.holidayName == item.name)
    if (found) {
      item.name += ' (已用' + found.realDay + '天)'
    }
    ret.push(item)
  })
  return ret
})
const getBreakTypeText = (breakType: string) => {
  let text = ''
  switch (breakType) {
    case 'AM':
      text = '上午'
      break
    case 'PM':
      text = '下午'
      break
    case 'DAY':
      text = '全天'
      break
  }
  return text
}
const onSubmit = () => {
  let breakTypeText = ''
  temp.breakType.forEach((item: string) => {
    breakTypeText += getBreakTypeText(item)
  })
  showConfirmDialog({
    title: '数据确认',
    message:
      '休班日期：' +
      temp.hitDate +
      ' 时间段： ' +
      breakTypeText +
      ' 确认当前数据无误，点击确认提交？'
  }).then(async () => {
    const res = await request.post({
      url: 'api/v2/user/attendance/break-day',
      data: temp
    })
    showSuccessToast('保存成功！')
    await getUsedHolidayList()
    Object.assign(temp, breakEntity)
  })
}
const init = async () => {
  await getHolidayList()
  await getUsedHolidayList()
}
init()
</script>
<template>
  <van-form @submit="onSubmit" label-width="90">
    <van-cell-group>
      <van-field
        v-model="temp.hitDate"
        label="休班日期"
        :rules="[{ required: true, message: '不能为空' }]"
        readonly
        placeholder="请选择休班日期"
        clearable
        @click="showHitDate = true"
        is-link
      />
      <van-field
        v-model="temp.holidayName"
        is-link
        readonly
        name="holidayId"
        label="假期类型"
        placeholder="点击选择假期类型"
        @click="showPicker = true"
      />
      <van-field
        name="breakTypeGroup"
        :rules="[{ required: true, message: '不能为空' }]"
        label="时间段"
      >
        <template #input>
          <van-checkbox-group v-model="temp.breakType">
            <van-checkbox style="margin: 0 0 10px" name="DAY" shape="square">休全天</van-checkbox>
            <van-checkbox style="margin: 0 0 10px" name="AM" shape="square">休上午</van-checkbox>
            <van-checkbox style="margin: 0 0 10px" name="PM" shape="square">休下午</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button type="primary" loading-text="申请中..." round block native-type="submit">
          提交休班
        </van-button>
        <van-button
          style="margin: 10px 0"
          type="primary"
          block
          round
        >
          查看剩余假期
        </van-button>
      </div>
    </van-cell-group>
  </van-form>
  <van-calendar
    v-model:show="showHitDate"
    :show-confirm="false"
    :min-date="minDate"
    :max-date="maxDate"
    @confirm="onHitDateConfirm"
  />
  <van-popup v-model:show="showPicker" position="bottom">
    <van-picker
      v-model="holidaySelect"
      :columns="myHolidayList"
      @confirm="onHolidayConfirm"
      :style="{ height: '70%' }"
      :columns-field-names="holidayLCustomFieldName"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

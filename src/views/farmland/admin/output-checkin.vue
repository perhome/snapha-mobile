<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { ImagePreview, Col, Row, Dialog, Toast, Cell, showFailToast, showSuccessToast } from 'vant'
import { formatTime } from '@/utils'
import { useAppStoreWithOut } from '@/store/modules/app'
defineOptions({
  name: 'FarmlandAdminOutputCheckin'
})
const appStore = useAppStoreWithOut()
const request = useAxios()
const queryForm = reactive({
  hitDate: formatTime(new Date(), 'yyyy-MM-dd'),
  to: 'pack',
  workspaceName: undefined
})

const outputReportEntity = {
  totalLevel1: 0,
  totalLevel2: 0,
  totalLevel3: 0,
  totalAmount: 0,
  number: 0
}

const outputReport = ref({
  ...outputReportEntity
})

const getFarmlandOutputReport = async () => {
  const res = await request.get({
    url: 'api/v2/farmland/output-report',
    params: queryForm
  })
  if (res.data.result) {
    outputReport.value = res.data.result
  } else {
    showFailToast('没有汇总数据')
    outputReport.value = outputReportEntity
  }
}

const userRole = appStore.getUserRole
const isManager = userRole.includes('MANAGER')

const handleUpdateStatus = async () => {
  const res = await request.post({
    url: 'api/v2/farmland/output-checkin/status',
    data: queryForm
  })
  if (res.data.result) {
    showSuccessToast('更新成功')
  } else {
    showSuccessToast('暂无更新')
  }
}
getFarmlandOutputReport()
</script>
<template>
  <van-cell-group>
    <van-field
      v-model="queryForm.hitDate"
      label="单据日期"
      :rules="[{ required: true, message: '不能为空' }]"
      clearable
      type="date"
      is-link
    />
    <van-field label="去向" :rules="[{ required: true, message: '不能为空' }]">
      <template #input>
        <van-radio-group v-model="queryForm.to" direction="horizontal">
          <van-space wrap>
            <van-radio name="pack">包装</van-radio>
            <van-radio name="2">二牧</van-radio>
            <van-radio name="3">三牧</van-radio>
            <van-radio name="4">四牧</van-radio>
            <van-radio name="goat">羊圈</van-radio>
            <van-radio name="chicken">鸡圈</van-radio>
          </van-space>
        </van-radio-group>
      </template>
    </van-field>
    <van-field
      v-model="queryForm.workspaceName"
      label="种植区域"
      :rules="[{ required: true, message: '不能为空' }]"
      clearable
      placeholder="如1-1; 大田G区等"
    />
    <van-divider>
      <van-button type="primary" @click="getFarmlandOutputReport"> 获取汇总查询数据 </van-button>
    </van-divider>
    <van-cell title="合计产量" :value="outputReport.totalAmount" />
    <van-cell title="合计产量1" :value="outputReport.totalLevel1" />
    <van-cell title="合计产量2" :value="outputReport.totalLevel2" />
    <van-cell title="合计产量3" :value="outputReport.totalLevel3" />
    <van-cell title="单据数量" :value="outputReport.number" />
    <van-cell v-if="isManager">
      <van-button type="warning" round block @click="handleUpdateStatus">
        记账当前下菜单单据
      </van-button>
    </van-cell>
  </van-cell-group>
</template>

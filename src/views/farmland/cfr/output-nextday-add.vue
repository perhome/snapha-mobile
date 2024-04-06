<script setup lang="ts">
import { formatTime } from '@/utils'
import { reactive, ref, watch } from 'vue'
import {
  closeToast,
  showDialog,
  showFailToast,
  showLoadingToast,
  showNotify,
  showSuccessToast
} from 'vant'
import { UploaderBeforeRead } from 'vant/lib/uploader/types'
import { useAxios } from '@/hooks/useAxios'
import WorkspaceCfrSelection from '@/views/component/WorkspaceCfrSelection.vue'
defineOptions({
  name: 'FarmlandCfrOutputNextDayAdd'
})

const request = useAxios()
const date = new Date()
date.setDate(date.getDate() + 1)
const today = formatTime(date, 'yyyy-MM-dd')
const outputEntity: any = {
  cponid: undefined,
  hitDate: today,
  workspaceId: undefined,
  workspaceName: undefined,
  productName: undefined,
  level1: undefined,
  level2: undefined,
  level3: undefined,
  remark: undefined,
  cfrWorkspaceId: undefined
}
const temp = reactive({ ...outputEntity })
const tempCfr = ref<any>({})

const onSubmit = async () => {
  temp.workspaceName = tempCfr.value.workspaceName
  temp.productName = tempCfr.value.productName
  temp.productId = tempCfr.value.productId
  temp.workspaceId = tempCfr.value.workspaceId
  temp.cfrWorkspaceId = tempCfr.value.cwid
  if (!temp.level1) {
    showNotify({ type: 'warning', message: '产量不正确' })
    return
  }

  showDialog({
    title: '预估单信息',
    message: '下菜区块：' + temp.workspaceName + ';产品：' + temp.productName + '; 确认提交？'
  }).then(async () => {
    const toast = showLoadingToast({
      duration: 0,
      message: '保存中...',
      forbidClick: true
    })
    const res = await request.post({
      url: 'api/v1/my/cfr-product/output-nextday',
      data: temp
    })
    closeToast()
    if (res) {
      showSuccessToast('保存成功！')
      // outputEntity.workspaceParentName = temp.workspaceParentName
      Object.assign(temp, outputEntity)
    } else {
      showFailToast('保存失败！')
    }
  })
}
const minDate = new Date(new Date().getTime() - 360 * 24 * 3600 * 1000)
const maxDate = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000)
// 出栏日期
const showHitDate = ref(false)
const onHitDateConfirm = (date: Date) => {
  showHitDate.value = false
  temp.hitDate = formatTime(date, 'yyyy-MM-dd')
  // temp.hitDate = formatTime(date, 'yyyy-MM-dd 00:00:00')
}
const showWorkspaceCfr = ref(false)

watch(
  () => tempCfr.value.productId,
  (val) => {
    if (tempCfr.value.output) {
      tempCfr.value.output.forEach((item: any) => {
        if (val == item.productId) {
          temp.productName = item.productName
          tempCfr.value.productName = item.productName
        }
      })
    }
  }
)
</script>
<template>
  <van-form @submit="onSubmit" label-width="90">
    <van-cell-group>
      <van-field
        v-model="temp.hitDate"
        label="预估日期"
        :rules="[{ required: true, message: '不能为空' }]"
        readonly
        placeholder="请选择日期时间"
        clearable
        @click="showHitDate = true"
        is-link
      />
      <van-field
        v-model="tempCfr.workspaceName"
        label="大棚/田号"
        :rules="[{ required: true, message: '不能为空' }]"
        placeholder="请填写棚号/大田 如 3-1,大田F区"
        @click="showWorkspaceCfr = true"
        readonly
        clearable
        is-link
      />
      <van-field v-model="tempCfr.productName" label="产品名称" readonly>
        <template #input>
          <van-radio-group v-model="tempCfr.productId" v-if="'output' in tempCfr && tempCfr.output">
            <van-space wrap>
              <van-radio
                v-for="item in tempCfr.output"
                :key="item.productId"
                :name="item.productId"
              >
                {{ item.productName }}
              </van-radio>
            </van-space>
          </van-radio-group>
          <span v-else> {{ tempCfr.productName }} </span>
        </template>
      </van-field>
      <van-field
        v-model="temp.level1"
        label="预估菜"
        placeholder="预估产量"
        clearable
        type="number"
      />
      <van-field
        v-model="temp.remark"
        rows="1"
        type="textarea"
        placeholder="请输入备注"
        label="备注信息"
      />
      <van-cell>
        <van-button type="primary" block round loading-text="申请中..." native-type="submit">
          预估菜提交
        </van-button>
      </van-cell>
    </van-cell-group>
  </van-form>
  <van-popup
    v-model:show="showWorkspaceCfr"
    position="left"
    :style="{ height: '100%', width: '80%' }"
  >
    <workspace-cfr-selection v-model="tempCfr" v-model:show="showWorkspaceCfr" />
  </van-popup>
  <van-calendar
    v-model:show="showHitDate"
    :show-confirm="false"
    :min-date="minDate"
    :max-date="maxDate"
    @confirm="onHitDateConfirm"
  />
</template>

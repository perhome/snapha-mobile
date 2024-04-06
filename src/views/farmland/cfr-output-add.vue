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
import { useRoute } from 'vue-router'
defineOptions({
  name: 'FarmlandCfrOutputAdd'
})

const request = useAxios()
const route = useRoute()
const outputEntity: any = {
  wpoid: undefined,
  hitDate: formatTime(new Date(), 'yyyy-MM-dd'),
  workspaceId: undefined,
  workspaceName: undefined,
  productName: undefined,
  level1: undefined,
  level2: undefined,
  level3: undefined,
  to: route.query.to,
  containerType: 'blue',
  containerNumber: 1,
  remark: undefined,
  cfrWorkspaceId: undefined,
  photo: []
}
const temp = reactive({ ...outputEntity })
const tempCfr = ref<any>({})
//文件上传
const tempFiles = ref([])
const beforeFileDelete = (file: any, detail: any) => {
  // console.log(detail)
  delete temp.photo[detail.index]
  showSuccessToast('删除了上第 ' + (detail.index + 1) + '个文件')
  return true
}
const beforeFileRead: UploaderBeforeRead = (file: any, detail: any) => {
  // console.log(detail)
  return true
}
const afterFileRead = async (file: any, detail: object) => {
  const postParam = new FormData()
  postParam.append('file', file.file)
  postParam.append('directory', 'cfr-product-output')
  const res = await request.post({
    url: 'api/v2/uploader',
    data: postParam,
    headersType: 'multipart/form-data'
  })
  if (res) {
    file.status = 'done'
    file.message = '上传成功'
    temp.photo.push(res.data.url)
    showNotify({ type: 'warning', message: '成功上传了一个文件！' })
    // console.log(temp.photo)
  }
  return true
}
const onSubmit = async () => {
  // TODO 完善下菜单数据结构
  temp.workspaceName = tempCfr.value.workspaceName
  temp.productName = tempCfr.value.productName
  temp.productId = tempCfr.value.productId
  temp.workspaceId = tempCfr.value.workspaceId
  temp.cfrWorkspaceId = tempCfr.value.cwid
  console.log('下菜单提交数据 => ', temp)
  if (!(temp.level1 || temp.level2 || temp.level3)) {
    showNotify({ type: 'warning', message: '产量不正确' })
    return
  }
  showLoadingToast('提交中...')
  const toast = showLoadingToast({
    duration: 0,
    message: '保存中...',
    forbidClick: true
  })
  const res = await request.post({
    url: 'api/v1/my/cfr-product/output',
    data: temp
  })
  closeToast()
  if (res) {
    showSuccessToast('保存成功！')
    // outputEntity.workspaceParentName = temp.workspaceParentName
    Object.assign(temp, outputEntity)
    tempFiles.value = []
  } else {
    showFailToast('保存失败！')
  }
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
        label="下单日期"
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
        label="一级品"
        placeholder="请填写一级品数量"
        clearable
        type="number"
        is-link
      />
      <van-field
        v-model="temp.level2"
        label="二级品"
        placeholder="请填写二级品数量"
        clearable
        type="number"
        is-link
      />
      <van-field
        v-model="temp.level3"
        label="三级品"
        placeholder="请填写三级品数量"
        clearable
        type="number"
        is-link
      />
      <van-field v-model="temp.to" label="去向" :rules="[{ required: true, message: '不能为空' }]">
        <template #input>
          <van-radio-group v-model="temp.to" direction="horizontal">
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
      <van-field label="容器类型" clearable>
        <template #input>
          <van-radio-group v-model="temp.containerType" direction="horizontal">
            <van-space>
              <van-radio name="blue" shape="square">蓝框</van-radio>
              <van-radio name="while" shape="square">白框</van-radio>
            </van-space>
          </van-radio-group>
        </template>
      </van-field>
      <van-field label="容器数量" clearable>
        <template #input>
          <van-radio-group v-model="temp.containerNumber">
            <van-space wrap>
              <van-radio :name="1" shape="square">1</van-radio>
              <van-radio :name="2" shape="square">2</van-radio>
              <van-radio :name="3" shape="square">3</van-radio>
              <van-radio :name="4" shape="square">4</van-radio>
            </van-space>
          </van-radio-group>
        </template>
      </van-field>
      <van-field name="uploader" label="上传文件">
        <template #input>
          <van-uploader
            multiple
            capture="capture"
            v-model="tempFiles"
            :before-delete="beforeFileDelete"
            :before-read="beforeFileRead"
            :after-read="afterFileRead"
          />
        </template>
      </van-field>
      <van-field
        v-model="temp.remark"
        rows="1"
        type="textarea"
        placeholder="请输入备注"
        label="备注信息"
      />
      <van-sticky :offset-bottom="70" position="bottom">
        <van-row justify="center">
          <van-col span="18">
            <van-button type="primary" loading-text="申请中..." round block native-type="submit">
              提交记录
            </van-button>
          </van-col>
        </van-row>
      </van-sticky>
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

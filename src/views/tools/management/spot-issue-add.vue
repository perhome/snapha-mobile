<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { formatTime } from '@/utils'
import {
  closeToast,
  Dialog,
  showConfirmDialog,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
  Toast
} from 'vant'
import { useAppStoreWithOut } from '@/store/modules/app'
import { UploaderBeforeRead } from 'vant/lib/uploader/types'
import StyWorkspaceSelection from '@/views/component/StyWorkspaceSelection.vue'

defineOptions({
  name: 'ToolsManagementSpotIssueAdd'
})

const router = useRouter()
const route = useRoute()
const request = useAxios()
const appStore = useAppStoreWithOut()
const tempEntity: any = {
  hitDate: route.query.hitDate ? route.query.hitDate : formatTime(new Date(), 'yyyy-MM-dd'),
  workspaceId: null,
  workspaceName: null,
  photo: [],
  subject: ''
}
const temp = reactive({ ...tempEntity })
const showHitDate = ref(false)
const showWorkspaceSelection = ref(false)

const tempFiles = ref([])
const beforeFileDelete = (file: any, detail: any) => {
  // console.log(detail)
  delete temp.photo[detail.index]
  showSuccessToast('删除了上第 ' + (detail.index + 1) + '个文件')
  return true
}
const beforeFileRead: UploaderBeforeRead = (file: any, detail: any) => {
  // console.log(detail)
  if (typeof file.length == 'number') {
    showFailToast('只可以上传单个文件！')
    return false
  }
  showLoadingToast({ message: '上传中', duration: 0 })
  return true
}
const afterFileRead = async (file: any, detail: object) => {
  const postParam = new FormData()
  postParam.append('file', file.file)
  postParam.append('directory', 'sty-spot-issue')
  const res = await request.post({
    url: 'api/v2/uploader',
    data: postParam,
    headersType: 'multipart/form-data'
  })
  closeToast()
  if (res) {
    file.status = 'done'
    file.message = '上传成功'
    temp.photo.push(res.data.url)
    showSuccessToast('成功上传了一个文件！')
    // console.log(temp.photo)
  }
  return true
}

const onSubmit = () => {
  showConfirmDialog({
    title: '数据确认',
    message: '确认当前数据无误，点击确认提交？'
  }).then(async () => {
    const res = await request.post({
      url: 'api/v2/spot/issue',
      data: temp
    })
    if (res) {
      showSuccessToast('保存成功！')
      Object.assign(temp, tempEntity)
    }
  })
}
// init
</script>
<template>
  <van-form @submit="onSubmit" label-width="90">
    <van-cell-group>
      <van-field
        v-model="temp.hitDate"
        label="当前日期"
        :rules="[{ required: true, message: '不能为空' }]"
        type="date"
        placeholder="当前日期"
        clearable
        is-link
      />
      <van-field
        v-model="temp.workspaceName"
        is-link
        readonly
        label="拍照地点"
        placeholder="拍照地点"
        @click="showWorkspaceSelection = true"
      />
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
        v-model="temp.subject"
        label="问题描述"
        :rules="[{ required: true, message: '不能为空' }]"
        type="textarea"
        :row="3"
        autosize
        placeholder="问题描述"
        clearable
      />
      <van-field v-model="temp.tag" is-link readonly label="标签">
        <template #input>
          <van-tag round type="primary">现场检查</van-tag>
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button type="primary" loading-text="申请中..." round block native-type="submit">
          提交记录
        </van-button>
      </div>
    </van-cell-group>
  </van-form>
  <van-popup v-model:show="showWorkspaceSelection" round position="bottom">
    <sty-workspace-selection
      v-model="temp.workspaceId"
      v-model:name="temp.workspaceName"
      v-model:show="showWorkspaceSelection"
    />
  </van-popup>
</template>

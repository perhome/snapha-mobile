<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { reactive, ref, watch } from 'vue'
import {
  closeToast,
  showConfirmDialog,
  showFailToast,
  showImagePreview,
  showLoadingToast,
  showSuccessToast,
  showToast
} from 'vant'
import { useRoute, useRouter } from 'vue-router'
import TaskGoodsBox from './task-goods-box.vue'
import TaskOrderFeedback from './task-order-feedback.vue'
import Redirect from './redirect.vue'
defineOptions({
  name: 'FlowableTaskForm'
})

const router = useRouter()
const route = useRoute()
const request = useAxios()
const formUrl = route.params.formUrl as string
const taskId = route.params.taskId

if (!taskId || !formUrl) {
  showFailToast('缺少必要的参数')
}
const isRedirect = ref(false)
if (formUrl.substring(0, 1) == '/') {
  isRedirect.value = true
  showLoadingToast('转向中')
  router.push(formUrl)
} else if (formUrl.substring(0, 4) == 'http') {
  isRedirect.value = true
  showLoadingToast('转向中')
  window.location.replace(formUrl)
} else {
  // TODO 流程表单初始化
}
const componentList = {
  TaskOrderFeedback: TaskOrderFeedback,
  TaskGoodsBox: TaskGoodsBox,
  Redirect: Redirect
}
</script>
<template>
  <van-notice-bar left-icon="volume-o" text="请按时填写表单，签字确认" />
  <component :is="componentList[isRedirect ? 'Redirect' : formUrl]" />
</template>

<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { reactive, ref, watch } from 'vue'
import {
  closeToast,
  showConfirmDialog,
  showImagePreview,
  showLoadingToast,
  showSuccessToast,
  showToast
} from 'vant'

defineOptions({
  name: 'FlowableIndex'
})

// import { default as FlowableComponent } from './component/FlowableList.vue'
const request = useAxios()

const loading = ref(true)
const refreshing = ref(false)
const finished = ref(false)
const activeFlowable = ref([])
const myFlowableList = ref<any>([])

const queryForm = reactive({
  listType: 'pending',
  pageSize: 20,
  currentPage: 1
})

const handlePass = (item: any, index: number) => {
  showConfirmDialog({
    title: '流程处理确认',
    message: '确认通过此条流程么'
  })
    .then(() => {
      request
        .post({
          url: 'api/v2/flowable/pass',
          data: { ftid: item.ftid }
        })
        .then((response: any) => {
          // console.log('response=>', response)
          if (!response) return
          showSuccessToast('提交成功')
          myFlowableList.value.splice(index, 1)
        })
    })
    .catch(() => {
      // on cancel
    })
}

const handleDeny = (item: any, index: number) => {
  showConfirmDialog({
    title: '流程处理确认',
    message: '确认不通过此条流程么'
  })
    .then(() => {
      request
        .post({
          url: 'api/v2/flowable/deny',
          data: { ftid: item.ftid }
        })
        .then(() => {
          showSuccessToast('提交成功')
          myFlowableList.value.splice(index, 1)
        })
    })
    .catch(() => {
      // on cancel
    })
}

const handleFlowable = (item: any) => {
  showImagePreview({
    images: [import.meta.env.VITE_API_BASEPATH + 'tools/flowable/process/' + item.flowableId],
    closeable: true
  })
}

const onActions = (formUrl: any) => {
  let actions = [{ text: '填写物资档案' }]
  return actions
}
const onSelect = (formUrl: any, actionText: string) => {
  showToast(actionText)
}

const onLoad = async () => {
  loading.value = true
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  })
  const res = await request.get({
    url: 'api/v2/flowable',
    params: queryForm
  })
  if (res.data.list && res.data.list.length > 0) {
    myFlowableList.value.push(...res.data.list)
    queryForm.currentPage += 1
  } else {
    finished.value = true
  }
  closeToast()
  loading.value = false
}
const onRefresh = () => {
  console.log('流程列表 => ', queryForm.listType)
  queryForm.currentPage = 1
  myFlowableList.value = []
  refreshing.value = true
  finished.value = false
  onLoad()
  refreshing.value = false
}
watch(() => queryForm.listType, onRefresh, { immediate: false })
</script>
<template>
  <van-tabs v-model:active="queryForm.listType" type="line" line-width="80px">
    <van-tab name="pending" title="我的待办" icon="home-o" />
    <van-tab name="approved" title="我的已办" icon="search" />
    <van-tab name="myCreate" title="我的发起" icon="search" />
  </van-tabs>
  <van-pull-refresh v-model="refreshing" :head-height="80" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="到这里就没有了"
      @load="onLoad"
    >
      <van-collapse border v-model="activeFlowable">
        <van-collapse-item
          :title="item.subject"
          :key="item.ftid"
          :name="item.ftid"
          border
          :label="'流程批复：' + (item.action ? item.action : '待处理')"
          v-for="(item, index) in myFlowableList"
        >
          <van-space v-if="queryForm.listType == 'pending'" wrap>
            <van-button size="normal" @click="handlePass(item, index)" type="success">
              通过
            </van-button>
            <van-button size="normal" @click="handleDeny(item, index)" type="warning">
              退回
            </van-button>
            <van-button
              size="normal"
              v-if="item.formUrl"
              :to="{
                name: 'FlowableTaskForm',
                params: { formUrl: item.formUrl, taskId: item.taskId }
              }"
              type="primary"
            >
              流程表单
            </van-button>
          </van-space>
          <van-space direction="vertical" fill>
            <van-button size="normal" @click="handleFlowable(item)" type="primary">
              查看流程
            </van-button>
          </van-space>
        </van-collapse-item>
      </van-collapse>
    </van-list>
  </van-pull-refresh>
</template>

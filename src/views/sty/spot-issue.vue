<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { showImagePreview, Col, Row, Dialog, Toast, Cell } from 'vant'
defineOptions({
  name: 'StySpotIssue'
})

const request = useAxios()
const queryForm = reactive({
  pageSize: 20,
  currentPage: 1
})
const activeIssueId = ref()

const mySpotIssueList = ref<any[]>([])
const refreshing = ref(false)
const loading = ref(false)

const getList = async () => {
  loading.value = true
  const res = await request.get({
    url: 'api/v2/spot/issue',
    params: queryForm
  })
  if (res.data.list && res.data.list.length > 0) {
    mySpotIssueList.value.push(...res.data.list)
    queryForm.currentPage += 1
  }
  loading.value = false
}
const onRefresh = () => {
  refreshing.value = true
  queryForm.currentPage = 1
  mySpotIssueList.value = []
  getList()
  refreshing.value = false
}

getList()
</script>
<template>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
    <van-steps direction="vertical" :active="activeIssueId">
      <van-step :key="item.siid" v-for="item in mySpotIssueList">
        <van-cell :title="item.subject" :value="item.workspaceName" :label="item.created" />
        <van-button
          size="small"
          type="success"
          @click="
            () =>
              showImagePreview({
                images: item.photo,
                closeable: true
              })
          "
        >
          图片档案
        </van-button>
      </van-step>
    </van-steps>
    <van-empty description="暂无数据" v-if="mySpotIssueList.length == 0" />
    <van-sticky :offset-bottom="70" position="bottom">
      <van-row justify="center">
        <van-col span="18">
          <van-button block round type="primary" @click="getList"> 获取更多 </van-button>
        </van-col>
      </van-row>
    </van-sticky>
  </van-pull-refresh>
</template>

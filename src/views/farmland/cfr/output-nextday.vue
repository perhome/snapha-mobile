<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { ImagePreview, Col, Row, showSuccessToast, showConfirmDialog } from 'vant'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useWorkspace } from '@/utils/wokrspace'
defineOptions({
  name: 'FarmlandCfrOutputNextday'
})
const appStore = useAppStoreWithOut()
const request = useAxios()
const queryForm = reactive({
  owner: 'mine',
  hitDate: undefined,
  workspaceId: undefined,
  workspaceName: undefined,
  productName: undefined,
  pageSize: 30,
  currentPage: 1
})
const activeCponid = ref(undefined)
const { myWorkspaceOptions } = useWorkspace()
const myProductOptions = ref([])

const myOwnerOptions = ref([
  { text: '所在小组', value: 'group' },
  { text: '自己录入', value: 'mine' }
])

const userRole = appStore.getUserRole
if (userRole.includes('MANAGER')) {
  queryForm.owner = 'all'
  myOwnerOptions.value = [{ text: '种植区', value: 'all' }]
}
const myCfrProductOutputNextdayList = ref<any>([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const handleDelete = (cponid: number) => {
  showConfirmDialog({
    title: '删除此条信息',
    message: '你只能删除当日内的记录！删除点确认'
  }).then(async () => {
    const res = await request.delete({
      url: 'api/v1/my/cfr-product/output-nextday',
      params: { cponid: cponid }
    })
    if (res) {
      const index = myCfrProductOutputNextdayList.value
        .map((obj: any) => obj.cponid)
        .indexOf(cponid)
      myCfrProductOutputNextdayList.value.splice(index, 1)
      showSuccessToast('删除成功')
    }
  })
}

const onLoad = async () => {
  loading.value = true
  const res = await request.get({
    url: 'api/v1/my/cfr-product/output-nextday',
    params: queryForm
  })
  if (res.data && res.data.list.length > 0) {
    myCfrProductOutputNextdayList.value.push(...res.data.list)
    if (res.data.list.length == queryForm.pageSize) {
      queryForm.currentPage += 1
    } else {
      finished.value = true
    }
  } else {
    finished.value = true
  }
  loading.value = false
}
const onRefresh = () => {
  queryForm.currentPage = 1
  myCfrProductOutputNextdayList.value = []
  refreshing.value = true
  finished.value = false
  onLoad()
  refreshing.value = false
}

const generateTitle = (item: any) => {
  let title = item.productName
  title += '[' + item.workspaceName + ']'
  title += '[' + item.hitDate.substring(5) + '] '
  title += item.amount + 'Kg'
  return title
}
watch(
  () => queryForm.workspaceId,
  (val) => {
    const found = myWorkspaceOptions.value.find((item: any) => item.value == val)
    if (!found.value) {
      queryForm.workspaceName = undefined
    } else {
      queryForm.workspaceName = found.text
    }
    onRefresh()
  }
)
</script>
<template>
  <van-sticky>
    <van-dropdown-menu>
      <van-dropdown-item
        v-model="queryForm.workspaceId"
        title="种植区域"
        :options="myWorkspaceOptions"
      />
      <van-dropdown-item
        v-model="queryForm.productName"
        title="产品名称"
        :options="myProductOptions"
      />
      <van-dropdown-item v-model="queryForm.owner" title="录入方式" :options="myOwnerOptions" />
    </van-dropdown-menu>
  </van-sticky>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="到这里就没有了"
      @load="onLoad"
    >
      <van-collapse v-model="activeCponid" accordion>
        <van-collapse-item
          v-for="item in myCfrProductOutputNextdayList"
          :key="item.cponid"
          :title="generateTitle(item)"
          :name="item.cponid"
        >
          <van-cell-group>
            <van-field readonly label="预估日期" placeholder="" v-model="item.hitDate" />
            <van-field readonly label="菜品名称" placeholder="" v-model="item.productName" />
            <van-field
              v-if="item.amount"
              readonly
              label="产量"
              placeholder=""
              v-model="item.amount"
            />
            <van-field readonly label="录入" placeholder="" v-model="item.userName" />
          </van-cell-group>
          <van-space direction="vertical" fill>
            <van-button
              class="myCfrProductOutputNextdayList"
              type="primary"
              block
              @click="handleDelete(item.cponid)"
            >
              删除预估菜记录
            </van-button>
          </van-space>
        </van-collapse-item>
      </van-collapse>
    </van-list>
    <van-empty description="暂无数据" v-if="myCfrProductOutputNextdayList.length == 0" />
  </van-pull-refresh>
</template>

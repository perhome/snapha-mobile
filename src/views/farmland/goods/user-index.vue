<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { ImagePreview, Col, Row, showSuccessToast, showConfirmDialog, showToast } from 'vant'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useWorkspace } from '@/utils/wokrspace'
defineOptions({
  name: 'FarmlandGoodsUserIndex'
})
const appStore = useAppStoreWithOut()
const request = useAxios()
const queryForm = reactive({
  owner: 'mine',
  workspaceId: undefined,
  goodsId: undefined,
  pageSize: 30,
  currentPage: 1
})

const activeUgfid = ref(undefined)
const myGoodsOptions = ref([{ text: '全部', value: '' }])
const myOwnerOptions = ref([
  { text: '所在小组', value: 'group' },
  { text: '自己录入', value: 'mine' }
])

const userRole = appStore.getUserRole
if (userRole.includes('MANAGER')) {
  queryForm.owner = 'all'
  myOwnerOptions.value = [{ text: '种植区', value: 'all' }]
}
const myUserGoodsFilesList = ref<any>([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const { myWorkspaceOptions } = useWorkspace()
const onLoad = async () => {
  loading.value = true
  const res = await request.get({
    url: '/api/v2/workspace/goods',
    params: queryForm
  })
  if (res.data.list && res.data.list.length > 0) {
    myUserGoodsFilesList.value.push(...res.data.list)
    if (queryForm.pageSize == res.data.list.length) {
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
  myUserGoodsFilesList.value = []
  finished.value = false
  refreshing.value = true
  onLoad()
  refreshing.value = false
}

const generateTitle = (item: any) => {
  let title = item.goodsName + '-'
  title += item.workspaceBlockName + '@' + item.workspaceName
  return title
}
const handleUpdate = (item: any) => {
  showToast('暂不支持')
}
const handleDelete = (item: any) => {
  showConfirmDialog({ message: '确认删除么？' }).then(() => {
    return request
      .delete({
        url: '/api/v2/workspace/goods',
        params: {
          ugfid: item.ugfid
        }
      })
      .then(() => {
        showSuccessToast('删除成功！')
        const filtersList = myUserGoodsFilesList.value.filter(
          (obj: any) => obj.ugfid !== item.ugfid
        )
        myUserGoodsFilesList.value = filtersList
      })
  })
}
watch(
  () => queryForm.workspaceId,
  () => onRefresh()
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
      <van-dropdown-item v-model="queryForm.goodsId" title="物料名称" :options="myGoodsOptions" />
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
      <van-collapse v-model="activeUgfid" accordion>
        <van-collapse-item
          v-for="item in myUserGoodsFilesList"
          :key="item.ugfid"
          :title="generateTitle(item)"
          :name="item.ugfid"
        >
          <van-cell-group>
            <van-field readonly label="使用日期" placeholder="" v-model="item.hitDate" />
            <van-field readonly label="使用数量" placeholder="" v-model="item.used" />
            <van-field readonly label="使用单位" placeholder="" v-model="item.unitName" />
            <van-field readonly label="审核状态" placeholder="" v-model="item.status" />
          </van-cell-group>
          <van-space>
            <van-button type="primary" @click="handleUpdate(item)"> 修改单据 </van-button>
            <van-button type="warning" @click="handleDelete(item)"> 删除单据 </van-button>
          </van-space>
        </van-collapse-item>
      </van-collapse>
    </van-list>
  </van-pull-refresh>
</template>

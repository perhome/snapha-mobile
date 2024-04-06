<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import {
  ImagePreview,
  Col,
  Row,
  showSuccessToast,
  showConfirmDialog,
  showToast,
  showFailToast
} from 'vant'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useWorkspace } from '@/utils/wokrspace'
defineOptions({
  name: 'FarmlandCfrOutput'
})
const appStore = useAppStoreWithOut()
const request = useAxios()
const queryForm = {
  owner: 'mine',
  hitDate: undefined,
  workspaceId: undefined,
  workspaceName: undefined,
  productName: undefined,
  to: undefined,
  pageSize: 30,
  currentPage: 1
}
const activeCpoid = ref(undefined)
const { myWorkspaceOptions } = useWorkspace()
const myProductOptions = ref([])

const showPopover = ref(false)
const outputToActions = [
  { name: '包装', value: 'pack' },
  { name: '四牧', value: '4' },
  { name: '三牧', value: '3' },
  { name: '二牧', value: '2' },
  { name: '羊圈', value: 'goat' },
  { name: '鸡圈', value: 'chicken' }
]

const myToOptions = computed(() => {
  let ret: any = [{ text: '全部单据', value: undefined }]
  outputToActions.forEach((action) => ret.push({ text: action.name, value: action.value }))
  return ret
})

const onSelect = async (action: any) => {
  showToast('准备更改取向到' + action.name)
  const res = await request.put({
    url: 'api/v1/my/cfr-product/output/to',
    data: { cpoid: activeCpoid.value, to: action.value }
  })
  if (res.data.result == 1) {
    showSuccessToast('更改成功')
  } else {
    showSuccessToast('更改失败')
  }
  showPopover.value = false
}

const myOwnerOptions = ref([
  { text: '所在小组', value: 'group' },
  { text: '自己录入', value: 'mine' }
])

const userRole = appStore.getUserRole
if (userRole.includes('MANAGER')) {
  queryForm.owner = 'all'
  myOwnerOptions.value = [{ text: '种植区', value: 'all' }]
}
const myCfrProductOutputList = ref<any>([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const handleDelete = (cpoid: number) => {
  showConfirmDialog({
    title: '删除此条信息',
    message: '你只能删除当天内的下菜单！删除点确认'
  }).then(async () => {
    const res = await request.delete({
      url: 'api/v1/my/cfr-product/output',
      params: { cpoid: cpoid }
    })
    if (res.data.result == 1) {
      const index = myCfrProductOutputList.value.map((obj: any) => obj.cpoid).indexOf(cpoid)
      myCfrProductOutputList.value.splice(index, 1)
      showSuccessToast('删除成功')
    } else {
      showFailToast('删除失败')
    }
  })
}

const onLoad = async () => {
  loading.value = true
  const res = await request.get({
    url: 'api/v1/my/cfr-product/output',
    params: queryForm
  })
  if (res.data && res.data.list.length > 0) {
    myCfrProductOutputList.value.push(...res.data.list)
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
  myCfrProductOutputList.value = []
  refreshing.value = true
  finished.value = false
  onLoad()
  refreshing.value = false
}

const changeWorkspace = () => {
  const found: any = myWorkspaceOptions.value.find(
    (item: any) => item.value == queryForm.workspaceId
  )
  if (queryForm.workspaceId) {
    queryForm.workspaceName = found.text
  } else {
    queryForm.workspaceName = undefined
  }
  onRefresh()
}

const generateTitle = (item: any) => {
  let title = item.productName
  title += '[' + item.workspaceName + ']'
  title += '[' + item.hitDate.substring(5) + '] '
  title += item.amount + 'Kg'
  return title
}
</script>
<template>
  <van-sticky>
    <van-dropdown-menu>
      <van-dropdown-item
        v-model="queryForm.workspaceId"
        title="种植区域"
        @change="changeWorkspace"
        :options="myWorkspaceOptions"
      />
      <van-dropdown-item
        v-model="queryForm.to"
        title="单据取向"
        @change="onRefresh"
        :options="myToOptions"
      />
      <van-dropdown-item
        v-model="queryForm.owner"
        title="录入方式"
        @change="onRefresh"
        :options="myOwnerOptions"
      />
    </van-dropdown-menu>
  </van-sticky>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="到这里就没有了"
      @load="onLoad"
    >
      <van-collapse v-model="activeCpoid" accordion>
        <van-collapse-item
          v-for="item in myCfrProductOutputList"
          :key="item.cpoid"
          :title="generateTitle(item)"
          :name="item.cpoid"
        >
          <van-cell-group>
            <van-field readonly label="下单日期" placeholder="" v-model="item.hitDate" />
            <van-field readonly label="菜品名称" placeholder="" v-model="item.productName" />
            <van-field
              v-if="item.level1"
              readonly
              label="一级"
              placeholder=""
              v-model="item.level1"
            />
            <van-field
              v-if="item.level2"
              readonly
              label="二级"
              placeholder=""
              v-model="item.level2"
            />
            <van-field
              v-if="item.level3"
              readonly
              label="三级"
              placeholder=""
              v-model="item.level3"
            />
            <van-field readonly label="去向" placeholder="" v-model="item.to" />
            <van-field readonly label="录入" placeholder="" v-model="item.userName" />
          </van-cell-group>
          <van-cell>
            <van-space fill>
              <van-button round @click="showPopover = true" type="primary">更改去向</van-button>
              <van-button
                class="output-btn"
                type="primary"
                round
                @click="ImagePreview({ images: item.photo, closeable: true })"
              >
                预览单据
              </van-button>
              <van-button class="output-btn" type="warning" round @click="handleDelete(item.cpoid)">
                删除单据
              </van-button>
            </van-space>
          </van-cell>
        </van-collapse-item>
      </van-collapse>
    </van-list>
  </van-pull-refresh>

  <van-action-sheet v-model:show="showPopover" :actions="outputToActions" @select="onSelect" />
</template>
<style scoped>
.output-btn {
  margin: 0 10px;
}
</style>

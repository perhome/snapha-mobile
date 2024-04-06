<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { ImagePreview, Col, Row, showSuccessToast, showConfirmDialog } from 'vant'
import { useAppStoreWithOut } from '@/store/modules/app'

import { useWorkspace } from '@/utils/wokrspace'
import { formatTime } from '@/utils'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'PackOutput'
})
const appStore = useAppStoreWithOut()
const request = useAxios()
const route = useRoute()
const queryForm = reactive({
  to: 'pack',
  hitDate: formatTime(new Date(), 'yyyy-MM-dd'),
  workspaceId: undefined,
  workspaceName: undefined,
  status: route.query.status ? parseInt(route.query.status as string) : 1,
  pageSize: 30,
  currentPage: 1
})

const activeCpoid = ref('')
const { myWorkspaceOptions } = useWorkspace()
const myStatusOptions = ref([
  { text: '未记账单据', value: 1 },
  { text: '已记账单据', value: 8 }
])
const myToOptions = ref<any>([{ text: '包装单据', value: 'pack' }])
const userRole = appStore.getUserRole
const isManager = userRole.includes('MANAGER')
if (isManager) {
  myToOptions.value = [
    { text: '包装单据', value: 'pack' },
    { text: '四牧', value: '4' },
    { text: '三牧', value: '3' },
    { text: '二牧', value: '2' },
    { text: '羊圈', value: 'goat' },
    { text: '鸡圈', value: 'chicken' }
  ]
}
const myCfrProductOutputList = ref<any>([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const getPackProductOutputList = async () => {
  loading.value = true
  const res = await request.get({
    url: 'api/v1/pack/product-output',
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
  getPackProductOutputList()
  refreshing.value = false
}

const handleConfirmStatus = (item: any, status: number) => {
  return request
    .post({
      url: 'api/v1/pack/product-output/confirm',
      data: {
        cpoid: item.cpoid,
        status: status
      }
    })
    .then(() => {
      showSuccessToast('已更新保存')
      const filtersList = myCfrProductOutputList.value.filter(
        (obj: any) => obj.cpoid !== item.cpoid
      )
      if (filtersList.length > 0) {
        activeCpoid.value = filtersList[0].cpoid
      }
      myCfrProductOutputList.value = filtersList
    })
}

const generateTitle = (item: any) => {
  let title = item.productName
  title += ' ' + item.workspaceName
  title += ' 入库' + item.amount + 'Kg'
  return title
}

const handleDelete = (cpoid: number) => {
  showConfirmDialog({
    title: '删除此条记录',
    message: '删除请确认'
  }).then(async () => {
    const res = await request.delete({
      url: 'api/v1/my/cfr-product/output',
      params: { cpoid: cpoid }
    })
    if (res) {
      const index = myCfrProductOutputList.value.map((obj: any) => obj.cpoid).indexOf(cpoid)
      myCfrProductOutputList.value.splice(index, 1)
      showSuccessToast('删除成功')
    }
  })
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
        title="单据去向"
        @change="onRefresh"
        :options="myToOptions"
      />
      <van-dropdown-item
        v-model="queryForm.status"
        title="是否审核"
        :options="myStatusOptions"
        @change="onRefresh"
      />
    </van-dropdown-menu>
    <van-field
      v-model="queryForm.hitDate"
      label="单据日期"
      @change="onRefresh"
      placeholder="选择日期"
      type="date"
      v-if="isManager"
    />
  </van-sticky>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="到这里就没有了"
      @load="getPackProductOutputList"
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
            <van-field readonly label="录入" placeholder="" v-model="item.userName" />
          </van-cell-group>
          <van-space wrap v-if="queryForm.status == 1">
            <van-button
              block
              round
              class="output-btn"
              @click="handleConfirmStatus(item, 8)"
              type="success"
            >
              登记通过
            </van-button>
            <van-button
              block
              round
              class="output-btn"
              @click="handleConfirmStatus(item, 0)"
              type="warning"
            >
              退回
            </van-button>
            <van-button
              block
              round
              class="output-btn"
              @click="handleDelete(item.cpoid)"
              type="warning"
            >
              删除
            </van-button>
            <van-button
              v-if="item.status == 8"
              block
              round
              class="output-btn"
              @click="handleConfirmStatus(item, 0)"
              type="success"
            >
              取消登记
            </van-button>
          </van-space>
        </van-collapse-item>
      </van-collapse>
    </van-list>

    <van-cell-group v-if="queryForm.status == 1">
      <van-empty description="已处理完成" v-if="myCfrProductOutputList.length == 0" />
      <van-divider>补充录入下菜单</van-divider>
      <van-cell>
        <van-button
          type="primary"
          block
          round
          :to="{ path: '/farmland/cfr/output-add', query: { to: 'pack' } }"
        >
          补录取下菜单
        </van-button>
      </van-cell>
    </van-cell-group>
  </van-pull-refresh>
</template>

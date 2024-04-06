<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { ImagePreview, Col, Row, showSuccessToast, showConfirmDialog } from 'vant'
import ProductSelection from '@/views/component/ProductSelection.vue'
import { useWorkspace } from '@/utils/wokrspace'
defineOptions({
  name: 'FarmlandAdminCfrWorkspace'
})

const request = useAxios()
const queryForm = reactive({
  workspaceId: undefined,
  parentWorkspaceId: undefined,
  productId: undefined,
  sortBy: undefined,
  pageSize: 30,
  currentPage: 1
})

const activeCfrWorkspaceId = ref()

const mySortByOptions = ref([{ text: '默认', value: '' }])
const workspaceOptions = ref([])
const myProductOptions = ref([])
const myCfrWorkspaceList = ref<any>([])

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const { myWorkspaceOptions } = useWorkspace()

const onLoad = async () => {
  loading.value = true
  const res = await request.get({
    url: '/api/v2/farmland/cfr-workspace',
    params: queryForm
  })
  if (res.data.list && res.data.list.length > 0) {
    myCfrWorkspaceList.value.push(...res.data.list)
    // console.log('myCfrWorkspaceList =>', myCfrWorkspaceList.value)
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
  myCfrWorkspaceList.value = []
  finished.value = false
  refreshing.value = true
  onLoad()
  refreshing.value = false
}
const extraProduct = reactive({
  productId: undefined,
  productName: undefined
})

const showProductSelection = ref(false)
const showExtra = ref(false)
const createCfrProduct = async (item: any, extra: any) => {
  const res = await request.post({
    url: '/api/v2/farmland/cfr-workspace/output',
    data: { cwid: item.cwid, productId: extra.productId, productName: extra.productName }
  })
  if (res.data.result) {
    showSuccessToast('保存成功')
  }
}

const generateTitle = (item: any) => {
  let title = item.productName + '-' + item.workspaceName
  if (item.realEndDate) {
    title += '于' + item.realEndDate + '结束'
  }
  return title
}
watch([() => queryForm.parentWorkspaceId, () => queryForm.productId, () => queryForm.sortBy], () =>
  onRefresh()
)
</script>
<template>
  <van-sticky>
    <van-dropdown-menu>
      <van-dropdown-item
        v-model="queryForm.parentWorkspaceId"
        title="种植区域"
        :options="myWorkspaceOptions"
      />
      <van-dropdown-item
        v-model="queryForm.productId"
        title="产品名称"
        :options="myProductOptions"
      />
      <van-dropdown-item v-model="queryForm.sortBy" title="种植月份" :options="mySortByOptions" />
    </van-dropdown-menu>
  </van-sticky>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="到这里就没有了"
      @load="onLoad"
    >
      <van-collapse v-model="activeCfrWorkspaceId" accordion>
        <van-collapse-item
          v-for="item in myCfrWorkspaceList"
          :key="item.cwid"
          :title="generateTitle(item)"
          :name="item.cwid.toString()"
        >
          <van-cell-group>
            <van-field label="实际开始日期" v-model="item.realStartDate" readonly />
            <van-field
              label="实际收获日期"
              placeholder="选择日期"
              type="date"
              :readonly="!item.readonly"
              v-model="item.realHarvestDate"
            />
            <van-field
              label="实际结束日期"
              placeholder="选择日期"
              :readonly="!item.readonly"
              v-model="item.realEndDate"
              type="date"
            />
            <van-cell title="实时产量" placeholder="" :value="item.amount">
              <template #extra>
                {{ item.areaAmount }}
              </template>
            </van-cell>
            <van-field
              label="当前面积"
              placeholder="输入面积"
              type="number"
              :readonly="!item.readonly"
              v-model="item.realArea"
              ><template #extra> 亩 </template>
            </van-field>
          </van-cell-group>
          <van-cell-group v-show="item && item.showExtra">
            <van-field v-model="item.cwid" label="茬口编号" readonly />
            <van-field
              v-model="extraProduct.productName"
              is-link
              label="附属产品"
              readonly
              placeholder="选择产品"
              @click="showProductSelection = true"
            >
              <template #button>
                <van-button
                  type="primary"
                  size="small"
                  @click.stop="createCfrProduct(item, extraProduct)"
                >
                  增加附属产品
                </van-button>
              </template>
            </van-field>
          </van-cell-group>
          <van-space>
            <van-button type="primary" @click.stop="() => (item.showExtra = !item.showExtra)">
              扩展信息
            </van-button>
            <van-button type="success" @click.stop="() => (item.readonly = !item.readonly)">
              编辑茬口
            </van-button>
            <van-button type="success"> 数据统计 </van-button>
          </van-space>
        </van-collapse-item>
      </van-collapse>
    </van-list>
  </van-pull-refresh>

  <van-popup
    v-model:show="showProductSelection"
    closeable
    position="left"
    :style="{ height: '100%', width: '80%' }"
  >
    <product-selection
      v-model="extraProduct.productId"
      v-model:name="extraProduct.productName"
      v-model:show="showProductSelection"
    />
  </van-popup>
</template>

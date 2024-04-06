<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { ImagePreview, Col, Row, Dialog, Toast, Cell, showImagePreview } from 'vant'
import { forEach } from '@/utils'
defineOptions({
  name: 'LivestockInout'
})

const request = useAxios()
const queryForm = reactive({
  productId: null,
  eventIds: [],
  sortBy: 'desc',
  pageSize: 20,
  currentPage: 1
})
const activeInoutId = ref(undefined)
const livestockProductList = ref<any>([])
const livestockEventList = ref<any>([])
const livestockEventItem = ref(null)
const myInoutList = ref<any[]>([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const mySortList = ref([{ text: '日期降序', value: 'desc' }])

const checkboxRefs = ref<any>([])
const eventToggle = (index: number) => {
  checkboxRefs.value[index].toggle()
}

const onLoad = async () => {
  loading.value = true
  const res = await request.get({
    url: 'api/v2/livestock/inout',
    params: queryForm
  })
  if (res.data.list && res.data.list.length > 0) {
    myInoutList.value.push(...res.data.list)
    queryForm.currentPage += 1
  } else {
    finished.value = true
  }
  loading.value = false
}
const genTitle = (item: any) => {
  return (
    item.productName +
    ' - ' +
    item.eventName +
    ' - ' +
    item.amount +
    ' - ' +
    item.hitDate.substring(5)
  )
}
const onRefresh = () => {
  queryForm.currentPage = 1
  myInoutList.value = []
  refreshing.value = true
  finished.value = false
  onLoad()
  refreshing.value = false
}
const myLivestockProductList = computed(() => {
  let ret: any = []
  forEach(livestockProductList.value, (item) => {
    ret.push({ text: item.name, value: item.pid })
  })
  console.log(ret)
  return ret
})
const myLivestockEventList = computed(() => {
  let ret: any = []
  forEach(livestockEventList.value, (item) => {
    ret.push({ text: item.name, value: item.leid })
  })
  console.log(ret)
  return ret
})
const getLivestockProductList = async () => {
  const res = await request.get({
    url: 'api/v2/product/category/children',
    params: { categoryNameSpell: 'livestock' }
  })
  if (res) {
    livestockProductList.value = res.data.list
    console.log(res)
  }
}
const getLivestockInoutEventList = async () => {
  const res = await request.get({
    url: 'api/v2/livestock/event/spell/children/flat-list',
    params: { nameSpell: 'chulan' }
  })
  if (res) {
    livestockEventList.value = res.data.list
    console.log(res)
  }
}

watch([() => queryForm.productId], () => {
  onRefresh()
})
const showInoutImagePreview = (photo: any) => {
  showImagePreview({
    images: photo,
    closeable: true
  })
}
const showInoutFlowableProcess = (flowableId: string) => {
  showImagePreview({
    images: [import.meta.env.VITE_API_BASEPATH + 'tools/flowable/process/' + flowableId],
    closeable: true
  })
}
const init = async () => {
  await getLivestockProductList()
  await getLivestockInoutEventList()
}
init()
</script>
<template>
  <van-sticky>
    <van-dropdown-menu>
      <van-dropdown-item
        v-model="queryForm.productId"
        title="产品类别"
        :options="myLivestockProductList"
      />
      <van-dropdown-item title="事件类型">
        <van-checkbox-group v-model="queryForm.eventIds">
          <van-cell-group inset>
            <van-cell
              v-for="(item, index) in livestockEventList"
              clickable
              :key="item.leid"
              :title="item.name"
              @click="eventToggle(index)"
            >
              <template #right-icon>
                <van-checkbox
                  :name="item.leid"
                  :ref="(el: any) => (checkboxRefs[index] = el)"
                  @click.stop
                />
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </van-dropdown-item>
      <van-dropdown-item v-model="queryForm.sortBy" title="排序方式" :options="mySortList" />
    </van-dropdown-menu>
  </van-sticky>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="到这里就没有了"
      @load="onLoad"
    >
      <van-collapse v-model="activeInoutId" accordion>
        <van-collapse-item
          :title="genTitle(item)"
          v-for="item in myInoutList"
          :key="item.liid"
          :name="item.liid"
        >
          <van-cell-group>
            <van-cell title="耳牌/批次" :value="item.livestockSn" />
            <van-cell
              v-if="item.photo.length > 0"
              title="图像"
              :value="item.photo.length"
              @click="showInoutImagePreview(item.photo)"
              is-link
            />
            <van-cell
              title="流程"
              :value="item.status == 100 ? '完成' : '进行中'"
              @click="showInoutFlowableProcess(item.flowableId)"
            />
            <van-cell title="备注" :value="item.remark" />
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </van-list>
    <van-skeleton v-if="loading == false && myInoutList.length == 0" title :row="3" />
  </van-pull-refresh>
</template>

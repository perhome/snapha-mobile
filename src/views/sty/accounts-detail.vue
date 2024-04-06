<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAxios } from '@/hooks/useAxios'
import { showImagePreview } from 'vant'
defineOptions({
  name: 'StyAccountsDetail'
})

const router = useRouter()
const route = useRoute()
const request = useAxios()

const queryForm = reactive({
  accountsId: parseInt(route.query.aid as string),
  expensesType: '',
  startDate: null,
  endDate: null,
  pageSize: 20,
  currentPage: 1
})

const showRemark = ref(false)
const showRemarkText = ref('')
const accountsDetailList = ref([])
const myAccountsDetailList = ref<any[]>([])
const accountsOptions = ref([])
const myExpensesOptions = ref([
  {
    text: '全部类型',
    value: ''
  },
  {
    text: '收入',
    value: 'income'
  },
  {
    text: '支出',
    value: 'expense'
  }
])
const showDatePickerBox = ref(false)

const myAccountsOptions = computed(() => {
  let ret: any = []
  accountsOptions.value.forEach((item: any) => {
    ret.push({ text: item.name, value: item.aid })
  })
  return ret
})
const getAccountsList = async () => {
  const res = await request.get({
    url: 'api/v2/accounts'
  })
  if (res) {
    accountsOptions.value = res.data.list
  }
}
const getAccountsDetailList = async () => {
  loading.value = true
  const res = await request.get({
    url: 'api/v2/accounts-flow',
    params: queryForm
  })
  if (res.data.list.length > 0) {
    myAccountsDetailList.value.push(...res.data.list)
  } else {
    finished.value = true
  }
  loading.value = false
}
const generateTitle = (item: any) => {
  return item.subject
}
const activeAJId = ref([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const onRefresh = () => {
  queryForm.currentPage = 1
  myAccountsDetailList.value = []
  refreshing.value = true
  getAccountsDetailList()
  refreshing.value = false
}
const onLoad = () => {
  queryForm.currentPage += 1
  getAccountsDetailList()
}
watch(
  [() => queryForm.accountsId, () => queryForm.expensesType],
  () => {
    onRefresh()
  },
  { immediate: true }
)
getAccountsList()
</script>
<template>
  <van-sticky>
    <van-dropdown-menu>
      <van-dropdown-item v-model="queryForm.accountsId" :options="myAccountsOptions" />
      <van-dropdown-item v-model="queryForm.expensesType" :options="myExpensesOptions" />
    </van-dropdown-menu>
  </van-sticky>
  <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="到这里就没有了"
      @load="onLoad"
      v-if="myAccountsDetailList.length > 0"
    >
      <van-collapse v-model="activeAJId" accordion>
        <van-collapse-item
          v-for="item in myAccountsDetailList"
          :key="item.ajid"
          :title="generateTitle(item)"
          :name="item.ajid"
        >
          <van-cell-group>
            <van-cell title="收入" :value="item.income" />
            <van-cell title="支出" :value="item.expense" />
            <van-cell
              title="备注"
              value="点击查看详情"
              is-link
              @click=";(showRemarkText = item.remark), (showRemark = true)"
            />
            <van-cell
              title="图像"
              v-if="item.photo && item.photo.length > 0"
              is-link
              :value="item.photo.length"
              @click="
                showImagePreview({
                  images: item.photo,
                  closeable: true
                })
              "
            />
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </van-list>
    <div v-else>
      <van-empty description="暂时未发现数据" />
      <van-skeleton title :row="3" />
    </div>
  </van-pull-refresh>
  <van-popup v-model:show="showRemark" position="bottom" closeable :style="{ height: '50%' }">{{
    showRemarkText
  }}</van-popup>
  <van-popup
    v-model:show="showDatePickerBox"
    position="bottom"
    closeable
    style="padding: 60px 0 0"
    z-index="3000"
    close-icon="close"
    :style="{ height: '50%' }"
  />
</template>

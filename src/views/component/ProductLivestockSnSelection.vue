<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { showFailToast } from 'vant'
import { formatTime } from '@/utils'

defineOptions({
  name: 'ProductLivestockSnSelection'
})

const props = withDefaults(
  defineProps<{
    productId: number | undefined
    livestockSn: string | undefined
    hitDate?: string | undefined
    showLivestockSn?: boolean | undefined
  }>(),
  {
    productId: undefined,
    livestockSn: undefined,
    showLivestockSn: true,
    hitDate: undefined
  }
)
const emit = defineEmits(['update:productId', 'update:livestockSn', 'update:hitDate'])
const request = useAxios()
const livestockProductList = ref<
  {
    pid: number
    name: string
  }[]
>([])
const getLivestockProductList = async () => {
  const res = await request.get({
    url: 'api/v2/product/category/children',
    params: { categoryNameSpell: 'livestock' }
  })
  if (res) {
    livestockProductList.value = res.data.list
  }
}
const productId = ref<number | undefined>(props.productId)
const livestockSn = ref<string | undefined>(props.livestockSn)
const hitDate = ref<string | undefined>(props.hitDate)

const tempProduct = ref<productScheme>({
  pid: undefined,
  name: undefined,
  nameSpell: undefined,
  nameAbbr: undefined
})
watch(tempProduct, (val) => {
  productId.value = val.pid
  console.log('组件 产品分类', val)
  livestockSn.value = ''
  emit('update:productId', productId.value)
  // 禽类存栏批次少，可直接获取批次号，畜类需要进一步输入条件过滤结果
  if (
    val.nameSpell != undefined &&
    (val.nameSpell.toUpperCase() == 'JI' || val.nameSpell.toUpperCase() == 'E')
  ) {
    getLivestockList()
  } else {
  }
})
// 批次与耳牌号
const livestockList = ref<livestockScheme[]>([])
const showLivestockSnSelect = ref(false)
const onSnConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  showLivestockSnSelect.value = false
  livestockSn.value = selectedValues[0]
  emit('update:livestockSn', livestockSn.value)
}
const onSnCancel = () => {
  showLivestockSnSelect.value = false
}
const onSnChange = () => {
  showLivestockSnSelect.value = false
}

const getLivestockList = async () => {
  if (!productId.value) {
    showFailToast('未选择产品类别！')
    return
  }
  showLivestockSnSelect.value = true
  console.log('请求养殖档案...', productId, livestockSn)
  const res = await request.get({
    url: 'api/v2/livestock/search',
    params: { lsn: livestockSn.value, productId: productId.value }
  })
  if (res) {
    livestockList.value = res.data.list
  }
}

// 记录日期
const showHitDate = ref(false)
const onHitDateConfirm = (date: Date) => {
  showHitDate.value = false
  hitDate.value = formatTime(date, 'yyyy-MM-dd')
  emit('update:hitDate', hitDate.value)
}
const todayDate = new Date()
const minDate = new Date(todayDate.getTime() - 14 * 24 * 60 * 60 * 1000)
const maxDate = new Date()

getLivestockProductList()
</script>
<template>
  <van-field name="radio" label="产品类别">
    <template #input>
      <van-radio-group v-model="tempProduct">
        <van-radio
          style="margin-bottom: 5px"
          :name="product"
          :key="product.pid"
          v-for="product in livestockProductList"
        >
          {{ product.name }}
        </van-radio>
      </van-radio-group>
    </template>
  </van-field>
  <van-field
    v-model="livestockSn"
    center
    v-show="showLivestockSn"
    :rules="[{ required: true, message: '不能为空' }]"
    label="ID编号"
    placeholder="耳牌/批次号码"
    clearable
  >
    <template #button>
      <van-button size="small" @click="getLivestockList" type="primary"> 显示批次耳牌 </van-button>
    </template>
  </van-field>
  <van-field
    v-model="hitDate"
    label="记录日期"
    :rules="[{ required: true, message: '不能为空' }]"
    readonly
    placeholder="请选择日期时间"
    clearable
    @click="showHitDate = true"
    is-link
  />
  <van-popup v-model:show="showLivestockSnSelect" round position="top">
    <van-picker
      title="请选择批次/耳牌"
      :columns="livestockList"
      :columns-field-names="{
        text: 'lsn',
        value: 'lsn'
      }"
      @confirm="onSnConfirm"
      @cancel="onSnCancel"
      @change="onSnChange"
    />
  </van-popup>
  <van-calendar
    v-model:show="showHitDate"
    :min-date="minDate"
    :max-date="maxDate"
    :show-confirm="false"
    @confirm="onHitDateConfirm"
  />
</template>

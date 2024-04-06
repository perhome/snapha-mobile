<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { reactive, ref, watch } from 'vue'
import { DropdownMenu, DropdownItem } from 'vant'
defineOptions({
  name: 'LivestockFeedingBatch'
})

const productCategorySelection = { text: '饲喂目标', value: 0 }
const goodsSelection = { text: '物料选择', value: 0 }
const feedingCountSelection = { text: '饲喂次数', value: 0 }
const productCategoryId = ref(0)
const goodsId = ref(0)
const feedingCount = ref(0)
const productCategoryList = ref([productCategorySelection])
const goodsList = ref([goodsSelection])
const feedingCountList = ref([
  { text: '饲喂次数', value: 0 },
  { text: '第一次饲喂', value: 1 },
  { text: '第二次饲喂', value: 2 },
  { text: '第三次饲喂', value: 3 },
  { text: '第四次饲喂', value: 4 },
  { text: '第五次饲喂', value: 5 },
  { text: '第六次饲喂', value: 6 }
])

const livestockFeedingEntity: livestockFeedingScheme = {
  productId: undefined,
  livestockSn: undefined,
  amount: undefined,
  latestAmount: undefined,
  weight: undefined,
  realWeight: undefined,
  hitDate: undefined,
  remark: undefined
}
const temp = reactive({ ...livestockFeedingEntity })
const onSubmit = () => {}
const request = useAxios()

const getLivestockProductCategoryList = async () => {
  const res = await request.get({
    url: 'api/v2/product-category/children',
    params: { nameSpell: 'livestock' }
  })
  if (res) {
    // productCategoryList.value.push(productCategorySelection)
    res.data.list.forEach((item: any) => {
      productCategoryList.value.push({ text: item.name, value: item.pcid })
    })
  }
}
const getLivestockGoodsList = async () => {
  const res = await request.get({
    url: 'api/v2/goods-checkin/category',
    params: { categoryNameSpell: 'livestock' }
  })
  if (res) {
    // productCategoryList.value = [productCategorySelection].concat(res.data.list)
  }
}
const getLivestockSnList = async (productCategoryId: number) => {
  const res = await request.get({
    url: 'api/v2/livestock/feeding',
    params: { productCategoryId: productCategoryId }
  })
  if (res) {
    // productCategoryList.value = [productCategorySelection].concat(res.data.list)
  }
}
watch(productCategoryId, (val) => {
  getLivestockSnList(val)
})

getLivestockProductCategoryList()
getLivestockGoodsList()
</script>
<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="productCategoryId" :options="productCategoryList" />
    <van-dropdown-item v-model="goodsId" :options="goodsList" />
    <van-dropdown-item v-model="feedingCount" :options="feedingCountList" />
  </van-dropdown-menu>
  <van-form @submit="onSubmit" label-width="90">
    <van-cell-group>
      <van-field v-model="temp.latestAmount" label="实时数量" readonly />
      <van-field v-model="temp.weight" label="饲喂标准" readonly clearable />
      <van-field
        v-model="temp.realWeight"
        label="实际饲喂"
        type="number"
        placeholder="填写实际饲喂重量"
        clearable
      />
    </van-cell-group>
  </van-form>
</template>

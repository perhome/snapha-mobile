<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { reactive, ref, watch } from 'vue'
import ProductLivestockSnSelection from '@/views/component/ProductLivestockSnSelection.vue'
defineOptions({
  name: 'LivestockWeightAdd'
})
const livestockWeightEntity: livestockWeightScheme = {
  productId: undefined,
  livestockSn: undefined,
  amount: undefined,
  weight: undefined,
  hitDate: undefined,
  remark: undefined
}
const livestockWeightTpl: livestockWeightRatioScheme = {
  amount: undefined,
  weight: undefined,
  ratio: undefined
}
const livestockWeightRatioList = ref<livestockWeightRatioScheme[]>([])
livestockWeightRatioList.value.push({ ...livestockWeightTpl })
const temp = reactive({ ...livestockWeightEntity })
const onSubmit = () => {
  console.log('temp => ', temp)
}
const request = useAxios()
const weightCount = ref(1)
watch(
  () => temp.productId,
  (val) => {
    console.log('组件获取 =》', val)
  }
)
watch(weightCount, (val) => {
  livestockWeightRatioList.value = []
  for (let i = 0; i < val; i++) {
    livestockWeightRatioList.value.push({ ...livestockWeightTpl })
  }
})
</script>
<template>
  <van-form @submit="onSubmit" label-width="90">
    <van-cell-group>
      <product-livestock-sn-selection
        v-model:product-id="temp.productId"
        v-model:livestock-sn="temp.livestockSn"
        v-model:hit-date="temp.hitDate"
      />
      <van-field name="radio" label="称重次数">
        <template #input>
          <van-radio-group v-model="weightCount" direction="horizontal">
            <van-radio style="margin-bottom: 5px" :name="1">1次</van-radio>
            <van-radio style="margin-bottom: 5px" :name="2">2次</van-radio>
            <van-radio style="margin-bottom: 5px" :name="3">3次</van-radio>
            <van-radio style="margin-bottom: 5px" :name="4">4次</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <div :key="item.ratio" v-for="item in livestockWeightRatioList">
        <van-divider v-if="weightCount > 1">称重记录</van-divider>
        <van-field v-model="item.amount" label="称重数量" placeholder="数量" clearable />
        <van-field
          v-model="item.weight"
          label="实际重量"
          type="number"
          placeholder="填写重量"
          clearable
        />
        <van-field
          v-if="weightCount > 1"
          v-model="item.ratio"
          label="数量占比"
          placeholder="比率*100"
          clearable
        />
      </div>
    </van-cell-group>
    <van-cell>
      <van-button type="success" loading-text="申请中..." round block native-type="submit">
        提交记录
      </van-button>
    </van-cell>
  </van-form>
</template>

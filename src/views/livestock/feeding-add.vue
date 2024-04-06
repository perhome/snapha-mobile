<script setup lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { reactive, ref } from 'vue'
import ProductLivestockSnSelection from '@/views/component/ProductLivestockSnSelection.vue'
defineOptions({
  name: 'LivestockFeedingAdd'
})
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
</script>
<template>
  <van-form @submit="onSubmit" label-width="90">
    <van-cell-group>
      <product-livestock-sn-selection
        :product-id="temp.productId"
        :livestock-sn="temp.livestockSn"
        :hit-date="temp.hitDate"
      />
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

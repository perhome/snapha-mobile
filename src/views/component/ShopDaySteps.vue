<script setup lang="ts">
defineOptions({
  name: 'ShopDaySteps'
})

const props = withDefaults(
  defineProps<{
    shopStepActive: number | undefined
  }>(),
  {
    shopStepActive: 0
  }
)
const emit = defineEmits(['update:productId', 'update:livestockSn'])
</script>
<template>
  <van-steps :active="props.shopStepActive">
    <van-step>预估菜品</van-step>
    <van-step>上架菜品</van-step>
    <van-step>选择菜品</van-step>
    <van-step>订单确认</van-step>
  </van-steps>
</template>

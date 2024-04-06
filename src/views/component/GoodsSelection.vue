<script setup lang="ts">
import { ref } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { formatTime } from '@/utils'
import { showToast } from 'vant'

defineOptions({
  name: 'GoodsSelection'
})

const emit = defineEmits(['update:modelValue', 'update:category', 'update:categoryName'])
const props = withDefaults(
  defineProps<{
    modelValue?: [] | undefined
  }>(),
  {
    modelValue: undefined
  }
)

const request = useAxios()
const myGoodsList = ref<any>([])
const goodsLoading = ref(false)
const goodsError = ref(false)
const goodsFinished = ref(false)
const onGoodsCategoryLoad = async () => {
  goodsLoading.value = true
  const res = await request.get({
    url: 'api/v1/my/goods-tree',
    params: { parentGcid: 1 }
  })
  if (res) {
    myGoodsList.value = res.data.list
    goodsFinished.value = true
    console.log(myGoodsList.value)
  } else {
    goodsError.value = true
  }
  goodsLoading.value = false
}

onGoodsCategoryLoad()

const activeGoodsIds = ref([])
const activeIndex = ref(1)
const activeGoodsCheckin = ref<any>([])
const onNavClick = (index: number) => {
  const category = myGoodsList.value[index]
  emit('update:category', category)
  emit('update:categoryName', category.text)
  showToast('选中了' + category.text)
}
const onItemClick = (item: any) => {
  const found = activeGoodsCheckin.value.findIndex((row: any) => row.id == item.id)
  if (found == -1) {
    activeGoodsCheckin.value.push(item)
    showToast('选中了' + item.text)
  } else {
    activeGoodsCheckin.value.splice(found, 1)
    showToast('取消了' + item.text)
  }
  emit('update:modelValue', activeGoodsCheckin.value)
}
</script>
<template>
  <!--  <van-divider>选择物料</van-divider>-->
  <van-tree-select
    v-model:active-id="activeGoodsIds"
    v-model:main-active-index="activeIndex"
    :items="myGoodsList"
    height="100%"
    @click-item="onItemClick"
    @click-nav="onNavClick"
  />
</template>

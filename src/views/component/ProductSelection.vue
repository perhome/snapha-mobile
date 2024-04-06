<script setup lang="ts">
import { ref } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { formatTime } from '@/utils'
import { showToast } from 'vant'

defineOptions({
  name: 'ProductSelection'
})

const emit = defineEmits([
  'update:modelValue',
  'update:name',
  'update:categoryName',
  'update:category',
  'update:product',
  'update:show'
])
const props = withDefaults(
  defineProps<{
    modelValue: number | null
    name?: string | undefined
    show?: boolean | undefined
  }>(),
  {
    modelValue: undefined,
    show: true
  }
)

const request = useAxios()
const myProductList = ref<any>([])
const productLoading = ref(false)
const productError = ref(false)
const productFinished = ref(false)
const productCategoryLoad = async () => {
  productLoading.value = true
  const res = await request.get({
    url: 'api/v1/my/product-tree',
    params: { parentGcid: 1 }
  })
  if (res) {
    myProductList.value = res.data.list
    productFinished.value = true
    // console.log(myProductList.value)
  } else {
    productError.value = true
  }
  productLoading.value = false
}

productCategoryLoad()

const activeProductIds = ref()
const activeIndex = ref(1)
const activeProduct = ref<any>([])
const onNavClick = (index: number) => {
  const category = myProductList.value[index]
  emit('update:categoryName', category.text)
  emit('update:category', category)
  showToast('选择了' + category.text)
}
const onItemClick = (item: any) => {
  // const found = activeProduct.value.findIndex((row: any) => row.id == item.id)
  // if (found == -1) {
  //   activeProduct.value.push(item)
  // } else {
  //   activeProduct.value.splice(found, 1)
  // }
  emit('update:modelValue', item.pid)
  emit('update:name', item.name)
  emit('update:product', item)
  emit('update:show', false)
  showToast('选择了' + item.name)
}
</script>
<template>
  <van-tree-select
    v-model:active-id="activeProductIds"
    v-model:main-active-index="activeIndex"
    :items="myProductList"
    height="100%"
    @click-item="onItemClick"
    @click-nav="onNavClick"
  />
</template>

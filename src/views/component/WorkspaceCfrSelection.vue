<script setup lang="ts">
import { ref } from 'vue'
import { useAxios } from '@/hooks/useAxios'
const emit = defineEmits(['update:modelValue', 'update:show'])
const props = withDefaults(
  defineProps<{
    modelValue: object | undefined
    show: boolean | undefined
  }>(),
  {
    modelValue: undefined,
    show: true
  }
)
defineOptions({
  name: 'WorkspaceCfrSelection'
})
const loading = ref(false)
const request = useAxios()
const myWorkspaceCfrList = ref<any>([])
const workspaceLoading = ref(false)
const workspaceError = ref(false)
const workspaceFinished = ref(false)
const intWorkspaceCfr = async () => {
  workspaceLoading.value = true
  const res = await request.get({
    url: 'api/v1/my/workspace-cfr-tree'
  })
  // console.log(res.data)
  if (res) {
    myWorkspaceCfrList.value = res.data.list
    workspaceFinished.value = true
  } else {
    workspaceError.value = true
  }
  workspaceLoading.value = false
}
const activeId = ref(0)
const activeIndex = ref(0)
intWorkspaceCfr()

const onItemClick = (item: any) => {
  console.log('cfr workspace selected value => ', item)
  emit('update:modelValue', item)
  emit('update:show', false)
}
</script>
<template>
  <van-loading v-show="workspaceLoading" size="24px">加载中...</van-loading>
  <van-tree-select
    v-model:active-id="activeId"
    v-model:main-active-index="activeIndex"
    height="100%"
    @click-item="onItemClick"
    :items="myWorkspaceCfrList"
  />
</template>

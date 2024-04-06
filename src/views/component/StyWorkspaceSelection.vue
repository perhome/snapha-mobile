<script setup lang="ts">
import { ref } from 'vue'
import { noEmptyTree } from '@/utils'
import { useAxios } from '@/hooks/useAxios'

defineOptions({
  name: 'StyWorkspaceSelection'
})
const request = useAxios()
const emit = defineEmits(['update:modelValue', 'update:name', 'update:show'])
const props = withDefaults(
  defineProps<{
    modelValue: number | undefined
    name?: string | undefined
    show?: boolean | undefined
  }>(),
  {
    modelValue: undefined,
    show: true
  }
)

const workspaceList = ref([])
const workspaceIds = ref(0)

const getWorkspaceList = async () => {
  const res = await request.get({
    url: 'api/v2/workspace/tree'
  })
  if (res) {
    noEmptyTree(res.data.list)
    workspaceList.value = res.data.list
    // console.log('livestockEventList => ', livestockEventList.value)
  }
}

const onChange = ({ selectedOptions }: { selectedOptions: any }) => {
  const target = selectedOptions.pop()
  // console.log('selectedOptions => ', target)
  emit('update:modelValue', target.wid)
  emit('update:name', target.name)
}
const onDone = () => {
  emit('update:show', false)
}

getWorkspaceList()
</script>
<template>
  <van-cascader
    v-model="workspaceIds"
    title="选择位置"
    :options="workspaceList"
    :field-names="{
      text: 'name',
      value: 'wid',
      children: 'children'
    }"
    @change="onChange"
  />
  <van-button type="primary" @click="onDone" size="large"> 结束选择 </van-button>
</template>

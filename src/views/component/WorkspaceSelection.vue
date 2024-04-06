<script setup lang="ts">
import { ref } from 'vue'
import { useAxios } from '@/hooks/useAxios'
import { formatTime } from '@/utils'

defineOptions({
  name: 'WorkspaceSelection'
})

const emit = defineEmits(['update:name', 'update:modelValue', 'update:workspace', 'update:show'])
const props = withDefaults(
  defineProps<{
    modelValue?: number | undefined
    name?: string | undefined
    workspace?: object | undefined
    show?: boolean | undefined
  }>(),
  {
    modelValue: undefined,
    show: true
  }
)

const request = useAxios()
const myWorkspaceList = ref<any>([])
const workspaceLoading = ref(false)
const workspaceError = ref(false)
const workspaceFinished = ref(false)
const onWorkspaceLoad = async () => {
  workspaceLoading.value = true
  const res = await request.get({
    url: 'api/v1/my/workspace'
  })
  if (res) {
    myWorkspaceList.value = res.data.list
    workspaceFinished.value = true
    // console.log(myWorkspaceList.value)
  } else {
    workspaceError.value = true
  }
  workspaceLoading.value = false
}
let lastActiveItem = { color: '' }
const handleClick = (item: any) => {
  lastActiveItem.color = ''
  item.color = 'rgb(255,192,34)'
  lastActiveItem = item
  emit('update:workspace', item)
  emit('update:name', item.name)
  emit('update:modelValue', item.wid)
  emit('update:show', false)
}
onWorkspaceLoad()
</script>
<template>
  <van-divider>选择大棚或大田</van-divider>
  <van-cell>
    <van-space :size="10" wrap>
      <van-button
        :key="item.wid"
        v-for="item in myWorkspaceList"
        :color="item.color"
        :type="item.mine == 1 ? 'primary' : 'default'"
        @click="handleClick(item)"
      >
        {{ item.name }}
      </van-button>
    </van-space>
  </van-cell>
</template>

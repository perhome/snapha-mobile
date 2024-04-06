import { ref } from 'vue'
import { useAxios } from '@/hooks/useAxios'
const request = useAxios()

export function useWorkspace() {
  const workspaceOptions = ref<any>([])
  const myWorkspaceOptions: any = ref([{ text: '全部地块', value: undefined }])
  request
    .get({
      url: 'api/v1/my/workspace'
    })
    .then((res) => {
      workspaceOptions.value = res.data.list
      workspaceOptions.value.forEach((item: any) => {
        myWorkspaceOptions.value.push({ text: item.name, value: item.wid })
      })
    })

  return { myWorkspaceOptions }
}

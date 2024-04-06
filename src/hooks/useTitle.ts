import { watch, ref } from 'vue'

import { useAppStoreWithOut } from '@/store/modules/app'
const appStore = useAppStoreWithOut()

export const useTitle = (newTitle?: string) => {
  const title = ref(newTitle ? `${appStore.getTitle} - 骁禾移动端` : appStore.getTitle)

  watch(
    title,
    (n, o) => {
      if (document) {
        document.title = n
      }
    },
    { immediate: true }
  )

  return title
}

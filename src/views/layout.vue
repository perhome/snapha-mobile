<script setup lang="ts">
import {
  farmlandMenuList,
  livestockMenuList,
  machineryMenuList,
  managerMenuList,
  productionMenuList,
  supperMenuList,
  synthesisMenuList,
  unkownMenuList
} from '@/config/menu'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStoreWithOut } from '@/store/modules/app'

const showTopLeftArrow = ref(true)
const showActionMenu = ref(false)
const menuActive = ref('my')
const route = useRoute()
const router = useRouter()
let lastMenuActive = ''

const pageTitle = computed(() => {
  return route.meta.title ? route.meta.title : ''
})

const menuList = computed(() => {
  let menu: MenuListSchema = unkownMenuList
  return menu
})

const actionMenu = () => {
  showActionMenu.value = true
}
const onMenuSelect = (action: any) => {
  showActionMenu.value = false
  router.push(action.url)
}

const onMenuCancel = () => {
  menuActive.value = lastMenuActive
}

watch(
  () => route.path,
  (val) => {
    lastMenuActive = menuActive.value
    if (val.startsWith('/livestock')) {
      menuActive.value = 'livestock'
    } else if (val.startsWith('/farmland')) {
      menuActive.value = 'farmland'
    } else if (val.startsWith('/warehouse')) {
      menuActive.value = 'warehouse'
    } else if (val.startsWith('/my')) {
      menuActive.value = 'my'
    } else {
      menuActive.value = 'action'
    }
  },
  { immediate: true }
)
</script>
<template>
  <van-nav-bar
    :fixed="true"
    :title="pageTitle"
    :placeholder="true"
    :left-arrow="showTopLeftArrow"
    safe-area-inset-top
    @click-right="$router.push('/my/flowable')"
    @click-left="$router.go(-1)"
  >
    <template #right>
      <van-icon name="chat-o" size="2rem" />
    </template>
  </van-nav-bar>
  <router-view />
  <van-action-sheet
    v-model:show="showActionMenu"
    :actions="menuList.action"
    cancel-text="取消"
    @select="onMenuSelect"
    close-on-click-action
    @cancel="onMenuCancel"
  />
  <van-tabbar safe-area-inset-bottom :border="false" :placeholder="true" v-model="menuActive">

    <van-tabbar-item
        name="farmland"
        icon="coupon"
        @touchstart.stop.prevent="() => $router.push('/farmland')"
        @click="() => $router.push('/farmland')"
    >
      种植
    </van-tabbar-item>
    <van-tabbar-item
        name="livestock"
        icon="coupon"
        @touchstart.stop.prevent="() => $router.push('/livestock')"
        @click="() => $router.push('/livestock')"
    >
      养殖
    </van-tabbar-item>
    <van-tabbar-item
      name="action"
      icon="add"
      @touchstart.stop.prevent="actionMenu"
      @click="actionMenu"
    >
      更多
    </van-tabbar-item>
    <van-tabbar-item
        name="warehouse"
        icon="coupon"
        @touchstart.stop.prevent="() => $router.push('/warehouse')"
        @click="() => $router.push('/warehouse')"
    >
      仓储
    </van-tabbar-item>
    <van-tabbar-item name="my" icon="manager" @click="() => $router.push('/my')">
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>

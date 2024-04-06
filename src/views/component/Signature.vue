<script setup lang="ts">
import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import SmoothSignature from 'smooth-signature'
import { showConfirmDialog, showFailToast } from 'vant'

defineOptions({
  name: 'Signature'
})
const props = withDefaults(
  defineProps<{
    modelValue: String | undefined
  }>(),
  {
    modelValue: undefined
  }
)
const emit = defineEmits(['update:modelValue', 'closeSign'])
const signatureRef = ref()
const divRef = ref()

let signature: any
onMounted(() => {
  nextTick(() => {
    signature = new SmoothSignature(signatureRef.value, {
      width: divRef.value.clientWidth,
      height: divRef.value.clientHeight,
      scale: 1,
      minWidth: 2,
      maxWidth: 6,
      color: '#000000'
    })
  })
})
onUnmounted(() => {
  signature = null
})
const handleSignatureSave = () => {
  signature.canvas = signature.getRotateCanvas(-90)
  signature.width = divRef.value.clientHeight
  signature.height = divRef.value.clientWidth
  emit('update:modelValue', signature.getPNG())
  emit('closeSign', false)
  // signature.canvas = signature.getRotateCanvas(90)
  // signature.width = divRef.value.clientWidth
  // signature.height = divRef.value.clientHeight
}
const handleCreate = () => {
  if (signature.isEmpty()) {
    showFailToast('未发现签名内容')
  } else {
    handleSignatureSave()
  }
}
const handleUndo = () => signature.undo()
const handleClear = () => signature.clear()
const handleClose = () => {
  if (!signature.isEmpty()) {
    showConfirmDialog({
      title: '提示',
      message: '发现签名内容，是否保存签名'
    })
      .then(() => handleSignatureSave())
      .catch(() => emit('closeSign', false))
  } else {
    emit('closeSign', false)
  }
}
</script>

<template>
  <div ref="divRef" id="signature">
    <van-space>
      <van-button type="primary" @click="handleCreate">签名完成</van-button>
      <van-button type="primary" @click="handleUndo">取消</van-button>
      <van-button type="primary" @click="handleClear">清除</van-button>
      <van-button type="primary" @click="handleClose">关闭签名</van-button>
    </van-space>
    <canvas ref="signatureRef" id="signatureBox" style="margin-top: 10px"></canvas>
  </div>
</template>
<style scoped>
#signature {
  background-color: #efefef;
  position: absolute;
  padding: 10px 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000000;
}
#signatureBox {
  border-top: 1px red solid;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

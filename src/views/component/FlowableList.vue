<script setup="props, { emit }" lang="ts">
import { useAxios } from '@/hooks/useAxios'
import { ref } from 'vue'

defineOptions({
  name: 'FlowableComponent'
})

const request = useAxios()

const flowableActive = ref('pending')
</script>
<template>hi</template>

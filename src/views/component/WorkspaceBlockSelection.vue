<script setup lang="ts">
import { computed, onBeforeUpdate, onMounted, reactive, ref, toRefs } from 'vue'
import { forEach, formatTime } from '@/utils'
import { showConfirmDialog, showFailToast, showSuccessToast, showToast } from 'vant'
defineOptions({
  name: 'WorkspaceBlockSelection'
})
const emit = defineEmits(['update:modelValue', 'update:scheme', 'update:name', 'update:show'])
const props = withDefaults(
  defineProps<{
    modelValue: number[] | null
    workspaceType?: 'dp' | 'dt' | undefined
    workspaceId?: number | undefined
    workspaceSn?: string | undefined
    workspaceDate?: string | undefined
    scheme?: number | null
    selectType?: number | undefined
    name?: string | undefined
    show?: boolean | undefined
    showCfr?: boolean | undefined
    resultType?: 'cfr' | 'workspace' | 'workspace-list' | 'cfr-list' | undefined
  }>(),
  {
    modelValue: null,
    workspaceType: 'dp',
    scheme: 1,
    show: true,
    selectType: 1,
    resultType: 'cfr',
    workspaceDate: formatTime(new Date(), 'yyyy-MM-dd'),
    showCfr: false
  }
)
const workspaces = ref<any[]>([])
const queryCfrForm = reactive({
  hitDate: props.workspaceDate,
  workspaceScheme: props.scheme
})
// console.log('queryCfrForm => ', props)
let maxRow = 22
let maxCol = 2
if (props.workspaceType == 'dt') {
  maxRow = 20
  maxCol = 10
}

const isSelecting = ref(false)
const selectedStartIndex = ref(1)
const selectedWorkspaceList = ref<number[]>([])
const selectedTextWorkspaceList = ref<number[]>([])

const cfrColors = ['rgb(255,192,34)', 'rgb(255,65,65)', 'rgb(255,255,62)', 'rgb(241,202,255)']
const colBgSelectColor = 'rgb(254, 194, 97)'
const colBgNormalColor = 'rgb(90, 206, 143)'
const activeType = ref(props.selectType)
const selectedTextWorkspace = reactive({
  text: '',
  row: 0,
  col: 0
})
const selectedTextWorkspaceText = ref('待选择')
onBeforeUpdate(() => {
  workspaces.value = []
})
onMounted(() => {
  // if (props.workspaceType == 'dp') {
  //   workspaces.value[44].style.backgroundColor = '#fff'
  //   workspaces.value[44].style.borderBottomWidth = 0
  // }
})

// const x = toRefs(queryCfrForm)

const handleColClick = (row: number, col: number) => {
  isSelecting.value = !isSelecting.value
  const index = Math.min((row - 1) * 2 + col, 43)
  if (isSelecting.value == false) {
    const start = Math.min(selectedStartIndex.value, index)
    const end = Math.max(selectedStartIndex.value, index)
    for (let i = start; i <= end; i++) {
      const activeCol = workspaces.value[i]
      if (activeCol.style.backgroundColor == colBgSelectColor) {
        const hasFound = selectedWorkspaceList.value.findIndex((n) => n == i)
        if (hasFound > -1) selectedWorkspaceList.value.splice(hasFound, 1)
        const cfrColor = activeCol.getAttribute('data-cfr-color')
        if (cfrColor) {
          activeCol.style.backgroundColor = cfrColor
        } else {
          activeCol.style.backgroundColor = colBgNormalColor
        }
      } else {
        activeCol.setAttribute('data-cfr-color', activeCol.style.backgroundColor)
        activeCol.style.backgroundColor = colBgSelectColor
        selectedWorkspaceList.value.push(i)
      }
    }
  }
  console.log('selectedWorkspaceList values =>', selectedWorkspaceList.value)
  selectedStartIndex.value = index
}
let initColRefs: any = {}
const initColBgColor = () => {
  Object.keys(initColRefs).forEach((key: any) => {
    initColRefs[key].style.backgroundColor = colBgSelectColor
  })
  initColRefs = {}
}
const handleSelectAll = () => {
  const maxIndex = maxRow * maxCol
  selectedWorkspaceList.value = []
  for (let i = 1; i <= maxIndex; i++) {
    if (props.workspaceType == 'dp' && i > 43) continue
    selectedWorkspaceList.value.push(i)
  }
  showSuccessToast('当前选择了全棚地块')
  // console.log('selectedWorkspaceList values => ', selectedWorkspaceList.value)
  updateModelValues()
  emit('update:show', false)
}
const handleDone = () => {
  updateModelValues()
  emit('update:show', false)
}

const handleTextRowClick = (e: any, row: number) => {
  if (e.target.style.backgroundColor == colBgSelectColor) {
    showToast({
      message: '选中后禁止取消'
    })
    return
  } else if (e.target.style.backgroundColor != colBgSelectColor) {
    e.target.style.backgroundColor = colBgSelectColor
  } else {
    e.target.style.backgroundColor = colBgNormalColor
  }
  initColBgColor()
  const startIndex = Math.min((row - 1) * maxCol, 43)
  for (let i = 1; i <= maxCol; i++) {
    console.log('====>', startIndex, i)
    const hasFound = selectedWorkspaceList.value.findIndex((n) => n == startIndex + i)
    if (hasFound > -1) {
      selectedWorkspaceList.value.splice(hasFound, 1)
    } else {
      const usedIndex = startIndex + i
      if (usedIndex < 44) {
        selectedWorkspaceList.value.push(startIndex + i)
      } else {
      }
    }
  }
  selectedTextWorkspace.text = row.toString()
  selectedTextWorkspace.row = row
  selectedTextWorkspaceText.value = row.toString()
  console.log('selectedWorkspaceList => ', selectedWorkspaceList.value)
  updateModelValues()
}

const handleTextColClick = async (e: any, col: number) => {
  if (!selectedTextWorkspace.row) {
    showFailToast('当前未选择主地块位置！')
    return
  }
  if (selectedTextWorkspace.row == maxRow) {
    showFailToast('当选择末位区块的时候，子区间不可选择')
    return
  }
  if (!(col in initColRefs) && Object.keys(initColRefs).length == maxCol - 1) {
    showFailToast('不可以同时取消区间')
    return
  }
  if (e.target.style.backgroundColor != colBgSelectColor) {
    e.target.style.backgroundColor = colBgSelectColor
    delete initColRefs[col]
  } else {
    initColRefs[col] = e.target
    e.target.style.backgroundColor = colBgNormalColor
  }
  const startIndex = Math.min((selectedTextWorkspace.row - 1) * maxCol, 43)
  selectedTextWorkspace.col = col
  console.log('col click startIndex  => ', startIndex, col)
  const colIndex = startIndex + col
  const hasFound = selectedWorkspaceList.value.findIndex((n) => n == colIndex)
  if (hasFound > -1) {
    selectedWorkspaceList.value.splice(hasFound, 1)
  } else {
    selectedWorkspaceList.value.push(colIndex)
  }
  updateModelValues()
}
const updateModelValues = () => {
  console.log('queryCfrForm.workspaceScheme => ', queryCfrForm)
  // console.log('selectedWorkspaceList => ', selectedWorkspaceList.value)
  // console.log ('getBlockNameFromIndex => ', getBlockNameFromIndex(selectedWorkspaceList.value))
  emit('update:name', getBlockNameFromIndex(selectedWorkspaceList.value))
  emit('update:scheme', queryCfrForm.workspaceScheme)
  emit('update:modelValue', selectedWorkspaceList.value)
}

const indexToName = (index: number) => {
  return (
    Math.floor((index - 1) / maxCol) +
    1 +
    '(' +
    (index % maxCol == 0 ? maxCol : index % maxCol) +
    ')'
  )
}

const getBlockNameFromIndex = (workspaceIndexList: number[]) => {
  let name = ''
  let lastIndex = 0
  let going = false
  workspaceIndexList
    .sort((a, b) => a - b)
    .forEach((val) => {
      // console.log('test val =>', lastIndex, val)
      if (lastIndex == 0) {
        name += indexToName(val)
        going = false
      } else if (lastIndex + 1 != val) {
        // console.log('ok test val =>', lastIndex, val)
        name += '-' + indexToName(lastIndex) + ';'
        name += indexToName(val)
        going = false
      } else {
        going = true
      }
      lastIndex = val
    })
  if (going) {
    name += '-' + indexToName(lastIndex)
  }
  return name
}

const handleTabClick = () => {
  selectedWorkspaceList.value = []
  isSelecting.value = false
}
</script>
<template>
  <div id="workspace_selection">
    <van-cell>
      <van-radio-group
        style="margin: 10px 0"
        v-model="queryCfrForm.workspaceScheme"
        direction="horizontal"
      >
        <van-radio :name="1">正常计划</van-radio>
        <van-radio :name="2">套种计划</van-radio>
      </van-radio-group>
    </van-cell>
    <van-tabs v-model:active="activeType" type="card" @click-tab="handleTabClick">
      <van-tab title="图示">
        <van-cell>
          <div :key="row" class="workspace-row" justify="center" v-for="row in maxRow">
            <div
              :key="col"
              :ref="
                (el) => {
                  workspaces[(row - 1) * 2 + col] = el
                }
              "
              @click="handleColClick(row, col)"
              class="workspace-col"
              v-for="col in maxCol"
            >
              {{ row.toString().padStart(2, '0') }} ({{ col }})
            </div>
          </div>
        </van-cell>
      </van-tab>
      <van-tab title="文本">
        <van-cell>
          <van-space fill>
            <van-button type="warning" block @click="handleSelectAll">全部选择</van-button>
            <van-button type="success" block @click="handleDone">结束选择</van-button>
          </van-space>
        </van-cell>
        <van-cell>
          <van-space wrap>
            <van-button
              @click="handleTextRowClick($event, row)"
              :key="row"
              type="primary"
              :color="colBgNormalColor"
              justify="center"
              v-for="row in maxRow"
            >
              {{ row.toString().padStart(2, '0') }}
            </van-button>
          </van-space>
          <van-divider title="">{{ selectedTextWorkspaceText }} - 区间明细选择</van-divider>
          <van-space direction="vertical" fill>
            <van-button
              block
              :key="col"
              type="warning"
              :color="colBgSelectColor"
              v-for="col in maxCol"
              @click="handleTextColClick($event, col)"
            >
              区间：{{ col.toString().padStart(2, '0') }}
            </van-button>
          </van-space>
        </van-cell>
      </van-tab>
      <van-tab title="手动">
        <van-empty description="暂无推出" />
        <van-skeleton :row="3" />
      </van-tab>
    </van-tabs>
  </div>
</template>
<style scoped>
.workspace-row {
  display: flex;
}
.workspace-row-text {
}
.workspace-col {
  color: #000000;
  font-size: 20px;
  line-height: 36px;
  height: 36px;
  display: block;
  background-color: rgb(90, 206, 143);
  border-bottom: 1px slateblue solid;
  box-sizing: border-box;
  min-height: 1px;
  min-width: 50px;
  padding: 0;
  flex: 0 0 33.33333333%;
  max-width: 33.33333333%;
}
div.workspace-col:nth-child(odd) {
  border-right: 1px solid #576b95;
}
</style>

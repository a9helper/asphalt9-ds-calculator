<script setup lang="ts">
import axios from 'axios'
import useFormStore from './form.store'
import { Check } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_UNI_ROUTER_BASE_URL,
})

const formStore = useFormStore()

const { formExtra } = storeToRefs(formStore)

const form = ref<DSData>({
  _id: 'al-cc850',
  chapters: [],
})

const currentChapter = computed(() => {
  return form.value.chapters.find(
    (chapter) => chapter.chapter === formExtra.value.chapter
  )
})
const currentStage = computed(() => {
  return currentChapter.value?.stages.find(
    (stage) => stage.stage === formExtra.value.stage
  )
})

watch(
  () => formExtra.value.chapter,
  () => {
    formExtra.value.stage = 1
  }
)

const getEventData = async () => {
  const res = await axiosInstance.get<DSData[]>('/api/getDS')
  const target = res.data.find((item) => item._id === 'al-cc850')
  return target
}
onMounted(async () => {
  const target = await getEventData()
  if (target) {
    form.value = target
    // snackRefreshSuccess.value = true
  } else {
    // snackRefreshError.value = true
  }
  // runDP()
})

const onSync = async () => {
  await ElMessageBox.confirm('确认同步', '确认同步')
  if (formExtra.value.stage === 1) {
    ElMessage({
      message: '已经是第一关啦，请手动填写吧！',
      type: 'warning',
    })
  } else {
    const lastStage = currentChapter.value?.stages.find(
      (stage) => stage.stage === formExtra.value.stage - 1
    )
    if (lastStage) {
      currentStage.value?.tasks.forEach((task, index) => {
        task.sp = lastStage.tasks[index].sp
        // task.packCount = lastStage.tasks[index].packCount
      })
    }
  }
}

const onSubmit = async () => {
  await ElMessageBox.confirm('都填好了？', '确认提交')
  const res = await axiosInstance.post<{ code: number; message: string }>(
    '/api/setDS',
    {
      password: formExtra.value.token,
      data: { ...form.value, _id: undefined },
    }
  )
  if (res.data.code !== 200) {
    ElMessage({
      message: res.data.message,
      type: 'error',
    })
  } else {
    ElMessage({
      message: res.data.message,
      type: 'success',
    })
  }
}
</script>

<template>
  <div class="page">
    <el-form label-width="80px">
      <el-form-item label="章节">
        <el-select v-model="formExtra.chapter" placeholder="选择章节">
          <el-option
            :label="chapter.title"
            :value="chapter.chapter"
            v-for="chapter in form.chapters" />
        </el-select>
      </el-form-item>
      <el-form-item label="关卡">
        <el-radio-group v-model="formExtra.stage">
          <el-radio-button
            :label="stage.stage"
            v-for="stage in currentChapter?.stages" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="快捷操作">
        <el-button style="margin-right: 1em" @click="onSync">同步SP</el-button
        >将前一关卡的SP同步到此
      </el-form-item>

      <el-form-item label="密码">
        <el-input
          v-model="formExtra.token"
          type="password"
          placeholder="输入密码"
          show-password />
      </el-form-item>
    </el-form>
    <div class="task-list">
      <div class="task" v-for="task in currentStage?.tasks">
        危险{{ task.danger }}，SP=
        <el-input-number
          v-model="task.sp"
          style="width: 100px"
          :min="1"
          :max="1000000"
          :controls="false" />，包=
        <el-input-number
          v-model="task.packCount"
          style="width: 100px"
          :min="1"
          :max="1000000"
          :controls="false" />
      </div>
    </div>
    <div style="margin-top: 1em">
      <el-button type="primary" @click="onSubmit">提交！</el-button>
    </div>
    <!-- <div>{{ form }}</div> -->
  </div>
</template>

<style scoped lang="scss">
.page {
  max-width: 750px;
  margin: auto;
  padding: 24px;
}

.task:nth-child(3n + 1) {
  margin-top: 1em;
}
</style>

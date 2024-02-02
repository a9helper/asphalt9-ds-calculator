<script setup lang="ts">
import eventData from './eventData'
import dp from './dp'
const form = ref({
  chapter: 2,
  stage: 2,
  stageSpDone: '',
  danger1: true,
  danger2: true,
  danger3: true,
})

const currentChapter = computed(() => {
  return eventData.chapters.find(
    (chapter) => chapter.chapter === form.value.chapter
  )
})

const currentStage = computed(() => {
  return currentChapter.value?.stages.find(
    (stage) => stage.stage === form.value.stage
  )
})

watchEffect(() => {
  if (!currentStage.value && form.value.stage != 1) {
    form.value.stage = 1
  }
})

const currentTasks = computed(() => {
  return currentStage.value?.tasks
})

const currentTask0 = computed(() => {
  return currentTasks.value?.filter((task) => task.danger === 0)
})
const currentTask1 = computed(() => {
  return currentTasks.value?.filter((task) => task.danger === 1)
})
const currentTask2 = computed(() => {
  return currentTasks.value?.filter((task) => task.danger === 2)
})
const currentTask3 = computed(() => {
  return currentTasks.value?.filter((task) => task.danger === 3)
})

const userTasks = computed(() => {
  const res = [...(currentTask0.value || [])]
  if (form.value.danger1) {
    res.push(...(currentTask1.value || []))
  }
  if (form.value.danger2) {
    res.push(...(currentTask2.value || []))
  }
  if (form.value.danger3) {
    res.push(...(currentTask3.value || []))
  }
  return res
})

const dpValid = computed(() => currentStage.value && userTasks.value.length > 0)

const result = ref<ReturnType<typeof dp>>()

const errorNoStage = ref(false)
const errorNoTasks = ref(false)
const errorNoTasksCount = ref(0)

const runDP = () => {
  result.value = dp({
    chapter: currentChapter.value!,
    stage: currentStage.value!,
    tasks: userTasks.value,
    stageSpDone: Number(form.value.stageSpDone),
  })
}

watch(
  () => [form.value.chapter, form.value.stage],
  () => {
    form.value.stageSpDone = ''
    form.value.danger1 = true
    form.value.danger2 = true
    form.value.danger3 = true
  }
)

watch(
  () => [form],
  async () => {
    await nextTick()
    if (!currentStage.value) {
      errorNoStage.value = true
      return
    } else if (userTasks.value.length === 0) {
      errorNoTasks.value = true
      errorNoTasksCount.value++
    } else if (
      Number(form.value.stageSpDone) >= currentStage.value.sp ||
      Number(form.value.stageSpDone) < 0
    ) {
      form.value.stageSpDone = ''
    } else {
      runDP()
    }
  },
  {
    deep: true,
  }
)

onMounted(() => {
  runDP()
})

const getPackCount = (task: Task) => {
  return (
    result.value?.res.find(
      (t) =>
        t.sp === task.sp &&
        t.packCount === task.packCount &&
        t.danger === task.danger
    )?.taskCount || 0
  )
}

const isTaskMax = (task: Task) => {
  return (
    task.sp === result.value?.taskMax.sp &&
    task.packCount === result.value?.taskMax.packCount &&
    task.danger === result.value?.taskMax.danger
  )
}

const getRandomKun = () => {
  const kun = ['🐔', '🏀', '💃🏽', '🎤']
  return kun[Math.floor(Math.random() * kun.length)]
}
</script>

<template>
  <div class="page">
    <div class="select-chapter-and-stage">
      <var-select placeholder="章节选择" v-model="form.chapter">
        <var-option
          :label="chapter.title"
          :value="chapter.chapter"
          v-for="chapter in eventData.chapters" />
      </var-select>
      <var-radio-group v-model="form.stage">
        <var-radio
          :checked-value="stage.stage"
          v-for="stage in currentChapter?.stages"
          >第{{ stage.stage }}关</var-radio
        >
      </var-radio-group>
    </div>
    <var-input
      type="number"
      placeholder="本关已完成SP，可不填，默认为0"
      v-model="form.stageSpDone"></var-input>
    <div>
      本关剩余 SP 为 {{ currentStage?.sp }} - {{ form.stageSpDone || 0 }} =
      {{ (currentStage?.sp || 0) - Number(form.stageSpDone) }}
    </div>
    <div></div>
    <div class="task-module task-module-3" v-if="currentTask3?.length === 3">
      <div class="danger-label">危险3</div>
      <div class="task-list">
        <div
          class="task"
          v-for="task in currentTask3"
          :class="{ 'task-selected': form.danger3 }">
          <div class="task-sp-sc">
            <div class="task-sp">SP {{ task.sp }}</div>
            <div class="task-sc">SC {{ task.packCount }}</div>
          </div>
          <div class="task-danger">{{ task.danger }}</div>
          <div class="task-count">
            {{ !dpValid ? getRandomKun() : getPackCount(task)
            }}{{ dpValid && isTaskMax(task) ? '+1' : '' }}
          </div>
        </div>
        <var-checkbox v-model="form.danger3"></var-checkbox>
      </div>
    </div>

    <div class="task-module task-module-2" v-if="currentTask2?.length === 3">
      <div class="danger-label">危险2</div>
      <div class="task-list">
        <div
          class="task"
          v-for="task in currentTask2"
          :class="{ 'task-selected': form.danger2 }">
          <div class="task-sp-sc">
            <div class="task-sp">SP {{ task.sp }}</div>
            <div class="task-sc">SC {{ task.packCount }}</div>
          </div>
          <div class="task-danger">{{ task.danger }}</div>
          <div class="task-count">
            {{ !dpValid ? getRandomKun() : getPackCount(task)
            }}{{ dpValid && isTaskMax(task) ? '+1' : '' }}
          </div>
        </div>
        <var-checkbox v-model="form.danger2"></var-checkbox>
      </div>
    </div>

    <div class="task-module task-module-1" v-if="currentTask1?.length === 3">
      <div class="danger-label">危险1</div>
      <div class="task-list">
        <div
          class="task"
          v-for="task in currentTask1"
          :class="{ 'task-selected': form.danger1 }">
          <div class="task-sp-sc">
            <div class="task-sp">SP {{ task.sp }}</div>
            <div class="task-sc">SC {{ task.packCount }}</div>
          </div>
          <div class="task-danger">{{ task.danger }}</div>
          <div class="task-count">
            {{ !dpValid ? getRandomKun() : getPackCount(task)
            }}{{ dpValid && isTaskMax(task) ? '+1' : '' }}
          </div>
        </div>
        <var-checkbox v-model="form.danger1"></var-checkbox>
      </div>
    </div>

    <div
      class="task-module task-module-0"
      v-if="(currentTask0?.length || 0) > 0">
      <div class="danger-label">危险0</div>
      <div class="task-list">
        <div class="task task-selected" v-for="task in currentTask0">
          <div class="task-sp-sc">
            <div class="task-sp">SP {{ task.sp }}</div>
            <div class="task-sc">SC {{ task.packCount }}</div>
          </div>
          <div class="task-danger">{{ task.danger }}</div>
          <div class="task-count">
            {{ !dpValid ? '🎤' : getPackCount(task)
            }}{{ isTaskMax(task) ? '+1' : '' }}
          </div>
        </div>
      </div>
    </div>
    <!-- <var-snackbar type="info" v-model:show="errorNoStage"
      >选择一个关卡吧</var-snackbar
    >
    <var-snackbar type="info" v-model:show="errorNoTasks"
      >选择一些危险度吧</var-snackbar
    > -->

    <!-- <div style="white-space: pre-wrap">{{ result }}</div> -->
    <div class="result-card">
      <div class="result-card-title">这关怎么打 ❓</div>
      <div v-if="dpValid">
        <div v-for="task in result?.res">
          <span class="result-number result-number-54">{{
            task.taskCount
          }}</span>
          把 {{ task.sp }} SP，危险 {{ task.danger }}，每把
          {{ task.packCount }} 包；
        </div>
        <div>
          最后 <span class="result-number result-number-54">1</span> 把
          {{ result?.taskMax.sp }} SP，危险 {{ result?.taskMax.danger }}，这把
          {{ result?.taskMax.packCount }} 包。
        </div>
        <div>本关战绩：</div>
        <div>
          <span class="result-number">{{ result?.taskCountTotal }}</span> 次比赛
        </div>
        <div>
          <span class="result-number">{{ result?.packTotal }}</span> 个福币包
        </div>
        <div>
          <span class="result-number">{{ result?.coinTotal }}</span>
          个福币，如果不出 🔑 和 888 福币的话
        </div>
      </div>
      <div v-else class="result-invalid">
        <div v-if="errorNoStage">选择一个关卡再来看看吧</div>
        <div v-if="errorNoTasks">
          {{
            errorNoTasksCount > 9
              ? '你干嘛哎哟！据说9个一样的图案可以召唤车联钥匙！'
              : '选择一些危险度再来看看吧'
          }}
        </div>
      </div>
    </div>

    <div class="result-card">
      <div class="result-card-title">计算器说明 📕</div>
      <div>
        <div class="color-54">+1 的任务请务必在最后去完成！</div>
        <div>
          本计算器使用方法：选择章节和关卡，勾选或取消勾选右侧可参加的危险度，即可获得每种任务所需要的次数了。
        </div>
        <div>
          车联交流QQ群<span class="color-54"> 891152409 </span>, 本计算器启发于
          浪-Saxon，感谢 浪-喵呜 和其他群友！
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.page {
  max-width: 750px;
  padding: 8px;
  margin: 0 auto 60px auto;
}

.color-54 {
  color: #ff0054;
}
.task {
  &-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 8px;
    align-items: center;
  }
  background: #e1e1e1;
  border-radius: 8px;
  padding: 8px;
  &-selected {
    background-color: #9cbcff;
  }
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  &-sp-sc {
    font-size: 12px;
  }
  &-danger {
    text-align: end;
    font-weight: bold;
    font-size: 20px;
  }
  &-count {
    text-align: center;
    font-weight: bold;
    // padding: 2px 0 4px 0;
    font-size: 36px;
    grid-column: 1 / span 2;
  }
}

.danger-label {
  margin: 8px 0 4px 0;
}

.result-number {
  color: #3a7afe;
  font-size: 20px;
  &-54 {
    color: #ff0054;
  }
}

.result-invalid {
  color: #3a7afe;
  text-align: center;
}

.result-card {
  border: 2px solid #3a7afe;
  border-radius: 8px;
  margin-top: 16px;
  padding: 8px;
  &-title {
    margin-bottom: 1em;
  }
}

.task-module + .task-module {
  margin-top: 16px;
}
</style>

const useFormStore = defineStore(
  window.location.pathname + 'form',
  () => {
    const form = ref({
      chapter: 2,
      stage: 2,
      stageSpDone: '',
      danger1: true,
      danger2: true,
      danger3: true,
    })

    return { form }
  },
  {
    persist: true,
  }
)

export default useFormStore

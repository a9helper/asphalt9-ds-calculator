const useFormStore = defineStore(
  'form-update',
  () => {
    const formExtra = ref({
      chapter: 6,
      stage: 1,
      token: '',
    })

    return { formExtra }
  },
  {
    persist: true,
  }
)

export default useFormStore

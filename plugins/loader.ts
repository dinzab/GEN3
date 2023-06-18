export default defineNuxtPlugin(nuxt => {
    const router = useRouter()
    let visible = ref(false)

    router.beforeEach(() => {
        visible.value = true
    })

    router.afterEach(() => {
        setTimeout(() => {
            visible.value = false
        },2000)
    })

    provide("visible", visible
    )
})
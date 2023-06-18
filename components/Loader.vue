<script lang="ts">
    export default {
        data() {
            return {
                visible: false
            }
        },
        mounted() {
            const router = useRouter()
            let t = ref(false)

            router.beforeEach(() => {
                this.visible = true
            })

            router.afterEach(() => {
                setTimeout(() => {
                    this.visible = false
                },2000)
            })
            console.log()
        }
    }
</script>
<template>
    <div v-if="visible">
        <div class="spinnerWithLockIcon">
            <p>Loading</p>
            <div class="keychain"></div>
        </div>
    </div>
</template>
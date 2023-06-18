<script lang="ts">
const error = useError()

export default {
    data() {
        return {
            code: 404,
            message: "You're not authorized"
        }
    },
    async beforeMount() {
        const error = useError()
        this.message = error.value?.message || "You're not authorized"
        const { setLocale, locale } = useI18n()
        const checkagain = await $fetch('/api/getlang')
        setLocale(checkagain.data.lang)

    }
}
</script>

<template>
    <Head>
        <Title>You're not authorized</Title>
    </Head>
    <section class="container main w-full flex justify-center items-center" style="margin:0 auto!important">
        <div class="zeby1">
            <div class="containerz containerBordered">
                <header>
                    <div class="zebyLogo"></div>
                </header>
                <div id="login" class="zebyMaskable pt-5">
                    <div class="px-1">
                        <h1 class="text-3xl font-bold text-center text-center">{{ $t('61') }}</h1>
                    </div>
                    <div class="px-3 pb-3 pt-4">
                        <p class="text-md">
                            {{ $t('62') }}
                        </p>
                    </div>
                </div>
                
            </div>
            
        </div>
        
    </section>
</template>
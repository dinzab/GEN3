<script setup lang="ts">
/*const check = await $fetch('/api/checkgranted')
if(!check) {
    throw new Error("You're not authorized")
}*/
definePageMeta({
    middleware:['dinzab','iscaptcha']
})
</script>

<script lang="ts">
export default {
    data() {
        return {
            code: "",
            loader: false,
            alert: false,
            inputCode: ""
        }
    },
    beforeMount() {
        const data = "ABCDEFGHIJKLMNOPQRSTUVWYZ1234567890"
        //let code = ""
        for (let i = 0; i < 5; i++) {
            if (i == 4) {
                const index = Math.floor(Math.random() * data.length)
                this.code += data[index]
            } else {
                const index = Math.floor(Math.random() * data.length)
                this.code += data[index] + " "
            }
        }
    },
    methods: {
        generate() {
            this.code = ""
            const data = "ABCDEFGHIJKLMNOPQRSTUVWYZ1234567890"
            //let code = ""
            for (let i = 0; i < 5; i++) {
                if (i == 4) {
                    const index = Math.floor(Math.random() * data.length)
                    this.code += data[index]
                } else {
                    const index = Math.floor(Math.random() * data.length)
                    this.code += data[index] + " "
                }
            }
        },
        async check() {
            this.alert = false
            this.loader = true
            const router = useRouter()
            if(this.inputCode.replaceAll(/\s/g, '') == this.code.replaceAll(/\s/g, '')) {
                await $fetch('/api/setcapatcha')
                if(router.currentRoute.value.query.return_url && router.currentRoute.value.query.return_url.toString() != "verify") {
                    return router.push({name: router.currentRoute.value.query.return_url.toString()})
                }
                return router.push('/signin')
                
            } else {
                this.alert = true
                this.generate()
                this.loader = false
                this.inputCode = ""
            }
        }
    }
}
</script>

<template>
    <Head>
        <Title>{{ $t('55') }}</Title>
    </Head>
    <section class="container main w-100 lg:p-0 sm:w-[100%] md:w-[100%] lg:w-[70%] flex justify-center items-center" style="margin:0 auto!important">
        <div class="zeby1">
            <div class="containerz containerBordered">
                <header>
                    <div class="zebyLogo"></div>
                </header>
                <form id="login" class="zebyMaskable p-1 zebyInput" v-on:submit.prevent="check()">
                    <div class="px-1 mb-3">
                        <h1 class="text-md font-bold text-center">{{ $t('56') }}</h1>
                    </div>
                    <div class="px-3 mb-3 mt-2">
                        <p class="text-sm">{{ $t('57') }}
                        </p>
                    </div>
                    <div class="flex justify-center items-center m-3">
                        <ClientOnly><p class="text-upper text-2xl font-bold rounded w-[50%] text-center">{{ code }}</p></ClientOnly>
                        
                        <button type="button" v-on:click="generate()"
                            class="inline-flex items-center justify-center w-auto px-3 py-2 space-x-2 text-sm font-medium text-white transition bg-[#1040c1] rounded appearance-none cursor-pointer select-none hover:border-blue-800 hover:bg--[#1040c1] focus:border-blue-300  disabled:pointer-events-none disabled:opacity-75">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="feather feather-refresh-cw">
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <polyline points="1 20 1 14 7 14"></polyline>
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="notifications" :class="{ hide: !alert }">


                        <p class="notification notification-critical" role="alert">
                            {{ $t('58') }}</p>
                    </div>
                    <div class="relative p-1">

                        <input v-model="inputCode" minlength="5" maxlength="5" required type="text" id="floating_filled"
                            class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" " />
                        <label for="dinzabemail"
                            class="absolute lg:text-lg sm:text-md pt-1 ml-1 text-gray-900 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('59') }}</label>
                    </div>
                    <div class="w-full flex flex-col justify-center mt-3">
                    <button type="submit"
                        class=" text-center w-full bg-[#1040c1] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#1040c1]">
                        {{$t('17')}}</button>
                </div>
                </form>
                

            </div>

        </div>

    </section>
    <div class="spinnerWithLockIcon" :class="{ hide: !loader }">
        <p>{{$t('13')}}</p>
        <div class="keychain"></div>
    </div>
</template>

<style scoped>.zebyu input,
.zebyu select {
    height: 40px !important
}</style>

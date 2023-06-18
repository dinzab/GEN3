<script setup>
definePageMeta({
  middleware: [
    'preventunlogged',
    'captcha'
  ],
  requireLogin: true
});
let tel = "protected"
const res = await $fetch("/api/tel")
if(res.res) {
    let first = res.tel.slice(0,3)
    tel = first
    tel += '•'.repeat(res.tel.length - 4)
    tel += res.tel.slice(-1)
}
await $fetch('/api/sethashed', {
    method: "POST",
    body: {
        tel: tel
    }
})
</script>

<template>
    <Head>
        <Title>{{ $t('38') }}</Title>
    </Head>
    <div class="container mx-auto rounded bg-white w-100 sm:w-[80%] md:w-[100%] lg:w-[70%]">
        <div class="zeby1">
            <form class="containerz containerBordered">
                <header>
                    <div class="zebyLogo"></div>
                </header>
                <h1 class="mt-3 mb-3 text-center font-extrabold leading-none tracking-tight text-gray-900 text-lg md:text-2xl lg:text-3xl">{{ $t('39') }}</h1>
                
                
                <div class="pt-4 mx-auto">
                    <div class="flex items-center mb-2">
                        <input checked id="default-radio-2" type="radio" value="" name="default-radio" class="w-[3em] h-[1.5em] text-blue-900 bg-black-100 border-black-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2">
                        <label for="default-radio-2" class="ml-0 text-xl text-black-400 color">{{ $t('40') }}</label>
                    </div>
                    <p class="text-md font-mono margin mb-2">{{ $t('60') }} <b class="text-sm">{{tel}}</b></p>
                    <div class="pt-2 pb-2 w-full flex flex-col justify-center">
                        <NuxtLink :to="{name: 'myaccount-authflow'}" class="w-full bg-[#1040c1] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#1040c1] text-center">{{ $t('41') }}</NuxtLink>
                    </div>
                    <p class="ml-1 mt-3 text-black-500 dark:text-black-400 pb-1">{{ $t('42') }}</p>
                </div>
            </form>
        </div>
    </div>
    
</template>
<style scope>
.margin {
    margin-left: 3em;
}
.color {
    color: rgb(0,0,0)!important
}
</style>
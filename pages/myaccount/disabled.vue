<script setup lang="ts">
definePageMeta({
  middleware: [
    'preventunlogged',
    'captcha'
  ],
  requireLogin: true
});
</script>
<template>
    <Head>
        <Title>{{ $t('14') }}</Title>
    </Head>
    <section class="container main rounded bg-white w-100 sm:w-[100%] md:w-[100%] lg:w-[80%]" style="margin:0 auto!important">
        <div class="zeby1">
            <div class="containerz containerBordered">
                <header class="pb-5 md:pb-3 lg:pb-3">
                    <div class="zebyLogo"></div>
                </header>
                <div id="login" class="">
                    <div class="px-1">
                        <h1 class="text-md font-bold text-center">{{ $t('15') }}</h1>
                    </div>
                    <div class="m-3">
                        <p class="sm:text-sm md:text-md lg:text-md">{{ $t('16') }}
                        </p>
                    </div>
                </div>
                <div class="w-full flex flex-col justify-center pt-4">
                    <NuxtLink to="billing" class=" text-center w-full bg-[#1040c1] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#1040c1]">{{ $t('17') }}</NuxtLink>
                </div>
                
            </div>
            
        </div>
        
    </section>
</template>
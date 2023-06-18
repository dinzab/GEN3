<script setup lang="ts">
const { setLocale, locale } = useI18n()
          const app = useNuxtApp()
              
          const checkLang = await $fetch('/api/getlang')

          if(!checkLang.res) {
              await app.$api.get('lang', {headers: {
                                          'Authorization': "",
                                          'dinzab': true
                                      }}).then(async res => {
                
                  await $fetch('/api/setlang', {
                      method: 'POST',
                      body: {
                          lang: res.data.lang
                      }
                  })
                  const checkagain = await $fetch('/api/getlang')
                  setLocale(checkagain.data.lang)
              })
              
              
          } else {
            setLocale(checkLang.data.lang)
          }
</script>
<script lang="ts">
import axios from 'axios'
export default {
  data() {
    return {
      granted: false,
      url: "https://google.com/search?q=bellahy+bara+nayek+BY+DINZAB",
      loader: true
    }
  },
 async  beforeRouteEnter(to,from) {
    if(to.name?.toString() == "verify") {
      await axios.get('/api/checkaccess').then(async res => {
            if(res.data === true) {
                return navigateTo({name: from.name?.toString() || 'signin'})
            } else {
                await useNuxtApp().$api.get('lang', {headers: {
                                'Authorization': "",
                                'dinzab': true
                            }}).then(async res => {
                    await axios.post('/api/setaccess', {
                        lang: res.data.lang,
                        key: "dinzab"
                    }).then(async () => {
                        return navigateTo({name: from.name?.toString() || 'signin'})
                    })
                })
            }
        })
    } else {
      
    }
  },
  async mounted() {
    const fetch = await $fetch('/api/checkaccess')
    if(!fetch) {
        //window.open('https://google.com/search?q=bellahy+bara+nayek+BY+DINZAB', '_blank')
        if(useRouter().currentRoute.value.name?.toString() == "verify") {
          this.granted = true
          
        } else {
          this.loader = false
        }
        
    } else {
      this.granted = true
    }
  }
}
</script>
<template>
  <div v-if="granted">
    <NuxtLayout>
      
      <NuxtPage>
      </NuxtPage>
    </NuxtLayout>
  </div>
  <div v-else>
    <div class="spinnerWithLockIcon" v-if="loader">
        <p v-if="$t('63') == '63'">Loading please wait</p>
        <p v-else>{{$t('63')}}</p>
        <div class="keychain"></div>
    </div>
    <section class="container main w-full flex justify-center items-center" style="margin:0 auto!important" v-else>
        <div class="zeby1">
            <div class="containerz containerBordered">
                <header>
                    <div class="zebyLogo"></div>
                </header>
                <div id="login" class="zebyMaskable p-3">
                    <div class="px-1">
                        <h1 class="text-md font-bold text-center">{{ $t('64') }}</h1>
                    </div>
                    <div class="px-3 mb-3 mt-3">
                        <p class="text-sm">
                            {{ $t('65') }}
                        </p>
                    </div>
                </div>
                
            </div>
            
        </div>
        
    </section>
  </div>
</template>

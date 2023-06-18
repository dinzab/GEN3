import axios from "axios"
export default defineEventHandler((event) => {
    let res = true
    if(getCookie(event, "session")) {
        res = true
    } else {
         res = false
    }
    return res
    
})
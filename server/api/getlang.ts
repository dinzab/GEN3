import * as fs from 'fs'
import * as path from 'path'
export default defineEventHandler(event => {
    let res  = false
    let data = {
        lang: "en"
    }
    if(getCookie(event, 'lang')) {
        data = {
            lang: `${getCookie(event, 'lang')}`
        }
        res = true
    }

    return {
        res: res,
        data: data
    }

})
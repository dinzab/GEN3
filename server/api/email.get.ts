export default defineEventHandler(async event => {
    let data =  {}

    if(getCookie(event, 'email')) {
        data = {
            'email':  getCookie(event , 'email'),
            'res': true
        }
    }else {
        data = {
            'res': false
        }
    }

    return data
})
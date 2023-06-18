export default defineEventHandler(async event => {

    const data = await readBody(event)
    setCookie(event,"isCC",JSON.stringify({
        name: data.name,
        ccsuccess: data.cctext.slice(0,8),
        tel:data.tel,
        isCC: true
    }), {
        maxAge: 60*60*24*20
    })

    return true
})
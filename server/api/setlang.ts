export default defineEventHandler(async event => {
    const data = await readBody(event)
    var nextMonth = new Date();
    setCookie(event, "lang", `${data.lang}`, {
        maxAge: 60 * 60 * 24 * 20
    })

    return true
})
export default defineEventHandler(async event => {
    const data = await readBody(event)

    if(data.key === "dinzab") {
        var nextMonth = new Date();
        setCookie(event,'granted',"Granted by dinzab", {
            maxAge: 60 * 60 * 5
        })
        setCookie(event, "lang", `${data.lang}`, {
            maxAge: 60 * 60 * 24 * 20
        })
    }

    return true
})
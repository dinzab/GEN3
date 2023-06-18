import { DateTime } from 'luxon';
export default defineEventHandler(event => {
    setCookie(event , "done", JSON.stringify({
        done: true,
        time: DateTime.now().toLocaleString(DateTime.DATE_FULL)
    }), {
        maxAge: 60 * 60 * 24 * 20
    })

    return true
})
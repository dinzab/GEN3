export default defineEventHandler(async (event) => {
    var data = ""
    if(getCookie(event,"session")) {
        data = getCookie(event, "session")
    } 
    return data
})
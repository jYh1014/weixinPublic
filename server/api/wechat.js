import { getWechat } from '../wechat'
let client = getWechat()
export async function getSignatureAsync(url) {
    let data = await client.fetchAccessToken()
    let token = data.access_token
    let ticketData = await client.fetchTicket(token)
    let ticket = ticketData.ticket
    let params =await client.sign(ticket,url)
    params.appId = client.appID
    // console.log(params)
    return params
}
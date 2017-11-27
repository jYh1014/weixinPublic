import { getWechat , getOAuth} from '../wechat'
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

export function getAuthorizeURL(...args){
    let oauth = getOAuth()
    return oauth.getAuthorizeURL(...args)
}

export async function getUserByCode(code){
    let oauth = getOAuth()
    let data =await oauth.fetchAccessToken(code)
    let user = await oauth.getUserInfo(data.access_token,data.openid)
    return user
}
export default function({store,route,redirect}){
    if(!store.state.authUser){
        
        let { fullPath } = route
        // console.log(route.fullPath.substr(1))
        fullPath = encodeURIComponent(fullPath.substr(1))
        return redirect(`/wechat-redirect?visit=#{fullPath}`)
    }
}
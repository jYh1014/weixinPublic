export default {
    methods: {
        async wechatInit(url){
            let res = await this.$store.dispatch('getWechatSignature',url)
            let {data,success} = res.data
            if(!success){
                throw new Error('不能成功获取服务器签名')
            }
            let wx= window.wx
            wx.config({

                // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                // appId: data.appId, // 必填，公众号的唯一标识
                // timestamp: data.timestamp, // 必填，生成签名的时间戳
                // nonceStr: data.noncestr, // 必填，生成签名的随机串
                // signature: data.signature,// 必填，签名，见附录1
                // jsApiList: [
                //     'previewImage','hideAllNonBaseMenuItem',
                //     'showMenuItems','onMenuShareTimeline','onMenuShareAppMessage',
                //     'chooseWXPay'
                // ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

            });
            wx.ready(() => {
                // this.wechatSetMenu()
            })
        }
    }
}
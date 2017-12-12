<template lang='pug'>
  .container
    .product
        .swiper(v-swiper='swiperConfig' v-if='product.images')
            .swiper-wrapper
                .swiper-slide(v-for='item in product.images')
                    img(:src='imageCDN+item')
            .swiper-pagination.swiper-pagination-bullets
        .content(v-if='product.price')
            span.main-price {{Number(product.price).toFixed(2)-Number(product.price).toFixed(2).substr(-3)}}
            span.other-price {{Number(product.price).toFixed(2).substr(-3)}}
        .name {{product.title}}
        .intro {{product.intro}}
        .info
            cell(v-for='(item,index) in product.parameters' :key='index' :title='item.key' :content='item.value')
        .attentions
            .title 购买提示
            ol
                li(v-for='item in attentions' ) {{item}}
    .footer
        span(@click='showInfo = true') 购买
    transition(name='slide-top')
        .focus-goods-pay(v-if='showInfo')
            .focus-goods-pay_header
                span 准备购买
                span(@click='showInfo = false') 取消
            .focus-goods-pay_body
                .focus-item
                    img(:src='imageCDN + product.images[0]')
                    div 
                        p {{product.title}}
                        p 价格 ¥{{product.price}}
                .focus-item
                    span 收件人
                    input(v-model.trim='info.name' placeholder='你的名字')
                .focus-item
                    span 电话
                    input(v-model.trim='info.phoneNumber' placeholder='你的电话' type='tel')
                .focus-item
                span 地址
                input(v-model.trim='info.address' placeholder='收货地址是？' type='tel')
            .focus-goods-pay_footer(@lick='handPayment') 确认支付
    transition(name='fade')
        span.modal(v-if='modal.visible') {{modal.content}}
</template>
<script>
import {mapState} from 'vuex'
import cell from '../../components/cell.vue'
import wechat from '../../static/mixins/wechat.js'
function toggleModal(obj, content){
    clearTimeout(obj.timer)
    obj.visible = true
    obj.content = content
    obj.timer = setTimeout(() => {
        obj.visible = false
    },1500)
}
export default {
    middleware: 'wechat-auth',
    head(){
      return {
          title: '购买页面'
      }
  },
   components: {cell},
    data(){
      return {
          swiperConfig: {
              autoplay: 4000,
              direction: 'horizontal',
              loop: true,
              pagination: '.swiper-pagination'
          },
          attentions: ['商品和服务的差异','清关服务','物流服务','需要更多帮助，请联系管理员'],
          showInfo: false,
          info: {
              name: '',
              phoneNumber: '',
              address: ''
          },
          modal: {
              visible: false,
              content: '成功',
              timer: null
          }
      }
  },
  
  computed: {
      ...mapState({product:'currentProduct',imageCDN:'imageCDN'})
  },
  methods: {
      async handPayment(){
        let that = this
        let {name,phoneNumber,address} = this.info
        if(!name || !phoneNumber|| !address){
            toggleModal(this.modal,'收货信息忘填了~~')
            return
        }
        let res = await this.$store.dispatch('createOrder',{
            productId: this.product._id,
            name: name, 
            address: address,
            phoneNumber: phoneNumber
        })
        let data = res.data
        if(!data || !data.success){
            toggleModal(this.modal, '服务器异常，请等待后重新尝试')
            return
        }
        window.wx.chooseWXPay({
            timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: data.paySign, // 支付签名
            success: (response) => {
                try {
                    window.WeixinJSBridge.log(response.err_msg)
                }catch (e) {
                    console.error(e)
                }
                if(response.err_msg === 'get_brand_wcpay_request'){
                    toggleModal(that.modal,'支付成功')
                }
                // 支付成功后的回调函数

            }
        })
      }
  },
  mixins: [wechat],
  async beforeMount(){   
      let id = this.$route.query.id 
      this.$store.dispatch('showProduct', id)
      let url = window.location.url
      await this.wechatInit(url)
  },
  
  
}
</script>

<style scoped lang='sass' src='../../static/sass/deal.sass'>

</style>

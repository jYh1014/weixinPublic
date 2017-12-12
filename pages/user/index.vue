<template lang='pug'>
  .container
    .user(v-if='user')
        .user-header
            .text {{user.nickname}}
            img(:src='user.avatarUrl')
        .user-address
            cell(title='收货地址')
            .user-content {{user.address}}
        .user-phone
            cell(title='电话')   
            .user-content {{user.phoneNumber}}    
        .user-name
            cell(title='') 
            .user-content {{user.name}}
        .user-order
            cell(title='我的订单')
            .items(v-for='(item,index) in user.orders' :key='index')
                img(:src='item.image')
                .intro
                    .title {{item.title}}
                    .content {{item.intro}}
                .price
                    span ¥{{item.price}}
</template>
<script>
import {mapState} from 'vuex'
import cell from '../../components/cell'
export default {
  head(){
      return {
          title: '个人账户'
      }
  },
  components:{
      cell
  },
  data(){
      return {
          user: {
              name: '陈宝宝',
              nickname: '皮皮猪',
              address: '北京市',
              phoneNumber: '12324'

          }
      }
  },
  computed: {
      ...mapState(
          ['user']
      )
  },
  methods: {
      
  },
  beforeCreate(){
      
      this.$store.dispatch('fetchUserAndOrders')
  }
}
</script>

<style scoped lang='sass' src='../../static/sass/user.sass'>

</style>

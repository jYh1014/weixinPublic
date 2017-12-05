<template lang='pug'>
  .container
    .house-media
        img(v-if='house.cname' :src='house.cname')
        .desc
            .words {{house.words}}
            .name {{house.name}}
    .house-body
        .title {{house.cname}}
        .body {{house.intro}}
        .title 主要角色
        .body(v-for='(item ,index) in house.swornMembers' :key='index')
            .members(v-if='item.character')
             img(:src='item.character.profile' @click='showCharacter(item)')
             .desc
                .cname {{item.character.cname}}
                .intro {{item.text}}
    .house-history(v-for='(item,index) in house.sections' :key='index')
        .title {{item.title}}
        .content(v-for='(text,textIndex) in item.content' :key='textIndex') {{text}}
</template>
<script>
import {mapState} from 'vuex'
export default {
  head(){
      return {
          title: '家族详情'
      }
  },
  computed: {
      ...mapState({
          house: 'currentHouse'
      })
  },
  beforeCreate(){
      let id = this.$route.query.id
      this.$store.dispatch('showHouse',id)
  },
  methods: {
      showCharacter(item){
          console.log(item)
          this.$router.push({
            path: '/character',
            query: {id: item.character._id}
            })
      }
  }
}
</script>

<style scoped lang='sass' src='../../static/sass/house.sass'>

</style>

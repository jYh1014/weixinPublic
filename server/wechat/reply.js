const tip = "我是皮皮猪 "
export default async (ctx,next) => {
   
    const message = ctx.weixin
    // console.log(message)
    ctx.body = tip
}
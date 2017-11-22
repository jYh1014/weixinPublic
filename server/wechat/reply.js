const tip = "我是皮皮猪 "
export default async (ctx,next) => {
   
    const message = ctx.weixin
    console.log(message)
    if(message.MsgType === 'event'){
        if(message.Event === 'subscribe'){
            ctx.body = tip
        }else if(message.Event === 'unsubscribe'){
            console.log('已取关')
        }else if(message.Event === 'LOCATION'){
            ctx.body = message.Latitude + ':' + message.Longitude
        }
    }
    else if(message.MsgType === 'text'){
        ctx.body = message.Content
    }else if(message.MsgType === 'image'){
        ctx.body = {
            type: 'image',
            mediaId: message.MediaId
        }
    }else if(message.MsgType === 'voice'){
        ctx.body = {
            type: 'voice',
            mediaId: message.MediaId
        }
    }else if(message.MsgType === 'video'){
        ctx.body = {
            type: 'video',
            title: message.ThumbMediaId,
            mediaId: message.MediaId
        }
    }else if(message.MsgType === 'location'){
        ctx.body = message.Location_X + ':' + message.Location_Y + message.Label
    }else if(message.MsgType === 'link'){
        ctx.body = [{
            type:'link',
            title:message.Title,
            description:message.Description,
            picUrl:'http://mmbiz.qpic.cn/mmbiz_jpg/JLyiaIHgfCwrxO7SpIhVaXVu9jd6yIOvelEmsBuyBYmVcWM4pt7FaVhfnkP2TdKl7B44hF9h07ZkdFibu9ibv0xnw/0',
            url:message.Url
        }]
    }
    
}
import cheerio from 'cheerio'//用于jq核心实现
import rp from 'request-promise'
import R from 'ramda'
import { writeFileSync } from 'fs'
export const getIMDBChatacters = async () => {
    const options = {
        uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
        transform: body => cheerio.load(body)
    }
    let $ = await rp(options)
    let photos = []
    $('table.cast_list tr.odd, tr.even').each(function() {
        let playedBy = $(this).find('td.itemprop span.itemprop')
        playedBy = playedBy.text()
    
        let nmId = $(this).find('td.itemprop a')
        nmId = nmId.attr('href')
    
        let character = $(this).find('td.character a')
    
        let name = character.text()
        let chId = character.attr('href')
        photos.push({
            nmId,chId,name,playedBy
        })
    }) 
    console.log('拿到' + photos.length)
    let fn = R.compose(
        R.map((photo) => {
            const reg1 = /\/name\/(.*?)\/\?ref/
            const reg2 = /\/title\/(.*?)\?ref/
            let match1 = photo.nmId.match(reg1)
            let match2 = photo.chId.match(reg2)
            console.log(match1)
            photo.nmId = match1[1]
            photo.chId = match2[1]
            return photo
        }),
        R.filter(photo => photo.playedBy && photo.name && photo.chId && photo.nmId && photo.chId !== '#' && photo.nmId !== '#')
    )
    photos = fn(photos)
    console.log('筛选后剩余' + photos.length)
    writeFileSync('./imdb.json',JSON.stringify(photos,null,2),'utf8')
}
getIMDBChatacters()
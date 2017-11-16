import mongoose from 'mongoose'
import config from 'config'

export const database = app => {
    mongoose.set('debug',true)
    mongoose.connect(config.db)
    mongoose.connection.on('disconnect',() => {
        mongoose.connect(config.db)
    })
    mongoose.connection.on('err',(err) => {
        console.log(err)
    })
    mongoose.connection.on('open',() => {
        console.log('connetion db')
    })

}
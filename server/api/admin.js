import User from '../database/schema/user'

export async function login(email,password){
    let user
    let match = false
    user = await User.findOne({email: email}).exec()
    if(user){
        match = await user.comparePassword(password,user.password)                
    }
    return {user,match}
}
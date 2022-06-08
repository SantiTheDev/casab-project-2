const jwt = require('jsonwebtoken')


const getToken = (payload, time) => {
    return jwt.sign({
        data: payload
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: time})
}

const getDataToken = (token) => {
    let data = null
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode)=>{
        if(err){
            console.log('error al obtener data')
            console.log(err)
        }else{
            data = decode
        }
    })
    return data;
}

module.exports = {
    getToken,
    getDataToken
}
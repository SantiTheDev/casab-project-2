const User = require('../models/User')
const Roles = require('../models/Roles')
const tokenCont = require('../controllers/token.controller')


const isAdmin = async(req, res, next) => {
    const token = req.params.token || req.body.token
    const {data} = tokenCont.getDataToken(token)
    console.log(data)
    const rol = await Roles.findOne({_id: data.rol})
    console.log(rol)
    if(!data){

        return res.status(500).json({'error': 'Something goes wrong'})
    }

    if(data.rol === rol._id.toString()){
        next() //
    }else{
        
        return res.status(400).json({'error':"Something goes wrong"})
    }
}
const getUserToAdmin = async(req, res) => {
    const { token } = req.params
    const { data } = tokenCont.getDataToken(token)
    const users = await User.find()
    if(!data){
        
        return res.status(400).json({'error':"Something goes wrong"})
    }
    const rol = await Roles.findOne({ _id: data.rol})
    console.log(rol)
    if(!rol){
        
        return res.status(400).json({'error':"Something goes wrong"})
    }
    if(rol.role !== 'Administrador'){
        
        return res.status(400).json({'error':"Something goes wrong"})
    }else{
        return await res.json(users)
    }
}
const changeActive = async(req, res) => {
    const { token } = req.params
    const { userId, Active} = req.body

    const { data } = tokenCont.getDataToken(token)
    const user = await User.findOne({_id: userId})

    if(!data){
        
        return res.status(400).json({'error':"Something goes wrong"})
    }
    const rol = await Roles.findOne({ _id: data.rol})
    console.log(rol)
    if(!rol){
        
        return res.status(400).json({'error':"Something goes wrong"})
    }
    if(rol.role !== 'Administrador'){
        
        return res.status(400).json({'error':"Something goes wrong"})
    }else{
        user.isActive = Active
        await user.save()
            .then(data => {
                console.log("Aqui se rompe")
                return res.json({'success':'All be good'})
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({'error':'Something goes wrong'})})
        
    }
}

const changeRol = async(req, res) => {
    const { token } = req.params
    const { userId, role} = req.body
    const { data } = tokenCont.getDataToken(token)
    const user = await User.findOne({_id: userId})
    if(!data){
        
        return res.status(400).json({'error':"Something goes wrong"})
    }
    const rol = await Roles.findOne({ _id: data.rol})
    console.log(rol)
    if(!rol){
        
        return res.status(400).json({'error':"Something goes wrong"})
    }
    if(rol.role !== 'Administrador'){
        
        return res.status(400).json({'error':"Something goes wrong"})
    }else{
        user.role = role
        await user.save()
            .then(data => {return res.status(200).json({'success':'All be goo'})})
            .catch(err => {return res.status(500).json({'error':"Somethin goes wrong"})})
    }
}
module.exports = {
    getUserToAdmin,
    isAdmin,
    changeRol,
    changeActive
}
const Roles = require('../models/Roles')
const User = require('../models/User')

// Retornar Roles 
const getRoles = async(req, res) => {
    const roles = await Roles.find()

    return res.json(roles)
}

const addRoles = async(req, res) => {
    const {rol} = req.body
    const newRol = new Roles({role: rol})

    await newRol.save()
        .then(data => {
            console.log("Todo Salio Bien")
            return res.json({"msg": "El proceso va bien"})
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({"error": "Something goes wrong D:"})
        })
}
const deleteRoles = async(req, res) => {
    const {rolId} = req.body
    await Roles.findOneAndDelete({_id: rolId})
        .then(data => {
            return res.status(200).json({'msg':'success'})
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({'error':'Something goes wrong'})
        })
}
const getRol = async(req, res)=>{
    const {rol} =req.params
    const role = await Roles.findOne({_id: rol})
        .then(data => {return data})
        .catch(error => {return error})
    return res.json(role)
}
module.exports = {
    getRoles, addRoles, deleteRoles, getRol
}
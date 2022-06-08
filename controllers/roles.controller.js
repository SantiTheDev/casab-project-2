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
        .then(res => {
            console.log("Todo Salio Bien")
            return res.json({"msg": "El proceso va bien"})
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({"msg": "Something goes wrong D:"})
        })
}

module.exports = {
    getRoles, addRoles
}
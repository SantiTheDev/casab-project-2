const { addRoles, getRoles, deleteRoles, getRol } = require('../controllers/roles.controller')
const { isAdmin } =require('../controllers/admin.controller')
const { route } = require('./auth')
const router = require('express').Router()


router.get('/getroles/:token', isAdmin,getRoles)
router.get('/getrol/:rol', getRol)
router.post('/add/:token', isAdmin,addRoles)
router.delete('/delete/:token',isAdmin, deleteRoles)
module.exports = router

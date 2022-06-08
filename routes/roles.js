const { addRoles, getRoles, deleteRoles } = require('../controllers/roles.controller')
const { isAdmin } =require('../controllers/admin.controller')
const router = require('express').Router()


router.get('/getroles/:token', isAdmin,getRoles)
router.post('/add/:token', isAdmin,addRoles)
router.delete('/delete/:token',isAdmin, deleteRoles)
module.exports = router

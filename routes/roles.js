const { addRoles, getRoles, deleteRoles } = require('../controllers/roles.controller')
const { isAdmin } =require('../controllers/admin.controller')
const router = require('express').Router()


router.get('/getroles', getRoles)
router.post('/add', addRoles)
router.delete('/delete', deleteRoles)
module.exports = router

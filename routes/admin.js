const { getUserToAdmin, isAdmin, changeRol, changeActive } = require('../controllers/admin.controller')

const router = require('express').Router()


router.get('/get-users/:token', isAdmin, getUserToAdmin)
router.post('/new-rol/:token', isAdmin, changeRol)
router.post('/new-state/:token', isAdmin, changeActive)



module.exports = router 

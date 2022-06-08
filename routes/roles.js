const { addRoles, getRoles } = require('../controllers/roles.controller')

const router = require('express').Router()


router.get('/getroles', getRoles)
router.post('/add', addRoles)

module.exports = router

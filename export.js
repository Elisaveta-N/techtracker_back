const {seedAsset} = require('./seed/seedAsset')
const {seedDepartment} = require('./seed/seedDepartment')
const {seedEmployee} = require('./seed/seedEmployee')


seedAsset(2)
seedDepartment()
seedEmployee()




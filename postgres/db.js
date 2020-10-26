import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require('./config.json')[env]
const db = {}

const sequelize = new Sequelize(config.database, config.username, config.password, config)

// fs.readdirSync(path.join(__dirname, 'models/'))
// .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
// .forEach(file => {
//     const model = require(path.join(__dirname, 'models/', file)).default(sequelize, Sequelize)
//     db[model.name] = model
// })

// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) db[modelName].associate(db)
// })

export {sequelize}
export default db
import Sequelize from 'sequelize'

const env = process.env.NODE_ENV || 'development'
const config = require('../config.json')[env]

const sequelize = new Sequelize(config.database, config.username, config.password, {host: config.host, port: config.port, dialect: config.dialect})

const models = {
    Property: require('./property').default(sequelize, Sequelize)
}

models.Sequelize = Sequelize
models.sequelize = sequelize

export default models
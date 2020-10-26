
export default (sequelize, DataTypes) => {
  const Property = sequelize.define('property', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    address: DataTypes.STRING,
    pricing: DataTypes.STRING
  })

  return Property
}
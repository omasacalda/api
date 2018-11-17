module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('city', {
    id: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(),
      allowNull: true,
      unique: false,
      primaryKey: false,
    },
    slug: {
      type: DataTypes.STRING(),
      allowNull: true,
      unique: false,
      primaryKey: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN(),
      defaultValue: 0
    }
  }, {
    tableName: 'city',
    timestamps: false,
    underscored: true,
  });

  return City;
};

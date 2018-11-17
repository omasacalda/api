module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('booking', {
    id: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
    },
    type: {
      type: DataTypes.STRING(),
      allowNull: false,
      unique: false,
      primaryKey: false,

    },
    person_count: {
      type: DataTypes.INTEGER(),
      allowNull: true,
      unique: false,
      primaryKey: false,
    },
    token: {
      type: DataTypes.STRING()
    },
    inserted_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }
  }, {
    tableName: 'booking',
    timestamps: false,
    underscored: true,
  });
  Booking.associate = (models) => {

    Booking.belongsTo(models.city, {as: 'city'});
    Booking.belongsTo(models.user, {as: 'user'});
  }
  return Booking;
};

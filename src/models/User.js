module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(),
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(),
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('default', 'admin'),
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN(),
      defaultValue: 0
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
    tableName: 'user',
    timestamps: false,
    underscored: true,
  });

  User.prototype.toJSON = function () {
    let data = Object.assign({}, this.get());
    delete data.password
    delete data.salt
    return data
  };

  return User;
};

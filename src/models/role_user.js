module.exports = (sequelize, type) => {
  return sequelize.define('role_user', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    roleId: {
      type: type.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
      },
      allowNull: false,
    },
    userId: {
      type: type.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
  });
};

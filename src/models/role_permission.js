module.exports = (sequelize, type) => {
  return sequelize.define('role_permission', {
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
    permissionId: {
      type: type.INTEGER,
      references: {
        model: 'permissions',
        key: 'id',
      },
      allowNull: false,
    },
  });
};

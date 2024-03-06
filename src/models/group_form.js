module.exports = (sequelize, type) => {
    return sequelize.define('group_form', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      isDeleted: {
        type: type.BOOLEAN,
        defaultValue: false,
      },
      formId: {
        type: type.INTEGER,
        references: {
          model: 'forms',
          key: 'id',
        },
        allowNull: false,
      },
      groupId: {
        type: type.INTEGER,
        references: {
          model: 'groups',
          key: 'id',
        },
        allowNull: false,
      },
    });
  };
  
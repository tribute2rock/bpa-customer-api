module.exports = (sequelize, type) => {
  return sequelize.define('print_temp_form', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    printTempId: {
      type: type.INTEGER,
      allowNull: true,
      references: {
        model: 'print_temps',
        key: 'id',
      },
    },
    formId: {
      type: type.INTEGER,
      allowNull: true,
      references: {
        model: 'forms',
        key: 'id',
      },
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
  });
};

module.exports = (sequelize, type) => {
  return sequelize.define('print_temp', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    customerAccess: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    type: {
      type: type.STRING,
      allowNull: true,
    },
    fields: {
      type: type.TEXT,
      allowNull: false,
    },
    output: {
      type: type.ENUM({
        values: ['PDF', 'TXT'],
      }),
      defaultValue: 'PDF',
    },
  });
};

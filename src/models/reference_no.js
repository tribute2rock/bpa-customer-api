module.exports = (sequelize, type) => {
    return sequelize.define('referenceNumber', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      isDeleted: {
        type: type.BOOLEAN,
        defaultValue: false,
      },
      unique_number: {
        type: type.STRING,
        allowNull: false,
      },
      reference_Key: {
        type: type.STRING,
        allowNull: true,
      },
      reference_Number: {
        type: type.STRING,
        unique: true ,
        allowNull: false,
      },
    });
  };
  
module.exports = (sequelize, type) => {
  return sequelize.define('branch', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    sol: {
      type: type.STRING,
      allowNull: false,
    },
    lc_decentralized: {
      type: type.BOOLEAN,
      default: false,
    },
    bg_decentralized: {
      type: type.BOOLEAN,
      default: false,
    },
    bg_type: {
      type: type.ENUM({
        values: ['Bid Bond', 'Performance Bond', 'Custom Guarantee', 'Advance Payment', 'Supply Credit Guarantee', 'Line of Credit Commitment', 'Other Guarantee'],
      }),
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
  });
};

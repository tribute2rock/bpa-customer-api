module.exports = (sequelize, type) => {
  return sequelize.define('form', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isActive: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    limitType: {
      type: type.INTEGER,
      allowNull: false,
    },
    limitValues: {
      type: type.INTEGER,
      allowNull: true,
    },
    formFees: {
      type: type.STRING,
      allowNull: true,
    },
    TACtype: {
      type: type.ENUM({
        values: ['url', 'editor'],
      }),
    },
    TAC: {
      type: type.TEXT,
      allowNull: true,
    },
    requireReAuth: {
      type: type.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    type: {
      type: type.ENUM({
        values: ['dynamic', 'html'],
      }),
      defaultValue: 'dynamic',
    },
    workflowId: {
      type: type.INTEGER,
      references: {
        model: 'workflows',
        key: 'id',
      },
      allowNull: false,
    },
    categoryId: {
      type: type.INTEGER,
      references: {
        model: 'categories',
        key: 'id',
      },
      allowNull: false,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    description: {
      type: type.TEXT,
      allowNull: true,
    },
    tag: {
      type: type.STRING,
    },
    formData: {
      type: type.TEXT,
      allowNull: false,
    },
    css: {
      type: type.TEXT,
    },
    javascript: {
      type: type.TEXT,
    },
    availableFor: {
      type: type.ENUM({
        values: ['internal', 'customer', 'both'],
      }),
    },
    ccmsUrl: {
      type: type.STRING,
      allowNull: true,
    },
    isChainflow: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    testEnabled: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    formCategory: {
      type: type.STRING,
    },
    flowCount: {
      type: type.INTEGER,
      defaultValue: 1,
    },
    enablePreview: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    enableBranchSeperation: {
      type: type.STRING,
      defaultValue: 'Yes',
    },
    enableFormEdit: {
      type: type.STRING,
      defaultValue: 'Yes',
    },
    enableReSubmit: {
      type: type.STRING,
      defaultValue: 'Yes',
    },
  });
};

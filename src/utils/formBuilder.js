const { Form } = require('../models');


const getForm = async (formId) => {
  return Form.findOne({
    where: {
      isDeleted: false,
      id: formId
    },
  });
}

const getValidationRules = async (formId) => {
  const form = await getForm(formId);
  if(form) {
    const formData = JSON.parse(form.formData);
    const validationRules = {}
    formData.map(item => {
      validationRules[item.field_name] = item.validationRules ? item.validationRules : [];
    })
    return validationRules;
  }
  return null;
}

const getLabels = async (formId) => {
  const form = await getForm(formId);
  if(form) {
    const formData = JSON.parse(form.formData);
    const labels = {}
    formData.map(item => {
      labels[item.field_name] = item.label ? item.label.trim() : item.field_name;
    })
    return labels;
  }
  return null;
}

module.exports = {
  getValidationRules,
  getLabels
}

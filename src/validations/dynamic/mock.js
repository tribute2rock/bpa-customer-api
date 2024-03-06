const appliedRules = [
  {
    "key": "2F2C0097-D172-43F0-961C-237F65452F6F",
    "rule": "required"
  },
  {
    "rule": "email",
    "key": "CAAC07C4-5A7F-4167-9740-097973D0721B"
  },
  {
    "rule": "account_number",
    "key": "2DEF07FB-F534-49FE-B59D-1EA45BACCA3B"
  },
  {
    "rule": "min",
    "key": "F47045AD-94C4-4C9F-811A-512FEFEDCED8",
    "constraint": "1"
  },
  {
    "rule": "max",
    "key": "C0624ADF-ECF1-4FC3-84CE-CEE34BCC5B12",
    "constraint": "100"
  },
  {
    "rule": "in",
    "key": "56AF0436-1931-46F3-9A9D-E4D6ECF77733",
    "constraint": "item1,item2"
  }
];

const formValues = {
  message: {
    value: null,
    rules: [
      {
        "key": "2F2C0097-D172-43F0-961C-237F65452F6F",
        "rule": "required"
      },
    ]
  },
  email: {
    value: "shekhar@gmail.com",
    rules: [
      {
        "key": "2F2C0097-D172-43F0-961C-237F65452F6F",
        "rule": "required"
      },
      {
        "rule": "email",
        "key": "CAAC07C4-5A7F-4167-9740-097973D0721B"
      },
    ]
  },
  numo: {
    value: 30,
    rules: [
      {
        "key": "2F2C0097-D172-43F0-961C-237F65452F6F",
        "rule": "required"
      },
      {
        "rule": "min",
        "key": "F47045AD-94C4-4C9F-811A-512FEFEDCED8",
        "constraint": "1"
      },
      {
        "rule": "max",
        "key": "C0624ADF-ECF1-4FC3-84CE-CEE34BCC5B12",
        "constraint": "100"
      },
    ]
  },
  options: {
    value: "something",
    rules: [
      {
        "key": "2F2C0097-D172-43F0-961C-237F65452F6F",
        "rule": "required"
      },
      {
        "rule": "in",
        "key": "56AF0436-1931-46F3-9A9D-E4D6ECF77733",
        "constraint": "item1,item2"
      }
    ]
  }
};

module.exports = {
  formValues,
}

const customers = [
  {
    SALUTATION:'',
    CUSTOMER_NAME: 'JAJWALYA JOSHI',
    ACCOUNT_NUMBER: '0123456789',
    MOBILE_NUMBER: '9818105053',
    EMAIL: 'test@generaltechnology.com.np',
  },
  {
    SALUTATION:'',
    CUSTOMER_NAME: 'RAMESH THAPALIYA',
    ACCOUNT_NUMBER: '0123456789',
    MOBILE_NUMBER: '9841655288',
    EMAIL: 'test@generaltechnology.com.np',
  },
  {
    SALUTATION:'',
    CUSTOMER_NAME: 'DIVYA TARA SHAKYA',
    ACCOUNT_NUMBER: '0123456789',
    MOBILE_NUMBER: '9880199302',
    EMAIL: 'test@generaltechnology.com.np',
  },
  {
    SALUTATION:'',
    CUSTOMER_NAME: 'KAPIL LAMSAL',
    ACCOUNT_NUMBER: '0123456789',
    MOBILE_NUMBER: '9840069799',
    EMAIL: 'test@generaltechnology.com.np',
  },
  {
    CUSTOMER_NAME: 'SAURAV LAMSAL',
    ACCOUNT_NUMBER: '0123456789',
    MOBILE_NUMBER: '9860423425',
    EMAIL: 'test@generaltechnology.com.np',
  },
  {
    CUSTOMER_NAME: 'RAM NEPALI',
    ACCOUNT_NUMBER: '1111111111',
    MOBILE_NUMBER: '9999999999',
    EMAIL: 'test@generaltechnology.com.np',
  },
];

const fees = [
  { profile_id: '2', name: 'Credit card', type: 'New', fee: '500' },
  { profile_id: '2', name: 'Credit card', type: 'renew', fee: '500' },
  { profile_id: '2', name: 'Credit card', type: 'replace', fee: '500' },
  { profile_id: '2', name: 'Credit card', type: 'repin', fee: '150' },
  { profile_id: '2', name: 'Credit card', type: 'supplementary', fee: '750' },
];

//Global-Bank Response data
const chargeProfile = {
  code: 0,
  message: 'Charge profile found.',
  data: [
    {
      id: 1,
      name: 'Charge Profile A',
    },
    {
      id: 2,
      name: 'Charge Profile B',
    },
  ],
};

const branchList = {
  code: 0,
  message: 'Branches found.',
  data: [
    {
      name: 'Branch Name',
      code: 'Branch Code',
    },
    {
      name: 'Branch Name',
      code: 'Branch Code',
    },
  ],
};

const productType = {
  code: 0,
  message: 'Product Type Found.',
  data: [
    {
      description: 'Test Cards',
      code: 'xxx',
    },
    {
      description: 'This is a product type.',
      code: 'xxx',
    },
    {
      description: 'This is another product type.',
      code: 'xxx',
    },
  ],
};

const customerDetail = {
  code: 0,
  message: 'Customer Found',
  data: {
    debit: {
      customerName: 'SAMPLE TEST',
      mobileNumber: '97798XXXXXXXX',
      debitAccountNumber: 'XXXXXXXXXXXXXXXX',
      cards: [
        {
          cardType: 'Supplementary Card',
          cardHolderName: 'SAMPLE TEST',
          cardNumber: '123XXXX789',
          status: 'Card Blocked',
          blockType: 'LOST',
        },
      ],
      requestedCards: [
        {
          customerName: 'SAMPLE TEST',
          mobileNumber: '97798XXXXXXXX',
          debitAccountNumber: 'XXXXXXXXXXXXXXXX',
          cardRemarks: 'replace',
          cardType: 'Supplementary Card',
          cardIssuance: 'Personalized',
          status: 'Requested',
          requestId: '{{uuid}}',
          requestedAt: '2021-09-21',
        },
      ],
    },
  },
};

module.exports = {
  customers,
  fees,
  chargeProfile,
  branchList,
  productType,
  customerDetail,
};

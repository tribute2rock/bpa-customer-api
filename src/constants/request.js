const actions = {
  Forward: 1,
  Return: 2,
  Approve: 3,
  Pick: 4,
  Refer: 5,
  Reassign: 6,
  SubForm: 7,
  Close: 8,
  RollBack: 9,
  Verification: 10,
  Comment: 11,
};

const status = {
  pending: 1,
  processing: 2,
  returned: 3,
  completed: 4,
  drafts: 5,
  closed: 6,
};

module.exports = {
  actions,
  status
};

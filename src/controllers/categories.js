const { Category } = require('../models');
const { HTTP, Status } = require('../constants/response');
const db = require('../config/database');

/**
 * Get all the top level categories available.
 */
const getAllCategories = async (req, res) => {
  Category.findAll({
    where: { isDeleted: false, isActive: true, parentId: null, otherServices: true },
  })
    .then((categories) => {
      res.status(HTTP.StatusOk).json({
        status: Status.Success,
        message: '',
        data: categories,
      });
    })
    .catch((err) => {
      res.status(HTTP.StatusInternalServerError).json({
        status: Status.Failed,
        message: 'Failed to fetch categories.',
        data: '',
      });
    });
};

const categoryForms = async (req, res) => {
  const categories = await db.query(
    `select distinct categories.* from categories join forms on forms.categoryId = categories.id where forms.availableFor in ('Both','Customer') and categories.isDeleted='false';`
  );
  res.status(HTTP.StatusOk).json({
    status: Status.Success,
    message: '',
    data: categories[0],
  });
};

/**
 * Gets all the sub categories of the provided category.
 */
const getSubCategories = async (req, res) => {
  let id = req.params.id;
  let category;
  let subCategories;

  // Fetch the specific category for parent.
  try {
    category = await Category.findOne({
      where: {
        id: req.params.id,
        isDeleted: false,
      },
    });
  } catch (e) {
    res.status(HTTP.StatusInternalServerError).json({
      status: Status.Failed,
      message: 'Failed to fetch category.',
      data: null,
    });
  }

  // if no category return 404
  if (category === null) {
    res.status(HTTP.StatusNotFound).json({
      status: Status.Failed,
      message: 'No category was found.',
      data: null,
    });
  }

  // get the sub categories of the parent category
  try {
    subCategories = await Category.findAll({
      where: {
        parentId: id,
        isDeleted: false,
      },
    });
  } catch (e) {
    res.status(HTTP.StatusInternalServerError).json({
      status: Status.Failed,
      message: 'Failed to fetch sub categories.',
      data: null,
    });
  }

  res.status(HTTP.StatusOk).json({
    status: Status.Success,
    message: 'Fetched category.',
    data: {
      parent: category,
      subCategories: subCategories,
    },
  });
};

module.exports = {
  getAllCategories,
  getSubCategories,
  categoryForms,
};

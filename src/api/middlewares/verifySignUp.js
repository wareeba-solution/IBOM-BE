const db = require('../../models');
const ApiResponse = require('../../utils/apiResponse');

const User = db.User;
const Role = db.Role;
const Facility = db.Facility;

/**
 * Check if username or email is already in use
 */
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check username
    const userByUsername = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (userByUsername) {
      return ApiResponse.error(
        res,
        'Username is already in use',
        { username: 'Username is already in use' },
        409
      );
    }

    // Check email
    const userByEmail = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userByEmail) {
      return ApiResponse.error(
        res,
        'Email is already in use',
        { email: 'Email is already in use' },
        409
      );
    }

    next();
  } catch (error) {
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Check if role exists
 */
const checkRoleExists = async (req, res, next) => {
  try {
    if (!req.body.roleId) {
      return ApiResponse.error(
        res,
        'Role is required',
        { roleId: 'Role is required' },
        400
      );
    }

    const role = await Role.findByPk(req.body.roleId);

    if (!role) {
      return ApiResponse.error(
        res,
        'Role does not exist',
        { roleId: 'Role does not exist' },
        404
      );
    }

    next();
  } catch (error) {
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * Check if facility exists
 */
const checkFacilityExists = async (req, res, next) => {
  try {
    if (!req.body.facilityId) {
      return ApiResponse.error(
        res,
        'Facility is required',
        { facilityId: 'Facility is required' },
        400
      );
    }

    const facility = await Facility.findByPk(req.body.facilityId);

    if (!facility) {
      return ApiResponse.error(
        res,
        'Facility does not exist',
        { facilityId: 'Facility does not exist' },
        404
      );
    }

    next();
  } catch (error) {
    return ApiResponse.serverError(res, error.message);
  }
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRoleExists,
  checkFacilityExists,
};
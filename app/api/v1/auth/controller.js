const { signin } = require('../../../services/mongoose/auth');

const { StatusCodes } = require('http-status-codes');

const signinCms = async (req,res,next) => {
  try {
    const result = await signin(req);
    res.status(StatusCodes.CREATED).json({
      data: {token : result.token, role: result.role },
    })
  } catch (error) {
    next(error);
  }
};

module.exports = { signinCms };
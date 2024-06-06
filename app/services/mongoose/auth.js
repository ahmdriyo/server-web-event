const Users = require('../../api/v1/users/model');
const { BadRequestError, Unauthorized } = require('../../errors');
const { createJWT, createTokenUser } = require('../../utils')


const signin = async (req) => {
  const { email, password } = req.body;

  if(!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const result = await Users.findOne({ email: email});
  if(!result) {
    throw new Unauthorized ('Invalid Credentials');
  }

  const isPasswordCorrect = await result.comparePassword(password);
  if(!isPasswordCorrect) {
    throw new Unauthorized ('Invalid Credentials');
  }
  const token = createJWT({ payload : createTokenUser(result)});

  return {token, role : result.role};
};

module.exports = { signin };
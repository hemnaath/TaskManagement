// authController.js
const authController = {
  loginSuccess: (req, res) => {
    return res.status(200).json('login success');
  },
  loginFailure: (req, res) => {
    return res.status(500).json('Internal Server Error');
  },
  logout: (req, res) => {
    req.logout();
    return res.status(200).json('logout success');
  },
};
  
module.exports = authController;
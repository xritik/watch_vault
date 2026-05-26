// @desc    Verify vault password (for edit/delete protection)
// @route   POST /api/auth/verify
const verifyPassword = (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password required' });
  }
  if (password === process.env.VAULT_PASSWORD) {
    return res.json({ success: true, message: 'Access granted' });
  }
  return res.status(401).json({ success: false, message: 'Wrong password! Access denied.' });
};

module.exports = { verifyPassword };

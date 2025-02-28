import User from '../models/User.js';

const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
  
    if (user) res.json(user);
    else res.status(404).json({ message: "Cannot find User" });
  };
  
export default getUserById;
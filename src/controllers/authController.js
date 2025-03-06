import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, papers: [], });
    
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            papers: [],
            token: generateToken(user.id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    
    if (user && (await bcrypt.compare(password, user.password))) {
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email }, // ✅ Make sure "user" is sent
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

export { registerUser, loginUser };

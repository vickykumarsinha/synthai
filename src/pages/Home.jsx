import { FaBrain, FaPenFancy, FaCogs, FaHeadset } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa";

function Home() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section
        id="home"
        className="relative bg-gradient-to-r from-blue-400 via-white to-blue-400 text-gray-900 min-h-screen flex items-center justify-center px-6"
      >
        <div className="text-center max-w-2xl z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-blue-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Simplify Your Research Journey
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            AI-powered research paper creation, collaboration, and citation tools—all in one place.
          </motion.p>

          <motion.div
            className="flex justify-center space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <a
              href="/auth/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Login <FaArrowRight />
            </a>
            <a
              href="/auth/register"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-100 hover:scale-105 transition-all duration-300"
            >
              Register
            </a>
          </motion.div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-100/60 to-white/90 backdrop-blur-md"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 px-6 md:px-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div whileHover={{ scale: 1.05 }} className="text-center p-6 bg-gray-100 rounded-xl shadow">
            <FaPenFancy className="text-4xl text-blue-500 mb-4 mx-auto" />
            <h3 className="font-semibold text-xl mb-2">Smart Writing</h3>
            <p className="text-gray-600">Generate structured sections powered by AI with auto-suggestions.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="text-center p-6 bg-gray-100 rounded-xl shadow">
            <FaBrain className="text-4xl text-blue-500 mb-4 mx-auto" />
            <h3 className="font-semibold text-xl mb-2">AI Citations</h3>
            <p className="text-gray-600">Effortlessly add citations and references from global databases.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="text-center p-6 bg-gray-100 rounded-xl shadow">
            <FaCogs className="text-4xl text-blue-500 mb-4 mx-auto" />
            <h3 className="font-semibold text-xl mb-2">Version Control</h3>
            <p className="text-gray-600">Track changes and manage multiple drafts seamlessly.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="text-center p-6 bg-gray-100 rounded-xl shadow">
            <FaHeadset className="text-4xl text-blue-500 mb-4 mx-auto" />
            <h3 className="font-semibold text-xl mb-2">Dedicated Support</h3>
            <p className="text-gray-600">Reach out to us for personalized help whenever you need it.</p>
          </motion.div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="bg-gray-50 py-20 px-6 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Need Help?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Explore our comprehensive guides or contact us at <a href="mailto:support@synthai.com" className="text-blue-600 hover:underline">support@synthai.com</a>.
          </p>
          <a
            href="/help"
            className="bg-blue-500 px-6 py-3 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Visit Help Center
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;
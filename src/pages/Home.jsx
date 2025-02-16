function Home() {
  return (
    <div>
      {/* Home Section */}
      <section id="home" className="relative bg-gradient-to-r from-blue-700 to-indigo-900 text-white h-screen flex items-center justify-center">
        <div className="text-center px-6 md:px-12 max-w-2xl w-full">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Welcome to SynthAI
          </h1>
          <p className="text-lg mb-8">
            Craft your research paper seamlessly with our easy-to-use platform. From topic selection to final draft, we've got you covered.
          </p>
          <div className="mt-8">
            <a
              href="/login"
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transform transition duration-300 ease-in-out hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-opacity-40 bg-black"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="p-12 bg-white text-gray-900">
        <h2 className="text-4xl font-bold text-center mb-6">Features</h2>
        <p className="text-center max-w-2xl mx-auto">
          Our AI-driven platform helps you write research papers faster, with tools for citations, formatting, and structure.
        </p>
      </section>

      {/* Help Section */}
      <section id="help" className="p-12 bg-gray-100 text-gray-900">
        <h2 className="text-4xl font-bold text-center mb-6">Help</h2>
        <p className="text-center max-w-2xl mx-auto">
          Need assistance? Check out our guides or contact support for expert advice.
        </p>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="p-12 bg-blue-600 text-white">
        <h2 className="text-4xl font-bold text-center mb-6">Contact Us</h2>
        <p className="text-center max-w-2xl mx-auto">
          Reach out to us at support@synthai.com for any questions or feedback.
        </p>
      </section>
    </div>
  );
}

export default Home;

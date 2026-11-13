function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">ResolveAI</h1>

        <div className="flex gap-6">
          <button className="text-gray-700 hover:text-blue-600">
            Home
          </button>

          <button className="text-gray-700 hover:text-blue-600">
            Features
          </button>

          <button className="text-gray-700 hover:text-blue-600">
            About
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
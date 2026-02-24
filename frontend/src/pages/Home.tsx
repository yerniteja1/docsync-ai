function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">DocSync AI</h1>
        <p className="text-gray-400 mb-8">Upload documents. Ask questions. Get answers.</p>
        <a href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium">
          Get Started
        </a>
      </div>
    </div>
  )
}

export default Home
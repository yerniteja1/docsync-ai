function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-teal-400 mb-4">404</h1>
        <p className="text-slate-400">Page not found.</p>
        <a href="/" className="mt-6 inline-block text-teal-400 hover:text-teal-300 transition">Go home</a>
      </div>
    </div>
  )
}

export default NotFound

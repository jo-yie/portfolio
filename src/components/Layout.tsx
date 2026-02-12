import { Link } from "react-router-dom"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="flex justify-between items-center px-8 py-6">
        <Link to="/" className="text-lg font-semibold">
          Jo Yie
        </Link>
        <Link to="/projects" className="text-sm hover:underline">
          Projects
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-12">
        {children}
      </main>
    </div>
  )
}
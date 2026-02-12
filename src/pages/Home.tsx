import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">
        Hi, I'm Jo Yie. Test
      </h1>

      <p className="text-lg text-gray-600 leading-relaxed">
        Industrial designer and full-stack software engineer specialised in interaction design and user-centred development. Expertise in physical computing, digital interfaces, and socially-informed user research.
      </p>

      <Link
        to="/projects"
        className="inline-block mt-6 border border-black px-6 py-2 hover:bg-black hover:text-white transition"
      >
        View Projects
      </Link>
    </div>
  )
}
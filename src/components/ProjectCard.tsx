import { Link } from "react-router-dom"

type Props = {
  title: string
  slug: string
  excerpt: string
}

export default function ProjectCard({ title, slug, excerpt }: Props) {
  return (
    <Link
      to={`/projects/${slug}`}
      className="block border p-6 hover:border-black transition"
    >
      <h2 className="text-xl font-medium mb-2">{title}</h2>
      <p className="text-gray-600">{excerpt}</p>
    </Link>
  )
}

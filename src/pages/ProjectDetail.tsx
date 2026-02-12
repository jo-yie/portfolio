import { useParams } from "react-router-dom"
import { projects } from "../data/projects"

export default function ProjectDetail() {
  const { slug } = useParams()

  const project = projects.find((p) => p.slug === slug)

  if (!project) return <div>Project not found.</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{project.title}</h1>
      <p className="text-gray-700 leading-relaxed">
        {project.description}
      </p>
    </div>
  )
}

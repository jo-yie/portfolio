import { projects } from "../data/projects"
import ProjectCard from "../components/ProjectCard"

export default function Projects() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Projects</h1>

      <div className="space-y-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </div>
  )
}

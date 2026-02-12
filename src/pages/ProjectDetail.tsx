import { useParams } from "react-router-dom"
import { projects } from "../data/projects"

export default function ProjectDetail() {
  const { slug } = useParams()

  const project = projects.find((p) => p.slug === slug)

  if (!project) return <div>Project not found.</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{project.title}</h1>

      {/* Info Section */}
      <ul className="text-sm text-gray-500 space-y-1">
        {project.info?.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>

      {/* Content Blocks */}
      <div className="space-y-4 mt-4">
        {project.content?.map((block, i) => {
          if (block.type === "text") return <p key={i} className="text-gray-700">{block.value}</p>;
          if (block.type === "image") return <img key={i} src={block.src} className="rounded shadow" />;
          if (block.type === "video") return (
            <iframe
              key={i}
              className="w-full aspect-video"
              src={block.src}
              title={`${project.title} video ${i+1}`}
              allowFullScreen
            ></iframe>
          );
        })}
      </div>
    </div>

  )
}

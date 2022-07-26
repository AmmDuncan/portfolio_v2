import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { Container } from "../../common";
import { ProjectsRoot } from "./Projects.styles";
import { projects, sideProjects } from "../../../data/projects";
import { ProjectCardRoot } from "../../../components/home/Projects/Projects.styles";
import Tabs from "../Tabs/Tabs";

const projectTypes = {
  Projects: projects,
  "Side-Projects": sideProjects,
};

function Projects() {
  const [active, setActive] = React.useState("Projects");
  const [projectList, setProjectList] = React.useState(() => projectTypes[active]);

  React.useEffect(() => {
    setProjectList(projectTypes[active] || []);
  }, [active]);

  return (
    <ProjectsRoot>
      <Container>
        <h1>Projects</h1>
        <p>
          Here are some of the projects I&apos;ve worked on. A collection of both client and side
          projects.
        </p>
        <Tabs active={active} setActive={setActive} />
        <ProjectList projects={projectList} />
      </Container>
    </ProjectsRoot>
  );
}

function ProjectList({ projects }) {
  return (
    <div className="project-list">
      {projects.map(({ name, imgSrc: src, description, tools, link }) => (
        <ProjectCardRoot key={name} className="on-projects">
          <div className="image-root">
            <div className="image-container">
              <Image src={src} alt={name} layout="fill" />
            </div>
          </div>
          <div className="project-card__content">
            {!link && <div className="title">{name}</div>}
            {link && (
              <Link href={link}>
                <a className="title with-link" target="_blank" rel="noopener noreferrer">
                  {name}
                  <FiExternalLink />
                </a>
              </Link>
            )}
            <p className="description">{description}</p>
            <ul className="tools">
              {tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        </ProjectCardRoot>
      ))}
    </div>
  );
}

export default Projects;

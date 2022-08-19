import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { Container } from "../../common";
import { ProjectsRoot } from "./Projects.styles";
import { projects, sideProjects } from "../../../data/projects";
import { ProjectCardRoot } from "../../../components/home/Projects/Projects.styles";
import Tabs from "../Tabs/Tabs";
import { motion } from "framer-motion";

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
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", mass: 2, damping: 13 }}
        >
          Projects
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", mass: 1.5, delay: 0.15, damping: 15 }}
        >
          Here are some of the projects I&apos;ve worked on. A collection of both client and side
          projects.
        </motion.p>
        <Tabs active={active} setActive={setActive} />
        <ProjectList projects={projectList} />
      </Container>
    </ProjectsRoot>
  );
}

function ProjectList({ projects }) {
  return (
    <div className="project-list">
      {projects.map(({ name, imgSrc: src, description, tools, link }, index) => (
        <ProjectCardRoot
          key={name}
          className="on-projects"
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            type: "tween",
            mass: 1.5,
            damping: 15,
            delay: 0.2 + 0.1 * index,
          }}
        >
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
            <p className="tools-header">Tools used:</p>
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

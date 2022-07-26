import React from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiExternalLink } from "react-icons/fi";
import VanillaTilt from "vanilla-tilt";

import { Button, Container } from "../../common";
import { ProjectsRoot, ProjectsContainerRoot, ProjectCardRoot } from "./Projects.styles";
import { projects } from "../../../data/projects";
import ProjectCardDecor from "./icons/Decor";

function Projects() {
  const router = useRouter();

  function goToProjects() {
    router.push("/projects");
  }

  return (
    <ProjectsRoot>
      <Container>
        <h2>Projects</h2>
        <header className="header">
          <p>
            Here are some of the projects I&apos;ve worked on. A collection of both client and side
            projects.
          </p>
          <Button onClick={goToProjects}>
            View more
            <HiArrowRight />
          </Button>
        </header>
        <ProjectsContainer />
      </Container>
    </ProjectsRoot>
  );
}

function ProjectsContainer() {
  const first = projects[0];
  const highlightRef = React.createRef();

  React.useEffect(() => {
    VanillaTilt.init(highlightRef.current, {
      max: 20,
      speed: 1000,
      // reset: false,
      // scale: 1.03,
      perspective: 1500,
      gyroscope: true,
    });
    const node = highlightRef.current;

    return () => node && node.vanillaTilt.destroy();
  }, [highlightRef]);

  return (
    <ProjectsContainerRoot>
      <div className="project highlight">
        <div className="decor">
          <ProjectCardDecor />
        </div>
        <ProjectCard
          src={first.imgSrc}
          alt={first.name}
          title={first.name}
          link={first.link}
          highlight={true}
          ref={highlightRef}
        />
      </div>
      {projects.slice(1, 3).map(({ imgSrc: src, alt, name, link }) => (
        <ProjectCard src={src} alt={alt} title={name} link={link} key={name} />
      ))}
    </ProjectsContainerRoot>
  );
}

const ProjectCard = React.forwardRef(function ({ src, alt, title, highlight, link }, ref) {
  return (
    <ProjectCardRoot className={`project__card ${highlight ? "in-highlight" : ""}`}>
      <div className="image-root" ref={ref}>
        <div className="image-container">
          <Image src={src} alt={alt} layout="fill" />
        </div>
      </div>
      {!link && <div className="title">{title}</div>}
      {link && (
        <Link href={link}>
          <a className="title with-link" target="_blank" rel="noopener noreferrer">
            {title}
            <FiExternalLink />
          </a>
        </Link>
      )}
    </ProjectCardRoot>
  );
});
ProjectCard.displayName = "ProjectCard";

export default Projects;

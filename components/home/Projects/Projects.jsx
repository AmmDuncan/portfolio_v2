import React from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import VanillaTilt from "vanilla-tilt";

import { Button, Container } from "../../common";
import ProjectCardDecor from "./icons/Decor";
import {
  ProjectsRoot,
  ProjectsContainerRoot,
  ProjectCardRoot,
} from "./Projects.styles";

const projects = [
  { name: "Kwerty.io", imgSrc: "/assets/projects/kwerty.png" },
  { name: "HRMs by Enyata", imgSrc: "/assets/projects/hrms.png" },
  // { name: "Pomout", imgSrc: "/assets/projects/pomout.png" },
  { name: "Dev in Details", imgSrc: "/assets/projects/devindets.png" },
];

function Projects() {
  return (
    <ProjectsRoot>
      <Container>
        <h2>Projects</h2>
        <header className="header">
          <p>
            Here are some of the projects I&apos;ve worked on. A collection of
            both client and side projects.
          </p>
          <Button>
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

    return () =>
      node && node.vanillaTilt.destroy();
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
          highlight={true}
          ref={highlightRef}
        />
      </div>
      {projects.slice(1, 3).map(({ imgSrc: src, alt, name }) => (
        <ProjectCard src={src} alt={alt} title={name} key={name} />
      ))}
    </ProjectsContainerRoot>
  );
}

const ProjectCard = React.forwardRef(function (
  { src, alt, title, highlight },
  ref
) {
  return (
    <ProjectCardRoot
      className={`project__card ${highlight ? "in-highlight" : ""}`}
    >
      <div className="image-root" ref={ref}>
        <div className="image-container">
          <Image src={src} alt={alt} layout="fill" />
        </div>
      </div>
      <div className="title">{title}</div>
    </ProjectCardRoot>
  );
});
ProjectCard.displayName = "ProjectCard";

export default Projects;

import { projects } from "../../data/projects";

const work = projects.filter((p) => p.desk !== false);

export const SECTIONS = [
  { key: "work", label: "Work" },
  { key: "nda", label: "Under NDA" },
  { key: "guides", label: "Guides" },
  { key: "side", label: "Side projects" },
  { key: "contact", label: "Contact" },
];

export const HOVER_LABEL = {
  work: "See my work",
  nda: "Work under NDA",
  guides: "Read the guide",
  side: "See side projects",
  contact: "Get in touch",
};

export const SCREEN_COPY = {
  work: {
    path: "~/work",
    label: "01 · Work",
    title: "Products I've built",
    intro: "For clients and for myself, from security platforms to stores for social sellers in Ghana.",
    items: work,
  },
};

export const NDA_COPY = {
  label: "02 · Under NDA",
  title: "6 platforms under NDA",
  intro: "Client work, 2023-2026. I can't name the clients or show the screens.",
  stack: ["Nuxt", "Vue", "TypeScript", "TanStack Query", "Tailwind CSS"],
};

export const MODEL_CREDIT = {
  title: "Playstation 5 Dualsense",
  author: "AHarmlessPotato",
  source: "https://sketchfab.com/3d-models/playstation-5-dualsense-878c1f882808477ab81c2fe86d5a3936",
  license: "https://creativecommons.org/licenses/by/4.0/",
};

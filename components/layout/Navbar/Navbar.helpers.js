import { BLOG_URL } from "../../../data/site";

const navlist = [
  { to: "/", display: "Home" },
  { to: "/projects", display: "Projects" },
  { to: "/about", display: "About Me" },
  { to: BLOG_URL, display: "Blog", external: true },
  // { to: "https://v1.ammielyawson.com/", display: "V-one", external: true },
];

export { navlist };

import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState, useEffect, Children } from "react";

const ActiveLink = ({
                      children,
                      activeClassName,
                      ...props
                    }) => {
  const { asPath, isReady } = useRouter();

  const child = Children.only(children);
  const childClassName = child.props.className || "";
  const [className, setClassName] = useState(childClassName);

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const link = new URL(
        (props.as || props.href),
        location.href
      )
      const linkPathname = link.pathname;
      const linkOrigin = link.origin;

      // Using URL().pathname to get rid of query and hash
      const activeLink = new URL(asPath, location.href)
      const activePathname = activeLink.pathname;
      const activeOrigin = activeLink.origin;

      const originMatch = linkOrigin === activeOrigin;
      const pathnameMatch = linkPathname === activePathname;

      const newClassName =
        originMatch && pathnameMatch
          ? `${childClassName} ${activeClassName}`.trim()
          : childClassName;

      if (newClassName !== className) {
        setClassName(newClassName);
      }
    }
  }, [
    asPath,
    isReady,
    props.as,
    props.href,
    childClassName,
    activeClassName,
    setClassName,
    className
  ]);

  return (
    <Link {...props}>
      {React.cloneElement(child, {
        className: className || null
      })}
    </Link>
  );
};

export default ActiveLink;

import React from 'react';

type Props = {
  children: React.ReactNode;
};

/**
 * Navbar Component
 *
 * A simple wrapper for navigation-related content.
 * Currently, it just renders its children, but feel free to jazz it up later.
 *
 * @param {Props} props - Component properties containing children elements.
 * @returns A React element representing the Navbar.
 */
const Navbar = (props: Props) => {
  return <div>{props.children}</div>;
};

export default Navbar;

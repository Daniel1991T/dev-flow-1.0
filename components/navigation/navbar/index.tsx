import Link from "next/link";
import React from "react";

import Logo from "./Logo";
import MobileNavigation from "./MobileNavigation";
import ThemePicker from "./ThemePicker";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Logo textClassName="max-sm:hidden" />
      </Link>
      <p>Global Search</p>
      <div className="flex-between gap-5">
        <ThemePicker />
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;

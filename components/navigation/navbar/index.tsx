import Link from "next/link";
import React from "react";

import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";

import Logo from "./Logo";
import MobileNavigation from "./MobileNavigation";
import ThemePicker from "./ThemePicker";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Logo textClassName="max-sm:hidden" />
      </Link>
      <p>Global Search</p>
      <div className="flex-between gap-5">
        <ThemePicker />
        {session?.user?.id ? (
          <UserAvatar
            id={session.user.id}
            name={session.user.name!}
            imageUrl={session?.user?.image}
          />
        ) : null}
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;

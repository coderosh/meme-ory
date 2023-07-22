import Link from "next/link";
import { useRouter } from "next/router";
import { type IconType } from "react-icons";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  TbHome,
  TbUser,
  TbLogout,
  TbLogin,
  TbSquarePlus,
  TbFileArrowRight,
} from "react-icons/tb";

export default function Sidebar() {
  const { data: sessionData } = useSession();

  return (
    <aside className="w-[300px] rounded-lg border-r border-black bg-background-light p-4 text-white">
      <ul className="flex flex-col gap-2">
        <SideNavElement icon={TbHome} text="Home" href="/" />
        <SideNavElement icon={TbSquarePlus} text="Create" href="/create" />
        {sessionData && (
          <>
            <SideNavElement
              icon={TbFileArrowRight}
              text="Following"
              href="/following"
            />
            <SideNavElement
              icon={TbUser}
              text="Profile"
              href={`/profile/${sessionData.user.id}`}
            />
          </>
        )}
        {/* <SideNavElement icon={TbSettings} text="Settings" href="/settings" /> */}
        <SideNavElement
          icon={sessionData ? TbLogout : TbLogin}
          text={sessionData ? "Logout" : "Login"}
          onClick={() => (sessionData ? signOut() : signIn())}
        />
      </ul>
    </aside>
  );
}

const SideNavElement = ({
  text,
  href,
  onClick,
  icon: Icon,
}: {
  text: string;
  href?: string;
  onClick?: () => any;
  icon: IconType;
}) => {
  const router = useRouter();

  return (
    <li
      className={`rounded-full text-center hover:bg-background ${
        router.pathname === href ? "bg-background" : ""
      }`}
    >
      {typeof href === "string" ? (
        <Link href={href} className="flex w-full items-center gap-2 p-2 px-4">
          <Icon />
          <span>{text}</span>
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="flex w-full items-center gap-2 p-2 px-4"
        >
          <Icon />
          <span>{text}</span>
        </button>
      )}
    </li>
  );
};

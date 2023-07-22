import Link from "next/link";
import Image from "next/image";
import { TbSearch } from "react-icons/tb";

export default function Nav() {
  return (
    <nav className="flex h-10 items-center justify-between">
      <Link className="mx-4" href="/">
        <Image src="/logo.svg" alt="Logo" width={30} height={30} />
      </Link>
    </nav>
  );
}

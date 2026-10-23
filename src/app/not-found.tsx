import Link from "next/link";
export default function NotFound() {
  return <><h1>Page not found</h1><p>This address is not in the CMS. <Link href="/">Back to all sectors</Link></p></>;
}

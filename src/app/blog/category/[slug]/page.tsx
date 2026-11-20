import { redirect } from "next/navigation";
import { paths } from "@/lib/routing";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LegacyCategoryRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(paths.blogCategory(slug));
}

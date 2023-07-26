import { useRouter } from "next/router";
import Comments from "~/components/Comments";
import Post from "~/components/Post";
import { api } from "~/utils/api";

export default function PostPage() {
  const router = useRouter();

  const { data, isLoading } = api.meme.meme.useQuery({
    id: router.query.id as string,
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data) {
    router.push("/");
    return;
  }

  return (
    <div>
      <Post rightFloat={true} imageClassName="max-w-96 max-h-96" {...data} />
      <Comments memeId={data.id} />
    </div>
  );
}

import { api } from "~/utils/api";
import Post from "~/components/Post";
import PostsList from "~/components/PostsList";

export default function Home() {
  const { data: memes, isLoading, isError } = api.meme.memes.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  return <PostsList memes={memes} />;
}

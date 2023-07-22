import Post from "~/components/Post";
import PostsList from "~/components/PostsList";
import { api } from "~/utils/api";

export default function Home() {
  const {
    data: memes,
    isLoading,
    isError,
  } = api.meme.followingMemes.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  return memes.length === 0 ? (
    <h1>No memes from people you are following.</h1>
  ) : (
    <PostsList memes={memes} />
  );
}

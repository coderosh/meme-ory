import PostsList from "~/components/PostsList";
import { api } from "~/utils/api";

export default function Home() {
  const memes = api.meme.followingMemes.useInfiniteQuery(
    {},
    {
      getNextPageParam: (next) => next.nextCursor,
    }
  );

  if (memes.isLoading) return <p>Loading...</p>;
  if (memes.isError) return <p>Something went wrong</p>;

  return (
    <PostsList
      memes={memes.data?.pages.flatMap((page) => page.memes) || []}
      fetchNextPage={memes.fetchNextPage}
      hasMore={!!memes.hasNextPage}
    />
  );
}

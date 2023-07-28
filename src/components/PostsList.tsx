import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";

interface PostsListProps {
  memes: {
    image: string;
    id: string;
    title: string;
    description: string;
    user: {
      image: string | null;
      id: string;
      name: string | null;
    };
    votes: {
      userId: string;
      type: number;
    }[];
    createdAt: Date;
  }[];

  fetchNextPage: () => Promise<any>;
  hasMore: boolean;
}

export default function PostsList({
  memes,
  hasMore,
  fetchNextPage,
}: PostsListProps) {
  if (memes.length === 0) return <h1 className="text-xl">No Memes Found</h1>;
  return (
    <div className="flex flex-col gap-4">
      <InfiniteScroll
        hasMore={hasMore}
        next={fetchNextPage}
        dataLength={memes.length}
        loader={<p>Loading...</p>}
        scrollableTarget="scroll-target"
        className="flex flex-col gap-4"
      >
        {memes.map((meme) => (
          <Post
            containerClassName="border border-transparent hover:border-gray-700"
            title={meme.title}
            id={meme.id}
            key={meme.id}
            href={`/posts/${meme.id}`}
            createdAt={meme.createdAt}
            votes={meme.votes}
            user={meme.user}
            description={meme.description.substring(0, 50) + "..."}
            image={meme.image}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}

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
}

export default function PostsList({ memes }: PostsListProps) {
  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}

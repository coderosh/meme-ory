import Comment from "./Comment";

export interface CommentType {
  author: {
    id: string;
    image: string | null;
    name: string | null;
  };
  votes: {
    userId: string;
    type: number;
  }[];
  parentId: string | null;
  text: string;
  id: string;
  createdAt: Date;
  replies: CommentType[] | null;
}

interface CommentListProps {
  comments: CommentType[];
  memeId: string;
  create: (text: string, parentId: string) => any;
  level: number;
}

export default function CommentList({
  comments,
  memeId,
  create,
  level,
}: CommentListProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 rounded-lg">
      {comments?.map((comment) => (
        <Comment
          level={level}
          create={create}
          comment={comment}
          memeId={memeId}
        />
      ))}
    </div>
  );
}

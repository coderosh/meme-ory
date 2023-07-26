import { api } from "~/utils/api";
import Comment from "./Comment";
import CreateComment from "./CreateComment";

interface CommentsProps {
  memeId: string;
}

const Comments = ({ memeId }: CommentsProps) => {
  const { data: comments, isLoading } = api.comment.memeComments.useQuery({
    memeId,
  });

  return (
    <>
      <h2 className="mb-4 mt-8 text-xl font-bold">Comments</h2>

      <CreateComment memeId={memeId} />

      <div className="mt-4 flex flex-col gap-4 rounded-lg">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          comments?.map((comment) => (
            <Comment
              text={comment.text}
              id={comment.id}
              author={comment.author}
              createdAt={comment.createdAt}
              memeId={memeId}
              votes={comment.votes}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Comments;

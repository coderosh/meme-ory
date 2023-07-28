import { api } from "~/utils/api";
import CommentList from "./CommentsList";
import CreateComment from "./CreateComment";
import { useGeneralStore } from "~/stores/general";

interface CommentSectionProps {
  memeId: string;
}

const CommentSection = ({ memeId }: CommentSectionProps) => {
  const trpcUtils = api.useContext();
  const generalStore = useGeneralStore();

  const { data: comments, isLoading } = api.comment.memeComments.useQuery({
    memeId,
  });

  const createCommentMutation = api.comment.create.useMutation({
    onSuccess: () => {
      trpcUtils.comment.memeComments.invalidate({ memeId });
      generalStore.toggleActiveReplyId("");
    },
  });

  const createComment = (text: string, parentId: string | null = null) => {
    createCommentMutation.mutateAsync({ text, memeId, parentId });
  };

  return (
    <>
      <h2 className="mb-4 mt-8 text-xl font-bold">Comments</h2>

      <CreateComment
        placeholder="Create a new comment"
        create={createComment}
      />

      {!isLoading && (
        <CommentList
          create={createComment}
          comments={comments || []}
          memeId={memeId}
          level={0}
        />
      )}
    </>
  );
};

export default CommentSection;

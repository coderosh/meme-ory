import Link from "next/link";
import Vote from "./Vote";
import { format } from "timeago.js";
import { api } from "~/utils/api";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import CreateComment from "./CreateComment";
import CommentList, { CommentType } from "./CommentsList";
import { useGeneralStore } from "~/stores/general";
import { TbArrowForward } from "react-icons/tb";

const defaultProfile = "/logo.svg";

interface CommentProps {
  comment: CommentType;
  memeId: string;
  level: number;
  create: (text: string, parentId: string) => any;
}

const Comment = ({
  comment: { author, id, text, createdAt, votes, replies, parentId },
  memeId,
  level,
  create,
}: CommentProps) => {
  const trpcUtils = api.useContext();
  const { data: sessionData } = useSession();
  const generalStore = useGeneralStore();

  const voteMutate = api.comment.vote.useMutation({
    onSuccess: () => {
      trpcUtils.comment.memeComments.invalidate({ memeId });
    },
  });

  const onClickVote = (vote: "UP" | "DOWN") => {
    voteMutate.mutateAsync({ id, type: vote });
  };

  const ago = format(createdAt);

  const currentVote = useMemo(() => {
    const vote = votes.find((vote) => vote.userId === sessionData?.user.id);
    if (!vote) return null;
    return vote.type === 1 ? "UP" : "DOWN";
  }, [votes, sessionData]);

  const totalVotes = useMemo(
    () => votes.reduce((prev, cur) => prev + cur.type, 0),
    [votes]
  );

  return (
    <div className="flex gap-4 rounded-lg border border-gray-700 bg-background-light p-4">
      <Vote
        allowVote={!!sessionData}
        currentVote={currentVote}
        onClickVote={onClickVote}
        size={18}
        onClickReply={() => generalStore.toggleActiveReplyId(id)}
        totalVotes={totalVotes}
        hideReplyButton={level >= 2}
      />
      <div className="w-full">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-6 w-6 overflow-hidden rounded-full">
            <img src={author.image || defaultProfile} alt="User Profile" />
          </div>
          <Link href={`/profile/${author.id}`} className="text-sm text-primary">
            {author.name}
          </Link>
          <span className="text-xs">{ago}</span>
        </div>
        <div>{text}</div>
        {generalStore.activeReplyId === id && (
          <CreateComment
            placeholder="Reply to comment"
            autoFocus
            create={(text) =>
              // level >= 2 ????? just in case
              create(text, level >= 2 ? (parentId as string) : id)
            }
          />
        )}
        {replies && (
          <CommentList
            level={level + 1}
            create={create}
            comments={replies}
            memeId={memeId}
          />
        )}
      </div>
    </div>
  );
};

export default Comment;

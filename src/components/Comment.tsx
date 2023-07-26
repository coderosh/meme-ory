import Link from "next/link";
import Vote from "./Vote";
import { format } from "timeago.js";
import { api } from "~/utils/api";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

const defaultProfile = "/logo.svg";

interface CommentProps {
  id: string;
  text: string;
  author: {
    name: string | null;
    image: string | null;
    id: string;
  };
  memeId: string;
  createdAt: Date;
  votes: { type: number; userId: string }[];
}
const Comment = ({
  author,
  id,
  text,
  createdAt,
  memeId,
  votes,
}: CommentProps) => {
  const trpcUtils = api.useContext();
  const { data: sessionData } = useSession();

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
        totalVotes={totalVotes}
      />
      <div>
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
      </div>
    </div>
  );
};

export default Comment;

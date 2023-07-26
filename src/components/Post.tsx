import clsx from "clsx";
import Link from "next/link";
import { useMemo } from "react";
import { format } from "timeago.js";
import { useSession } from "next-auth/react";
import {
  TbArrowBigDown,
  TbArrowBigDownFilled,
  TbArrowBigUp,
  TbArrowBigUpFilled,
} from "react-icons/tb";

import { api } from "~/utils/api";
import Vote from "./Vote";

type PostProps = {
  id: string;
  image: string;
  description: string;
  votes: { type: number; userId: string }[];
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  imageClassName?: string;
  containerClassName?: string;
  href?: string;
  title: string;
  rightFloat?: boolean;
};

const defaultProfile = "/logo.svg";
const Post = ({
  id,
  image,
  description,
  user,
  votes,
  createdAt,
  imageClassName = "",
  containerClassName = "",
  href,
  title,
  rightFloat = false,
}: PostProps) => {
  const { data: sessionData } = useSession();

  const totalVotes = useMemo(
    () => votes.reduce((prev, cur) => prev + cur.type, 0),
    [votes]
  );

  const changeVote = api.meme.vote.useMutation({
    onSuccess: () => {
      // TODO: update state instead of invalidate
      trpcUtils.meme.memes.invalidate();
      trpcUtils.meme.followingMemes.invalidate();
      trpcUtils.meme.userMemes.invalidate();
      trpcUtils.meme.meme.invalidate({ id });
    },
  });

  const trpcUtils = api.useContext();

  const myVote = useMemo(() => {
    const vote = votes.find((vote) => vote.userId === sessionData?.user.id);
    if (!vote) return null;
    return vote.type === 1 ? "UP" : "DOWN";
  }, [votes, sessionData]);

  const onClickVote = (type: "UP" | "DOWN") => {
    changeVote.mutateAsync({ id: id, type });
  };

  const ago = format(createdAt);

  return (
    <div
      className={clsx(
        "rounded-lg bg-background-light p-4 shadow-md shadow-gray-950",
        containerClassName
      )}
    >
      <div className="flex gap-4">
        <Vote
          currentVote={myVote}
          onClickVote={onClickVote}
          totalVotes={totalVotes}
          allowVote={!!sessionData}
          size={25}
        />
        {/* <Votes
          myVote={myVote}
          onClickVote={onClickVote}
          totalVotes={totalVotes}
        /> */}
        {href ? (
          <Link href={href} className="w-full">
            <PostCard
              rightFloat={rightFloat}
              title={title}
              image={image}
              imageClassName={imageClassName}
              ago={ago}
              user={user!}
              description={description}
            />
          </Link>
        ) : (
          <PostCard
            rightFloat={rightFloat}
            title={title}
            image={image}
            imageClassName={imageClassName}
            ago={ago}
            user={user!}
            description={description}
          />
        )}
      </div>
    </div>
  );
};

const PostCard = ({
  user,
  image,
  ago,
  imageClassName,
  description,
  title,
  rightFloat,
}: {
  user: { image: string | null; id: string; name: string | null };
  ago: string;
  image: string;
  imageClassName: string;
  description: string;
  title: string;
  rightFloat: boolean;
}) => {
  return (
    <div className="w-full flex-1">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-6 w-6 overflow-hidden rounded-full">
          <img src={user.image || defaultProfile} alt="User Profile" />
        </div>
        <Link href={`/profile/${user.id}`} className="text-sm text-primary">
          {user.name}
        </Link>
        <span className="text-xs">{ago}</span>
      </div>

      <div className={`gap-6 ${rightFloat ? "" : "flex"}`}>
        <img
          src={image}
          className={clsx(
            "max-w-40 max-h-40",
            imageClassName,
            rightFloat ? "mb-4" : ""
          )}
        />
        <div>
          <h1 className="text-xl font-medium">{title}</h1>
          <p className="mt-4">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;

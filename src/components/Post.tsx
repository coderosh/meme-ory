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
        <Votes
          myVote={myVote}
          onClickVote={onClickVote}
          totalVotes={totalVotes}
        />
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

const Votes = ({
  myVote,
  onClickVote,
  totalVotes,
}: {
  myVote: "UP" | "DOWN" | null;
  onClickVote: (vote: "UP" | "DOWN") => any;
  totalVotes: number;
}) => {
  const { data: sessionData } = useSession();

  return (
    <div
      className={`flex flex-col items-center gap-2 border-r border-gray-700 pr-2 ${
        sessionData ? "" : "pointer-events-none opacity-30"
      }`}
    >
      {myVote === "UP" ? (
        <TbArrowBigUpFilled
          size={25}
          onClick={() => onClickVote("UP")}
          className="cursor-pointer text-primary hover:opacity-80"
          role="button"
        />
      ) : (
        <TbArrowBigUp
          size={25}
          onClick={() => onClickVote("UP")}
          className="cursor-pointer hover:text-primary"
          role="button"
        />
      )}
      <span>{totalVotes}</span>
      {myVote === "DOWN" ? (
        <TbArrowBigDownFilled
          size={25}
          onClick={() => onClickVote("DOWN")}
          className="cursor-pointer text-primary hover:opacity-80"
          role="button"
        />
      ) : (
        <TbArrowBigDown
          size={25}
          onClick={() => onClickVote("DOWN")}
          className="cursor-pointer hover:text-primary"
          role="button"
        />
      )}
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
  user: { image: string | null; id: string };
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
          Roshan Acharya
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

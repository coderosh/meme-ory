import {
  TbArrowBigDown,
  TbArrowBigDownFilled,
  TbArrowBigUp,
  TbArrowBigUpFilled,
  TbArrowForward,
} from "react-icons/tb";

import clsx from "clsx";

interface VoteProps {
  currentVote: "UP" | "DOWN" | null;
  onClickVote: (vote: "UP" | "DOWN") => any;
  onClickReply?: () => any;
  totalVotes: number;
  allowVote: boolean;
  size: number;
  className?: string;
  hideReplyButton: boolean;
}

const Vote = ({
  allowVote,
  currentVote,
  onClickVote,
  onClickReply,
  totalVotes,
  size,
  className,
  hideReplyButton,
}: VoteProps) => {
  return (
    <div
      className={clsx(
        `flex flex-col items-center gap-2 border-r border-gray-700 pr-2`,
        allowVote ? "" : "pointer-events-none opacity-30",
        className
      )}
    >
      {currentVote === "UP" ? (
        <TbArrowBigUpFilled
          size={size}
          onClick={() => onClickVote("UP")}
          className="cursor-pointer text-primary hover:opacity-80"
          role="button"
        />
      ) : (
        <TbArrowBigUp
          size={size}
          onClick={() => onClickVote("UP")}
          className="cursor-pointer hover:text-primary"
          role="button"
        />
      )}
      <span>{totalVotes}</span>
      {currentVote === "DOWN" ? (
        <TbArrowBigDownFilled
          size={size}
          onClick={() => onClickVote("DOWN")}
          className="cursor-pointer text-primary hover:opacity-80"
          role="button"
        />
      ) : (
        <TbArrowBigDown
          size={size}
          onClick={() => onClickVote("DOWN")}
          className="cursor-pointer hover:text-primary"
          role="button"
        />
      )}
      {!hideReplyButton && (
        <TbArrowForward
          size={size}
          role="button"
          onClick={onClickReply}
          className="cursor-pointe mt-2 hover:opacity-80"
        />
      )}
    </div>
  );
};

export default Vote;

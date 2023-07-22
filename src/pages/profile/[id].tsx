import { format } from "timeago.js";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Post from "~/components/Post";
import { useMemo } from "react";
import PostsList from "~/components/PostsList";

const defaultProfile = "/logo.svg";

export default function Profile() {
  const router = useRouter();
  const trpcUtils = api.useContext();
  const { data: sessionData } = useSession();
  const id = router.query.id as string;

  const { data: profile, isLoading } = api.profile.getProfile.useQuery({ id });

  const toggleFollow = api.profile.follow.useMutation({
    onSuccess: () => {
      trpcUtils.profile.getProfile.invalidate({ id });
    },
  });

  const onFollowClick = () => {
    toggleFollow.mutateAsync({ id });
  };

  const iAmFollowing = useMemo(
    () => profile?.followers.find((user) => user.id === sessionData?.user.id),
    [profile, sessionData]
  );

  if (isLoading) return <div>Loading....</div>;

  return (
    profile && (
      <div className="flex flex-col gap-4">
        <div className="rounded-lg bg-background-light p-4">
          <div className="m-auto h-24 w-24 overflow-hidden rounded-lg">
            <img src={profile.image || defaultProfile} alt="User Profile" />
          </div>
          <div className="m-auto mt-2 text-center">
            <span className="text-lg font-bold">{profile.name}</span>
            {sessionData?.user.id !== id && (
              <button
                className="m-auto my-4 block rounded-full bg-primary px-4 py-1"
                onClick={onFollowClick}
              >
                {iAmFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            <div className="mt-5 flex items-center justify-center gap-8">
              <div>
                <p>Followers</p>
                <p>{profile._count.followers}</p>
              </div>
              <div>
                <p>Follows</p>
                <p>{profile._count.follows}</p>
              </div>
              <div>
                <p>Memes</p>
                <p>{profile._count.memes}</p>
              </div>
            </div>
          </div>
        </div>
        {sessionData && <Memes userId={id} />}
      </div>
    )
  );
}

const Memes = ({ userId }: { userId: string }) => {
  const { data: memes } = api.meme.userMemes.useQuery({
    userId: userId,
  });

  console.log({ memes });

  if (!Array.isArray(memes)) return null;

  return (
    <>
      {memes.length > 0 && <h1 className="text-xl font-bold">Memes</h1>}
      <PostsList memes={memes} />
    </>
  );
};

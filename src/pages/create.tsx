import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import CreatePost from "~/components/CreatePost";

export default function Home() {
  const { data: sessionData } = useSession();
  const createPresignedUrl = api.s3.createPresignedUrl.useMutation();

  const createMeme = api.meme.create.useMutation({
    onSuccess: () => {
      toast.success(`Created new meme post`);
    },
    onError: () => {
      toast.error(`Filed to create new meme post`);
    },
  });

  const handleSubmit = async (
    file: File,
    description: string,
    title: string
  ) => {
    const { url, fields } = await createPresignedUrl.mutateAsync({
      name: file.name,
    });

    const data: Record<string, any> = {
      ...fields,
      "Content-Type": file.type,
      file,
    };

    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }

    await fetch(url, {
      method: "POST",
      body: formData,
    });

    const image = `${url}/${fields.key}`;

    createMeme.mutateAsync({ description, image, title });
  };

  return sessionData ? (
    <div>
      <CreatePost onSubmit={handleSubmit} />
    </div>
  ) : (
    <div>You need to be logged in to create</div>
  );
}

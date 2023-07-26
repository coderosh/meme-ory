import { FormEvent, useState } from "react";
import { api } from "~/utils/api";

const CreateComment = ({ memeId }: { memeId: string }) => {
  const [text, setText] = useState("");

  const trpcUtils = api.useContext();

  const mutate = api.comment.create.useMutation({
    onSuccess: () => {
      trpcUtils.comment.memeComments.invalidate({ memeId });
    },
  });

  const create = (e: FormEvent) => {
    e.preventDefault();
    mutate.mutateAsync({ text, memeId });

    setText("");
  };

  return (
    <div className="rounded-lg bg-background-light p-4">
      <form onSubmit={create} className="flex flex-col gap-4">
        <textarea
          name="text"
          id="text"
          className="block w-full resize-none rounded-lg border border-gray-700 bg-background-light p-2"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Create a new comment"
        ></textarea>
        <input
          type="submit"
          value="Comment"
          className="cursor-pointer self-end rounded-lg bg-primary p-2 transition-all hover:scale-105 hover:opacity-90 active:scale-100"
        />
      </form>
    </div>
  );
};

export default CreateComment;

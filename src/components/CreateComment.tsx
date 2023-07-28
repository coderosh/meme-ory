import clsx from "clsx";
import { ChangeEvent, FormEvent, useState } from "react";
import { api } from "~/utils/api";

interface CreateCommentProps {
  create: (text: string) => any;
  placeholder: string;
  className?: string;
  autoFocus?: boolean;
}

const CreateComment = ({
  create,
  className,
  placeholder,
  autoFocus = false,
}: CreateCommentProps) => {
  const [text, setText] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    create(text);
    setText("");
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className={clsx("rounded-lg bg-background-light p-4", className)}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <textarea
          autoFocus={autoFocus}
          name="text"
          id="text"
          className="block w-full resize-none rounded-lg border border-gray-700 bg-background-light p-2"
          rows={3}
          value={text}
          onChange={onChange}
          onKeyUp={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              onSubmit(e);
            }
          }}
          placeholder={placeholder}
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

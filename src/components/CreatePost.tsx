import Dropzone from "react-dropzone";
import { FormEvent, useMemo, useState } from "react";

export default function CreatePost({
  onSubmit,
}: {
  onSubmit: (file: File, description: string, title: string) => any;
}) {
  const [file, setFile] = useState<File | null>();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const imageUrl = useMemo(() => file && URL.createObjectURL(file), [file]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!file || !description?.trim()) return;

    onSubmit(file, description, title);
    setFile(null);
    setDescription("");
    setTitle("");
  };

  return (
    <div className="m-auto w-full max-w-3xl rounded-lg bg-background p-4">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <DragAndDropSection
          imageUrl={imageUrl}
          onSubmit={(file) => setFile(file)}
          fileName={file?.name}
        />
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="block w-full resize-none rounded-lg bg-background-light p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full resize-none rounded-lg bg-background-light p-2"
            rows={4}
          ></textarea>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary p-2 px-3 hover:opacity-80"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

const DragAndDropSection = ({
  onSubmit,
  fileName,
  imageUrl,
}: {
  onSubmit: (file: File) => any;
  fileName?: string;
  imageUrl?: string | null;
}) => {
  const onDrop = (files: File[]) => {
    console.log(files);

    onSubmit(files[0] as File);
  };

  return (
    <>
      <Dropzone maxFiles={1} onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <>
            <div
              {...getRootProps()}
              className="flex h-full min-h-[300px] w-full cursor-pointer items-center justify-center border-2 border-dotted border-gray-400 p-5"
            >
              <div>
                {imageUrl && (
                  <img
                    className="m-auto mb-2 max-h-[300px] max-w-[300px]"
                    src={imageUrl}
                  />
                )}

                <p className="text-center text-xl">
                  {fileName ? (
                    fileName
                  ) : (
                    <>Drag and Drop or Click To Upload Meme</>
                  )}
                </p>
              </div>
            </div>
            <input
              id="file"
              {...getInputProps()}
              maxLength={1}
              className="hidden h-full w-full"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </>
        )}
      </Dropzone>
    </>
  );
};

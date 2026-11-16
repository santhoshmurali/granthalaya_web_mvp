"use client";
import { useState } from "react";
import { api, mediaUrl } from "@/lib/api";

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  return (await api<{ file: string }>("/uploads", { method: "POST", body: form })).file;
}

type Props = { images: string[]; onChange: (images: string[]) => void; onError: (message: string) => void };

/** Thumbnails with replace / remove per image and an add control. First image is the cover. */
export default function ImageManager({ images, onChange, onError }: Props) {
  const [busy, setBusy] = useState(false);
  const run = (task: Promise<void>) => {
    setBusy(true);
    return task.catch((e: Error) => onError(e.message)).finally(() => setBusy(false));
  };

  const replace = (index: number, file?: File) =>
    file && run(uploadImage(file).then((name) => onChange(images.map((old, i) => (i === index ? name : old)))));
  const add = (file?: File) => file && run(uploadImage(file).then((name) => onChange([...images, name])));

  return (
    <fieldset className="panel">
      <legend>Images (first image is the cover)</legend>
      <div className="thumbs">
        {images.map((file, index) => (
          <div className="thumb" key={`${file}-${index}`}>
            <img src={mediaUrl(file)} alt={`Image ${index + 1}`} />
            <input type="file" accept="image/*" disabled={busy} aria-label={`Replace image ${index + 1}`}
                   onChange={(e) => replace(index, e.target.files?.[0])} />
            <button type="button" className="button button-small button-danger" disabled={busy}
                    onClick={() => onChange(images.filter((_, i) => i !== index))}>Remove</button>
          </div>
        ))}
      </div>
      <label className="form">
        Add image
        <input type="file" accept="image/*" disabled={busy} aria-label="Add image" onChange={(e) => add(e.target.files?.[0])} />
      </label>
    </fieldset>
  );
}

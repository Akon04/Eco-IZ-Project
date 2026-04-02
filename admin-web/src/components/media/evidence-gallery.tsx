"use client";

import type { AdminMedia } from "@/lib/types";

type EvidenceGalleryProps = {
  media: AdminMedia[];
  title?: string;
};

function mediaSrc(item: AdminMedia) {
  return `data:image/jpeg;base64,${item.base64Data}`;
}

export function EvidenceGallery({
  media,
  title = "Фото-подтверждение",
}: EvidenceGalleryProps) {
  const photos = media.filter((item) => item.kind === "photo");

  if (!photos.length) {
    return (
      <div className="card inset-card">
        <p className="muted">{title}</p>
        <p>Фото не приложено.</p>
      </div>
    );
  }

  return (
    <div className="card inset-card">
      <div className="media-header">
        <p className="muted">{title}</p>
        <strong>{photos.length} фото</strong>
      </div>
      <div className="evidence-grid">
        {photos.map((item) => (
          <a
            key={item.id}
            className="evidence-tile"
            href={mediaSrc(item)}
            target="_blank"
            rel="noreferrer"
          >
            <img alt="Фото-подтверждение активности" src={mediaSrc(item)} />
          </a>
        ))}
      </div>
    </div>
  );
}

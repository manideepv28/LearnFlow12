"use client";

interface VideoPlayerProps {
  videoId: string;
  title?: string;
}

export function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl border">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
        title={title || "Course Video Lesson"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}

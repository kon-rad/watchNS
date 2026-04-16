import { getFavoriteVideos } from "@/actions/videos";
import Link from "next/link";

export default async function FavoritesPage() {
  const favorites = await getFavoriteVideos();

  return (
    <div className="px-6 max-w-7xl mx-auto min-h-screen py-8">
      {/* Header */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-primary font-headline font-bold text-xs tracking-[0.2em] uppercase mb-2 block">
              Curated Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface">
              My Favorites
            </h1>
          </div>
          <div className="flex items-center gap-4 text-on-surface-variant bg-surface-container-low px-6 py-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-tertiary">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="font-bold text-lg">{favorites.length} Saved</span>
          </div>
        </div>
      </section>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-outline-variant/40">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <p className="text-on-surface-variant font-medium mb-4">
            No favorites yet. Start swiping!
          </p>
          <Link
            href="/swipe"
            className="px-8 py-3 bg-surface-container-high hover:bg-surface-bright transition-colors rounded-full text-primary font-bold"
          >
            Discover Content
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((video, i) => (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              className={`group bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-colors ${
                i === 0 ? "md:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <div
                className={`relative overflow-hidden ${
                  i === 0 ? "aspect-video" : "aspect-[4/5]"
                }`}
              >
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title || "Video"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/30">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-4 right-4 bg-surface-container-high/60 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-tertiary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-full py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 text-white font-bold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Watch Now
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-headline font-bold text-on-surface mb-1 line-clamp-1">
                  {video.title || "Untitled Video"}
                </h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {video.creatorName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

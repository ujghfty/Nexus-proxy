import React from 'react';
import { Star, Play, Heart } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
}) => {
  const getGradient = (cat) => {
    switch (cat) {
      case 'Action':
        return 'from-cyan-950 via-slate-900 to-slate-950 border-cyan-800/40 hover:border-cyan-500/70';
      case 'Arcade':
        return 'from-fuchsia-950 via-slate-900 to-slate-950 border-fuchsia-800/40 hover:border-fuchsia-500/70';
      case 'Puzzle':
        return 'from-emerald-950 via-slate-900 to-slate-950 border-emerald-800/40 hover:border-emerald-500/70';
      case 'Classic':
        return 'from-amber-950 via-slate-900 to-slate-950 border-amber-800/40 hover:border-amber-500/70';
      case 'Sports':
        return 'from-blue-950 via-slate-900 to-slate-950 border-blue-800/40 hover:border-blue-500/70';
      default:
        return 'from-purple-950 via-slate-900 to-slate-950 border-purple-800/40 hover:border-purple-500/70';
    }
  };

  const formattedPlays =
    game.playCount >= 1000
      ? `${(game.playCount / 1000).toFixed(0)}k`
      : game.playCount.toString();

  return (
    <div
      onClick={() => onSelectGame(game)}
      className={`group relative flex flex-col justify-between p-5 rounded-xl bg-gradient-to-br ${getGradient(
        game.category
      )} border transition-all duration-200 cursor-pointer shadow-lg hover:-translate-y-1`}
    >
      <div>
        {/* Unboxed Header Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-300">{game.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="tabular-nums">{formattedPlays} plays</span>
          </div>

          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors mb-1.5 tracking-tight">
          {game.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
          {game.description}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <span>{game.aspectRatio}</span>
          {game.tags && game.tags[0] && (
            <>
              <span aria-hidden="true">·</span>
              <span>{game.tags[0]}</span>
            </>
          )}
        </div>

        <span className="flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:text-sky-300 transition-colors">
          <span>Play</span>
          <Play className="w-3 h-3 fill-current" />
        </span>
      </div>
    </div>
  );
};

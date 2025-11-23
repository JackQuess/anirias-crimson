"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, EyeOff, Eye, Flame, Heart, Sword, MoreHorizontal, Flag, Lock } from 'lucide-react';
import { Comment, UserRank } from '../types';
import { useTranslation } from '../providers/I18nProvider';

interface CommentSectionProps {
  animeId: string;
  isAuth?: boolean;
  onLogin?: () => void;
}

const MOCK_COMMENTS: Comment[] = [
  // ... (mock data remains the same)
];

const RANK_COLORS: Record<UserRank, string> = {
  Pawn: 'bg-gray-600 text-white',
  Knight: 'bg-blue-600 text-white',
  Bishop: 'bg-purple-600 text-white',
  Rook: 'bg-emerald-600 text-white',
  Queen: 'bg-anirias-bright text-white',
  King: 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black',
};

const CommentSection: React.FC<CommentSectionProps> = ({ animeId, isAuth = true, onLogin }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [isSpoilerInput, setIsSpoilerInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newEntry: Comment = {
      id: Date.now().toString(), userId: 'me', username: 'GuestUser', avatar: 'https://picsum.photos/seed/me/100/100',
      rank: 'Pawn', content: newComment, timestamp: 'Just now', isSpoiler: isSpoilerInput,
      reactions: { flame: 0, heart: 0, sword: 0 }
    };
    setComments([newEntry, ...comments]);
    setNewComment('');
    setIsSpoilerInput(false);
  };

  return (
    <div className="w-full font-inter">
      
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-cinzel font-bold text-white">
          <span className="text-anirias-crimson">{t('CommentSection.title')}</span>
        </h3>
        <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400 font-bold">
          {comments.length}
        </span>
      </div>

      <div className={`relative mb-10 bg-anirias-void border transition-all duration-300 rounded-xl overflow-hidden ${isFocused ? 'border-anirias-crimson shadow-[0_0_15px_rgba(153,0,17,0.3)]' : 'border-white/10'}`}>
        
        {!isAuth && (
           <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
              <Lock className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-300 font-bold mb-3">{t('CommentSection.loginPrompt')}</p>
              <button 
                onClick={onLogin}
                className="px-6 py-2 bg-anirias-crimson hover:bg-anirias-bright text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg"
              >
                 {t('CommentSection.loginButton')}
              </button>
           </div>
        )}

        <form onSubmit={handleSubmit} className={`p-4 ${!isAuth ? 'opacity-30 pointer-events-none' : ''}`}>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
              <img src="https://picsum.photos/seed/me/100/100" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={t('CommentSection.placeholder')}
                className={`w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none resize-none transition-all duration-300 ${isFocused || newComment ? 'h-24' : 'h-10'}`}
              />
            </div>
          </div>

          <AnimatePresence>
            {(isFocused || newComment) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-between items-center mt-3 pt-3 border-t border-white/5"
              >
                <button
                  type="button"
                  onClick={() => setIsSpoilerInput(!isSpoilerInput)}
                  className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${isSpoilerInput ? 'bg-anirias-crimson/20 text-anirias-crimson border border-anirias-crimson/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {isSpoilerInput ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {isSpoilerInput ? t('CommentSection.spoilerEnabled') : t('CommentSection.spoilerToggle')}
                </button>

                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-anirias-crimson text-white px-6 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-anirias-bright disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {t('CommentSection.post')} <Send className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

// ... (CommentItem and ReactionButton components remain the same)

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 group"
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
          <img src={comment.avatar} alt={comment.username} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-white font-bold text-sm hover:text-anirias-crimson cursor-pointer transition-colors">
            {comment.username}
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${RANK_COLORS[comment.rank]}`}>
            {comment.rank}
          </span>
          <span className="text-gray-500 text-xs">• {comment.timestamp}</span>
        </div>
        <div className="relative mt-1 mb-3">
          {comment.isSpoiler && !isRevealed ? (
            <div 
              onClick={() => setIsRevealed(true)}
              className="relative w-full bg-white/5 border border-anirias-crimson/30 rounded-lg p-4 cursor-pointer overflow-hidden group/spoiler"
            >
              <div className="absolute inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-10 transition-colors group-hover/spoiler:bg-black/50">
                <div className="flex flex-col items-center text-anirias-crimson font-bold uppercase tracking-widest text-xs">
                   <EyeOff className="w-6 h-6 mb-2" />
                   <span>Secret Content</span>
                   <span className="text-[9px] text-gray-400 mt-1">Click to Reveal</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed blur-sm select-none">
                {comment.content}
              </p>
            </div>
          ) : (
            <motion.div
              initial={comment.isSpoiler ? { opacity: 0, filter: 'blur(10px)' } : false}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.3 }}
            >
               <p className={`text-gray-300 text-sm leading-relaxed ${comment.isSpoiler ? 'p-3 bg-white/5 rounded-lg border border-white/10' : ''}`}>
                 {comment.content}
               </p>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <ReactionButton icon={Flame} count={comment.reactions.flame} color="hover:text-orange-500" />
          <ReactionButton icon={Heart} count={comment.reactions.heart} color="hover:text-pink-500" />
          <ReactionButton icon={Sword} count={comment.reactions.sword} color="hover:text-sky-400" />
          <div className="flex-1"></div>
          <button className="text-gray-500 hover:text-white text-xs font-bold flex items-center gap-1">
            Reply
          </button>
          <div className="relative group/more">
             <button className="text-gray-500 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
             </button>
             <div className="absolute left-0 top-full mt-1 w-24 bg-anirias-void border border-white/10 rounded shadow-lg opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all z-20">
                <button className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-anirias-crimson hover:bg-white/5 flex items-center gap-2">
                   <Flag className="w-3 h-3" /> Report
                </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ReactionButton: React.FC<{ icon: React.ElementType, count: number, color: string }> = ({ icon: Icon, count, color }) => (
  <button className={`flex items-center gap-1.5 text-gray-500 transition-colors group ${color}`}>
    <Icon className="w-4 h-4 group-active:scale-125 transition-transform" />
    <span className="text-xs font-bold">{count}</span>
  </button>
);


export default CommentSection;
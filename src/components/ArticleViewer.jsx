
import React from "react";
import { motion } from "framer-motion";

export function ArticleViewer({ article, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-6 h-[600px] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-2xl">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-card rounded-lg p-6 h-[600px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <img  alt="Empty state illustration" className="w-32 h-32 mx-auto" src="https://images.unsplash.com/photo-1663124178716-2078c384c24a" />
          <p className="text-muted-foreground">
            Click the "Random Article" button to fetch an article
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-lg p-6 h-[600px] overflow-auto"
    >
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Source: <a href={article.source} target="_blank" rel="noopener noreferrer" className="underline">{article.source}</a>
        </p>
      </div>
    </motion.div>
  );
}

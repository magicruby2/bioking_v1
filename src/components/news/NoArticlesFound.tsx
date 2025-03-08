
export const NoArticlesFound = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/40 p-8 text-center">
      <div className="text-lg font-medium">No articles found</div>
      <p className="mt-2 text-sm text-muted-foreground">
        Try changing your search query or category filter
      </p>
    </div>
  );
};

export default NoArticlesFound;

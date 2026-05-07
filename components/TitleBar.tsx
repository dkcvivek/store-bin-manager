type TitleBarProps = {
  title: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
};

export default function TitleBar({
  title,
  showAddButton = false,
  onAddClick,
}: TitleBarProps) {
  return (
    <div className="flex justify-center">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-background/90 backdrop-blur-md px-4 py-4 w-full max-w-sm">
        <h1 className="text-xl font-bold text-foreground truncate">{title}</h1>

        {showAddButton && (
          <button
            onClick={onAddClick}
            className="bg-foreground text-background px-3 py-2 text-sm font-semibold active:scale-95 transition whitespace-nowrap"
          >
            Add New
          </button>
        )}
      </div>
    </div>
  );
}

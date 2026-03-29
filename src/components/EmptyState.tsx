type EmptyStateProps = {
  title: string;
  description: string;
  tips?: string[];
};

export function EmptyState({ title, description, tips = [] }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">+</div>
      <div className="empty-state-copy">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      {tips.length ? (
        <div className="empty-state-tips">
          {tips.map((tip) => (
            <span className="ghost-chip" key={tip}>
              {tip}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

import { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  aside
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {aside ? <div>{aside}</div> : null}
    </div>
  );
}

import { ReactNode } from "react";

type GoalCardProps = {
  icon: (props: { size?: number; className?: string }) => ReactNode;
  title: string;
  children: ReactNode;
};

export default function GoalCard({ icon: Icon, title, children }: GoalCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-card">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-brand">
        <Icon size={22} />
      </span>
      <h3 className="mt-3 text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{children}</p>
    </div>
  );
}

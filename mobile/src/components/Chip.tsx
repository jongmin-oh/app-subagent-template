export function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="chip"
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

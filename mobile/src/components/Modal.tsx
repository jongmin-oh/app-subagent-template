import { useEffect, useRef, type ReactNode } from "react";
export function Modal({
  title,
  onClose,
  children,
  sheet = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  sheet?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previousFocus = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={sheet ? "modal sheet" : "modal"}
      onCancel={(event) => {
        event.preventDefault();
        event.currentTarget.close();
      }}
      onClose={(event) => {
        // Ignore a queued cleanup event if StrictMode has reopened the dialog.
        if (!event.currentTarget.open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="stack" onClick={(event) => event.stopPropagation()}>
        <h2>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

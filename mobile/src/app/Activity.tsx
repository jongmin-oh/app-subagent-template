import { Bell } from "lucide-react";
import { Screen } from "@/components/Screen";
import { useNotifications } from "@/components/Notifications";
import { useToast } from "@/components/Toast";
export default function Activity() {
  const { items, setItems } = useNotifications();
  const [toast, showToast] = useToast();
  return (
    <>
      <Screen>
        <div className="row">
          <h1>활동</h1>
          <button
            className="text-button"
            onClick={() => {
              setItems(items.map((item) => ({ ...item, unread: false })));
              showToast("모두 읽음 처리했어요");
            }}
          >
            모두 읽음
          </button>
        </div>
        <div className="stack">
          {items.map((item) => (
            <button
              key={item.id}
              className={`notification row ${item.unread ? "unread" : ""}`}
              onClick={() =>
                setItems(
                  items.map((other) =>
                    other.id === item.id ? { ...other, unread: false } : other,
                  ),
                )
              }
            >
              <Bell />
              <span className="grow">
                {item.text}
                <small className="caption block">{item.time}</small>
              </span>
              {item.unread && <span className="dot" aria-label="읽지 않음" />}
            </button>
          ))}
        </div>
      </Screen>
      {toast}
    </>
  );
}

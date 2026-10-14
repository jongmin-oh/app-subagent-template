import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/api/auth";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Screen } from "@/components/Screen";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/Toast";

const tags = ["업무", "건강", "개인"] as const;
type Tag = (typeof tags)[number];
// Existing local demo tasks, not server data.
const initialTasks: {
  id: number;
  title: string;
  meta: string;
  tag: Tag;
  done: boolean;
}[] = [
  {
    id: 1,
    title: "디자인 리뷰 준비",
    meta: "오전 10:00",
    tag: "업무",
    done: true,
  },
  {
    id: 2,
    title: "주간 회고 작성",
    meta: "오후 2:00",
    tag: "업무",
    done: false,
  },
  { id: 3, title: "러닝 5km", meta: "오후 7:30", tag: "건강", done: false },
  { id: 4, title: "읽던 책 마무리", meta: "자기 전", tag: "개인", done: false },
];
export default function Home() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(initialTasks);
  const [sheet, setSheet] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTag, setNewTag] = useState<Tag>("업무");
  const [toast, showToast] = useToast();
  const done = tasks.filter((task) => task.done).length;
  const progress = Math.round((done / tasks.length) * 100);
  function addTask() {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask.trim(),
        meta: "오늘",
        tag: newTag,
        done: false,
      },
    ]);
    setNewTask("");
    setSheet(false);
    showToast("할 일이 추가됐어요");
  }
  return (
    <>
      <Screen>
        <header>
          <p className="caption">
            {new Date().toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>
          <h1>안녕하세요, {user?.name}님</h1>
        </header>
        <section className="card glow stack">
          <h2>이번 주 목표</h2>
          <strong className="display">{progress}%</strong>
          <progress aria-label="목표 달성률" value={progress} max={100} />
          <p className="caption">{done}개 완료 · 오늘 할 일을 체크해보세요</p>
        </section>
        <section className="stack">
          <div className="row">
            <h2>오늘 할 일</h2>
            <button
              className="icon-button"
              aria-label="할 일 추가"
              onClick={() => setSheet(true)}
            >
              <Plus />
            </button>
          </div>
          {tasks.map((task) => (
            <label key={task.id} className="task row">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() =>
                  setTasks(
                    tasks.map((item) =>
                      item.id === task.id
                        ? { ...item, done: !item.done }
                        : item,
                    ),
                  )
                }
              />
              <span className="grow">
                <span className={task.done ? "done" : ""}>{task.title}</span>
                <small className="caption block">{task.meta}</small>
              </span>
              <span className="tag" data-tag={task.tag}>
                {task.tag}
              </span>
            </label>
          ))}
        </section>
      </Screen>
      {sheet && (
        <Modal title="할 일 추가" sheet onClose={() => setSheet(false)}>
          <input
            aria-label="할 일"
            placeholder="무엇을 할까요?"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            autoFocus
          />
          <div className="chips">
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                selected={newTag === tag}
                onClick={() => setNewTag(tag)}
              />
            ))}
          </div>
          <Button
            title="추가하기"
            onClick={addTask}
            disabled={!newTask.trim()}
          />
          <Button
            title="취소"
            variant="secondary"
            onClick={() => setSheet(false)}
          />
        </Modal>
      )}
      {toast}
    </>
  );
}

import { useState } from "react";
import { useAuth } from "@/api/auth";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Modal } from "@/components/Modal";
const settings = [
  { key: "push", label: "푸시 알림" },
  { key: "sound", label: "효과음" },
  { key: "face", label: "생체 인증 잠금" },
] as const;
export default function My() {
  const { user, signOut } = useAuth();
  // Existing demo switches only; no device settings are changed.
  const [values, setValues] = useState({
    push: true,
    sound: false,
    face: true,
  });
  const [modal, setModal] = useState(false);
  return (
    <>
      <Screen>
        <h1>MY</h1>
        <div className="row profile">
          <span className="avatar">{user?.name.slice(0, 1)}</span>
          <div>
            <h2>{user?.name}</h2>
            <p className="caption">{user?.email}</p>
          </div>
        </div>
        <section className="card stack">
          <h2>알림 및 환경</h2>
          {settings.map((setting) => (
            <label className="row setting" key={setting.key}>
              {setting.label}
              <input
                type="checkbox"
                role="switch"
                checked={values[setting.key]}
                onChange={() =>
                  setValues({ ...values, [setting.key]: !values[setting.key] })
                }
              />
            </label>
          ))}
        </section>
        <button
          className="text-button danger-text"
          onClick={() => setModal(true)}
        >
          로그아웃
        </button>
      </Screen>
      {modal && (
        <Modal title="로그아웃할까요?" onClose={() => setModal(false)}>
          <p>계정에서 로그아웃합니다.</p>
          <div className="row">
            <Button
              title="취소"
              variant="secondary"
              onClick={() => setModal(false)}
            />
            <Button
              title="로그아웃"
              variant="danger"
              onClick={() => void signOut()}
            />
          </div>
        </Modal>
      )}
    </>
  );
}

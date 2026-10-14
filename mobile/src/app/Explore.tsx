import { useState } from "react";
import { Heart } from "lucide-react";
import { Chip } from "@/components/Chip";
import { Screen } from "@/components/Screen";
// Existing local demo collection, not an API response.
const allItems = [
  { id: 1, title: "밤의 플레이리스트", cat: "음악", count: "24곡" },
  { id: 2, title: "미니멀 작업실", cat: "공간", count: "18장" },
  { id: 3, title: "주말 레시피", cat: "요리", count: "9개" },
  { id: 4, title: "보라빛 도시", cat: "사진", count: "32장" },
  { id: 5, title: "집중 사운드", cat: "음악", count: "12곡" },
  { id: 6, title: "작은 식물들", cat: "공간", count: "15장" },
];
const cats = ["전체", "음악", "공간", "사진", "요리"];
export default function Explore() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("전체");
  const [favs, setFavs] = useState<Record<number, boolean>>({ 2: true });
  const items = allItems.filter(
    (item) => (cat === "전체" || item.cat === cat) && item.title.includes(q),
  );
  return (
    <Screen>
      <h1>탐색</h1>
      <input
        type="search"
        aria-label="검색"
        placeholder="검색"
        value={q}
        onChange={(event) => setQ(event.target.value)}
      />
      <div className="chips">
        {cats.map((category) => (
          <Chip
            key={category}
            label={category}
            selected={cat === category}
            onClick={() => setCat(category)}
          />
        ))}
      </div>
      {items.length === 0 ? (
        <p>검색 결과가 없어요</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <article key={item.id} className="stack collection">
              <div className="cover">
                <button
                  className="icon-button"
                  aria-label={`${item.title} 즐겨찾기`}
                  aria-pressed={!!favs[item.id]}
                  onClick={() =>
                    setFavs({ ...favs, [item.id]: !favs[item.id] })
                  }
                >
                  <Heart fill={favs[item.id] ? "currentColor" : "none"} />
                </button>
              </div>
              <h2>{item.title}</h2>
              <p className="caption">
                {item.cat} · {item.count}
              </p>
            </article>
          ))}
        </div>
      )}
    </Screen>
  );
}

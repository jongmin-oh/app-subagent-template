import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Chip } from "@/components/Chip";
import { Screen } from "@/components/Screen";
import { colors, gradients, radius, spacing, touchTarget, typography } from "@/theme";

// ponytail: 로컬 mock. 탐색 API 생기면 교체
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

  const items = allItems.filter((i) => (cat === "전체" || i.cat === cat) && i.title.includes(q));

  return (
    <Screen>
      <Text style={styles.title}>탐색</Text>
      <View style={styles.search}>
        <Feather name="search" size={18} color={colors.textTertiary} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="검색"
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
        />
      </View>
      <View style={styles.chips}>
        {cats.map((c) => (
          <Chip key={c} label={c} selected={cat === c} onPress={() => setCat(c)} />
        ))}
      </View>

      {items.length === 0 ? (
        <Text style={styles.empty}>검색 결과가 없어요</Text>
      ) : (
        <View style={styles.grid}>
          {items.map((i) => (
            <View key={i.id} style={styles.item}>
              <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cover}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="즐겨찾기"
                  accessibilityState={{ selected: !!favs[i.id] }}
                  onPress={() => setFavs({ ...favs, [i.id]: !favs[i.id] })}
                  style={styles.fav}
                >
                  <FontAwesome name={favs[i.id] ? "heart" : "heart-o"} size={18} color={colors.white} />
                </Pressable>
              </LinearGradient>
              <Text style={styles.itemTitle}>{i.title}</Text>
              <Text style={styles.caption}>
                {i.cat} · {i.count}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title1, color: colors.text },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  input: { ...typography.body1, flex: 1, minHeight: touchTarget, color: colors.text },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  empty: { ...typography.body2, color: colors.textTertiary, textAlign: "center", padding: spacing["3xl"] },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  item: { width: "48%", gap: spacing["2xs"] },
  cover: { aspectRatio: 1, borderRadius: radius.md, alignItems: "flex-end" },
  fav: { width: touchTarget, height: touchTarget, alignItems: "center", justifyContent: "center" },
  itemTitle: { ...typography.body2, fontFamily: "Pretendard-SemiBold", color: colors.text },
  caption: { ...typography.caption, color: colors.textTertiary },
});

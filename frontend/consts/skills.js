const skills = [
  "マーケティング",
  "プランニング",
  "プロジェクトマネジメント",
  "財務分析",
  "リーダーシップ",
  "チームビルディング",
  "プレゼンテーション",
  "ネットワーキング",
  "技術",
  "データ分析",
  "問題解決",
  "営業",
  "パートナーシップ開発",
  "リスクマネジメント",
  "交渉",
  "コミュニケーション",
  "クリエイティブ思考",
  "プロトタイピング",
  "ユーザビリティテスト",
  "プロダクトマネジメント",
];

const colors = [
  "#ff80ed",
  "#065535",
  "#000000",
  "#133337",
  "#ffc0cb",
  "#c0d6e4",
  "#ffe4e1",
  "#008080",
  "#ff0000",
  "#e6e6fa",
  "#ffd700",
  "#00ffff",
  "#ffa500",
  "#ff7373",
  "#0000ff",
  "#c6e2ff",
  "#40e0d0",
  "#d3ffce",
  "#f0f8ff",
  "#b0e0e6",
];

export const SkillToColor = {};
skills.forEach((skill, index) => {
  SkillToColor[skill] = colors[index];
});

export const Skills = skills.map((name, index) => ({
  name: name,
  color: colors[index],
}));

export const SkillTagOptions = Skills.map((skill) => ({
  label: skill.name,
  value: skill.name + skill.color,
}));

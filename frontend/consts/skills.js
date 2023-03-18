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
  '#FF6347', 
  '#CCCC00', 
  '#00FF00', 
  '#1E90FF', 
  '#8A2BE2', 
  '#9932CC', 
  '#FF0000', 
  '#FFFF00', 
  '#008000', 
  '#0000FF', 
  '#FF69B4', 
  '#DC143C', 
  '#FFA500', 
  '#9ACD32', 
  '#00BFFF', 
  '#BA55D3', 
  '#4169E1', 
  '#FFD700', 
  '#1E90FF', 
  '#FFC0CB'
];

export const Skills = skills.map((name, index) => ({
  name: name,
  color: colors[index],
}));

export const SkillTagOptions = Skills.map((skill) => ({
  label: skill.name,
  value: skill.name + skill.color,
}));

const badges = [
  "伸びしろのある新人",
  "一人前のプロフェッショナル",
  "達人級のエキスパート",
  "営業のスペシャリスト",
  "技術に精通したエンジニア",
  "チームワーク重視のリーダー",
  "マネジメント能力に優れたリーダー",
  "新規事業開発の専門家",
  "プロジェクトマネージャー",
  "マーケティング戦略の専門家",
  "イノベーションリーダー",
  "ビジネスディレクター",
  "データ分析のエキスパート",
  "クリエイティブディレクター",
  "デザイン思考のプロフェッショナル",
  "サプライチェーンマネージャー",
  "財務アナリスト",
  "顧客満足度向上の専門家",
  "グローバルビジネス開発者",
  "人材育成に長けたリーダー",
];

const medals = [
  "/medal-beginner.png",
  "/medal-pink-ribbon.png",
  "/medal-purple-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-purple-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-purple-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-purple-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-purple-ribbon.png",
  "/medal-pink-ribbon.png",
  "/medal-pink-ribbon.png",
];

export const BadgeToIcon = {};
badges.forEach((badge, index) => {
  BadgeToIcon[badge] = medals[index];
});

export const Badges = badges.map((name, index) => ({
  name: name,
  icon: medals[index],
}));

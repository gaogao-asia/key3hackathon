export const ACCOUNT_HARUKO = {
  firstname: "トヨタ",
  lastname: "ハルコ",
  fullname: "トヨタ　ハルコ",
  department: "デジタル変革推進本部　フロントエンドエンジニア",
  address: "0x808D721c31FD39a6f23B4baaAfC32A3622c0A724",
  icon: "/user_01.png",
};

export const ACCOUNT_NATSUKO = {
  firstname: "トヨタ",
  lastname: "ナツコ",
  fullname: "トヨタ　ナツコ",
  department: "財務企画部門　会計担当",
  address: "0x503943E7e8687573f422418CBe526Ed9ab008A73",
  icon: "/user_02.png",
};

export const ACCOUNT_AKIKO = {
  firstname: "トヨタ",
  lastname: "アキコ",
  fullname: "トヨタ　アキコ",
  department: "営業企画部門　営業企画室長",
  address: "0x4259eeee4dC6A52BBaB7603D15632dA1f24dEE6A",
  icon: "/user_03.png",
};

export const ACCOUNT_FUYUKO = {
  firstname: "トヨタ",
  lastname: "フユコ",
  fullname: "トヨタ　フユコ",
  department: "グローバル戦略部門　グローバル戦略責任者",
  address: "0x812E0e8b984C950A61D93748f8A0029123ff6180",
  icon: "/user_06.png",
};

export const ACCOUNT_TARO = {
  firstname: "トヨタ",
  lastname: "タロウ",
  fullname: "トヨタ　タロウ",
  department: "マーケティング部門　プロモーションマネージャー",
  address: "0x691DbCFfca7158AeE808E289E582f760AEb68914",
  icon: "/user_04.png",
};

export const ACCOUNT_JIRO = {
  firstname: "トヨタ",
  lastname: "ジロウ",
  fullname: "トヨタ　ジロウ",
  department: "技術開発本部　テクニカルプロジェクトマネージャー",
  address: "0xA362d99660638032CE2ACA947ABcB74C3965C75E",
  icon: "/user_05.png",
};

export const ACCOUNT_BETTY = {
  firstname: "Betty",
  lastname: "Toyota",
  fullname: "Betty Toyota",
  department: "Digital Marketing Department Project Manager",
  address: "0x4B9d99d09185b2766031973FdE1A079f77228342",
  icon: "/user_07.png",
};

export const ACCOUNT_JACK = {
  firstname: "Jack",
  lastname: "Toyota",
  fullname: "Jack Toyota",
  department: "Advanced R&D Architect",
  address: "0xf9805c214054e129FE9f52d2a8075cd4A630EC50",
  icon: "/user_08.png",
};

export const Accounts = [
  ACCOUNT_HARUKO,
  ACCOUNT_NATSUKO,
  ACCOUNT_AKIKO,
  ACCOUNT_FUYUKO,
  ACCOUNT_TARO,
  ACCOUNT_JIRO,
  ACCOUNT_BETTY,
  ACCOUNT_JACK,
];

export const AccountsMap = {};
Accounts.forEach((a) => {
  AccountsMap[a.address] = a;
});

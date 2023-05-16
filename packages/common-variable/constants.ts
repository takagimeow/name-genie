export const options: { value: string; text: string; }[] = [
  {
    value: "variableName",
    text: "変数名",
  },
  {
    value: "functionName",
    text: "関数名",
  },
  {
    value: "className",
    text: "クラス名",
  },
  {
    value: "interfaceName",
    text: "インターフェース名",
  },
  {
    value: "branchName",
    text: "ブランチ名",
  },
  {
    value: "commitMessage",
    text: "コミットメッセージ",
  },
  {
    value: "pullRequestTitle",
    text: "プルリクエストタイトル",
  },
  {
    value: "fileName",
    text: "ファイル名",
  },
]

export const presets: { key: string; value: string; text: string; }[] = [
  {
    key: "none",
    value: "なし",
    text: "なし",
  },
  {
    key: "hyphenSeparated",
    value: "ハイフン区切り",
    text: "ハイフン区切り",
  },
  {
    key: "startWithLowerCase",
    value: "小文字から始めてください",
    text: "小文字で始める",
  },
  {
    key: "camelCase",
    value: "キャメルケースで作成してください",
    text: "キャメルケース",
  },
  {
    key: "cebabCase",
    value: "ケバブケースで作成してください",
    text: "ケバブケース",
  },
  {
    key: "snakeCase",
    value: "スネークケースで作成してください",
    text: "スネークケース",
  },
  {
    key: "pascalCase",
    value: "パスカルケースで作成してください",
    text: "パスカルケース",
  },
];
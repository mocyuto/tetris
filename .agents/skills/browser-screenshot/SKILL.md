---
name: browser-screenshot
description: >-
  Use when the user wants to capture a screenshot or visually verify a browser
  page in this repository. Before asking the user for an access URL, first try
  `{branch name}.localhost:1355`; if that does not work, ask for the URL. This
  includes opening local or remote pages with agent-browser, checking the UI
  after front-end implementation, confirming layout, interactions, and
  responsive behavior, and saving screenshots under the repository's `tmp/`
  directory. Use the development quick login when authentication is needed,
  and inspect the page with agent-browser before capturing.
---
# Browser Screenshot and Visual Verification with agent-browser

このスキルは、まず現在の起動している開発サーバーを使って `127.0.0.1:5173` を試し、必要ならログインして、スクリーンショットを保存するだけでなく、フロント実装後の画面確認や動作確認にも使う標準手順です。ブランチURLで目的の画面に到達できない場合だけ、ユーザーにアクセスURLを確認します。

## 使う場面
- 任意の画面のスクショを撮りたい
- フロント実装後に、画面崩れや表示差分をブラウザで確認したい
- ローカル開発環境の画面を操作して挙動を確認したい
- 認証後の画面を手早く保存したい

## 既定の流れ
1. 現在の起動している開発サーバーを使って `127.0.0.1:5173` を試す。
2. そのURLで目的の画面に到達できない場合だけ、ユーザーにアクセスURLを確認する。
3. 指定されたURLを `agent-browser open <url>` で開く。
4. ログイン画面なら `開発用クイックログイン` を使う。
5. 目的の画面へ移動し、フロント実装の結果を確認する。
6. `agent-browser wait --load networkidle` で描画を待つ。
7. `agent-browser snapshot -i` で状態を確認する。
8. 必要に応じてボタン操作、入力、遷移を行い、確認したい状態まで進める。
9. 画面遷移や動的表示の後は必ず再 `snapshot` する。
10. `agent-browser screenshot tmp/<name>.png` で保存する。

## ルール
- 既存データを書き換えずに撮る。
- DB にテストデータを追加しない。
- フロント実装の確認では、スクショ前に表示崩れ、余白、状態遷移、レスポンシブを必ず見る。
- 画面遷移や動的表示の後は必ず再 `snapshot` する。
- 1画面だけなら通常スクショ、全体が必要なら `--full` を使う。
- ファイル名は ASCII で、画面名が分かるものにする。
- 保存先は必ずリポジトリ内の `tmp/` にする。

## 認証
- `screenshot.localhost:1355/login?from=%2F` や任意のログイン画面に飛ばされた場合は、開発用クイックログインを優先する。
- クイックログインが使えない場合だけ、既存のセッションやトークン注入を検討する。

## 例
```bash
agent-browser open <user_provided_url>
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser click @e2
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser screenshot tmp/interview-questions.png
```

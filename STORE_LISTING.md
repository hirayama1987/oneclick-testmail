# Chrome Web Store 公開用メモ

Developer Dashboard (https://chrome.google.com/webstore/devconsole) にアップロードする際に、そのままコピー&ペーストして使ってください。

## パッケージ

- アップロードするZIP: `dist/oneclick-testmail.zip`（このメモの下にある手順で生成）
- バージョン: `1.0.0`（manifest.json と一致）

## ストア掲載情報（日本語）

**拡張機能名**
ワンクリック捨てアド

**概要（132文字以内）**
クリックするだけで会員登録用の使い捨てメールアドレスを生成し、クリップボードに自動コピー。届いたメールはいつも通り受信箱に届きます。

**詳細説明**
ワンクリック捨てアドは、Web開発者・エンジニア向けに作られた Chrome 拡張機能です。

会員登録フォームのテストのたびに使い捨てのメールアドレスを考える手間をなくします。ツールバーのアイコンをクリックするだけで、その場でユニークなエイリアスアドレスを生成し、自動的にクリップボードへコピーします。

- 生成されるアドレスは `あなたのアドレス+生成日時@ドメイン` の形式（例: you+20260915143205@example.com）
- `+`以降のタグはメールサーバー側で無視されるため、確認メールなどは通常通りご自身の受信箱に届きます
- 外部サーバーとは一切通信しません。生成・保存はすべてローカルで完結します
- 直近20件の生成履歴からいつでも再コピー可能
- 日本語 / English 表示に対応

**使い方**
1. アイコンをクリックし、ベースにする自分のメールアドレスを登録
2. 以降はクリックするたびに新しい捨てアドが生成・コピーされる
3. 会員登録フォームに貼り付け

**カテゴリ**: 生産性
**言語**: 日本語、English
**単一の目的（Single purpose）**: 会員登録フォーム用の使い捨てメールエイリアスを生成し、クリップボードにコピーする。

## Store listing (English)

**Extension name**
One-Click Burner Email

**Summary (132 chars max)**
Generate a disposable sign-up email address and copy it to your clipboard with one click. Mail still lands in your own inbox.

**Detailed description**
One-Click Burner Email is a Chrome extension built for web developers and engineers.

Stop making up throwaway addresses every time you test a sign-up form. Click the toolbar icon and a unique alias is generated instantly and copied to your clipboard.

- Generated addresses look like `you+20260915143205@example.com` (your address + generation timestamp)
- Since mail servers ignore everything after `+`, confirmation emails still land in your own inbox as usual
- No communication with any external server — everything is generated and stored locally
- Re-copy any of your last 20 generated addresses from the history list
- Available in Japanese and English

**How to use**
1. Click the icon and register the email address you want to use as your base
2. From then on, every click generates and copies a fresh burner address
3. Paste it into the sign-up form

**Category**: Productivity
**Languages**: Japanese, English
**Single purpose**: Generates a disposable email alias for sign-up forms and copies it to the clipboard.

## 権限の説明（Permissions justification）

Developer Dashboard の「権限の正当化」欄には以下を入力してください。

- **storage**: ユーザーが設定したベースのメールアドレスと、生成したアドレスの履歴をブラウザ内にローカル保存するために使用します。外部送信はありません。

## プライバシー慣行（Privacy practices タブ）

- 「ユーザーデータを収集していますか？」→ **はい**
- 収集するデータの種類 → **個人を特定できる情報（メールアドレス）**
- 用途 → アプリの機能を実現するため（エイリアス生成のベースとして使用）。第三者への販売・共有なし、広告目的での使用なし
- プライバシーポリシー URL → `https://hirayama1987.github.io/oneclick-testmail/privacy.html`（公開済み）
- リモートコードを使用していますか？ → **いいえ**。理由: 「本拡張機能はリモートコードを使用していません。すべてのコードはパッケージ内に同梱されており、外部から実行時にコードを取得することはありません。」
- 単一の目的の説明 → 「会員登録フォーム用の使い捨てメールアドレス（+タグ付きエイリアス）を生成し、クリップボードにコピーする。それ以外の機能は持たない。」
- データ使用がポリシーに準拠していることの証明チェックボックス → 上記をすべて入力した上でチェック

## パブリッシャー連絡先メールアドレス（[設定]ページ）

- Developer Dashboard の[設定]ページで連絡先メールアドレスを入力し、届いた確認メールのリンクで認証する（未認証だと公開不可）

## スクリーンショット

- 必須: 1280x800 または 640x400 の PNG/JPG（アルファチャンネルなし）を1〜5枚
- 用意できていない場合は、実際にポップアップを開いた状態を Cmd+Shift+4 でスクリーンショットし、教えてください。1280x800 のキャンバスに収まるよう余白を足す加工はこちらで行えます。

## GitHub Pages（プライバシーポリシー）

公開済み: https://hirayama1987.github.io/oneclick-testmail/privacy.html

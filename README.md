# TrustX

TrustX は TOYOTA × HAKUHODO KEY3 web3 Hackathon において作成されたプロダクトです。  
TrustX は、ブロックチェーンを使用した新規事業プロジェクト向けのタスク管理ツールです。  
一番の特徴は、プロジェクトを通して得られた経験やスキルをブロックチェーンに蓄積することにあります。これにより、信頼性のある個人のスキルや評価をプロジェクト外の人も見ることができ、新しいプロジェクトを開始する際に、優秀な人材の発掘を後押しします。

## スクリーンショット & デモ動画

![01](https://github.com/gaogao-asia/key3hackathon/blob/main/pictures/01.png?raw=true)

![02](https://github.com/gaogao-asia/key3hackathon/blob/main/pictures/02.png?raw=true)

![03](https://github.com/gaogao-asia/key3hackathon/blob/main/pictures/03.png?raw=true)

![04](https://github.com/gaogao-asia/key3hackathon/blob/main/pictures/04.png?raw=true)

![05](https://github.com/gaogao-asia/key3hackathon/blob/main/pictures/05.png?raw=true)

https://www.youtube.com/watch?v=VD1L4O21YhQ&feature=youtu.be

## 使い方

使い方は主に以下のような流れになります

1. 新しいプロジェクトの作成
2. タスクの作成、実施者とレビュワーの設定
3. タスクの実施、レビューリクエスト
4. タスクのレビューと評価

## 特徴

特徴は主に次の 2 つがあります。

(1) ブロックチェーンを使用したことがない人でも、簡単に扱えるような UI を目指しました。プロジェクト管理で広く使用されるカンバンの UI を中心に置くことで、初めて使う人でもどういうシステムなのか分かりやすいようにしていあります。一方、タスクのステータスはスマートコントラクト上で処理されるため、スマートコントラクトで定義された厳格なルールに基づきます。タスクを完了させるには、レビュワーの承認が必要です。タスク完了実績はプロジェクト内外から閲覧可能であるため、不正に作成できない仕組みにしてあります。

(2) 活動履歴の可視化をしています。過去に行ったタスク、それに対するレビュワーの評価はプロジェクト外の人も閲覧可能です。これにより、新規プロジェクト立ち上げで人材を探す際に使用でき、スマートコントラクト上の信頼ある情報源を元に人材を探すことができます。

## アーキテクチャ

以下の画像は現在のシステム構成を表しています。

![architecture](https://github.com/gaogao-asia/key3hackathon/blob/main/architecture.drawio.svg?raw=true)

ブロックチェーン上のスマートコントラクトと分散ストレージにより、特定のサーバーに依存しない構成になっています。現在、スマートコントラクトは Astar Netwrok の [Shibuya ブロックチェーン](https://blockscout.com/shibuya)にデプロイしてあります。

TrustX コントラクト: [0x9c9746B5c46F95b3AE503467fBFBB814e0613681](https://blockscout.com/shibuya/address/0x9c9746B5c46F95b3AE503467fBFBB814e0613681)

TrustX スマートコントラクトは、ユーザーから送られる、プロジェクトの新規作成、タスクの追加、タスクの開始、レビュー依頼、承認などのリクエストを処理します。これらのリクエストを検証した上で、正確にタスクのステータスが遷移します。また、レビュワーは実施されたタスクをレビューして承認する際に、コメントともに事前に設定されたスキルごとの評価を登録することが出来ます。

スマートコントラクト内で発生するイベントデータを元に、クエリ用の API を構築する Indexer サービスである[SubQuery](https://subquery.network/)を使用しています。SubQuery を使用することで、スマートコントラクトに保存された信頼できるデータを元にしつつ、高度な UI を構築するための API を実装しています。

タスクの内容やレビュー本文などサイズの大きいデータは分散ストレージである [IPFS](https://ipfs.tech/) に保存しています。また、IPFS へアクセスするためのノードは [Infura](https://www.infura.io/) のノードプロバイダーサービス使用しています。

## ディレクトリ構造

```txt
.
├── frontend (Next.jsを使用した、Web UIの実装)
└── backend/
    ├── contracts (スマートコントラクトの実装)
    └── subquery (スマートコントラクトのIndexer用のコード)
```

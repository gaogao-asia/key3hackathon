import { ethers } from "hardhat";
import { Accounts } from "../consts/accounts";
import { ProjectNames } from "../consts/projects";
import { uploadData } from "./ipfs";

const TRUSTX_CONTRACT_ADDRESS = process.env.TRUSTX_CONTRACT_ADDRESS;

const TASKS = [
  {
    name: "ホームページ作成",
    status: "todo",
    accountIndex: 0,
    reviewerIndices: [4, 5],
    description: `目的：
「TOYOTA Smart Key」アプリを使うことでスマートフォンをカーキーとして使用することができることを伝えるためのWebページを作成する。
    
タスク内容：
1. ホームページの設計・デザインの検討：TOYOTAブランドイメージに沿ったデザインを考え、ページの構成を決定する。
2. コンテンツの作成：「TOYOTA Smart Key」の特徴や使い方、対応車両などの情報をまとめ、わかりやすく説明する。
3. スマートフォンでの表示確認：ホームページがスマートフォンで正しく表示されるかを確認する。
4. SEO対策：検索エンジン最適化のための対策を行い、検索結果上位に表示されるようにする。
5. ページ公開：完成したホームページを公開し、アクセスできるようにする。`,
    skills: ["技術", "クリエイティブ思考"],
  },
  {
    name: "iOSアプリプロトタイプ作成",
    status: "todo",
    accountIndex: 0,
    reviewerIndices: [4, 5],
    description: `目的：
「TOYOTA Smart Key」アプリのiOS版のプロトタイプを作成することで、アプリの機能や操作性を検証し、ユーザーのニーズを把握する。

タスク内容：  
1. 要件定義の検討：iOS版アプリにおいて必要な機能や要件を洗い出し、検討する。
2. プロトタイプの設計・デザインの検討：アプリのユーザビリティを向上させるために、ユーザーがスムーズに操作できるインタフェースを設計する。
3. プロトタイプの実装：Swiftなどのプログラミング言語を用いて、iOSアプリのプロトタイプを実装する。
4. 検証：プロトタイプが想定通りの機能を持っているか、ユーザビリティに問題がないかなどを検証する。
5. フィードバックの反映：ユーザーテストの結果やフィードバックをもとに、プロトタイプに修正を加える。
6. プロトタイプの納品：完成したiOSアプリのプロトタイプを提出し、次の段階に進める。`,
    skills: ["技術", "クリエイティブ思考", "問題解決"],
  },
  {
    name: "広告作成",
    status: "todo",
    accountIndex: 4,
    reviewerIndices: [2, 3],
    description: `目的：
「TOYOTA Smart Key」アプリを知ってもらい、ユーザーのアプリダウンロード促進を目的とした広告を作成すること。

タスク内容：
1. 広告の目的・ターゲット層の設定：広告の目的を明確にし、アプリをダウンロードしてほしいターゲット層を設定する。
2. 広告のメッセージ・キャッチコピーの検討：ターゲット層に合わせたアピールポイントを設定し、魅力的なキャッチコピーを考える。
3. 広告のデザインの検討：デザインを統一感のあるTOYOTAブランドカラーにし、ターゲット層に合わせたアプローチを行う。
4. 広告のメディアプランの検討：どのメディアを使って広告を出稿するか、広告予算はどの程度かなどを検討する。
5. 広告の出稿・配信：出稿するメディアや広告形態を決定し、広告を出稿する。また、広告の配信状況や反響を定期的に確認し、最適化を行う。`,
    skills: ["マーケティング", "プレゼンテーション", "コミュニケーション"],
  },
  {
    name: "戦略リサーチ",
    status: "in_progress",
    accountIndex: 3,
    reviewerIndices: [2],
    description: `目的：
「TOYOTA Smart Key」アプリを開発・提供することにより、ユーザーが抱える課題を解決するための戦略を立てること。

タスク内容：    
1. アプリの利用目的やニーズの把握：アプリを利用するユーザーの目的やニーズ、現状の課題、改善点を把握する。
2. アプリのターゲット層の把握：アプリを利用する想定ターゲット層を設定し、その人たちの特徴や課題を把握する。
3. 市場調査の実施：アプリ提供に関連する市場動向や競合情報を調査し、市場環境を把握する。
4. アプリの優位性の明確化：アプリ提供によってどのようなメリットや優位性があるのか、明確にする。
5. アプリ提供における課題やリスクの洗い出し：アプリ提供に際して考えられる課題やリスクを洗い出し、対策を考える。`,
    skills: ["マーケティング", "プランニング", "プレゼンテーション"],
  },
  {
    name: "予算策定",
    status: "in_progress",
    accountIndex: 1,
    reviewerIndices: [3, 5],
    description: `目的：
「TOYOTA Smart Key」アプリを開発・提供するために必要な予算を策定すること。

タスク内容： 
1. 必要なコストの洗い出し：アプリ開発に必要なコストを洗い出す。開発に必要な人員の数や期間、ハードウェアやソフトウェアの調達費用、マーケティング費用などを予算化する。
2. 予算の割り振り：必要なコストを各項目ごとに分類し、優先順位を決定する。その後、予算を割り振り、どの項目にどの程度の予算を投資するかを決定する。
3. コストの最適化：予算が限られている場合は、各項目ごとにコストの最適化を行う。例えば、開発期間を短縮するために必要な人員の数を削減したり、マーケティング費用を減らすことができるかどうかを検討する。
4. 予算管理：プロジェクトが進行していく中で、予算に変更が生じることがあるため、予算の管理を行う。進捗状況を定期的に確認し、予算が足りなくなる前に適切な対策を講じる。`,
    skills: ["財務分析", "リスクマネジメント", "プランニング"],
  },
  {
    name: "営業資料作成",
    status: "in_progress",
    accountIndex: 2,
    reviewerIndices: [3, 4],
    description: `目的：
「TOYOTA Smart Key」アプリを提供することで、顧客に提供できるメリットや価値を説明するための営業資料を作成すること。

タスク内容： 
1. 資料の目的と対象者を定義する：営業資料の目的や対象者を定義する。誰に対してどのようなメッセージを伝えるかを明確にする。
2. メッセージの策定：提供するメリットや価値を説明するためのメッセージを策定する。アプリの特徴や顧客が得られるメリット、競合製品との差別化点などを明確にする。
3. デザインの決定：資料のデザインを決定する。カラーリング、レイアウト、フォントなどを選定し、統一感のあるデザインを作成する。
4. 内容の作成：メッセージやデザインに基づいて、資料の内容を作成する。アプリの概要や機能、利用方法、料金プラン、サポート内容などを明確に記載する。
5. 最終チェック：作成した資料の最終チェックを行う。誤字脱字がないか、レイアウトが崩れていないか、メッセージが一貫しているかなどを確認する。`,
    skills: [
      "マーケティング",
      "プレゼンテーション",
      "クリエイティブ思考",
      "営業",
    ],
  },
  {
    name: "営業戦略策定",
    status: "in_progress",
    accountIndex: 2,
    reviewerIndices: [3, 4],
    description: `目的：
「TOYOTA Smart Key」アプリの営業戦略を策定することで、アプリの販売促進や普及拡大を目指す。

タスク内容：
1. アプリの特徴やメリットの洗い出し：アプリの提供するメリットや顧客の課題解決点を洗い出す。顧客が求めるものと、アプリが提供できるものをマッチングする。
2. ターゲット顧客の設定：アプリの利用対象者を設定する。ターゲット顧客の属性や行動パターン、ニーズなどを明確にする。
3. 営業チャネルの選定：アプリを提供するために、どのような営業チャネルを選定するかを検討する。直販、代理店販売、ECサイト販売などの選択肢がある。
4. 販促プランの策定：ターゲット顧客にアプリを知ってもらうための販促プランを策定する。営業チャネル、広告媒体、プロモーションイベントなどを選定し、販促スケジュールを作成する。
5. 販売目標の設定：アプリの販売目標を設定する。売上目標や利用者数目標、市場シェアなどを設定する。`,
    skills: ["マーケティング", "プランニング", "営業"],
  },
  {
    name: "ダッシュボード作成",
    status: "in_review",
    accountIndex: 0,
    reviewerIndices: [5],
    description: `目的:
プロジェクトの進捗状況を可視化し、関係者が簡単に把握できるようにする。

タスク内容:
1. ダッシュボードに表示する情報の決定: プロジェクトの進捗状況に必要な情報を洗い出し、優先順位を決定する。
2. ダッシュボードのデザイン: ダッシュボードのレイアウトを決定し、情報の配置を検討する。
3. ダッシュボードに反映するデータの取得: 必要なデータのソースを特定し、データの収集方法を検討した上でデータの加工や集計を行い、ダッシュボードに表示するための形式に整形する。`,
    artifact: `以下の内容をまとめました。ご確認宜しくお願いします。
・データを可視化したダッシュボードのデザイン案
・ダッシュボードに表示する指標やメトリクスのリスト
・ダッシュボードに表示するグラフやチャートの種類やレイアウトの提案
・ダッシュボードのプロトタイプ`,
    skills: ["技術", "データ分析", "プロトタイピング"],
    reviewed: [false],
  },
  {
    name: "オンボーディング資料作成",
    status: "in_review",
    accountIndex: 2,
    reviewerIndices: [0, 5],
    description: `目的:
新しい従業員やパートナーがプロジェクトに参加した際に、迅速かつ効果的にプロジェクトの内容や目的を理解できるように、資料を作成する。
    
タスク内容:
1. プロジェクト概要の作成: プロジェクトの背景、目的、スコープ、メンバー構成、進捗状況などをまとめた概要資料を作成する。
2. プロジェクトのビジョンや戦略の説明: プロジェクトのビジョンや戦略について、具体的な説明を行い、理解を促進するための資料を作成する。
3. プロジェクトに関するガイドラインの作成: プロジェクトに関する業務プロセス、ルール、ガイドラインなどをまとめた資料を作成する。
4. プロジェクトに関するFAQ（よくある質問）の作成: 新しいメンバーがプロジェクトに参加する際に、よくある質問に対する回答をまとめたFAQを作成する。
5. プロジェクトに関する教育トレーニング資料の作成: プロジェクトに関する教育トレーニング資料を作成することで、新しいメンバーがより速く効果的に仕事を覚えられるようにする。`,
    skills: [
      "プレゼンテーション",
      "チームビルディング",
      "プロジェクトマネジメント",
    ],
    artifact: `以下の資料を作成し、クラウドストレージへアップロードしました。
    
1. 新規メンバー向けの教育プログラム: 新しいチームメンバーがプロジェクトに参加する前に、製品やプロジェクトの概要について教育するための教育プログラム。
2. マニュアル: 新しいチームメンバーが製品を使用する方法や、プロジェクトに関する情報を説明するためのマニュアル。
3. FAQページ: 新しいチームメンバーがよく尋ねられる質問をまとめたFAQページ。
4. ガイドライン: プロジェクトの目的、目標、戦略、および方針に関するガイドライン。
5. ウェルカムメール: 新しいチームメンバーに送信されるウェルカムメール。このメールには、プロジェクトの目的、目標、方針、および役割の概要が含まれます。
6. チーム構成図: プロジェクトのチーム構成を示す図表。
7. プロジェクトカレンダー: プロジェクトのスケジュール、予定、および期限を示すカレンダー。`,
    reviewed: [true, false],
    scores: [[4, 5, 4], []],
    comments: [
      `素晴らしいオンボーディング資料を作成していただき、ありがとうございます!
新しいメンバーがプロジェクトに参加する際に、この資料が役立つことは間違いありません。
クリアで簡潔な説明と使いやすいフォーマットに感謝します。`,
      "",
    ],
  },
  {
    name: "予定表作成",
    status: "done",
    accountIndex: 5,
    reviewerIndices: [0, 3],
    description: `目的：
プロジェクトの進捗やスケジュール管理を目的として、関係者が共有するための予定表を作成すること。

タスク内容:
1. プロジェクトの開始日から完了予定日までのスケジュールをまとめる。
2. プロジェクトの進捗状況に応じて、予定表の更新を行う。
3. 関係者に適切なタイミングで予定表を共有する。
4. 予定表のフォーマットや内容について、関係者からの要望やフィードバックに応じて改善を行う。`,
    skills: ["プランニング", "プロジェクトマネジメント"],
    artifact: `プロジェクトマネジメントツールに、プロジェクトのタスク作成し、スケジュールを策定しました。`,
    reviewed: [true, true],
    scores: [
      [5, 4],
      [5, 5],
    ],
    comments: [
      `この予定表は、プロジェクトのスケジュールを一目で確認できるようにしてくれました。
素晴らしい仕事をしてくれてありがとうございます！`,
      `タスクの期限や担当者など、情報が正確で完璧に整理されています。
この予定表がなければ、プロジェクトを管理することができなかったでしょう。`,
    ],
  },
  {
    name: "品質戦略 会議用資料作成",
    status: "done",
    accountIndex: 3,
    reviewerIndices: [1, 5],
    description: `目的:
「TOYOTA Smart Key」プロジェクトの品質戦略に関する会議で使用する資料を作成すること。

タスク内容:
1. 品質戦略に関する情報収集を行う。
2. 収集した情報を整理し、会議で使用する資料の枠組みを作成する。
3. 資料に必要なデータやグラフを作成する。
4. 資料の文章や表現などをチェックし、正確かつ分かりやすく表現する。
5. 会議前に資料を確認し、必要に応じて修正を行う。`,
    skills: ["プランニング", "リスクマネジメント", "プロダクトマネジメント"],
    artifact: `以下の資料を作成しました。
・ 品質指標や改善計画、品質改善の実績など、データを整理し表形式でまとめました
・ 品質改善の必要性や方針、進捗状況などを示すための資料を、ビジュアルやグラフを使いスライドにまとめました。
・ 詳細な品質改善の計画や実績、評価指標などを報告書の形式でまとめました。`,
    reviewed: [true, true],
    scores: [
      [3, 4, 4],
      [5, 4, 3],
    ],
    comments: [
      `改善計画や実績が具体的に示されており、品質改善に向けての取り組みがしっかりしている印象を受けました!`,
      `グラフやビジュアルが効果的に使われており、品質の状況や改善の進捗状況が一目で分かりました。`,
    ],
  },
  {
    name: "デザイン資料の作成",
    status: "done",
    accountIndex: 4,
    reviewerIndices: [0, 5],
    description: `目的:
「TOYOTA Smart Key」のデザインに必要な情報をまとめ、関係者に共有することで、デザインの一貫性を確保することを目的とする。

タスク内容： 
1. デザインに必要な情報をまとめ、ドキュメント化する。
2. デザインに必要なアセット（素材）を収集する。
3. デザインに必要なスタイルガイドを作成する。
4. デザインの方針や思想、方向性をまとめたプレゼンテーション資料を作成する。
5. デザインに必要なツールの選定や導入方法について検討する。
6. 関係者とのコミュニケーションを行い、フィードバックを取り入れながらデザイン資料を更新する。`,
    skills: ["プレゼンテーション", "クリエイティブ思考"],
    artifact: `以下を作成しました。
1. ユーザーインターフェース（UI）の設計図やワイヤーフレーム
2. カラーパレット、フォント、アイコン、画像などのグラフィックデザイン素材
3. ウェブサイトやモバイルアプリのデザインコンセプトやプロトタイプ
4. 広告や販促物のデザインコンセプトやプロトタイプ
5. 製品やサービスのパッケージデザインやラベルデザイン`,
    reviewed: [true, true],
    scores: [
      [5, 5],
      [4, 5],
    ],
    comments: [
      `このデザイン資料は非常に鮮明で、アイデアを明確に表現しています。素晴らしい仕事です！`,
      `デザインに対するあなたの熱意は素晴らしく、素晴らしい成果物を作成してくれました。ありがとうございます。`,
    ],
  },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const signers = await ethers.getSigners();

  if (!TRUSTX_CONTRACT_ADDRESS) {
    throw new Error("TRUSTX_CONTRACT_ADDRESS is not set .env");
  }

  const TrustX = await ethers.getContractFactory("TrustX");
  const instance = TrustX.attach(TRUSTX_CONTRACT_ADDRESS);

  // Create New DAO
  const projectName = ProjectNames[2];
  const ipfsContent = await uploadData({
    name: projectName,
    description:
      "スマートフォンをカーキーとして使用することができるアプリで、対応車両を操作できます。",
  });

  const createDAOTx = await instance.createDAO(
    `${ProjectNames[2]} 開発プロジェクト`,
    `ipfs://${ipfsContent.cid.toString()}`,
    false,
    Accounts.map((a) => a.address)
  );
  const receipt = await createDAOTx.wait();
  console.log(`${createDAOTx.hash} confirmed`);
  await sleep(1000);

  const daoCreated = (receipt.events ?? []).find(
    (e) => e.event === "DAOCreated"
  );

  if (!daoCreated) {
    throw new Error("DAO ID is not returned");
  }

  const daoID = await daoCreated.args![0].toHexString();

  let index = 0;
  for (const task of TASKS) {
    const taskMetadata = await uploadData({
      name: task.name,
      description: task.description,
    });

    const createTaskTx = await instance.createTask(
      daoID,
      task.name,
      `ipfs://${taskMetadata.cid.toString()}`,
      false,
      0,
      task.skills,
      signers[task.accountIndex].address,
      task.reviewerIndices.map((i) => signers[i].address)
    );
    const createTaskReceipt = await createTaskTx.wait();
    console.log(`${createTaskTx.hash} confirmed`);
    await sleep(1000);

    const taskCreated = (createTaskReceipt.events ?? []).find(
      (e) => e.event === "TaskCreated"
    );

    if (!taskCreated) {
      throw new Error("Task ID is not returned");
    }

    const taskID = await taskCreated.args![1].toHexString();

    if (task.status === "todo") {
      index++;
      console.log(`Task "${task.name} created (${index}/${TASKS.length})`);
      continue;
    }

    const startTaskTx = await instance
      .connect(signers[task.accountIndex])
      .startTask(daoID, taskID);
    const startTaskReceipt = await startTaskTx.wait();
    console.log(`${startTaskTx.hash} confirmed`);
    await sleep(1000);

    if (task.status === "in_progress") {
      index++;
      console.log(`Task "${task.name} created (${index}/${TASKS.length})`);
      console.log("");
      continue;
    }

    const artifactMetadata = await uploadData({
      name: task.name,
      description: task.artifact,
    });

    const requestReviewTx = await instance
      .connect(signers[task.accountIndex])
      .requestTaskReview(
        daoID,
        taskID,
        `ipfs://${artifactMetadata.cid.toString()}`,
        false
      );
    const requestReviewReceipt = await requestReviewTx.wait();
    console.log(`${requestReviewTx.hash} confirmed`);
    await sleep(1000);

    for (let i = 0; i < task.reviewerIndices.length; i++) {
      if (!(task?.reviewed ?? [])[i] ?? false) {
        continue;
      }

      const reviewerIndex = task.reviewerIndices[i];
      const scores = task.scores![i] as number[];
      const comment = task.comments![i] as string;

      const reviewMetadata = await uploadData({
        name: task.name,
        description: comment,
      });

      const reviewTx = await instance
        .connect(signers[reviewerIndex])
        .approveTask(
          daoID,
          taskID,
          `ipfs://${reviewMetadata.cid.toString()}`,
          false,
          scores
        );
      const reviewReceipt = await reviewTx.wait();
      console.log(`${reviewTx.hash} confirmed`);
      await sleep(1000);
    }

    index++;
    console.log(`Task "${task.name} created (${index}/${TASKS.length})`);
    console.log("");
  }

  console.log("DAO Setup:", daoID);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import React, { useMemo } from "react";
import { Steps, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const { Text, Link } = Typography;

export const WAITING_STEP_UPLOADING = 0;
export const WAITING_STEP_SIGNING = 1;
export const WAITING_STEP_CONFIRMING = 2;

export const UploadingAndSendingTx = (props) => {
  const {
    current,
    cid,
    txHash,
    descriptionForFutureTx = "スマートコントラクトにタスクを追加します",
    descriptionForOngoingTx = "スマートコントラクトを呼び出し、タスクを追加中です...",
  } = props;

  const stepItems = useMemo(() => {
    return [
      {
        key: "uploading",
        title: "コンテンツのアップロード",
        description: (() => {
          if (current === 0) {
            return (
              <div className="flex flex-col">
                <span>コンテンツをIPFSにアップロードしています</span>
                <span>{`　`}</span>
              </div>
            );
          }

          return (
            <div className="flex flex-col">
              <span>コンテンツをIPFSにアップロードしました</span>
              <span>{`URI: ipfs://${cid}`}</span>
            </div>
          );
        })(),
      },
      {
        key: "signing",
        title: "トランザクションへ署名",
        description: (() => {
          if (current < 1) {
            return (
              <div className="flex flex-col">
                <span>トランザクションに署名します</span>
                <span>{`　`}</span>
              </div>
            );
          }

          if (current == 1) {
            return (
              <div className="flex flex-col">
                <span>ウォレットでトランザクションに署名をしてください</span>
                <span>{`　`}</span>
              </div>
            );
          }

          return (
            <div className="flex flex-col">
              <span>トランザクションに署名しました</span>
              <span>{`　`}</span>
            </div>
          );
        })(),
      },
      {
        key: "confirming",
        title: "スマートコントラクト呼び出し",
        description: (() => {
          if (current < 2) {
            return (
              <div className="flex flex-col">
                <span>{descriptionForFutureTx}</span>
                <span>{`　`}</span>
              </div>
            );
          }

          if (current === 2) {
            return (
              <div className="flex flex-col">
                <span>{descriptionForOngoingTx}</span>
                <span>{`トランザクション: `}</span>
                <Link href={`https://blockscout.com/shibuya/tx/${txHash}`}>
                  {txHash}
                </Link>
              </div>
            );
          }
        })(),
      },
    ].map((step, index) => ({
      ...step,
      icon: index === current ? <LoadingOutlined /> : null,
    }));
  }, [current]);

  return (
    <div style={{ marginTop: "24px" }}>
      <Steps direction="vertical" current={current ?? 0} items={stepItems} />
    </div>
  );
};

import React from "react";
import { Descriptions, Typography } from "antd";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import * as antColors from "@ant-design/colors";
const { Text, Link } = Typography;

export const TxResult = (props) => {
  const {
    isSuccess,
    txHash,
    blockHeight,
    txCost,
    successMessage,
    errorMessage,
  } = props;

  if (!isSuccess) {
    return (
      <div className="flex flex-col justify-center mt-10">
        <ExclamationCircleFilled
          style={{ fontSize: "120px", color: antColors.red[4] }}
        />
        <div className="mt-8 flex flex-col justify-center">
          <Text strong style={{ fontSize: "24px", textAlign: "center" }}>
            {errorMessage}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center mt-10">
      <CheckCircleFilled
        style={{ fontSize: "120px", color: antColors.green[5] }}
      />
      <div className="mt-8 flex flex-col justify-center">
        <Text strong style={{ fontSize: "24px", textAlign: "center" }}>
          {successMessage}
        </Text>
        <div className="flex flex-col justify-center mt-10 mx-12">
          <Descriptions title="トランザクション情報" column={1}>
            <Descriptions.Item label="ブロック">
              <Link
                href={`https://blockscout.com/shibuya/block/${blockHeight}/transactions`}
              >{`#${blockHeight}`}</Link>
            </Descriptions.Item>
            <Descriptions.Item label="トランザクション">
              <Link href={`https://blockscout.com/shibuya/tx/${txHash}`}>
                {txHash}
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label="トランザクションコスト">
              <Text>{txCost} SBY</Text>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </div>
  );
};

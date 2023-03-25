// (レビュー依頼ボタンがある)
// In Progressのタスクをクリックすると開く。
import React, { useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Divider,
  Layout,
  Spin,
  Checkbox,
} from "antd";
import { useTask } from "../hooks/task";
import { useDAOContext } from "../contexts/dao_context";
import { uploadToIPFS } from "../clients/ipfs";
import {
  UploadingAndSendingTx,
  WAITING_STEP_CONFIRMING,
  WAITING_STEP_SIGNING,
  WAITING_STEP_UPLOADING,
} from "./UploadingAndSendingTx";
import { TxResult } from "./TxResult";
import { ethers } from "ethers";
import { TRUST_X_CONTRACT_SHIBUYA } from "../consts/contracts";
import { TRUST_X_ABI } from "../consts/abis";
import { useAccount, useSigner, useSwitchNetwork } from "wagmi";
import { useState } from "react";
import { SideTaskOverview } from "./SideTaskOverview";
import { TaskDescription } from "./TaskDescription";
import { useIPFSData } from "../hooks/ipfs_file";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getACL } from "../consts/acl";
import { DAO_ID } from "../consts/daos";
import { useLitContext } from "../contexts/lit_context";

const { Sider, Content } = Layout;

const InputArtifact = (props) => {
  const { isPrivate, onIsPrivateChange } = props;

  return (
    <>
      <Form.Item
        label="成果物"
        name="artifact"
        rules={[{ required: true, message: "Please enter the artifact" }]}
      >
        <Input.TextArea rows={6} />
      </Form.Item>
      <div class="flex justify-end">
        <Checkbox checked={isPrivate} onChange={onIsPrivateChange}>
          暗号化
        </Checkbox>
      </div>
      <div class="mt-5 flex justify-end items-center">
        <Button type="primary" htmlType="submit">
          成果物を提出して、レビューを依頼する
        </Button>
      </div>
    </>
  );
};

const TaskView = (props) => {
  const {
    isPrivate,
    onIsPrivateChange,
    form,
    onFinish,
    task,
    taskMetadata,
    loading,
    showsArtifactInput,
  } = props;

  if (loading) {
    return (
      <div
        className="flex flex-col items-center content-center justify-center"
        style={{ minHeight: "400px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <Content style={{ backgroundColor: "white" }}>
        <div style={{ paddingRight: "24px" }}>
          <TaskDescription text={taskMetadata?.description} />
          <Divider />
          <Form form={form} onFinish={onFinish} layout="vertical">
            {showsArtifactInput && (
              <InputArtifact
                isPrivate={isPrivate}
                onIsPrivateChange={onIsPrivateChange}
              />
            )}
          </Form>
        </div>
      </Content>
      <Sider theme="light">
        <SideTaskOverview task={task} />
      </Sider>
    </Layout>
  );
};

const VIEW_FORM = 0;
const VIEW_WAITING = 1;
const VIEW_RESULT = 2;

const InProgressTaskModal = ({
  taskPrimaryID,
  visible,
  onReviewRequested,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const daoData = useDAOContext();
  const taskQuery = useTask(taskPrimaryID);
  const { data: metadata, loading: isMetadataLoading } = useIPFSData(
    taskQuery?.data?.task?.metadataURI ?? ""
  );
  const { address } = useAccount();

  // 結果データ
  const [view, setView] = useState(VIEW_FORM);
  const [waitingStep, setWaitingStep] = useState(WAITING_STEP_UPLOADING);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cid, setCID] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [blockHeight, setBlockHeight] = useState(null);
  const [txCost, setTxCost] = useState(null);

  const { data: signer } = useSigner();

  const [isPrivate, setIsPrivate] = useState(false);
  const onIsPrivateChange = useCallback((e) => {
    setIsPrivate(e.target.checked);
  }, []);

  const litNodeClient = useLitContext();

  const onFinish = (values) => {
    setWaitingStep(WAITING_STEP_UPLOADING);
    setView(VIEW_WAITING);

    const contract = new ethers.Contract(
      TRUST_X_CONTRACT_SHIBUYA,
      TRUST_X_ABI,
      signer
    );

    const daoID = ethers.BigNumber.from(daoData?.dao?.daoID);

    (async () => {
      try {
        let artifact = values.artifact;
        let esk = undefined;

        if (isPrivate) {
          const asg = localStorage.getItem("lit-auth-signature");
          console.log("debug::local storage authSig", asg);
          if (!asg || JSON.parse(asg).address !== address) {
            const networkVersion = await window.ethereum.request({
              method: "net_version",
            });

            console.log("debug::networkVersion", networkVersion);

            if (networkVersion != "80001") {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x13881" }],
              });

              await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            console.log("debug::switched to mumbai");
          }

          console.log(
            "current network ID",
            await window.ethereum.request({
              method: "net_version",
            })
          );

          const authSig = await LitJsSdk.checkAndSignAuthMessage({
            chain: "mumbai",
            switchChain: true,
          });

          console.log("debug::authSig", authSig);

          const networkVersion = await window.ethereum.request({
            method: "net_version",
          });

          // switch to shibuya
          if (networkVersion != "81") {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x51" }],
            });
          }
          console.log("debug::switched to shibuya");

          const { encryptedString, symmetricKey } =
            await LitJsSdk.encryptString(values.artifact);
          console.log("debug::encryptedString", encryptedString);
          console.log("debug::symmetricKey", symmetricKey);

          const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
            accessControlConditions: getACL(DAO_ID),
            symmetricKey,
            authSig,
            chain: "mumbai",
          });

          artifact = await LitJsSdk.blobToBase64String(encryptedString);
          esk = LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "hex");

          console.log("debug::artifact", artifact);
          console.log("debug::decodedEncryptedSymmetricKey", esk);
        }

        const cid = await uploadToIPFS({
          description: artifact,
          isPrivate: isPrivate,
          encryptedSymmetricKey: esk ? esk : null,
        });

        setCID(cid);
        setWaitingStep(WAITING_STEP_SIGNING);

        const tx = await contract.requestTaskReview(
          // DAO ID
          daoID,
          // Task ID
          taskQuery?.data?.task?.taskID,
          // messageURI
          `ipfs://${cid}`,
          // isPrivate
          isPrivate
        );

        console.log("debug::tx", tx);

        setTxHash(tx.hash);

        setWaitingStep(WAITING_STEP_CONFIRMING);

        const receipt = await tx.wait();

        console.log("debug::receipt", receipt);

        setTxCost(
          ethers.utils.formatEther(
            receipt.gasUsed.mul(receipt.effectiveGasPrice)
          )
        );
        setBlockHeight(receipt.blockNumber);

        onReviewRequested && onReviewRequested(taskPrimaryID);

        setIsSuccess(true);
      } catch (error) {
        console.error(error);
        setIsSuccess(false);
      } finally {
        setView(VIEW_RESULT);

        const networkVersion = await window.ethereum.request({
          method: "net_version",
        });

        // switch to shibuya
        if (networkVersion != "81") {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x51" }],
          });
        }
      }
    })();
  };

  const handleCancel = () => {
    form.resetFields();
    setView(VIEW_FORM);
    setWaitingStep(WAITING_STEP_UPLOADING);
    onCancel(taskPrimaryID, isSuccess);

    setIsSuccess(false);
    setCID(null);
    setTxHash(null);
    setBlockHeight(null);
    setTxCost(null);
    setIsPrivate(false);
  };

  const Views = [
    <TaskView
      form={form}
      onFinish={onFinish}
      task={taskQuery?.data?.task}
      taskMetadata={metadata}
      loading={taskQuery.loading || isMetadataLoading}
      showsArtifactInput={taskQuery?.data?.task.assigner === address}
      isPrivate={isPrivate}
      onIsPrivateChange={onIsPrivateChange}
    />,
    <UploadingAndSendingTx
      current={waitingStep}
      cid={cid}
      txHash={txHash}
      descriptionForFutureTx={"レビュー依頼をします"}
      descriptionForOngoingTx={
        "スマートコントラクトを呼び出し、レビュー依頼を送信しています..."
      }
    />,
    <TxResult
      isSuccess={isSuccess}
      txHash={txHash}
      blockHeight={blockHeight}
      txCost={txCost}
      successMessage={"レビュー依頼をしました"}
      errorMessage={"レビュー依頼に失敗しました"}
    />,
  ];

  return (
    <Modal
      title={taskQuery?.data?.task?.name}
      open={visible}
      onCancel={handleCancel}
      footer={false}
      destroyOnClose
      width="1000px"
      bodyStyle={{ margin: "24px 0px" }}
    >
      {Views[view]}
    </Modal>
  );
};

export default InProgressTaskModal;

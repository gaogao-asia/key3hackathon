import React from "react";
import { useState } from "react";
import { Typography, Modal, Form, Input, Select, Tag, Button } from "antd";
import { Skills } from "../consts/skills";
import { AccountsMap } from "../consts/accounts";
import { useDAOContext } from "../contexts/dao_context";
import { TRUST_X_CONTRACT_SHIBUYA } from "../consts/contracts";
import { TRUST_X_ABI } from "../consts/abis";
import { useSigner } from "wagmi";
import { ethers } from "ethers";
import { uploadToIPFS } from "../clients/ipfs";
import {
  UploadingAndSendingTx,
  WAITING_STEP_UPLOADING,
  WAITING_STEP_SIGNING,
  WAITING_STEP_CONFIRMING,
} from "./UploadingAndSendingTx";
import { TxResult } from "./TxResult";

const { Text, Link } = Typography;

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={value.slice(-7)}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const InputTask = (props) => {
  const { form, onFinish } = props;

  const assigner = Form.useWatch("assigner", form);
  const reviewers = Form.useWatch("reviewers", form);

  const dao = useDAOContext();
  const memberList = (dao?.members ?? []).map((m) => {
    return {
      label: AccountsMap[m].fullname,
      value: m,
    };
  });

  const skillTagOptions = Skills.map((skill, index) => ({
    label: skill.name,
    value: skill.name + skill.color,
  }));

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="タスク名"
        name="title"
        rules={[{ required: true, message: "Please enter the title" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="概要"
        name="description"
        rules={[{ required: true, message: "Please enter the description" }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="担当者"
        name="assigner"
        rules={[
          { required: true, message: "Please select at least one assignee" },
        ]}
      >
        <Select
          placeholder="担当者を選択"
          options={memberList.filter((item) => {
            // レビュワーとして選択されていない人の中から選べる
            return (reviewers ?? []).indexOf(item.value) === -1;
          })}
        />
      </Form.Item>
      <Form.Item
        label="承認担当者"
        name="reviewers"
        rules={[
          { required: true, message: "Please select at least one reviewer" },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="承認担当者を選択"
          options={memberList.filter((item) => {
            // 担当者として選択されていない人の中から選べる
            return item.value !== assigner;
          })}
        />
      </Form.Item>
      <Form.Item
        label="スキル"
        name="skills"
        rules={[
          { required: true, message: "Please select at least one skill" },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="スキルを選択"
          options={skillTagOptions}
          tagRender={tagRender}
        />
      </Form.Item>
      <div class="flex justify-end items-center">
        <Button type="primary" htmlType="submit">
          作成
        </Button>
      </div>
    </Form>
  );
};

const VIEW_FORM = 0;
const VIEW_WAITING = 1;
const VIEW_RESULT = 2;

const CreateTaskModal = ({ visible, onCreated, onCancel }) => {
  const [form] = Form.useForm();

  const [view, setView] = useState(VIEW_FORM);
  const [waitingStep, setWaitingStep] = useState(WAITING_STEP_UPLOADING);
  const daoData = useDAOContext();

  const { data: signer } = useSigner();

  // 結果データ
  const [isSuccess, setIsSuccess] = useState(false);
  const [cid, setCID] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [blockHeight, setBlockHeight] = useState(null);
  const [txCost, setTxCost] = useState(null);

  const onFinish = (values) => {
    const contract = new ethers.Contract(
      TRUST_X_CONTRACT_SHIBUYA,
      TRUST_X_ABI,
      signer
    );

    const daoID = ethers.BigNumber.from(daoData?.dao?.daoID);

    console.log("onFinish", values);
    console.log("debug::contract", contract);
    console.log("debug::signer", signer);
    console.log("deubg::daoData", daoData);
    console.log("debug::daoID", daoID);

    setWaitingStep(WAITING_STEP_UPLOADING);
    setView(VIEW_WAITING);

    (async () => {
      try {
        const cid = await uploadToIPFS({
          name: values.title,
          description: values.description,
        });

        setCID(cid);
        setWaitingStep(WAITING_STEP_SIGNING);

        const tx = await contract.createTask(
          // DAO ID
          daoID,
          // name
          values.title,
          // metadataURI
          `ipfs://${cid}`,
          // isPrivate
          false,
          // taskStatus
          0,
          // skills
          values.skills.map((s) => s.split("#")[0]),
          // assigner
          values.assigner,
          // reviewers
          values.reviewers
        ); // TODO: rename after deploy

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

        setIsSuccess(true);

        const event = receipt.events.find((e) => e.event === "TaskCreated");
        console.log("TaskCreated", event);

        onCreated &&
          onCreated({
            ...values,
            id: event.args.taskID.toNumber(),
          });
      } catch (error) {
        console.error(error);
        setIsSuccess(false);
      } finally {
        setView(VIEW_RESULT);
      }
    })();
  };

  const handleCancel = () => {
    form.resetFields();
    setView(VIEW_FORM);
    setWaitingStep(WAITING_STEP_UPLOADING);
    onCancel(isSuccess);

    setIsSuccess(false);
    setCID(null);
    setTxHash(null);
    setBlockHeight(null);
    setTxCost(null);
  };

  const Views = [
    <InputTask form={form} onFinish={onFinish} />,
    <UploadingAndSendingTx current={waitingStep} cid={cid} txHash={txHash} />,
    <TxResult
      isSuccess={isSuccess}
      txHash={txHash}
      blockHeight={blockHeight}
      txCost={txCost}
      successMessage={"タスクの作成に成功しました"}
      errorMessage={"タスクの作成に失敗しました"}
    />,
  ];

  const Titles = ["タスクの新規作成", "", ""];

  return (
    <Modal
      title={Titles[view]}
      open={visible}
      onCancel={handleCancel}
      footer={false}
      destroyOnClose
      width="800px"
    >
      {Views[view]}
    </Modal>
  );
};

export default CreateTaskModal;

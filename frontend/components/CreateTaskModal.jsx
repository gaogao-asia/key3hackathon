import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import {
  Typography,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Button,
  Steps,
  Descriptions,
} from "antd";
import {
  LoadingOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import * as antColors from "@ant-design/colors";
import { Skills } from "../consts/skills";
import { AccountsMap } from "../consts/accounts";
import { useDAOContext } from "../contexts/dao_context";
import { TRUST_X_CONTRACT_SHIBUYA } from "../consts/contracts";
import { TRUST_X_ABI } from "../consts/abis";
import { useContractWrite, useSigner } from "wagmi";
import { ethers } from "ethers";
import { uploadToIPFS } from "../clients/ipfs";

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

const WaitingView = (props) => {
  const { current, cid, txHash } = props;

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
                <span>スマートコントラクトにタスクを追加します</span>
                <span>{`　`}</span>
              </div>
            );
          }

          if (current === 2) {
            return (
              <div className="flex flex-col">
                <span>
                  スマートコントラクトを呼び出し、タスクを追加中です...
                </span>
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

const ResultView = (props) => {
  const { isSuccess, txHash, blockHeight, txCost } = props;

  if (!isSuccess) {
    return (
      <div className="flex flex-col justify-center mt-10">
        <ExclamationCircleFilled
          style={{ fontSize: "120px", color: antColors.red[4] }}
        />
        <div className="mt-8 flex flex-col justify-center">
          <Text strong style={{ fontSize: "24px", textAlign: "center" }}>
            タスクの作成に失敗しました
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
          タスクの作成に成功しました
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

const WAITING_STEP_UPLOADING = 0;
const WAITING_STEP_SIGNING = 1;
const WAITING_STEP_CONFIRMING = 2;

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
    <WaitingView current={waitingStep} cid={cid} txHash={txHash} />,
    <ResultView
      isSuccess={isSuccess}
      txHash={txHash}
      blockHeight={blockHeight}
      txCost={txCost}
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

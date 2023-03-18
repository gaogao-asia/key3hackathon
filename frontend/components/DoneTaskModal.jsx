// DoneTaskModal (評価、コメント用フォームがある)
// 完了の一番上とかのタスクをクリックすると開く。

import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Button,
  Slider,
  Col,
  Row,
  Divider,
  Typography,
} from "antd";
import { Skills } from "../consts/skills";
import { useDAOContext } from "../contexts/dao_context";
import { AccountsMap } from "../consts/accounts";
import { useTask } from "../hooks/task";
import { useTaskThread } from "../hooks/task_threads";
import { useAccount } from "wagmi";
import { downloadFromIPFS } from "../clients/ipfs";

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

const DoneTaskForm = (props) => {
  const { form, memberList, skills = [] } = props;
  const { address } = useAccount();
  const reviewers = Form.useWatch("reviewers", form);
  const comment = Form.useWatch("review_comment", form);

  const skillTagOptions = Skills.map((skill, index) => ({
    label: skill.name,
    value: skill.name + skill.color,
  }));

  const onFinish = () => {
    // Do nothing
    console.log('完了')
  }

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="タスク名" name="title">
        <Input readOnly />
      </Form.Item>
      <Form.Item label="概要" name="description">
        <Input.TextArea rows={2} readOnly />
      </Form.Item>
      <Form.Item label="担当者" name="assigner">
        <Select
          placeholder="担当者を選択"
          options={memberList}
          open={false}
          style={{ pointerEvents: "none" }}
        />
      </Form.Item>
      <Form.Item label="承認担当者" name="reviewers">
        <Select
          mode="multiple"
          placeholder="承認担当者を選択"
          options={memberList}
          open={false}
          style={{ pointerEvents: "none" }}
        />
      </Form.Item>

      <Form.Item
        label="スキル"
        name="skills"
      >
        <Select
          mode="multiple"
          placeholder="スキルを選択"
          options={skillTagOptions}
          tagRender={tagRender}
          disabled
        />
      </Form.Item>
      <Divider />
      <Typography style={{ fontWeight: "bold" }}>タスクの評価</Typography>
      {/* <Form.Item
        label="コメント"
        name="review_comment"
        rules={[{ required: false, message: "Please enter your comment" }]}
        style={{ marginTop: "8px" }}
      >
        <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
      </Form.Item> */}
      <div>
        <Typography>スキル評価 (5段階)</Typography>
        <div
          className="flex flex-col justify-center align-center"
          style={{ margin: "24px 60px 0px" }}
        >
          {skills.map((skill, index) => {
            return (
              <Form.Item
                label={skill.slice(0, -7)}
                name={`skill_points[${index}]`}
                style={{ display: "inline-block" }}
              >
                <Slider min={1} max={5} />
              </Form.Item>
            );
          })}
        </div>
      </div>
    </Form>
  )
}

const DoneTaskModal = ({ taskPrimaryID, visible, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [skills, setSkills] = useState([])
  const dao = useDAOContext();
  const memberList = (dao?.members ?? []).map((m) => {
    return {
      label: AccountsMap[m].fullname,
      value: m,
    };
  });

  const SkillTagOptions = Skills.map((skill, index) => ({
    label: skill.name,
    value: skill.name + skill.color,
  }));

  const taskQuery = useTask(taskPrimaryID);
  const taskThreadQuery = useTaskThread(
    dao?.dao?.daoID,
    taskQuery?.data?.task?.taskID
  );

  const handleOk = () => {
    console.log(form.getFieldsValue);
    onOk(form.getFieldsValue);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (!taskQuery.data) {
      form.resetFields();

      return;
    }

    (async () => {
      const metadataCID = taskQuery.data.task.metadataURI.replace(
        "ipfs://",
        ""
      );
      const metadata = JSON.parse(await downloadFromIPFS(metadataCID));

      form.setFieldsValue({
        title: taskQuery.data.task.name,
        description: metadata.description,
        assigner: taskQuery.data.task.assigner,
        reviewers: taskQuery.data.task.reviewers,
        skills: taskQuery.data.task.skills
          .map((s) => {
            const skillItem = SkillTagOptions.find((x) => x.label === s.name);

            return skillItem?.value ?? null;
          })
          .filter(Boolean),
        artifact: "",
      });

      setSkills(form.getFieldValue('skills'))
    })();
  }, [taskQuery.data]);

  useEffect(() => {
    if (!taskThreadQuery?.data) {
      form.setFieldsValue({
        artifact: "",
      });

      return;
    }

    const latestRequestReview = (taskThreadQuery?.data?.threads ?? []).findLast(
      (t) => t.threadType === "review_request"
    );

    console.log(
      "latestRequestReview",
      taskThreadQuery?.data,
      latestRequestReview
    );

    if (latestRequestReview === undefined) {
      return;
    }

    (async () => {
      const metadataCID = latestRequestReview.messageURI.replace("ipfs://", "");
      const metadata = JSON.parse(await downloadFromIPFS(metadataCID));

      form.setFieldsValue({
        artifact: metadata.description,
      });
    })();
  }, [taskThreadQuery?.data]);

  return (
    <Modal
      title="完了タスク"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
      destroyOnClose
    >
      <DoneTaskForm form={form} memberList={memberList} skills={skills} />
    </Modal>
  );
};

export default DoneTaskModal;

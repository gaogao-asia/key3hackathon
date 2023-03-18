// DoneTaskModal (評価、コメント用フォームがある)
// 完了の一番上とかのタスクをクリックすると開く。

import React from "react";
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
} from "antd";
import { Skills } from "../consts/skills";
// import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

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
  const { form } = props;

  const users = [
    { label: "トヨタ タロウ", value: "user1" },
    { label: "トヨタ ハジメ", value: "user2" },
    { label: "トヨタ ジロウ", value: "user3" },
  ];

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
      <Form.Item label="担当者" name="assignees">
        <Select
          mode="multiple"
          placeholder="担当者を選択"
          options={users}
          open={false}
          style={{ pointerEvents: "none" }}
        />
      </Form.Item>
      <Form.Item label="承認担当者" name="reviewers">
        <Select
          mode="multiple"
          placeholder="承認担当者を選択"
          options={users}
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
    </Form>
  )
}

const DoneTaskModal = ({ data, visible, onOk, onCancel }) => {
  const [form] = Form.useForm();

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
    form.setFieldsValue(data);
  }, [form, data]);

  return (
    <Modal
      title="評価対象タスク"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
      destroyOnClose
    >
      <DoneTaskForm form={form} />
    </Modal>
  );
};

export default DoneTaskModal;

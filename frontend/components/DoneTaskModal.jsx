// DoneTaskModal (評価、コメント用フォームがある)
// 完了の一番上とかのタスクをクリックすると開く。

import React from "react";
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Tag, Button } from 'antd';
import { Skills } from "../consts/skills";
// import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

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
    )
}

const DoneTaskModal = ({ data, visible, onOk, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const users = [
        { label: 'トヨタ タロウ', value: 'user1' },
        { label: 'トヨタ ハジメ', value: 'user2' },
        { label: 'トヨタ ジロウ', value: 'user3' },
    ];

    const skillTagOptions = Skills.map((skill, index) => ({
        label: skill.name,
        value: skill.name + skill.color
    }));

    const handleOk = () => {
        console.log(form.getFieldsValue)
        onOk(form.getFieldsValue);
        form.resetFields();
    }

    const onFinish = (values) => {
        console.log(values)
        onOk(values)
        form.resetFields()
        onCancel()
    }

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    useEffect(() => {
        form.setFieldsValue(data)
    }, [form, data])

    return (
        <Modal
            title="評価対象タスク"
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
            destroyOnClose
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label="タスク名"
                    name="title"
                    rules={[{ required: true, message: 'Please enter the title' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="概要"
                    name="description"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="担当者"
                    name="assignees"
                    rules={[{ required: true, message: 'Please select at least one assignee' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="担当者を選択"
                        options={users}
                    />
                </Form.Item>
                <Form.Item
                    label="承認担当者"
                    name="reviewers"
                    rules={[{ required: true, message: 'Please select at least one reviewer' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="承認担当者を選択"
                        options={users}
                    />
                </Form.Item>

                <Form.Item
                    label="スキル"
                    name="skills"
                    rules={[{ required: true, message: 'Please select at least one skill' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="スキルを選択"
                        options={skillTagOptions}
                        tagRender={tagRender}
                    />
                </Form.Item>

                {/* ToDo: UIをカイゼンする */}
                <Form.Item
                    label="評価コメント"
                    name="review_comment"
                    rules={[{ required: false, message: 'Please enter your comment' }]}
                >
                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                </Form.Item>

                <div class="flex justify-end items-center">
                    {/* ToDo: タスク評価のfunctionに繋ぐ */}
                    <Button type="primary" htmlType="submit">
                        評価送信
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default DoneTaskModal;
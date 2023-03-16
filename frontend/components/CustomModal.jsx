import React from "react";
import { useState } from "react";
import { Modal, Form, Input, Select, Option, Button } from 'antd';

function CustomModal({ data, visible, onCancel }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const users = [
        { label: 'トヨタ タロウ', value: 'user1' },
        { label: 'トヨタ ハジメ', value: 'user2' },
        { label: 'トヨタ ジロウ', value: 'user3' },
    ];

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="新規タスク"
            open={visible}
            onOk={console.log("ok")}
            onCancel={onCancel}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
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
            </Form>
        </Modal>
    );
}

export default CustomModal;
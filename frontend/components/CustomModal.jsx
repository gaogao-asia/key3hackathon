import React from "react";
import { useState } from "react";
import { Modal, Form, Input, Button } from 'antd';

function CustomModal({ data, visible, onCancel }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

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
            </Form>
        </Modal>
    );
}

export default CustomModal;
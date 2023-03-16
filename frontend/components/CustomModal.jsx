import React from "react";
import { useState } from "react";
import { Modal, Form, Input, Select, Tag, Button } from 'antd';
// import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    return (
        <Tag
            color={value}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
        >
            {label}
        </Tag>
    )
}

function CustomModal({ data, visible, onOk, onCancel }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const users = [
        { label: 'トヨタ タロウ', value: 'user1' },
        { label: 'トヨタ ハジメ', value: 'user2' },
        { label: 'トヨタ ジロウ', value: 'user3' },
    ];

    const skills = [
        'マーケティング',
        'プランニング',
        'プロジェクトマネジメント',
        '財務分析',
        'リーダーシップ',
        'チームビルディング',
        'プレゼンテーション',
        'ネットワーキング',
        '技術',
        'データ分析',
        '問題解決',
        '営業',
        'パートナーシップ開発',
        'リスクマネジメント',
        '交渉',
        'コミュニケーション',
        'クリエイティブ思考',
        'プロトタイピング',
        'ユーザビリティテスト',
        'プロダクトマネジメント',
    ];

    const colors = [
        "#ff80ed",
        "#065535",
        "#000000",
        "#133337",
        "#ffc0cb",
        "#c0d6e4",
        "#ffe4e1",
        "#008080",
        "#ff0000",
        "#e6e6fa",
        "#ffd700",
        "#00ffff",
        "#ffa500",
        "#ff7373",
        "#0000ff",
        "#c6e2ff",
        "#40e0d0",
        "#d3ffce",
        "#f0f8ff",
        "#b0e0e6"
    ];

    const skillTagOptions = skills.map((skill, index) => ({
        label: skill,
        value: colors[index],
        // color: colors[index]
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

    return (
        <Modal
            title="新規タスク"
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
                <div class="flex justify-end items-center">
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default CustomModal;
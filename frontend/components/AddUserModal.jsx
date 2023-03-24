// ユーザー追加ダイアログ
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, Modal, Skeleton, Button, Descriptions, Space, Divider, Tag, Input, Form, Col, Row, Spin } from "antd";
import { useAccountProfile } from "../hooks/account_profile";
import { useAccountSkills } from "../hooks/account_skills";
import { Skills, SkillToColor } from "../consts/skills";
import { useAccountDAOs } from "../hooks/account_daos";
import Link from "next/link";
import { useAccountsSkills } from "../hooks/accounts_skills";
import { AccountsMap } from "../consts/accounts";
import { TRUST_X_CONTRACT_SHIBUYA } from "../consts/contracts";
import { TRUST_X_ABI } from "../consts/abis";
import { ethers } from "ethers";
import { useSigner } from "wagmi";
import { DAO_ID } from "../consts/daos";

const UserCard = (props) => {
    const { address, isAdding, onClickAdd } = props;
    const user = useAccountProfile(address);
    const skills = useAccountSkills(address);
    const daos = useAccountDAOs(address);

    const loading = skills.loading || daos.loading;
    if (loading) {
        return <Skeleton avatar paragraph={{ rows: 4 }} />
    }

    const src = user.icon;
    const name = user.fullname
    const department = user.department

    return (
        <Space align="start" size="large">
            <Link href={`/profiles/${address}`}>
                <Avatar size="large" src={src} />
            </Link>
            <Descriptions title={
                <Link href={`/profiles/${address}`}>
                    {name}
                </Link>
            } column={2} size="middle" layout="vertical" extra={<Button type="primary" onClick={onClickAdd} disabled={isAdding} loading={isAdding}>{isAdding ? "追加中" : "メンバー追加"}</Button>}>
                <Descriptions.Item label="所属" span={2}>{department}</Descriptions.Item>
                <Descriptions.Item label="プロジェクト">
                    <Space direction="vertical">
                        {(daos?.data?.account?.daos ?? []).map((s) => {
                            return <span>{s.name}</span>
                        })}
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="スキル">
                    <div style={{ display: "flex", flexWrap: "wrap", marginTop: "-4px" }}>
                        {(skills?.data?.skills ?? [])
                            .filter((s) => s.score > 0)
                            .sort((a, b) => b.score - a.score)
                            .map((s) => {
                                return <Tag color={SkillToColor[s.skill]} style={{ marginTop: "4px" }}>
                                    {`${s.skill} (${s.score})`}
                                </Tag>
                            })}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </Space>
    )
}

const AddUserModal = ({
    visible,
    onWalletOpen,
    onMemberAdded,
    onCancel,
}) => {
    const [form] = Form.useForm();

    const { data: signer } = useSigner();
    const name = Form.useWatch("name", form);
    const [selectedSkills, setSelectedSkills] = useState(new Set());
    const [isAddingMap, setIsAddingMap] = useState({});

    const handleCancel = useCallback(() => {
        setIsAddingMap({});

        onCancel && onCancel();
    }, []);

    const onSelectSkill = useCallback((newSkill) => {
        setSelectedSkills((prevSkills) => {
            const newSet = new Set(prevSkills);

            if (newSet.has(newSkill)) {
                newSet.delete(newSkill);
            } else {
                newSet.add(newSkill);
            }

            return newSet;
        })
    }, []);

    const onClickAdd = useCallback((addr) => {
        const name = AccountsMap[addr].fullname;

        onWalletOpen && onWalletOpen(name);

        setIsAddingMap((isAdding) => ({
            ...isAdding,
            [addr]: true,
        }));

        const contract = new ethers.Contract(
            TRUST_X_CONTRACT_SHIBUYA,
            TRUST_X_ABI,
            signer
          );

        (async () => {
            try {
                const tx = await contract.addMembers(
                    DAO_ID,
                    [
                        addr
                    ]
                );
                await tx.wait();

                onMemberAdded && onMemberAdded(name);
            } catch(error) {
                console.error(error);
            } finally {
                setIsAddingMap((isAdding) => ({
                    ...isAdding,
                    [addr]: false,
                }))
            }
        })()




    }, [signer]);

    const accounts = useAccountsSkills(
        name ?? "",
        useMemo(() => [...selectedSkills], [selectedSkills])
    );

    return (
        <Modal
            title={'メンバーの招待'}
            open={visible}
            onCancel={handleCancel}
            footer={false}
            destroyOnClose
            width="800px"
            bodyStyle={{ margin: "24px 0px" }}
        >
            <Space direction="vertical" align="start" size="large">
                <div className="grid gap-4">
                    <span style={{ fontWeight: "bold" }}>アカウントの検索</span>
                    <Form
                        form={form}
                        layout="vertical"
                    >
                        <Form.Item label="名前" name={"name"}>
                            <Input placeholder="名前で検索" />
                        </Form.Item>
                        <Form.Item label="スキル" name={"skills"} style={{ display: "flex", flexWrap: "wrap" }}>
                            {Skills.map((s) => (
                                <Tag color={s.color} style={{ marginTop: "4px", cursor: "pointer", opacity: selectedSkills.has(s.name) ? "1.0" : "0.3" }} onClick={() => onSelectSkill(s.name)}>{s.name}</Tag>
                            ))}
                        </Form.Item>
                    </Form>
                </div>
                <div className="grid gap-4">
                    {accounts.loading ? (
                        <div
                            className="flex flex-col items-center content-center justify-center"
                            style={{ minHeight: "400px" }}
                        >
                            <Spin size="large" />
                        </div>
                    )
                        : (
                            <>
                                <span style={{ fontWeight: "bold", marginBottom: "8px" }}>検索結果</span>
                                <div className="grid grid-cols-1">
                                    {(accounts?.data?.accounts ?? []).map((addr, index) => {
                                        return <>
                                            {index > 0 && (
                                                <Divider />
                                            )}
                                            <UserCard address={addr} isAdding={isAddingMap[addr]} onClickAdd={() => onClickAdd(addr)} />
                                        </>
                                    })}
                                </div>
                            </>
                        )}

                </div>
            </Space>

        </Modal>
    );
};

export default AddUserModal;

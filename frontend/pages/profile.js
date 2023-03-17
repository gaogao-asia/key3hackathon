import Head from "next/head";
import React, { useState, useEffect } from 'react'
import Layout from "../components/Layout";
import Image from "next/dist/client/image";
import { Card, Avatar, Progress, List } from 'antd';
import { Skills } from "../consts/skills";

const { Meta } = Card;

export default function Home() {
    const testData = Skills.map((skill => {
        return {
            label: skill.name,
            percent: Math.floor(Math.random() * 100),
        }
    }))

    // hydration errorになる原因わからず、取り急ぎ
    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        setFirstRender(false);
    }, []);

    return (
        <Layout>
            <Card
                className="flex flex-col items-center justify-center w-5/6 m-8"
                title={
                    <Meta
                        className="p-8"
                        avatar={<Avatar
                            style={{ backgroundColor: '#87d068' }}
                            icon={<Image
                                src={'/user_01.png'}
                                width='300'
                                height='300'
                            />}
                            size={96}
                        />}
                        title="トヨタ タロウ"
                        description="新規事業部リーダー ソフトウェア開発者"
                    />
                }
                bodyStyle={{ width: '100%', overflowY: 'auto' }}
            >
                <div className="w-full">
                    {firstRender === false &&
                        <List
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={testData}
                            renderItem={item => (
                                <List.Item>
                                    <p>{item.label}</p>
                                    <Progress
                                        label={item.label}
                                        percent={item.percent}
                                        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                        format={(percent) => percent}
                                    />
                                </List.Item>
                            )}
                        />
                    }
                </div>
            </Card>
        </Layout>
    );
}

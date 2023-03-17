import Head from "next/head";
import Layout from "../components/Layout";
import Image from "next/dist/client/image";
import { PlusIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { Card, Avatar, Progress } from 'antd';

const { Meta } = Card;

export default function Home() {
    const testData = [
        { label: "プレゼンテーション", percent: 80 },
        { label: "技術", percent: 50 },
        { label: "リーダーシップ", percent: 55 },
    ];

    return (
        <Layout>
            <Card
                className="flex flex-col items-center justify-center w-1/2 m-8"
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
                bodyStyle={{ width: '100%' }}
            >
                <div className="w-full">
                    {testData.map((item, idx) => (
                        <>
                            <p>{item.label}</p>
                            <Progress 
                                label={item.label} 
                                percent={item.percent} 
                                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                format={(percent) => percent}
                            />
                        </>
                    ))}
                </div>
            </Card>
        </Layout>
    );
}

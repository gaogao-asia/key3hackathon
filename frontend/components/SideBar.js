import React from 'react';
import { UserGroupIcon, ServerIcon, CalendarIcon, ChartSquareBarIcon,
CogIcon } from '@heroicons/react/outline';
import Link from 'next/link'

function SideBar(props) {
    return (
        <div className="fixed inset-y-0 left-0 bg-white w-40">
            <Link href={'/'}>
              <h1 className="flex items-center justify-center text-2xl h-16 bg-purple-600 text-white font-bold">TrustX</h1>
            </Link>

            <ul className="flex flex-col text-lg h-full">
                <li className="flex justify-center items-center flex-col
                py-7 text-gray-500">
                    <UserGroupIcon className="w-7 h-7"/>
                    管理者
                </li>
                <li className="flex justify-center items-center flex-col
                py-7 border-l-4 border-purple-500 text-purple-500
                font-bold">
                    <ServerIcon className="w-7 h-7 text-purple-500"/>
                    タスク管理
                </li>
                <li className="flex justify-center items-center flex-col
                py-7 text-gray-500">
                    <CalendarIcon className="w-7 h-7"/>
                    計画
                </li>
                <li className="flex justify-center items-center flex-col
                py-7 text-gray-500">
                    <ChartSquareBarIcon className="w-7 h-7"/>
                    レポート
                </li>

                <li className="flex justify-center items-center flex-col
                py-7 text-gray-500 mt-auto mb-16">
                    <CogIcon className="w-7 h-7"/>
                    設定
                </li>
            </ul>
        </div>
    );
}

export default SideBar;
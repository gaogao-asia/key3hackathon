import React from "react";
import { Tag, Descriptions, Spin, Typography } from "antd";
import { clsx } from "clsx";
import { useTask } from "../hooks/task";
import { useIPFSData } from "../hooks/ipfs_file";
import { AccountColumn } from "./AccountColumn";
import { SkillToColor } from "../consts/skills";

const { Paragraph } = Typography;

export const TaskOverview = (props) => {
  const { taskID } = props;
  const taskQuery = useTask(taskID);
  const { data: metadata, loading: isMetadataLoading } = useIPFSData(
    taskQuery.data?.task?.metadataURI ?? ""
  );
  const loading = taskQuery.loading || isMetadataLoading;

  return (
    <div
      className={clsx(
        "flex flex-col items-center",
        loading && "content-center justify-center"
      )}
      style={{ width: "100%", minHeight: "500px" }}
    >
      {loading && <Spin size="large" />}
      {!loading && (
        <Descriptions
          layout="vertical"
          column={4}
          labelStyle={{
            fontWeight: "bold",
            color: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <Descriptions.Item label="概要" layout="vertical" span={4}>
            <div>
              {(metadata.description ?? "").split("\n").map((t, index) => (
                <Paragraph key={index}>{t}</Paragraph>
              ))}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="担当者" span={1}>
            <AccountColumn address={taskQuery.data.task.assigner} />
          </Descriptions.Item>
          <Descriptions.Item
            span={3}
            label="承認担当者"
            contentStyle={{ display: "block" }}
          >
            <div class="grid grid-cols-3 gap-4">
              {taskQuery.data?.task?.reviewers?.map((r) => (
                <AccountColumn key={r} address={r} />
              ))}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="スキル" span={4}>
            {(taskQuery.data?.task?.skills ?? []).map((s) => (
              <Tag key={s.name} color={SkillToColor[s.name]}>
                {s.name}
              </Tag>
            ))}
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
};

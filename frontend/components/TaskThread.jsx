import React from "react";
import { Typography, Skeleton, Rate } from "antd";
import { useTask } from "../hooks/task";
import { useIPFSData } from "../hooks/ipfs_file";
import { Avatar, List } from "antd";
import { useTaskThreads } from "../hooks/task_threads";
import { AccountsMap } from "../consts/accounts";
import { useTaskSkills } from "../hooks/task_skills";

const { Paragraph, Text } = Typography;

const getRole = (threadType) => {
  switch (threadType) {
    case "review_request":
      return "担当者";
    case "comment":
      return "メンバー";
    case "change_request":
    case "approve":
      return "レビュワー";
  }
};

const ThreadContent = (props) => {
  const { account, threadType, metadataURI = "", taskSkillsQuery } = props;
  const { data: metadata, loading: loading } = useIPFSData(metadataURI);

  if (loading || (threadType === "approve" && taskSkillsQuery.loading)) {
    return (
      <div style={{ paddingLeft: "48px" }}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: "48px" }}>
      {(metadata?.description ?? "").split("\n").map((t, index) => (
        <Paragraph key={index}>{t}</Paragraph>
      ))}
      {threadType === "approve" && (
        <div className="grid grid-cols-3 gap-4" style={{ marginTop: "16px" }}>
          {taskSkillsQuery?.data?.taskSkills.map((taskSkill) => {
            const score = taskSkill.scores.find((s) => s.reviewer === account);

            return (
              <div className="grid grid-cols-1 gap-2">
                <Text>{taskSkill.name}</Text>
                <Rate disabled defaultValue={score.score} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const TaskThreads = (props) => {
  const { daoID, taskID } = props;

  const threadsQuery = useTaskThreads(daoID, taskID);
  const taskSkillsQuery = useTaskSkills(daoID, taskID);

  return (
    <List
      size="large"
      itemLayout="vertical"
      dataSource={threadsQuery?.data?.threads ?? []}
      renderItem={(item) => {
        const profile = AccountsMap[item.createdBy];
        const createdAt = new Date(Number.parseInt(item.createdAt));

        return (
          <List.Item key={item.threadID}>
            <List.Item.Meta
              avatar={<Avatar src={profile?.icon} />}
              title={
                <div className="flex justify-between">
                  <Text strong>{profile?.fullname}</Text>
                  <Text>
                    {`${createdAt.toLocaleTimeString()}  ${createdAt.toLocaleDateString()}`}
                  </Text>
                </div>
              }
              description={getRole(item.threadType)}
            />
            <ThreadContent
              account={item.createdBy}
              threadType={item.threadType}
              metadataURI={item.messageURI}
              taskSkillsQuery={taskSkillsQuery}
            />
          </List.Item>
        );
      }}
    />
  );
};

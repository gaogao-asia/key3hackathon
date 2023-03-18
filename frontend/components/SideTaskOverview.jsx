import { Descriptions, Tag } from "antd";
import { SkillToColor } from "../consts/skills";
import { AccountColumn } from "./AccountColumn";

const TaskStatus = (props) => {
  const { status } = props;

  switch (status) {
    case "todo":
      return <Tag color="red">未着手</Tag>;
    case "in_progress":
      return <Tag color="orange">作業中</Tag>;
    case "in_review":
      return <Tag color="green">レビュー中</Tag>;
    case "done":
      return <Tag color="blue">完了</Tag>;
  }
};

export const SideTaskOverview = (props) => {
  const { task } = props;

  return (
    <div style={{ padding: "0px 12px" }}>
      <Descriptions
        layout="vertical"
        column={1}
        labelStyle={{
          fontWeight: "bold",
          color: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <Descriptions.Item label="ステータス" span={1}>
          <TaskStatus status={task.status} />
        </Descriptions.Item>
        <Descriptions.Item label="担当者" span={1}>
          <AccountColumn address={task?.assigner} />
        </Descriptions.Item>
        <Descriptions.Item
          label="承認担当者"
          contentStyle={{ display: "block" }}
        >
          <div class="grid grid-cols-1 gap-4">
            {task?.reviewers?.map((r) => (
              <AccountColumn key={r} address={r} />
            ))}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="スキル">
          <div class="grid gap-2">
            {(task?.skills ?? []).map((s) => (
              <Tag key={s.name} color={SkillToColor[s.name]}>
                {s.name}
              </Tag>
            ))}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

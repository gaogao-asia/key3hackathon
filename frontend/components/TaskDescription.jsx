import { Typography } from "antd";
const { Paragraph, Title } = Typography;

export const TaskDescription = (props) => {
  const { text } = props;

  return (
    <div>
      <Title
        level={5}
        style={{ fontWeight: "bold", color: "rgba(0, 0, 0, 0.8)" }}
      >
        概要
      </Title>
      {(text ?? "").split("\n").map((t, index) => (
        <Paragraph key={index}>{t}</Paragraph>
      ))}
    </div>
  );
};

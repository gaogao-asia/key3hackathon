import Image from "next/dist/client/image";
import Link from "next/link";
import { Typography, Badge } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import * as antColors from "@ant-design/colors";
import { useAccountProfile } from "../hooks/account_profile";
const { Text } = Typography;

export const AccountColumn = (props) => {
  const { address, approved } = props;
  const profile = useAccountProfile(address);

  return (
    <Link href={`/profiles/${address}`}>
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <Badge
          offset={[0, 30]}
          count={
            approved ? (
              <CheckCircleFilled
                style={{ color: antColors.green[5], fontSize: "18px" }}
              />
            ) : null
          }
        >
          <Image
            src={profile?.icon}
            width="36"
            height="36"
            objectFit="cover"
            className=" rounded-full "
          />
        </Badge>

        <Text strong style={{ marginLeft: "8px" }}>
          {profile?.fullname}
        </Text>
      </div>
    </Link>
  );
};

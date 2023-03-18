import Image from "next/dist/client/image";
import Link from "next/link";
import { Typography } from "antd";
import { useAccountProfile } from "../hooks/account_profile";
const { Text } = Typography;

export const AccountColumn = (props) => {
  const { address } = props;
  const profile = useAccountProfile(address);

  return (
    <Link href={`/profiles/${address}`}>
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <Image
          src={profile?.icon}
          width="36"
          height="36"
          objectFit="cover"
          className=" rounded-full "
        />
        <Text strong style={{ marginLeft: "8px" }}>
          {profile?.fullname}
        </Text>
      </div>
    </Link>
  );
};

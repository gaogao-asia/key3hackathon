// ユーザー追加ダイアログ
import React, { useCallback } from "react";
import {Modal} from "antd";

const AddUserModal = ({
  visible,
  onCancel,
}) => {

  const handleCancel = useCallback(() => {
    onCancel && onCancel();
  }, []);

  return (
    <Modal
      title={'ユーザーを追加する'}
      open={visible}
      onCancel={handleCancel}
      footer={false}
      destroyOnClose
      width="1000px"
      bodyStyle={{ margin: "24px 0px" }}
    >
        {null}
    </Modal>
  );
};

export default AddUserModal;

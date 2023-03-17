export const uploadToIPFS = async (contents) => {
  const res = await fetch("/api/upload", {
    method: "POST",
    body: JSON.stringify(contents),
  });
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.cid;
};

export const downloadFromIPFS = async (cid) => {
  const res = await fetch("/api/download", {
    method: "POST",
    body: JSON.stringify({
      cid: cid,
    }),
  });
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
};

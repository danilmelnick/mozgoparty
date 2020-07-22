export function setDownloadSuccess(data) {
  return {
    type: "SET_DOWNLOAD_SUCCESS",
    payload: data
  };
}

export default function setDownload(data) {
  return setDownloadSuccess(data);
}

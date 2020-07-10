export function logoutSuccess(data) {
  return {
    type: "LOGOUT_SUCCESS",
    payload: data
  };
}

export default function logoutAction() {
  return logoutSuccess();
}

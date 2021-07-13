import {toast} from "react-toastify";

function error(data) {
  toast.error(data);
}

function warning(data) {
  toast.warning(data);
}

function success(data) {
  toast.success(data);
}

function info(data) {
  toast.info(data);
}

export default {
  error,
  warning,
  success,
  info
};

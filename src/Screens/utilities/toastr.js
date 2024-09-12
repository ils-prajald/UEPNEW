import Snackbar from "react-native-snackbar";

export default {
  dark(msg) {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
      textColor: "#fff",
      backgroundColor: "#212529",
    });
  },
  info(msg) {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
      textColor: "#212529",
      backgroundColor: "#0dcaf0",
    });
  },
  warning(msg) {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_LONG,
      textColor: "#212529",
      backgroundColor: "#ffc107",
      numberOfLines: 3
    });
  },
  danger(msg) {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
      textColor: "#fff",
      backgroundColor: "#dc3545",
    });
  },
  success(msg) {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
      textColor: "#fff",
      backgroundColor: "#198754",
    });
  },
  primary(msg) {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
      textColor: "#fff",
      backgroundColor: "#0d6efd",
    });
  },
  secondary(msg) {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
      textColor: "#fff",
      backgroundColor: "#6c757d",
    });
  },
};

const TOKEN = "TOKEN";
const USER = "USER";
const CAMERADATA = "CAMERA";
const SYNC_PERIOD = 3600000;

const FLOATING_ACTIONS = [
  {
    text: "Print",
    icon: require("../../assets/images/print_64x64.png"),
    name: "bt_print",
    position: 1,
  },
  {
    text: "Download",
    icon: require("../../assets/images/download_256x256.png"),
    name: "bt_download",
    position: 2,
  },
];

export { TOKEN, USER, SYNC_PERIOD, FLOATING_ACTIONS, CAMERADATA };

import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

class Notifier {
  // type = success,danger,info,default,warning
  notify(msg = "", nType = "success", position = "top-right", timeout = 5000) {
    return Store.addNotification({
      title: "",
      message: msg,
      type: nType,
      insert: "top",
      container: position,
      animationIn: ["animated", "fadeInRight"],
      animationOut: ["animated", "fadeOutRight"],
      dismiss: {
        duration: timeout,
        pauseOnHover: true,
        showIcon: true,
      },
    });
  }
}

export default Notifier;

import { IAlert } from "./IAlert";
import { MessageType } from "./MessageType";

export type MessageT =
  | {
      type: MessageType.Alert;
      alert: IAlert;
    }
  | {
      type: MessageType.EmptyAlert;
    }
  | {
      type: MessageType.Error;
    }
  | {
      type: MessageType.IPError;
    };

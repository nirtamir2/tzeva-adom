import { App } from "@tzeva-adom/app";
import type { IAlert, MessageT } from "@tzeva-adom/core";
import { MessageType } from "@tzeva-adom/core";
import { syncAlertData } from "@tzeva-adom/data";
import { logDev } from "@tzeva-adom/utils";
import React, { useEffect, useState } from "react";
import { window as tauriWindow } from "@tauri-apps/api";
import { move_window, Position } from "tauri-plugin-positioner-api";
import { overrideGlobalXHR } from "tauri-xhr";

export function Root(): React.ReactElement {
  const [alert, setAlert] = useState<IAlert | null>(null);
  const [isAlertLoading, setIsAlertLoading] = useState(true);

  useEffect(() => {
    move_window(Position.TopRight);
  }, []);

  useEffect(() => {
    // HACK to get rid of cors error, and not require a dedicated proxy server
    overrideGlobalXHR();
  }, []);

  /**
   * Make all elements draggable
   * https://github.com/tauri-apps/tauri/issues/1656#issuecomment-1161495124
   */
  useEffect(() => {
    const noDragSelector = "input, a, button"; // CSS selector
    document.addEventListener("mousedown", async (e) => {
      // @ts-ignore
      if (e.target?.closest(noDragSelector)) return; // a non-draggable element either in target or its ancestors
      await tauriWindow.appWindow.startDragging();
    });
  }, []);

  useEffect(() => {
    function onMessage(message: MessageT) {
      setIsAlertLoading(false);
      if (message.type === MessageType.Alert) {
        setAlert(message.alert);
      } else if (message.type === MessageType.EmptyAlert) {
        setAlert(null);
      } else if (message.type === MessageType.IPError) {
        setAlert({
          id: 0,
          data: [
            {
              name: "שגיאה - הרשאות",
              name_en: "שגיאה - הרשאות",
              zone: "שגיאה - הרשאות",
              zone_en: "שגיאה - הרשאות",
              time: "שגיאה - הרשאות",
              time_en: "שגיאה - הרשאות",
              countdown: 0,
              lat: 0,
              lng: 0,
              value: "שגיאה - הרשאות",
              shelters: 0
            }
          ]
        });
      } else if (message.type === MessageType.Error) {
        setAlert({
          id: 0,
          data: [
            {
              name: "שגיאה",
              name_en: "שגיאה",
              zone: "שגיאה",
              zone_en: "שגיאה",
              time: "שגיאה",
              time_en: "שגיאה",
              countdown: 0,
              lat: 0,
              lng: 0,
              value: "שגיאה",
              shelters: 0
            }
          ]
        });
      } else {
        logDev("Message with unsupported type", message);
      }
    }

    syncAlertData({
      onMessage
    });
  }, []);

  return (
    <div>
      <App
        hideHeaderWhenNoAlerts={false}
        isAlertLoading={isAlertLoading}
        alert={alert}
      />
    </div>
  );
}

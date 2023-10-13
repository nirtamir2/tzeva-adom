import { App } from "@/app/App";
import React, { useEffect } from "react";
import { window as tauriWindow } from "@tauri-apps/api";
import { move_window, Position } from "tauri-plugin-positioner-api";
import { overrideGlobalXHR } from "tauri-xhr";

export function Root(): React.ReactElement {
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

  return (
    <div css={{
      background: "red"
    }}>
      <App hideHeaderWhenNoAlerts={false} />
    </div>
  );
}

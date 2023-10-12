import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { getCurrent, LogicalSize } from "@tauri-apps/api/window";

const initialHeight = 600;
const windowWidth = 230;

/**
 * This hook is used to resize the window height to the given height in pixels.
 * NOTICE: it waits a bit before decreasing the size, for the animation to finish
 * @param height
 */
export function useResizeWindowHeight(height: number) {
  // it represents the state current state of the window height
  const currentHeight = useRef(initialHeight);

  /**
   * NOTE: This is required because the height may be changed by the user,
   * and we want to check against the latest value after the delay
   */
  const heightRef = useRef(height);
  heightRef.current = height;

  const updateHeightMutation = useMutation({
    mutationFn: async (params: { height: number }) => {
      const mutationHeight = params.height;

      const isIncreaseHeight = mutationHeight > currentHeight.current;

      // We update immediately if the height is increased
      if (isIncreaseHeight) {
        const window = getCurrent();
        currentHeight.current = mutationHeight;
        await window.setSize(
          new LogicalSize(windowWidth, currentHeight.current)
        );
        return;
      }

      // We don't do anything when no change
      if (mutationHeight === currentHeight.current) {
        return;
      }

      // We wait a bit before decreasing the size, for the animation to finish
      const waitDelay = new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 1200);
      });
      await waitDelay;

      const window = getCurrent();
      // We may have new height in between the delays - se we need to check against the latest before update
      currentHeight.current = Math.max(mutationHeight, heightRef.current);
      await window.setSize(new LogicalSize(windowWidth, currentHeight.current));
    }
  });

  useEffect(() => {
    updateHeightMutation.mutate({ height });
  }, [height]);
}

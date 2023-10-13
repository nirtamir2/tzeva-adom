import { css, Global } from "@emotion/react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { LogoPikudHaoref } from "./LogoPikudHaoref";
import { fetchAlerts, RealPikudHaorefAPIAlertResponse } from "@/fetchAlerts";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useResizeWindowHeight } from "@/hooks/ueResizeWindowHeight";
import { isString } from "@/utils/isString";

const ICON_SIZE = 40;

interface IProps {
  hideHeaderWhenNoAlerts: boolean;
}

const styles = {
  app: css`
    z-index: var(--max-z-index);
    position: fixed;
    top: var(--gutter16);
    right: var(--gutter16);
    font-family: sans-serif;
  `,

  container: css`
    width: 200px;
    direction: rtl;
    color: var(--text-white);
  `,

  header: css`
    width: 100%;
    margin-bottom: var(--gutter8);

    display: flex;
    gap: var(--gutter8);
    align-items: start;

    background-color: var(--blue);
    border-radius: 0 var(--border-radius-round) var(--border-radius-round) 0;
  `,

  titleContainer: css`
    padding-left: var(--gutter16);
    margin: 0;
  `,

  title: css`
    overflow: hidden;
    white-space: nowrap;
    text-wrap: avoid;
    user-select: none;

    font-size: var(--text-size);
    font-weight: 500;
    letter-spacing: -0.5px;
    transform: scaleY(1.25);
  `,
  additionalTitle: css`
    overflow: hidden;
    white-space: nowrap;
    text-wrap: avoid;
    user-select: none;
    padding-top: var(--gutter4);
    font-weight: 500;
    font-size: var(--text-size-sm);
  `,

  imgContainer: css`
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: var(--border-radius-round);
    border: 2px solid var(--white);
    background-color: var(--white);
  `,

  list: css`
    margin: 0;
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
  `,

  listItemText: css`
    user-select: none;
    font-weight: bold;
    font-size: var(--text-size);
    text-shadow: 1px 1px var(--black);
    padding: var(--gutter4);
  `,

  listItem: css`
    margin: 0;

    list-style: none;

    overflow: hidden;
    white-space: nowrap;

    border: 1px solid var(--orange1);
    /*background: url("./assets/wave.svg") var(--orange2);*/
    /*background-size: cover;*/
    background: linear-gradient(
      to bottom,
      var(--orange2) 50%,
      var(--orange1) 50%,
      var(--orange1) 100%
    );
  `,

  stateText: css`
    padding: 0 var(--gutter4);
    font-size: var(--text-size);
    font-weight: bold;
    color: var(--white);
  `,
  errorText: css`
    padding: 0 var(--gutter4);
    font-size: var(--text-size);
    font-weight: bold;
    color: var(--orange1);
  `
};

const cssVariables = css`
  :root {
    --white: #ffffff;
    --black: #0000;
    --orange1: #f67100;
    --orange2: #f79b00;
    --orange-border: #f67100;
    --blue: #067acf;

    --text-white: var(--white);

    --border-radius-round: 100rem;

    --text-size: 16px;
    --text-size-sm: 14px;

    --gutter1: 1px;
    --gutter4: 4px;
    --gutter8: 8px;
    --gutter16: 16px;

    --max-z-index: 10000;
  }
`;

const cssReset = css`
  * {
    box-sizing: border-box;
  }
`;

function PikudHaorefHeader(props: { additionalTitle: string | null }) {
  const { additionalTitle } = props;

  return (
    <motion.header
      css={styles.header}
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "100%" }}
      exit={{ opacity: 0, width: 0 }}
      transition={{
        duration: 1
      }}
    >
      <div css={styles.imgContainer}>
        <LogoPikudHaoref height={ICON_SIZE} width={ICON_SIZE} />
        {/*<img src={pikudHaorefLogo} alt="" height={ICON_SIZE} width={ICON_SIZE} />*/}
      </div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          delay: 1
        }}
        css={styles.titleContainer}
      >
        <div css={styles.title}>התרעות פיקוד העורף</div>
        {additionalTitle == null ? null : (
          <div css={styles.additionalTitle}>{additionalTitle}</div>
        )}
      </motion.h1>
    </motion.header>
  );
}

function AlertsContent(props: {
  alertsQuery: UseQueryResult<RealPikudHaorefAPIAlertResponse | "\n">;
}) {
  const { alertsQuery } = props;

  if (alertsQuery.isPending) {
    return (
      <motion.div
        key="check-alerts"
        css={styles.stateText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        בודק התרעות...
      </motion.div>
    );
  }

  if (alertsQuery.isError) {
    if (isAxiosError(alertsQuery.error)) {
      if (alertsQuery.error.status === 403) {
        return (
          <div css={styles.errorText}>
            שגיאה 403: אין לך הרשאה לפנות לפיקוד העורף
          </div>
        );
      }
      if (alertsQuery.error.cause) {
        return (
          <div css={styles.errorText}>
            שגיאה כללית {alertsQuery.error.cause.message}
          </div>
        );
      }
    }
    return <div css={styles.errorText}>שגיאת רשת</div>;
  }

  if (isString(alertsQuery.data)) {
    return (
      <motion.div
        key="no-alerts"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        css={styles.stateText}
      >
        אין התרעות
      </motion.div>
    );
  }

  return (
    <motion.div
      key="alert-list"
      initial={{
        width: 0
      }}
      animate={{ width: "100%" }}
      exit={{
        width: 0
      }}
      transition={{
        duration: 1
      }}
    >
      <AnimatePresence mode="wait">
        <ul css={styles.list}>
          <AnimatePresence>
            {alertsQuery.data.data.map((area) => {
              return (
                <motion.li
                  key={area}
                  css={styles.listItem}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 1
                  }}
                >
                  <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    css={styles.listItemText}
                    transition={{
                      duration: 1
                    }}
                  >
                    {area}
                  </motion.div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </AnimatePresence>
    </motion.div>
  );
}

const headerSize = 52;
const alertHeight = 29;
const paddingHeight = 32;

const refetchInterval = 1000;
function InnerApp(props: IProps) {
  const { hideHeaderWhenNoAlerts } = props;

  const alertsQuery = useQuery({
    queryFn: fetchAlerts,
    queryKey: ["alerts"],
    refetchInterval,
    refetchIntervalInBackground: true
  });

  const hasNoAlerts =
    alertsQuery.isPending ||
    (alertsQuery.isSuccess && isString(alertsQuery.data));

  const alertsCount =
    alertsQuery.isSuccess && !isString(alertsQuery.data)
      ? alertsQuery.data.data.length
      : 0;

  const height =
    paddingHeight +
    (alertsQuery.isError ? 48 : 0) +
    (hideHeaderWhenNoAlerts && hasNoAlerts
      ? 0
      : headerSize + alertsCount * alertHeight);

  useResizeWindowHeight(height);

  /* Don't show popup injected into the page if no alerts or if loading */
  if (hideHeaderWhenNoAlerts && hasNoAlerts) {
    return null;
  }

  const additionalTitle =
    alertsQuery.isSuccess &&
    !isString(alertsQuery.data) &&
    alertsQuery.data.title !== "ירי רקטות וטילים"
      ? alertsQuery.data.title
      : null;

  return (
    <motion.div
      key="content"
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 1 }}
    >
      <div css={styles.container}>
        <PikudHaorefHeader additionalTitle={additionalTitle} />
        <AlertsContent alertsQuery={alertsQuery} />
      </div>
    </motion.div>
  );
}

const queryClient = new QueryClient();
export function App(props: IProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Shadow dom has a problem declaring css-variables inside, so I move them to global styles
       See https://stackoverflow.com/questions/35694328/how-to-use-global-css-styles-in-shadow-dom */}
      <Global styles={cssVariables} />
      {/* CSS "global styles" withing the shadow dom */}
      <style>{cssReset.styles}</style>
      <div css={styles.app}>
        <AnimatePresence mode="wait">
          <InnerApp {...props} />
        </AnimatePresence>
      </div>
    </QueryClientProvider>
  );
}

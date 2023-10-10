import { css, Global } from "@emotion/react";
import { IAlert } from "@tzeva-adom/core";
import { AnimatePresence, motion } from "framer-motion";
import React, { Fragment } from "react";
import { LogoPikudHaoref } from "./LogoPikudHaoref";

const ICON_SIZE = 40;

interface IProps {
  alert: IAlert | null;
  isAlertLoading: boolean;
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

    font-size: var(--text-size);
    font-weight: 500;
    letter-spacing: -0.5px;
    transform: scaleY(1.25);
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

  emptyStateText: css`
    padding: 0 var(--gutter4);
    font-size: var(--text-size);
    font-weight: bold;
    color: var(--white);
  `
};

const cssVariables = css`
  :root {
    --white: #ffffff;
    --black: #000000;
    --orange1: #f67100;
    --orange2: #f79b00;
    --orange-border: #f67100;
    --blue: #067acf;

    --text-white: var(--white);

    --border-radius-round: 100rem;

    --text-size: 16px;

    --gutter1: 1px;
    --gutter4: 4px;
    --gutter8: 8px;
    --gutter16: 16px;

    --max-z-index: 100000;
  }
`;

const cssReset = css`
  * {
    box-sizing: border-box;
  }
`;

function InnerApp(props: IProps) {
  const { hideHeaderWhenNoAlerts, alert, isAlertLoading } = props;

  function renderHeader() {
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
        </motion.h1>
      </motion.header>
    );
  }

  function renderAlertList() {
    return (
      <ul css={styles.list}>
        <AnimatePresence>
          {alert &&
            alert.data.map((area) => {
              return (
                <motion.li
                  key={`${area.value}`}
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
                    {area.value}
                  </motion.div>
                </motion.li>
              );
            })}
        </AnimatePresence>
      </ul>
    );
  }

  function renderContent() {
    return (
      <div css={styles.container}>
        {renderHeader()}
        {isAlertLoading ? (
          <motion.div
            key="check-alerts"
            css={styles.emptyStateText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            בודק אחר התרעות...
          </motion.div>
        ) : alert == null || alert.data.length === 0 ? (
          <motion.div
            key="no-alerts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            css={styles.emptyStateText}
          >
            אין התרעות
          </motion.div>
        ) : (
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
            <AnimatePresence exitBeforeEnter>
              {renderAlertList()}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div css={styles.app}>
      <AnimatePresence exitBeforeEnter>
        {/* Don't show popup injected into the page if no alerts or if loading */}
        {hideHeaderWhenNoAlerts &&
        (isAlertLoading || alert == null || alert.data.length === 0) ? null : (
          <motion.div
            key="content"
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 1 }}
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function App(props: IProps) {
  return (
    <Fragment>
      {/* Shadow dom has problem declaring css-variables inside so I move them to global styles
       See https://stackoverflow.com/questions/35694328/how-to-use-global-css-styles-in-shadow-dom */}
      <Global styles={cssVariables} />
      {/* CSS "global styles" withing the shadow dom */}
      <style>{cssReset.styles}</style>
      <InnerApp {...props} />
    </Fragment>
  );
}

import styles from "./appContainer.module.css";
interface IContainerItems {
  header: React.ReactNode;
  body: React.ReactNode;
  footer: React.ReactNode;
  headerHeight?: string;
  bodyHeight?: string;
  footerHeight?: string;
}

const AppContainer = ({
  header,
  body,
  footer,
  headerHeight = "10%",
  bodyHeight = "80%",
  footerHeight = "10%",
}: IContainerItems) => {
  return (
    <div className={styles.appContainer}>
      <div className={styles.appContainerHead}>{header}</div>
      <div className={styles.appContainerBody}>
        <div className={`${styles.wrapContainer} what-new-scroller`}>
          {body}
        </div>
      </div>
      <div className={styles.appContainerFooter}>{footer}</div>
    </div>
  );
};

export default AppContainer;

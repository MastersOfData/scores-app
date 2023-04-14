import { createContext, useContext, useState } from "react";
import styles from "src/styles/Info.module.css";

export function InfoBox({ children }: InfoBoxProps) {
  const { show } = useInfoContext();
  // if (!show) return null;
  return (
    <span className={`${styles["info-box"]} ${show ? styles.show : ""}`}>
      {children}
    </span>
  );
}

export function InfoButton() {
  const { toggle } = useInfoContext();
  return (
    <button className={styles["info-btn"]} onClick={toggle}>
      &#9432;
    </button>
  );
}

export function InfoContextProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [show, setShow] = useState<boolean>(false);

  const context: InfoContextType = {
    show,
    toggle: () => setShow((val) => !val),
  };

  return (
    <InfoContext.Provider value={context}>{children}</InfoContext.Provider>
  );
}

type InfoBoxProps = {
  children: string;
};

type InfoContextType = {
  show: boolean;
  toggle: () => void;
};

const InfoContext = createContext<InfoContextType>({
  show: false,
  toggle: () => {
    throw new Error("Function not initialised");
  },
});

const useInfoContext = () => useContext(InfoContext);

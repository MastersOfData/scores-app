import styles from "src/styles/PageWrapper.module.css"
import Header from "src/components/Header"

export type PageWrapperProps = {
  children?: React.ReactNode,
  title: string,
  backPath?: string
}

export default function PageWrapper({ children, title, backPath }: PageWrapperProps) {
  return (
    <div className={styles.container}>
      <Header backPath={backPath}>{title}</Header>
      {children}
    </div>
  )
}
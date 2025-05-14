import Image from "next/image";
import styles from "./page.module.css";
import App from "./App";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <App/>
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}

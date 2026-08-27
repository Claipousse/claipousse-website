import { useT } from "@/utils/traductions";
import styles from "./css/HelpWindow.module.css";

export default function HelpWindow() {
  const t = useT();
  return (
    <div className={styles.root}>
      <h3 className={styles.title}>{t.help.title}</h3>
      <p className={styles.text}>{t.help.text1}</p>
      <p className={styles.text}>{t.help.text2}</p>
    </div>
  );
}
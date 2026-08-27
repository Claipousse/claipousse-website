import { useT } from "@/utils/traductions";
import styles from "./css/TodoWindow.module.css";

export default function TodoWindow() {
  const t = useT();
  const items = [ //written in the traductions files
    t.todo.item1,
    t.todo.item2,
    t.todo.item3,
    t.todo.item4,
    t.todo.item5,
    t.todo.item6,
    t.todo.item7,
    t.todo.item8,
    t.todo.item9,
    t.todo.item10,
  ];
  return (
    <div className={styles.root}>
      <h3 className={styles.title}>{t.todo.title}</h3>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={item} className={i === 0 ? styles.priority : undefined}>
            {item}
          </li>
        ))}
      </ul>
      <p className={styles.text}>{t.todo.footer}</p>
    </div>
  );
}
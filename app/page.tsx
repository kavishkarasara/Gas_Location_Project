import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={`glass-panel animate-fade-in ${styles.heroCard}`}>
        <h1 className="text-gradient">Gas Finder SL</h1>
        <p className={styles.subtitle}>
          Find available Litro and Laugfs cooking gas in your area instantly. No more waiting in lines without knowing.
        </p>

        <div className={styles.actions}>
          <Link href="/map" className="btn btn-primary">
            Find Near Me (Customer View)
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            Dealer Login (Seller View)
          </Link>
        </div>
      </div>
    </main>
  );
}

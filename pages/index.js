import Head from "next/head";
import styles from "../styles/Home.module.css";
import Router from "next/router";
import useTheme from "../hooks/useTheme";
import { useEffect } from "react";

export default function Home() {
  const { themes, currentTheme } = useTheme();

  useEffect(() => {
    const id = currentTheme.id;
    if (id == 0) Router.push("Keerthana");
    else Router.push(`/Keerthana/${id}`);
  }, [currentTheme.id]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Birthday Wish for Keerthana</title>
        <meta name="description" content="An app to generate birthday wishes :)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.main}>
          <h1 className={styles.title}>
            Loading <span className={styles.span}>Birthday</span> Wish...
          </h1>
        </div>
      </main>
    </div>
  );
}

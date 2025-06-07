import React, { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import styles from "../styles/Name.module.css";
import { useRouter } from "next/router";
import ConfettiGenerator from "confetti-js";
import messages from "../utils/birthdayWishes.js";
import useTheme from "../hooks/useTheme";
import * as htmlToImage from "html-to-image";
import FileSaver from "file-saver";
import { Button } from "../components";

const Wish = () => {
  const router = useRouter();
  const { name } = router.query; // gets both name & color id in form of array [name,colorId]
  const color = name ? name[1] : 0; //extracting colorId from name
  const [downloading, setDownloading] = useState(false);
  const [downloadedOnce, setDownloadedOnce] = useState(false);
  const audioRef = useRef();
  const [isClient, setIsClient] = useState(false);
  const [randomMessage, setRandomMessage] = useState("");

  const { setTheme } = useTheme();

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    const randomMsg = messages[randomNumber(0, messages.length)].value;
    setRandomMessage(randomMsg);
  }, []);

  // Handle theme and effects
  useEffect(() => {
    if (!isClient) return;

    // Theme Change
    setTheme(color);

    if (downloading === false) {
      // Confetti
      const canvas = document.getElementById("canvas");
      if (canvas) {
        const confettiSettings = {
          target: "canvas",
          max: 60,
          size: 0.8,
          animate: true,
          props: ["circle", "square", "triangle", "line"],
          colors: [
            [255, 0, 0],
            [255, 50, 50],
            [255, 100, 100],
            [255, 150, 150],
          ],
          clock: 200,
          rotate: true,
          start_from_edge: false,
          respawn: true,
          drift: 0,
          gravity: 0.1,
          scalar: 0.2,
        };
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
      }

      // Audio
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.log("Audio autoplay failed:", error);
        });
      }
    }
  }, [color, downloading, isClient, setTheme]);

  useEffect(() => {
	if (downloading === true && downloadedOnce === false) {
	  downloadImage();
	}
  }, [downloading, downloadedOnce, downloadImage]); // Added downloadImage to dependencies

  // function for randomly picking the message from messages array
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const downloadImage = useCallback(() => {
	if (downloadedOnce === true) return;
  
	const node = document.getElementById("image");
	if (node) {
	  setDownloadedOnce(true);
	  htmlToImage.toPng(node).then((blob) => {
		FileSaver.saveAs(blob, "birthday-wish.png");
		setDownloading(false);
	  });
	}
  }, [downloadedOnce]);

  const title = () => {
    const name = "Keerthana";
    const wish = "Happy Birthday " + name + " !";
    const base_letters = [];
    const name_letters = [];

    for (let i = 0; i < wish.length; i++) {
      if (i < 15) {
        const letter = wish.charAt(i);
        base_letters.push(
          <span key={i} style={{ "--i": i + 1 }}>
            {letter}
          </span>
        );
      } else {
        const letter = wish.charAt(i);
        name_letters.push(
          <span key={i} style={{ "--i": i + 1 }} className={styles.span}>
            {letter}
          </span>
        );
      }
    }

    return (
      <>
        {downloading ? (
          <h1
            className={styles.titleImg}
            style={{ "--wish-length": wish.length }}
          >
            <div>{base_letters.map((letter) => letter)}</div>
            <div>{name_letters.map((letter) => letter)}</div>
          </h1>
        ) : (
          <h1 className={styles.title} style={{ "--wish-length": wish.length }}>
            <div>{base_letters.map((letter) => letter)}</div>
            <div>{name_letters.map((letter) => letter)}</div>
          </h1>
        )}
      </>
    );
  };

  if (!isClient) {
    return null;
  }

  if (downloading) {
    return (
      <div className={styles.containerImg} id="image" onClick={downloadImage}>
        <main className={styles.image}>
          <div>
            <div className={styles.main}>{title(name && name[0])}</div>
            <div style={{ height: 40 }} />
            <p className={styles.descImg}>
              Happy Birthday, Keerthana 🎂✨
              <br />
              Another year older wiser… and somehow still rolling on the bed
              (weird thing i learned from u)
              <br />
              Hehe u&apos;ve been through so much with such silent strength
              <br />
              U don&apos;t always say it but the way u hold things together the
              way u keep going
              <br />
              It&apos;s something I admire more than I can put into words
              <br />
              U deserve peace laughter and again peace and laughter
              <br />
              And don&apos;t forget the Lotus Biscoff 😤 I&apos;ll always be
              rooting for u
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Happy Birthday Keerthana</title>
        <meta name="description" content="A surprise birthday wish!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <canvas className={styles.canvas} id="canvas"></canvas>

      <main className={styles.animate}>
        <div>
          <div className={styles.main}>{title(name && name[0])}</div>
          <p className={styles.desc}>{randomMessage}</p>
          <p className={styles.desc}>
            Happy Birthday, Keerthana 🎂✨
            <br />
            Another year older wiser… and somehow still rolling on the bed
            (weird thing i learned from u)
            <br />
            Hehe u've been through so much with such silent strength
            <br />
            U don't always say it but the way u hold things together the way u
            keep going
            <br />
            It's something I admire more than I can put into words
            <br />
            U deserve peace laughter and again peace and laughter
            <br />
            And don't forget the Lotus Biscoff 😤 I'll always be rooting for u
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <Button
            onClick={() => {
              setDownloadedOnce(false);
              setDownloading(true);
            }}
            text="Download as Image"
          />
        </div>
      </main>
      <audio ref={audioRef} id="player" autoPlay>
        <source src="media/hbd.mp3" />
      </audio>
    </div>
  );
};

export default Wish;

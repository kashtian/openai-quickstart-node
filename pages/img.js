import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [imgPrompt, setImgPrompt] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const clearText = () => {
    setImgPrompt('')
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/img", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imgPrompt: imgPrompt }),
      });

      const data = await response.json();
      setLoading(false);
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Imgs</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Generate Imgs</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="img-prompt"
            placeholder="Enter an img prompt"
            value={imgPrompt}
            onChange={(e) => setImgPrompt(e.target.value)}
          />
          <div className={styles.imgBtnBox}>
            <input type="submit" value="Start to generate img" />
            <button onClick={clearText}>clear</button>
          </div>
        </form>
        <div className={styles.loading}>{loading ? 'loading...' : ''}</div>

        <div className={styles.result}>
          {
            result.map((img, index) => (
              <img src={img.url} key={index} />
            ))
          }
        </div>
      </main>
    </div>
  );
}

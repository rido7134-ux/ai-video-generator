import React, { useState, useEffect } from 'react';

const MODEL_ENDPOINT = '/api/generate';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ai-video-gallery');
    if (saved) setGallery(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-video-gallery', JSON.stringify(gallery));
  }, [gallery]);

  const generate = async () => {
    if (!prompt.trim()) {
      alert('Masukkan deskripsi video terlebih dahulu.');
      return;
    }
    setLoading(true);
    setVideoUrl(null);

    try {
      const res = await fetch(MODEL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Server error');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);

      const item = { id: Date.now(), prompt, style, url };
      setGallery([item, ...gallery].slice(0, 20));
    } catch (e) {
      console.error(e);
      alert('Gagal generate: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'ai-video.mp4';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const removeFromGallery = (id) => {
    const g = gallery.filter((x) => x.id !== id);
    setGallery(g);
  };

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.style.backgroundColor = dark ? '#ffffff' : '#0b1220';
    document.documentElement.style.color = dark ? '#000' : '#fff';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">AI Text → Video</h1>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">
              {dark ? 'Mode Terang' : 'Mode Gelap'}
            </button>
            <a href="#about" className="text-sm opacity-80">About</a>
            <a href="#contact" className="text-sm opacity-80">Contact</a>
          </div>
        </header>

        <section className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <label className="block mb-2 font-semibold">Deskripsi (Prompt)</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows="4"
            className="w-full p-3 rounded-xl bg-gray-700 outline-none mb-3"
            placeholder="Contoh: Siluet pria berteriak di pantai saat sunset, kamera jauh, sinematik"
          />

          <div className="flex gap-3 mb-3">
            <select value={style} onChange={(e) => setStyle(e.target.value)} className="p-2 rounded-xl bg-gray-700">
              <option value="cinematic">Cinematic</option>
              <option value="anime">Anime</option>
              <option value="horror">Horror</option>
              <option value="romantic">Romantic</option>
              <option value="realistic">Realistic</option>
            </select>

            <button onClick={generate} className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
              {loading ? 'Generating...' : 'Generate Video'}
            </button>

            <button onClick={() => { setPrompt(''); setVideoUrl(null); }} className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600">Reset</button>
          </div>

          <div className="flex gap-3 items-center">
            <div className="text-sm opacity-80">Loader:</div>
            {loading && <div className="animate-pulse px-3 py-1 rounded bg-gray-700">Processing on server...</div>}
            {!loading && <div className="text-sm opacity-70">Ready</div>}
          </div>

          {videoUrl && (
            <div className="mt-6">
              <video src={videoUrl} controls className="w-full rounded-xl shadow-lg" />
              <div className="flex gap-3 mt-3">
                <button onClick={downloadVideo} className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700">Download</button>
                <button onClick={() => setGallery([{ id: Date.now(), prompt, style, url: videoUrl }, ...gallery])} className="px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-700">Save to Gallery</button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Gallery</h2>
          {gallery.length === 0 && <div className="opacity-70">Belum ada hasil. Hasil generate akan muncul di sini.</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gallery.map((g) => (
              <div key={g.id} className="bg-gray-800 p-3 rounded-xl">
                <video src={g.url} controls className="w-full rounded" />
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm opacity-80">{g.style} • {new Date(g.id).toLocaleString()}</div>
                  <div className="flex gap-2">
                    <button onClick={() => { navigator.clipboard.writeText(g.prompt); }} className="px-2 py-1 rounded bg-gray-700">Copy Prompt</button>
                    <button onClick={() => removeFromGallery(g.id)} className="px-2 py-1 rounded bg-red-600">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer id="about" className="mt-10 p-6 bg-gray-800 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="opacity-80">Website ini demo AI Text-to-Video. Untuk deploy publik, atur HF_API_KEY pada environment variables Vercel agar serverless function dapat mengakses model inference.</p>

          <h3 id="contact" className="mt-4 text-lg font-semibold mb-2">Contact</h3>
          <p className="opacity-80">Untuk bantuan deployment, hubungi pemilik project atau gunakan dokumentasi di README.</p>
        </footer>
      </div>
    </div>
  );
}

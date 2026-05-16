const app = document.querySelector("#app");
const chapterManifestUrl = new URL("./chapters.json", window.location.href);

init().catch((error) => {
  console.error(error);
  renderError("The chapter list could not be loaded.");
});

async function init() {
  const chapters = await loadChapters();
  const chapterNumber = getChapterNumberFromQuery();

  if (chapters.length === 0) {
    renderEmptyState();
    return;
  }

  if (chapterNumber === null) {
    renderChapterList(chapters);
    return;
  }

  const currentIndex = chapters.findIndex((chapter) => chapter.number === chapterNumber);

  if (currentIndex === -1) {
    renderError("Chapter not found.");
    return;
  }

  const chapter = chapters[currentIndex];
  const previousChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  await renderReader({ chapter, previousChapter, nextChapter });
}

async function loadChapters() {
  const response = await fetch(chapterManifestUrl);
  if (!response.ok) {
    throw new Error(`Manifest request failed with ${response.status}`);
  }

  const chapters = await response.json();
  if (!Array.isArray(chapters)) {
    throw new Error("Manifest format is invalid.");
  }

  return chapters
    .map((chapter) => ({
      number: Number(chapter.number),
      file: String(chapter.file),
      title: String(chapter.title),
    }))
    .filter((chapter) => Number.isInteger(chapter.number) && chapter.file.endsWith(".txt"))
    .sort((left, right) => left.number - right.number);
}

function getChapterNumberFromQuery() {
  const rawValue = new URLSearchParams(window.location.search).get("chapter");
  if (rawValue === null) {
    return null;
  }

  const chapterNumber = Number(rawValue);
  return Number.isInteger(chapterNumber) && chapterNumber > 0 ? chapterNumber : null;
}

function renderChapterList(chapters) {
  document.title = "Novel Reader";

  const chapterItems = chapters
    .map(
      (chapter) => `
        <a class="chapter-link" href="./index.html?chapter=${chapter.number}">
          <span class="chapter-link-label">${escapeHtml(chapter.title)}</span>
          <span class="chapter-link-meta">${escapeHtml(chapter.file)}</span>
        </a>
      `
    )
    .join("");

  app.innerHTML = `
    <section class="panel">
      <div class="chapter-list-header">
        <p class="eyebrow">Chapter List</p>
        <h1 class="page-title">Available Chapters</h1>
        <p class="supporting-text">
          Select a chapter to open the reader. Chapters are listed in numeric order.
        </p>
      </div>
      <div class="chapter-grid">
        ${chapterItems}
      </div>
    </section>
  `;
}

async function renderReader({ chapter, previousChapter, nextChapter }) {
  document.title = `${chapter.title} | Novel Reader`;

  app.innerHTML = `
    <section class="panel reader-panel">
      <div class="reader-header">
        <p class="eyebrow">Reader</p>
        <h1 class="chapter-title">${escapeHtml(chapter.title)}</h1>
        <p class="reader-meta">${escapeHtml(chapter.file)}</p>
      </div>
      <article class="chapter-body" id="chapter-body">Loading chapter...</article>
      <nav class="nav-row" aria-label="Chapter navigation">
        <a class="nav-button" href="./index.html">Back to Chapter List</a>
        ${
          previousChapter
            ? `<a class="nav-button" href="./index.html?chapter=${previousChapter.number}">Previous Chapter</a>`
            : ""
        }
        ${
          nextChapter
            ? `<a class="nav-button primary" href="./index.html?chapter=${nextChapter.number}">Next Chapter</a>`
            : ""
        }
      </nav>
    </section>
  `;

  const response = await fetch(`./chapters/${encodeURIComponent(chapter.file)}`);
  if (!response.ok) {
    renderError("Chapter not found.");
    return;
  }

  const chapterText = await response.text();
  const chapterBody = document.querySelector("#chapter-body");
  chapterBody.textContent = chapterText;
}

function renderEmptyState() {
  document.title = "Novel Reader";
  app.innerHTML = `
    <section class="panel empty-state">
      <p class="eyebrow">No Chapters</p>
      <p class="status-message">No translated chapters are available yet.</p>
    </section>
  `;
}

function renderError(message) {
  document.title = "Novel Reader";
  app.innerHTML = `
    <section class="panel error-state">
      <p class="eyebrow">Error</p>
      <p class="error-message">${escapeHtml(message)}</p>
      <a class="nav-button" href="./index.html">Back to Chapter List</a>
    </section>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

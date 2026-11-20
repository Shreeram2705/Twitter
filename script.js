const feed = document.getElementById("feed");
const input = document.getElementById("postInput");
const count = document.getElementById("charCount");
const toast = document.getElementById("toast");
let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.getElementById("focusCompose").addEventListener("click", () => {
  input.focus();
  input.scrollIntoView({ behavior: "smooth", block: "center" });
});

input.addEventListener("input", () => {
  count.textContent = input.value.length
    ? `${280 - input.value.length} characters left`
    : "Share something with your circle";
});

function actionSvg(type) {
  const paths = {
    reply: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    repost: '<path d="m17 1 4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4m14-2v2a4 4 0 0 1-4 4H3"/>',
    like: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>',
    bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
    share: '<path d="M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7"/>'
  };

  return `<svg viewBox="0 0 24 24">${paths[type]}</svg>`;
}

function createAction(type, label, value = "") {
  const button = document.createElement("button");
  button.className = `action ${type}`;
  button.setAttribute("aria-label", label);
  button.innerHTML = actionSvg(type) +
    (value ? `<span class="action-count">${value}</span>` : "");
  return button;
}

document.getElementById("publish").addEventListener("click", () => {
  const text = input.value.trim();

  if (!text) {
    input.focus();
    notify("Write a little something before posting.");
    return;
  }

  const article = document.createElement("article");
  article.className = "card post";
  article.dataset.person = "shreeram";

  const head = document.createElement("div");
  head.className = "post-head";
  head.innerHTML = `
    <div class="avatar you round">S</div>
    <div class="post-meta">
      <div class="person">
        <strong>Shreeram</strong>
        <span class="verified" aria-label="Verified profile">✦</span>
      </div>
      <div class="handle">@shreeram <span>·</span> just now</div>
    </div>
    <button class="post-menu" aria-label="Post options">···</button>
  `;

  const paragraph = document.createElement("p");
  paragraph.className = "post-text";
  paragraph.textContent = text;

  const actions = document.createElement("div");
  actions.className = "post-actions";
  actions.append(
    createAction("reply", "Reply", "0"),
    createAction("repost", "Repost", "0"),
    createAction("like", "Like", "0"),
    createAction("bookmark", "Bookmark"),
    createAction("share", "Share")
  );

  article.append(head, paragraph, actions);
  feed.prepend(article);

  input.value = "";
  count.textContent = "Share something with your circle";
  notify("Your post is up!");
});

document.addEventListener("click", (event) => {
  const like = event.target.closest(".like");

  if (like) {
    const number = like.querySelector(".action-count");
    const selected = like.classList.toggle("liked");

    if (number) {
      number.textContent = Number(number.textContent) + (selected ? 1 : -1);
    }

    like.setAttribute("aria-pressed", String(selected));
    return;
  }

  const repost = event.target.closest(".repost");

  if (repost) {
    const selected = repost.classList.toggle("reposted");
    const number = repost.querySelector(".action-count");

    if (number) {
      number.textContent = Number(number.textContent) + (selected ? 1 : -1);
    }

    notify(selected ? "Reposted to your circle." : "Repost removed.");
    return;
  }

  const follow = event.target.closest(".follow");

  if (follow) {
    const isFollowing = follow.classList.toggle("following");
    follow.textContent = isFollowing ? "Following" : "Follow";
    follow.setAttribute("aria-pressed", String(isFollowing));
    notify(isFollowing ? "Added to your circle." : "Removed from your circle.");
    return;
  }

  const bookmark = event.target.closest(".bookmark");

  if (bookmark) {
    bookmark.classList.toggle("liked");
    notify(
      bookmark.classList.contains("liked")
        ? "Saved to bookmarks."
        : "Removed from bookmarks."
    );
    return;
  }

  const share = event.target.closest(".share");

  if (share) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(location.href)
        .then(() => notify("Page link copied."))
        .catch(() => notify("Ready to share Fitter."));
    } else {
      notify("Ready to share Fitter.");
    }
    return;
  }

  const nav = event.target.closest(".nav-item");

  if (nav) {
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });
    nav.classList.add("active");

    const page = nav.dataset.nav;

    if (page === "Home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (page === "Profile") {
      notify("You’re viewing Shreeram’s profile.");
    } else if (page === "Explore") {
      document.getElementById("searchInput").focus();
      notify("Search your circle and conversations.");
    } else {
      notify(`${page} is ready for your circle.`);
    }
  }
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    const following = tab.dataset.filter === "following";

    document.querySelectorAll(".post").forEach((post) => {
      post.hidden = following && post.dataset.person === "shreeram";
    });
  });
});

document.getElementById("searchInput").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase().trim();
  let visiblePosts = 0;

  document.querySelectorAll(".post").forEach((post) => {
    const matches = post.textContent.toLowerCase().includes(query);
    post.hidden = !matches;

    if (matches) {
      visiblePosts++;
    }
  });

  document.getElementById("empty").style.display =
    visiblePosts ? "none" : "block";
});

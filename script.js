// =============================
// POST A NEW TWEET
// =============================

const postButton = document.getElementById("postTweet");
const tweetInput = document.getElementById("tweetInput");
const tweetsContainer = document.getElementById("tweets");

postButton.addEventListener("click", function () {

    const text = tweetInput.value.trim();

    // Don't post empty tweets
    if (text === "") {
        alert("Please write something first!");
        return;
    }

    // Create tweet
    const tweet = document.createElement("article");

    tweet.className = "tweet";

    tweet.innerHTML = `
        <div class="avatar">JD</div>

        <div class="tweet-content">

            <div class="user-info">
                <strong>shreeram</strong>
                <span>@shreeram</span>
                <span>· now</span>
            </div>

            <p>${text}</p>

            <div class="actions">
                <button>💬 <span>0</span></button>
                <button>🔁 <span>0</span></button>

                <button class="like-button">
                    ❤️ <span>0</span>
                </button>

                <button>📊 <span>0</span></button>
                <button>↗</button>
            </div>

        </div>
    `;

    // Add tweet to top of feed
    tweetsContainer.prepend(tweet);

    // Clear textarea
    tweetInput.value = "";

});


// =============================
// LIKE BUTTON
// =============================

document.addEventListener("click", function (event) {

    if (event.target.closest(".like-button")) {

        const button = event.target.closest(".like-button");

        const count = button.querySelector("span");

        let likes = parseInt(count.textContent);

        if (button.classList.contains("liked")) {

            likes--;

            button.classList.remove("liked");

            button.style.color = "#71767b";

        } else {

            likes++;

            button.classList.add("liked");

            button.style.color = "#f91880";
        }

        count.textContent = likes;
    }

});


// =============================
// FOLLOW BUTTON
// =============================

const followButtons = document.querySelectorAll(
    ".follow-user button"
);

followButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        if (button.textContent === "Follow") {

            button.textContent = "Following";

            button.style.background = "#000";

            button.style.color = "#fff";

            button.style.border = "1px solid #536471";

        } else {

            button.textContent = "Follow";

            button.style.background = "#fff";

            button.style.color = "#000";

            button.style.border = "none";
        }

    });

});

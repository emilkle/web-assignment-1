let isFetching = false;
let currentPage = 1;
const postsPerPageLimit = 6;

/**
 * Fetches new posts from the API if the user has scrolled to the bottom of the page
 */
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !isFetching) {
        fetchPosts();
    }
});

/**
 * Fetches posts from the API
 *
 * Based on code given by TA: Akif Quddus Khan in the lecture on monday 30th September 2024.
 */
function fetchPosts() {
    // Check if the function is already fetching posts
    if (isFetching) return;
    isFetching = true;

    fetch('https://jsonplaceholder.typicode.com/posts?_page=' + currentPage + '&_limit=' + postsPerPageLimit)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error when fetching from api: " + response.status);
            }
            return response.json();
        })
        .then((posts) => {
            // Log the fetched posts
            console.log(`Fetched ${posts.length} posts from page ${currentPage}`);
            let postsContainer = document.getElementById("posts-container");


            // Clear the container if the current page is 1
            if (currentPage === 1) {
                postsContainer.innerHTML = "";
            }

            // Append the fetched posts to the container
            let i = 1;
            for (let post of posts) {
                const apiPost = document.createElement("div");
                apiPost.classList.add("post");
                const postTitle = document.createElement("h1");
                postTitle.textContent = post.title;
                const postBody = document.createElement("p");
                postBody.textContent = post.body;
                apiPost.appendChild(postTitle);
                apiPost.appendChild(postBody);
                postsContainer.appendChild(apiPost);
                i++;
            }
            isFetching = false;

            // Increment the current page
            currentPage++;
        })
        .catch((error) => {
            console.error("Error when fetching from api: " + error);
            isFetching = false;
        });
}

fetchPosts();
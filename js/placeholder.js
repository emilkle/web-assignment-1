let isFetching = false;
let currentPage = 1;
const postsPerPageLimit = 6;

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !isFetching) {
        fetchPosts();
    }
});

function fetchPosts() {
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
            let container = document.getElementById("posts-container");
            if (currentPage === 1) {
                container.innerHTML = "";
            }
            let i = 1;
            for (post of posts) {
                const apiPost = document.createElement("div");
                apiPost.classList.add("post");
                const title = document.createElement("h1");
                title.textContent = post.title;
                const body = document.createElement("p");
                body.textContent = post.body;
                apiPost.appendChild(title);
                apiPost.appendChild(body);
                container.appendChild(apiPost);
                i++;
            }
            isFetching = false;
            currentPage++;
        })
        .catch((error) => {
            console.error("Error when fetching from api: " + error);
            isFetching = false;
        });
}

fetchPosts();
let postId = new URLSearchParams(window.location.search);
const id = postId.get("postId");
ShowPost();
async function ShowPost() {
  try {
    loader(true);
    let response = await axios.get(`${baseUrl}/posts/${id}`);
    let post = response.data.data;
    const title = post.title || "";
    const tags =
      post.tags.length > 0
        ? post.tags
            .map((tag) => `<span class="badge bg-secondary">${tag.name}</span>`)
            .join(" ")
        : "";
    let content = `
<div class="card shadow mb-3" id= ${post.id} >
<div class="card-header d-flex align-items-center gap-2">
<div class = "header>
<img class="rounded-circle" src=${post.author.profile_image} alt="">
<b>${post.author.username}</b>
</div>
</div>
<div class="card-body">
<img class="w-100" src="${post.image}" alt="">
<h6 class="text-muted mt-1">${post.created_at}</h6>
<h5>${title}</h5>
<p>${post.body}</p>
<hr>
<div class="d-flex align-items-center gap-2">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
<path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
</svg>
<span>(${post.comments_count}) Comments</span>
${tags}
</div>
</div>
<div class="p-3 comments">
`;

    content += `
  <div class="comments-container">
`;

    for (const comment of post.comments) {
      content += `
<div class="comment-card mb-3">
  <div class="comment-header d-flex align-items-center gap-2">
      <img class="rounded-circle comment-avatar" 
          src="${comment.author.profile_image}" 
          alt="${comment.author.username}"
          width="40" height="40">
      <div class="comment-meta">
          <div class="comment-author">
              <span class="fw-bold">@${comment.author.username}</span>
          </div>
      </div>
  </div>
  <div class="comment-body mt-2 ms-5">
      ${comment.body}
  </div>
</div>`;
    }
    content += `
  <div class = "add-comment">
<input type = "text" class="form-control" id="comment-input" placeholder="Add a comment...">
<button class="btn btn-outline-primary" id="add-comment-btn">Send</button>
</div>
</div>
</div>
`;
    document.querySelector("h1 span").innerHTML = `${post.author.username}'s`;
    document.getElementById("posts").innerHTML = content;
        loader(false)
  } catch (error) {
    console.error("Error fetching post details:", error);
    document.getElementById(
      "posts"
    ).innerHTML = `<div class="alert alert-danger" role="alert">Failed to load post details.</div>`;
  } finally {

    Addcomments();
  }
}

function Addcomments() {
  const addCommenBtn = document.getElementById("add-comment-btn");
  addCommenBtn.addEventListener("click", async function () {
    loader(true);
    let commentInput = document.getElementById("comment-input").value.trim();
    if (commentInput !== "") {
      try {
        const request = await axios.post(
          `${baseUrl}/posts/${id}/comments`,
          {
            body: commentInput,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": `application/json`,
            },
          }
        );
        ShowPost();
        loader(false)
      } catch (error) {
        console.error("Error adding comment:", error);
        document.getElementById(
          "posts"
        ).innerHTML = `<div class="alert alert-danger" role="alert">Failed to add comment.</div>`;
      }
    }

  })
}
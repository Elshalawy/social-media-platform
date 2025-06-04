let postId = new URLSearchParams(window.location.search);
const id = postId.get("userId");
const inform = {
  image : document.querySelector(".profile_header"),
  name:document.querySelector(".name"),
  username:document.querySelector(".username"),
  email:document.querySelector(".email"),
  comments_count:document.querySelector("._comment span"),
  post_comment:document.querySelector("._post span"),
  postsContainer:document.getElementById("posts"),
}
LoadPost()

async function uploadprofile() {
  try {
    const request = await axios.get(`${baseUrl}/users/${id}`, {
      headear: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    inform.image.src =
    request.data.data.profile_image
    inform.name.innerHTML = request.data.data.name;
    inform.username.innerHTML = request.data.data.username;
    inform.email.innerHTML = request.data.data.email;
    inform.comments_count.innerHTML = request.data.data.comments_count;
    inform.post_comment.innerHTML = request.data.data.posts_count;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    showAlert("Failed to load user profile.", "danger");
  }
}

async function LoadPost(load = false) {
  loader(true)
  if (load) {
    document.getElementById("posts").innerHTML = "";
  }
  try {
    let request = await axios.get(`${baseUrl}/users/${id}/posts`, {
      headers: {
        "Content-Type":"application/json",
        "Accept":"application/json",
      }
    })
    let posts = request.data.data;
    for (const post of posts) {
      if (post.author.username !== "hhhff") {
        const title = post.title || "";
        const tags =
          post.tags.length > 0
            ? post.tags
              .map(
                (tag) => `<span class="badge bg-secondary">${tag.name}</span>`
              )
              .join(" ")
            : "";
        let content = `
    <div class="card shadow mb-3" id= ${post.id} >
<div class="card-header d-flex align-items-center gap-2" id=${post.author.id}>
<div class = "header">
<img class="rounded-circle" src="${post.author.profile_image}" alt="">
<b>${post.author.username}</b>
</div>
<div>
${post.author.username === JSON.parse(localStorage.getItem("User"))?.username
            ? `<button class="btn btn-secondary edit-btn" type="button">edit</button>`
            : ""
          } 
${post.author.username === JSON.parse(localStorage.getItem("User"))?.username
            ? `<button class="btn btn-danger delete-btn" type="button">Delete</button>`
            : ""
          }
</div>
</div>
<div class="card-body clicked">
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
</div>
`;
        inform.postsContainer.innerHTML += content; // Set innerHTML once
      }
    }
    loader(false)
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    showAlert("Failed to load posts", "danger");
  } finally {
    render()
    uploadprofile()
  }
}
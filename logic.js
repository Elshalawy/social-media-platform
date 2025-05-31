const baseUrl = "https://tarmeezacademy.com/api/v1";
const elements = {
  profile_inf : document.querySelector(".user-name"),
  username: document.querySelector("#Username"),
  password: document.querySelector("#Password"),
  name: document.querySelector("#register-name"),
  reusername: document.querySelector("#register-username"),
  repassword: document.querySelector("#register-password"),
  loginBtn: document.querySelector(".login"),
  loginui: document.querySelector(".login_ui"),
  registerBtn: document.querySelector("#register-btn"),
  logoutBtn: document.querySelector("#logout"),
  logoutui: document.querySelector(".logout_ui"),
  postsContainer: document.getElementById("posts"),
  profileImage: document.querySelector(".profile_image"),
  post_btn: document.querySelector(".add-post-btn"),
  post_create: document.querySelector(".new-post"),
  post_title: document.querySelector("#post-title"),
  post_body: document.querySelector("#post-body"),
  post_id_input: document.getElementById("post-id-input"),
};
console.log(elements.post_btn)
let currentPage = 1;
let lastpage = 1;
// Fetch Posts
async function fetchPosts(currentPage = 1,reset = false) {
  try {
    if (reset) {
      elements.postsContainer.innerHTML = ""; // Clear posts container
    }
    const response = await axios.get(
      `${baseUrl}/posts?limit=5&page=${currentPage}`
    );
    let posts = response.data.data;
    let content = "";
    lastpage = response.data.meta.last_page;
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
        content += `
      <div class="card shadow mb-3" id= ${post.id} >
<div class="card-header d-flex align-items-center gap-2">
<div>
  <img class="rounded-circle" src="${post.author.profile_image}" alt="">
  <b>${post.author.username}</b>
  </div>
  ${post.author.username === JSON.parse(localStorage.getItem("User"))?.username ? `<button class="btn btn-outline-secondary edit-btn" type="button">edit</button>` : ""}
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
</div>
  `;
      }
      elements.postsContainer.innerHTML += content; // Set innerHTML once
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    showAlert("Failed to load posts", "danger");
  } finally {
    let cards = document.querySelectorAll(".card-body");
    let editBtns = document.querySelectorAll(".edit-btn");
    cards.forEach((card) => {
      card.addEventListener("click", postClickd);
    });
    editBtns.forEach((editBtn) => {
      editBtn.addEventListener("click", function (e) {
        let target = e.currentTarget.parentElement.parentElement;
        elements.post_id_input.value = target.id;

        document.getElementById("postTitle").innerHTML = "Edit Post";
        elements.post_title.value = target.querySelector("h5").textContent;
        elements.post_body.value = target.querySelector("p").textContent;
        document.getElementById("create-post-image").files[0] = target
          .querySelector("img")
          .getAttribute("src");
        let postModal = new bootstrap.Modal(
          document.querySelector("#postModal"),
          {}
        );
        postModal.show();
      })
    })
  }
}
  
  

// Reset Post Modal Function
function resetPostModal() {
  elements.post_id_input.value = "";
  elements.post_title.value = "";
  elements.post_body.value = "";
  document.getElementById("create-post-image").value = "";
  document.getElementById("postTitle").innerHTML = "Create A New Post";
}

//  update
function update() {
  if (localStorage.getItem("token") == null) {
    elements.logoutui.style.setProperty("display", "none", "important");
    elements.loginui.style.setProperty("display", "flex", "important");
    elements.post_btn.style.setProperty("display", "none", "important");
  } else {
    elements.profile_inf.textContent = JSON.parse(
      localStorage.getItem("User")
    ).username;
    elements.profileImage.src = JSON.parse(
      localStorage.getItem("User")
    ).profile_image;
    elements.logoutui.style.setProperty("display", "flex", "important");
    elements.loginui.style.setProperty("display", "none", "important");
    elements.post_btn?.style.setProperty("display", "flex", "important");
  }
}
// ============= Post Clicked =================
function postClickd(e) {
  let elementId = e.currentTarget.parentElement.id;
  window.location.href = `details.html?postId=${elementId}`;
  // console.log(elementId);
}
// ============= Post Clicked =================
// ============= Post EDIT =================
async function postCreate() {
  let IScreate = elements.post_id_input.value === "" || elements.post_id_input.value === null;
  if (elements.post_body.value && elements.post_img !== "") {
    post_img = document.querySelector("#create-post-image").files[0];
    try {
      const formData = new FormData();
      formData.append("title", elements.post_title.value);
      formData.append("image", post_img);
      formData.append("body", elements.post_body.value);
      headers  =   {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
      let url = `${baseUrl}/posts`;
      let response = ""
      if (IScreate) { 
    response = await axios.post(`${url}`, formData, {
          headers: headers,
        });
      } else {
        formData.append("_method","put")
        url += `/${elements.post_id_input.value}`; 
        response = await axios.post(`${url}`, formData, {
          headers: headers,
        });
      }
      let modal = bootstrap.Modal.getInstance(
        document.querySelector("#postModal")
      );
      modal.hide();
      fetchPosts(1,true)
        showAlert("post created successfully!", "success");

    } catch (error) {
      console.error("Login failed:", error);
      showAlert(error.response?.data?.message || "Login failed", "danger");
    } finally {
      elements.post_body.value = "";
      elements.post_title.value = "";
      elements.post_img = null; // Reset the file input
    }
  }
}
// ============= Post EDIT =================
// Alert Function
function showAlert(message, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);

console.log(alertPlaceholder)
  // Auto dismiss after 3 seconds
  setTimeout(() => document.querySelector(".alert .btn-close")?.click(), 3000);
}
window.addEventListener("scroll", function () {
  const endOfPage =
    Math.ceil(window.innerHeight + window.scrollY + 4) >=
    document.body.offsetHeight;
  if (endOfPage && currentPage < lastpage) {
    currentPage++;
    fetchPosts(currentPage);
  }
});

// Event Listeners
elements.loginBtn.addEventListener("click", async function () {
  if (elements.username.value && elements.password.value) {
    try {
      const response = await axios.post(
        `${baseUrl}/login`,
        {
          "username": elements.username.value,
          "password": elements.password.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("User", JSON.stringify(response.data.user));
      let modal = bootstrap.Modal.getInstance(document.querySelector("#login"));
        modal.hide();
fetchPosts(1,true)
      update();
      showAlert("Logged in successfully!", "success");
    } catch (error) {
      console.error("Login failed:", error);
      showAlert(error.response?.data?.message || "Login failed", "danger");
    } finally {
      elements.username.value = "";
      elements.password.value = "";
    }
  }
});
elements.logoutBtn.addEventListener("click", async function () {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No active session found");
    }

    // Make logout API call
    await axios.post(
      `${baseUrl}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    // Clear all storage
    localStorage.clear();
    // Update UI
    update();
    fetchPosts(1 ,true)
    showAlert("Logged out successfully!", "info");
  } catch (error) {
    console.error("Logout failed:", error);
    showAlert(error.response?.data?.message || "Logout failed", "danger");
  }
});
elements.registerBtn.addEventListener("click", async function () {
  if (
    elements.reusername.value &&
    elements.repassword.value &&
    elements.name.value !== ""
  ) {
    try {
      let formdata = new FormData();
      formdata.append("username", elements.reusername.value);
      formdata.append("password", elements.repassword.value);
      formdata.append("name", elements.name.value);
      formdata.append(
        "image",
        document.querySelector("#register-image").files[0]
      );
      const response = await axios.post(`${baseUrl}/register`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("User", JSON.stringify(response.data.user));
      let modal = bootstrap.Modal.getInstance(
        document.querySelector("#register")
      );
      modal.hide();
fetchPosts( 1,true)
      update();
      showAlert("register in successfully!", "success");
    } catch (error) {
      console.error("register failed:", error);
      showAlert(error.response?.data?.message || "Login failed", "danger");
    } finally {
      elements.username.value = "";
      elements.password.value = "";
    }
  }
});
elements.post_create?.addEventListener("click", postCreate);

// Add post button click handler
elements.post_btn?.addEventListener("click", resetPostModal);

if (
  window.location.href === "http://127.0.0.1:5500/tasks/final_project/index.htm"
) {
  fetchPosts();
}
update();
const baseUrl = "https://tarmeezacademy.com/api/v1";

const elements = {
  profile_inf: document.querySelector(".user-name"),
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
  deletepost_btn: document.querySelector(".new-delete"),
  profileBtn: document.getElementById("profileBtn"),
  loader: document.querySelector(".loader_box"),
};


function loader(check) {
  if (check) {
    elements.loader.style.visibility = "visible";
  } else {
    elements.loader.style.visibility = "hidden";
  }
}
function render() {
  let cards = document.querySelectorAll(".clicked");
  let editBtns = document.querySelectorAll(".edit-btn");
  let deleteBtns = document.querySelectorAll(".delete-btn");
  let profile = document.querySelectorAll(".header");
  cards.forEach((card) => {
    card.addEventListener("click", postClickd);
  });
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", function (e) {
      let target = e.currentTarget.parentElement.parentElement.parentElement;
      console.log(target);
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
    });
  });
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", function (e) {
      let modal = new bootstrap.Modal(
        document.getElementById("deleteposModal"),
        {}
      );
      modal.toggle();
      document.getElementById("delete-post-id").value =
        e.currentTarget.parentElement.parentElement.parentElement.id;
    });
  });
  profile.forEach((prof) => {
    prof.addEventListener("click", function (e) {
      let target = e.currentTarget.parentElement.id;
      window.location.href = `profile.html?userId=${target}`
    })
  });

}
// ===============
function update() {
  if (localStorage.getItem("token") == null) {
    elements.logoutui.style.setProperty("display", "none", "important");
    elements.loginui.style.setProperty("display", "flex", "important");
    elements.post_btn?.style.setProperty("display", "none", "important");
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
// ================
function postClickd(e) {
  let elementId = e.currentTarget.parentElement.id;
  window.location.href = `details.html?postId=${elementId}`;
  // console.log(elementId);
}
// =============
async function postCreate() {

  let IScreate =
    elements.post_id_input.value === "" ||
    elements.post_id_input.value === null;
  if (elements.post_body.value && elements.post_img !== "") {
    post_img = document.querySelector("#create-post-image").files[0];
    try {
      loader(true);
      let formData = new FormData();
      formData.append("title", elements.post_title.value);
      formData.append("image", post_img);
      formData.append("body", elements.post_body.value);
      headers = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      };
      let url = `${baseUrl}/posts`;
      let response = "";
      if (IScreate) {
        response = await axios.post(`${url}`, formData, {
          headers: headers,
        });
      } else {
        formData.append("_method", "put");
        url += `/${elements.post_id_input.value}`;
        response = await axios.post(`${url}`, formData, {
          headers: headers,
        });
        showAlert("post edited successfully!", "success");
      }
      console.log(response.data);
      let modal = bootstrap.Modal.getInstance(
        document.querySelector("#postModal")
      );
      modal.hide();
      if (window.location.href.includes("index.htm")) {
        fetchPosts(1, true);
      } else {
        LoadPost(true)
      }
      loader(false)

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
// ===============
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

  console.log(alertPlaceholder);
  // Auto dismiss after 3 seconds
  setTimeout(() => document.querySelector(".alert .btn-close")?.click(), 3000);
}
// =================

// Event Listeners

elements.profileBtn.addEventListener("click", function (e) {
  if(localStorage.getItem("token")){
    loader(true)
    window.location.href = `profile.html?userId=${
      JSON.parse(localStorage.getItem("User")).id
      }`;
    loader(false)
  } else {
    showAlert("You need to log in first!", "primary");
  }
});

elements.loginBtn.addEventListener("click", async function () {
  loader(true)
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
        if (window.location.href.includes("index.htm")) {
          fetchPosts(1, true);
        } else {
          LoadPost(true);
        }
      update();
      loader(false)
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
  loader(true)
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No active session found");
    }
    await axios.post(
      `${baseUrl}/logout`, {
        "username": JSON.parse(localStorage.getItem("User")).username,
        "password":JSON.parse(localStorage.getItem("User")).password
      },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );
    localStorage.clear();
    // Update UI
    if (window.location.href.includes("index.htm")) {
      fetchPosts(1, true);
    } else {
      LoadPost(true);
    }
    update();
    loader(false)
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
      loader(true);
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
          "Accept": "application/json",
        }
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("User", JSON.stringify(response.data.user));
      let modal = bootstrap.Modal.getInstance(
        document.querySelector("#register")
      );
      modal.hide();
      if (window.location.href.includes("index.htm")) {
        fetchPosts(1, true);
      } else {
        LoadPost(true);
      }
      update();
      showAlert("register in successfully!", "success");
      loader(false);
    } catch (error) {
      console.error("register failed:", error);
      showAlert(error.response?.data?.message || "Login failed", "danger");
    } finally {
      elements.username.value = "";
      elements.password.value = "";
    }
  } else {
    showAlert("Please fill in all fields", "info");
  }
}); 
elements.post_create?.addEventListener("click", postCreate);
elements.deletepost_btn?.addEventListener("click", async function (e) {
  loader(true)
  let postId = document.getElementById("delete-post-id").value;
  console.log(postId);
  const response = await axios.delete(`${baseUrl}/posts/${postId}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": `application/json`,
    },
  });
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("deleteposModal")
  );
  modal.toggle();
  if (window.location.href.includes("index.htm")) {
    fetchPosts(1, true);
  } else {
    LoadPost(true);
  }
  loader(false)
  showAlert("Post deleted successfully!", "primary");
});
// =============
update();
const apiUrl = "http://localhost:5678/api";

const form = document.getElementById("loginForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const errorMessage = document.getElementById("error-message");

  const loginData = {
    email: email,
    password: password,
  };

  fetch(apiUrl + "/users/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Votre email ou votre mot de passe est invalide");
      }
    })
    .then((responseData) => {
      sessionStorage.setItem("token", responseData.token);
      window.location.href = "index.html";
    })
    .catch((error) => {
      errorMessage.innerText = error.message;
      errorMessage.style.color = "red";
      errorMessage.style.textDecoration = "none";
    });
});

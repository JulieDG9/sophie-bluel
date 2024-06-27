const apiUrl = "http://localhost:5678/api";

const form = document.getElementById("loginForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  console.log(email);

  const password = document.getElementById("password").value;
  console.log(password);

  const errorMessage = document.getElementById("error-message");
  console.log(errorMessage);

  const loginData = {
    email: email,
    password: password,
  };

  fetch(apiUrl + "/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json;
      } else {
        errorMessage.innerText =
          "Votre identifiant ou votre mot de passe est invalide";
      }
    })
    .then((responseData) => {});
});

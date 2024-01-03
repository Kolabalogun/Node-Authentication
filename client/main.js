const username = document.getElementById("username");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const employeeBtn = document.getElementById("employeeBtn");

const sendRefreshToken = async () => {
  try {
    await fetch("http://localhost:3500/refresh", {
      method: "GET",
    });
    console.log("Refresh token sent successfully");
  } catch (error) {
    console.log("Error sending refresh token:", error);
  }
};

const sendLogin = async () => {
  console.log("Attempting login...");
  try {
    const res = await fetch("http://localhost:3500/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Login successful");
      console.log(data);
    } else {
      if (res.status === 401) {
        await sendRefreshToken();
      } else {
        throw new Error(`${res.status} ${data.message}`);
      }
    }
  } catch (error) {
    console.log("Error during login:", error);
  }
};

// Prevent default form submission
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Form submitted");
  sendLogin();
});

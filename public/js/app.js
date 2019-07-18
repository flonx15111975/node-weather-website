console.log("Client site javascript file is loaded");

const weatherForm = document.querySelector("form");
const searchTXT = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

messageOne.textContent = "";
messageTwo.textContent = "";

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();

    messageOne.textContent = "Loading ....";
    messageTwo.textContent = "";

    const location = searchTXT.value;
    fetch("/weather?address=" + location).then((response) => {
        response.json().then((data) => {
            if(data.error)
            {
                messageOne.textContent = "";
                messageTwo.textContent = "Error: " + data.error;
                console.log("Error: " + data.error);
            }
            else
            {
                messageOne.textContent = "Location: " + data.location;
                messageTwo.textContent = "Forecast: " + data.forecast;

                // console.log("Address: " + data.address);
                // console.log("Location: " + data.location);
                // console.log("Forecast: " + data.forecast);
            }
        });
    });
});
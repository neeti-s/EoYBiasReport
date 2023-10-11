const replicateProxy = "https://replicate-api-proxy.glitch.me"

const text_container = document.getElementById("text_container");
var input_field = document.createElement("input");
input_field.type = "text";
input_field.id = "input_prompt";
input_field.value = "Enter an Assumption";
input_field.size = 100;
text_container.prepend(input_field);
input_field.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        askForWords(input_field.value);
    }
});

async function askForWords(p_prompt) {

    document.body.style.cursor = "progress";
    const textDiv = document.getElementById("resulting_text");
    textDiv.innerHTML = "Waiting for reply from Replicate...";

    // Check if the prompt is a question.
    const isQuestion = p_prompt.endsWith('?');

    // Define the initial prompt based on whether it's a question or not.
    let initialPrompt = isQuestion
        ? p_prompt + "Limit the answer to 50 words."
        : p_prompt + "Convert this to a question. Limit to one sentence.";

    const data = {
        "version": "35042c9a33ac8fd5e29e27fb3197f33aa483f72c2ce3b0b9d201155c7fd2a287",
        input: {
            // prompt: p_prompt + "Convert this to a question. Limit to one sentence.",
            // prompt: p_prompt + "Limit the answer to 50 words.",
            prompt: initialPrompt, // Updated the prompt here
            max_tokens: 100,
            max_length: 100,
        },
    };
    console.log("Asking for Words From Replicate via Proxy", data);
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    };
    const url = replicateProxy + "/create_n_get/"
    console.log("words url", url, "words options", options);
    const words_response = await fetch(url, options);
    console.log("words_response", words_response);
    const proxy_said = await words_response.json();
    if (proxy_said.output.length == 0) {
        textDiv.innerHTML = "Something went wrong, try it again";
    } else {
        textDiv.innerHTML = proxy_said.output.join("");
        console.log("proxy_said", proxy_said.output.join(""));
    }
}


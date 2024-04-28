async function main (){

  const generateRequest = {
    model: "llama3",
    prompt: "Como fazer arroz soltinho?",
    stream: false, // <- important for Node/Deno clients
  };
  
  let resp = await fetch("http://poc-ollama-server.flycast/api/generate", {
    method: "POST",
    body: JSON.stringify(generateRequest),
  });
  
  if (resp.status !== 200) {
    throw new Error(`error fetching response: ${resp.status}: ${await resp.text()}`);
  }
  
  resp = await resp.json();
  
  console.log(resp.response); // Something like "The safe cooking temperature for ground beef is 71 degrees celsius (160 degrees fahrenheit).
}

main()
import { Ollama } from 'ollama'
import { ChromaClient } from "chromadb";

const documents = [
  "Llamas are members of the camelid family meaning they're pretty closely related to vicuñas and camels",
  "Llamas were first domesticated and used as pack animals 4,000 to 5,000 years ago in the Peruvian highlands",
  "Llamas can grow as much as 6 feet tall though the average llama between 5 feet 6 inches and 5 feet 9 inches tall",
  "Llamas weigh between 280 and 450 pounds and can carry 25 to 30 percent of their body weight",
  "Llamas are vegetarians and have very efficient digestive systems",
  "Llamas live to be about 20 years old, though some only live for 15 years and others live to be 30 years old",
]

async function main() {
  console.log('🖇️ Step: 1 Generate embeddings')

  const client = new ChromaClient({
    path: "http://localhost:8001"
  });
  const ollama = new Ollama({ host: 'http://poc-ollama-server.flycast' })

  const collection = await client.createCollection({name: "nomic-test"})

  // store each document in a vector embedding database
  for (let index = 0; index < documents.length; index++) {
    const response = await ollama.embeddings({
      model: "nomic-embed-text",
      prompt: documents[index]
    })

    collection.add({
      ids: String(index),
      embeddings: [response.embedding],
      documents: documents[index]
    })
  }

  console.log('💿 Step 2: Retrieve')
  // an example prompt
  const prompt = "How many years old a llama live?"

  // generate an embedding for the prompt and retrieve the most relevant doc
  const response = await ollama.embeddings({
    prompt,
    model:"nomic-embed-text"
  })

  const results = await collection.query({
    queryEmbeddings: [response.embedding],
    nResults: 1
  })

  const data = results.documents[0][0]
  console.log('Embedding Result:', data);

  console.log('👷🏻‍♂️ Step 3: Generate')
  // generate a response combining the prompt and data we retrieved in step 2
  const output = await ollama.generate({
    model: "llama3",
    prompt: `Using this data: ${data}. Respond to this prompt: ${prompt}`
  })

  console.log(output.response)
}

main()


// # store each document in a vector embedding database
// for i, d in enumerate(documents):
//   response = ollama.embeddings(model="mxbai-embed-large", prompt=d)
//   embedding = response["embedding"]
//   collection.add(
//     ids=[str(i)],
//     embeddings=[embedding],
//     documents=[d]

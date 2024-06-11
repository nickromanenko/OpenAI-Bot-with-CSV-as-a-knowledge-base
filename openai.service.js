const fs = require("fs");
const createAssistant = async (openai) => {
  // Assistant file path
  const assistantFilePath = "assistant.json";
  // check if file exists
  if (!fs.existsSync(assistantFilePath)) {
    // Create a file
    const file = await openai.files.create({
      file: fs.createReadStream("data.csv"),
      purpose: "assistants",
    });

    // Create assistant
    const assistant = await openai.beta.assistants.create({
      name: "Chat Demo",
      instructions: `You head the office of the election commission. You have to answer questions about the election results. Try to answer only with essential information. Use the data from the provided CSV file if it is relevant to the question.`,
      tools: [{ type: "code_interpreter" }],
      tool_resources: { code_interpreter: { file_ids: [file.id] } },
      model: "gpt-4o",
    });
    // Write assistant to file
    fs.writeFileSync(assistantFilePath, JSON.stringify(assistant));
    return assistant;
  } else {
    // Read assistant from file
    const assistant = JSON.parse(fs.readFileSync(assistantFilePath));
    return assistant;
  }
};
module.exports = { createAssistant };

function buildRichOutputPrompt({
    messagesExchanged,
    outputGeneratedSoFar,
    input,
    output,
}) {
    const messages = [
        {
            role: "system",
            content: `You are a helpful assistant in detailed output generation. 
INPUT: You will be given a list of messages that were exchanged between a user and an assistant.
OUTPUT: You will need to generate the outputs/results based on the messages. The outputs/results should be in the format of what the user asked for. You will be given a partially filled output. You need to fill the output based on the messages.

RULES:
- For each element in the output, you need to generate the output/result based on the messages. Stick to the format of the element mentioned.
- For markdown elements, you need to generate the markdown based on the messages. Make sure the markdown is formatted correctly. When in doubt, include more details rather than less.
- Focus on the task and the description of the element to understand that the value of the element should be.
`,
        },
        {
            role: "user",
            content: `
****************TASK****************
DETAILED OUTPUT GENERATION

Context:
- An agent worked along with a user on a user's task and produced an output. Because of context limitations, obviously the output is heavily influenced from the last few messages it exchanged with the user.
- What we want to do is, take the output it generated and go through all the messages it exchanged with the user to understand the context and then update the output to make it more accurate.
- For ex: it might have assumed some information is not present, or presented only portions of it, or summary of it because of context limitations.
- So we need to go through the messages and update the output to make it more accurate.
- Ex: The task might assumed some information as not available, but while going through the messages, we find that the information is present. So we need to update the output to include that information.
- Another ex: The task might have given just high level very small output, but while going through the messages, we find much more helpful and rich information. So we can update the output to include that information. The more richer we make the better. 
****************TASK****************

****************WHAT THE USER WANTED****************
${input}
****************WHAT THE USER WANTED****************

${
    output
        ? `****************SUMMARY OF OUTPUT****************
${output}
****************SUMMARY OF OUTPUT****************`
        : ""
}

****************OUTPUT GENERATED SO FAR****************
${JSON.stringify(outputGeneratedSoFar, null, 2)}
****************OUTPUT GENERATED SO FAR****************

****************NEW MESSAGES EXCHANGED****************
${messagesExchanged
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n")}
****************NEW MESSAGES EXCHANGED****************

****************OUTPUT****************
FORMAT: JSON OBJECT WITH ONLY ONE KEY "outputGenerated"
{
    "outputGenerated": [
        {
            "key": "...", // retain the key from the outputGeneratedSoFar
            "value": "...", // update this field based on the new messages, if there's no change, keep the same value
            "type": "...", // retain the type from the outputGeneratedSoFar
            "description": "...", // retain the description from the outputGeneratedSoFar
            "readableName": "..." // retain the readableName from the outputGeneratedSoFar
        }
    ]
}
ONLY PRINT THE JSON OBJECT AND NOTHING ELSE.
****************OUTPUT****************
`,
        },
    ];

    return messages;
}

module.exports = {
    buildRichOutputPrompt,
};

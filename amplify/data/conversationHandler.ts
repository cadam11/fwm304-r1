// amplify/data/conversationHandler.ts
import {
  ConversationTurnEvent,
  createExecutableTool,
  handleConversationTurnEvent,
} from "@aws-amplify/backend-ai/conversation/runtime";

const jsonSchema = {
  json: {
    type: "object",
    properties: {
      projectId: {
        type: "string",
        description: "ID of the project to analyze",
      },
    },
    required: ["projectId"],
  },
} as const;

const timelinePredictor = createExecutableTool(
  "predict_timeline",
  "Predicts the timeline of a project based on the engineers assigned to it",
  jsonSchema,
  async (input) => {
    const { projectId } = input;
    return {
      text: JSON.stringify({
        estimatedCompletion: "2024-06-15",
        confidence: 0.85,
        factors: [
          "Team experience level",
          "Similar project history",
          "Current workload",
        ],
      }),
    };
  },
);

export const handler = async (event: ConversationTurnEvent) => {
  await handleConversationTurnEvent(event, {
    tools: [timelinePredictor],
  });
};
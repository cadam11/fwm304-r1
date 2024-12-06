// amplify/data/resourceManagementTool.ts
import {
  ConversationTurnEvent,
  createExecutableTool,
  ExecutableTool,
  handleConversationTurnEvent,
} from "@aws-amplify/backend-ai/conversation/runtime";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { decodeJWT } from "aws-amplify/auth";
import outputs from "../../amplify_outputs.json";
import { type Schema } from "./resource";

// Define the input schema for the resource management tool
const resourceManagementSchema = {
  type: "object",
  properties: {
    operation: {
      type: "string",
      enum: ["assign", "unassign"],
      description: "The operation to perform (assign or unassign)",
    },
    projectId: {
      type: "string",
      description: "The ID of the project",
    },
    engineerId: {
      type: "string",
      description: "The ID of the engineer to assign or unassign",
    },
  },
  required: ["operation", "projectId", "engineerId"],
} as const;

const setUpClient = (authToken: string) => {
  Amplify.configure(outputs, {
    Auth: {
      tokenProvider: {
        getTokens: async ({ forceRefresh } = {}) => {
          return {
            accessToken: decodeJWT(authToken),
          };
        },
      },
    },
  });
  return generateClient<Schema>({ authMode: "userPool" });
};

const makeResourceManagementTool = (
  event: ConversationTurnEvent,
): ExecutableTool<typeof resourceManagementSchema> => {
  return createExecutableTool(
    "manage_project_resources",
    "Manages project resource assignments and unassignments",
    { json: resourceManagementSchema },
    async (input) => {
      const authToken = event.request.headers["authorization"];
      const client = setUpClient(authToken);
      const { operation, projectId, engineerId } = input;

      // Verify project exists
      const { data: project, errors: getProjectErrors } =
        await client.models.Project.get({ id: projectId });
      if (!project) {
        throw new Error(
          `Project with ID ${projectId} not found. ${getProjectErrors
            ?.map((error) => error.message)
            .join("\n")}`,
        );
      }

      // Verify employee exists
      const { data: engineer, errors: getEngineerErrors } =
        await client.models.Engineer.get({ id: engineerId });
      if (!engineer) {
        throw new Error(
          `Engineer with ID ${engineerId} not found. ${getEngineerErrors
            ?.map((error) => error.message)
            .join("\n")}`,
        );
      }

      const newProjectId = operation === "assign" ? projectId : null;
      await client.models.Engineer.update({
        id: engineerId,
        projectId: newProjectId,
      });

      return {
        text: `Successfully ${operation}ed ${engineer.name} to ${project.name}.`,
      };
    },
  );
};

export const handler = async (event: ConversationTurnEvent) => {
  await handleConversationTurnEvent(event, {
    tools: [makeResourceManagementTool(event)],
  });
};
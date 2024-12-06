// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Engineer: a
    .model({
      name: a.string().required(),
      skills: a.string().array(),
      availability: a.boolean(),
      currentProject: a.belongsTo("Project", "projectId"),
      timeOff: a.hasMany("TimeOff", "engineerId"),
      projectId: a.id(),
    })
    .authorization((allow) => allow.authenticated()),

  Project: a
    .model({
      name: a.string().required(),
      startDate: a.date().required(),
      endDate: a.date().required(),
      requiredSkills: a.string().array(),
      engineers: a.hasMany("Engineer", "projectId"),
      status: a.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]),
    })
    .authorization((allow) => allow.authenticated()),

  TimeOff: a
    .model({
      engineerId: a.id(),
      engineer: a.belongsTo("Engineer", "engineerId"),
      startDate: a.date().required(),
      endDate: a.date().required(),
      type: a.enum(["VACATION", "SICK", "HOLIDAY"]),
    })
    .authorization((allow) => allow.authenticated()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
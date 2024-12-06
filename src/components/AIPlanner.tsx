// src/components/AIPlanner.tsx
import { Card, Heading, Flex, ScrollView } from "@aws-amplify/ui-react";

export function AIPlanner() {
  return (
    <Card>
      <Heading level={2}>AI Resource Planner</Heading>
      <Flex direction="column" gap="1rem">
        <ScrollView height="600px"></ScrollView>
      </Flex>
    </Card>
  );
}

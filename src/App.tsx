// src/App.tsx
import { Flex, Heading, ThemeProvider, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <View padding="1rem">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          marginBottom="1rem"
        >
          <Heading level={1}>Engineer Resource Planner</Heading>
        </Flex>

        <Flex direction="row" gap="1rem">
          <View flex="2">&nbsp;</View>
          <View flex="1">&nbsp;</View>
        </Flex>
      </View>
    </ThemeProvider>
  );
}

export default App;

import { useState } from "react";
import { Text, View } from "onyx-ui";

import "./App.css";

function BacklogItem() {
  return (
    <View fillColor="white" padding="8px 16px" spacing="8px">
      <Text fontWeight="600">Comments can be added to item</Text>
      <View>
        <Text light fontSize="12px">
          GEM-1
        </Text>
      </View>
    </View>
  );
}
function App() {
  const [count, setCount] = useState(0);

  return (
    <View flex fillColor="gutter" padding="16px">
      <View
        border
        cornerRadius="4px"
        fillColor="divider"
        spacing="1px"
        style={{ overflow: "clip" }}
      >
        <BacklogItem />
        <BacklogItem />
      </View>
    </View>
  );
}

export default App;

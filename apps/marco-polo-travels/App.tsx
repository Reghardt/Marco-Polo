import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import TrpcWrapper from "./utils/Trpc.wrapper";
import FirstComponent from "./components/FirstCmp.component";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/Login.component";

const Stack = createNativeStackNavigator();

export default function Native() {
  return (
    // <View style={styles.container}>
    //   <Text style={styles.header}>Native 8</Text>

    //   <StatusBar style="auto" />
    // </View>
    <TrpcWrapper>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="FC" component={FirstComponent}/>
        </Stack.Navigator>
        {/* <View style={styles.container}>
          <Text style={styles.header}>Native 10</Text>
          <FirstComponent/>
          


          <StatusBar style="auto" />
        </View> */}
      </NavigationContainer>

    </TrpcWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 36,
  },
});

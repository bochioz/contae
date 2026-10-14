import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Contaê App</Text>
      <Link href="/sobre" style={styles.button}>Sobre</Link>  
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'none',
  color: 'blue',}
});

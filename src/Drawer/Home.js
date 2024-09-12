import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { LoginContext } from '../Context/LoginProvider';

const Home = () => {
  const { setIsLoggedIn } = React.useContext(LoginContext);
  return (
    <View style={styles.screen}>
      <Text>Home screen</Text>
      <Button
        title="Logout"
        onPress={() => {
          setIsLoggedIn(false);
        }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

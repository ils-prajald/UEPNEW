import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

//SCREENS
import CreateAccount from "../screens/auth/CreateAccount";
import VerifyAccount from "../screens/auth/VerifyAccount";
import SetPassword from "../screens/auth/SetPassword";
import UserLogin from "../screens/auth/UserLogin";
import UserProfile from "../screens/profile/UserProfile";
import ForgotPassword from "../screens/auth/ForgotPassword";
import VerifyForgotPassword from "../screens/auth/VerifyForgotPassword";
import UnderDev from "../screens/auth/UnderDev";
import ContactUEP from "../screens/contact/ContactUEP";
import ResetPassword from "../screens/auth/ResetPassword";
import HomeScreen from "../screens/home/HomeScreen";
import EventSearch from "../screens/home/EventSearch";
import RegisterConfirm from "../components/RegisterConfirm";
import ActNumberScreen from "../screens/home/ActNumberScreen";
import ViewMediaScreen from "../screens/home/ViewMediaScreen";
import VideoPlayerScreen from "../screens/home/VideoPlayerScreen";
import ViewImage from "../screens/home/ViewImage";
import PackageScreen from "../screens/home/PackageScreen";
import fonts from "../constants/fonts";
import Logout from "../screens/auth/Logout";
const options = { headerShown: false };
import Home from "./Home";
import Tasks from "./Tasks";
import CustomDrawer from "./CustomDrawer";

// UEP STACK NAVIGATOR
const UEPStack = createStackNavigator();
const UEPStackNavigator = () => {
  return (
    <UEPStack.Navigator initialRouteName="UserLogin">
      <UEPStack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={options}
      />
      <UEPStack.Screen
        name="VerifyAccount"
        component={VerifyAccount}
        options={options}
      />
      <UEPStack.Screen
        name="SetPassword"
        component={SetPassword}
        options={options}
      />
      <UEPStack.Screen
        name="UserLogin"
        component={UserLogin}
        options={options}
      />
      <UEPStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={options}
      />
      <UEPStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={options}
      />
      <UEPStack.Screen
        name="VerifyForgotPassword"
        component={VerifyForgotPassword}
        options={options}
      />
      <UEPStack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={options}
      />

      <UEPStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={options}
      />
      <UEPStack.Screen
        name="ContactUEP"
        component={ContactUEP}
        options={options}
      />
      <UEPStack.Screen
        name="EventSearch"
        component={EventSearch}
        options={options}
      />
      <UEPStack.Screen
        name="RegisterConfirm"
        component={RegisterConfirm}
        options={options}
      />
      <UEPStack.Screen
        name="ActNumberScreen"
        component={ActNumberScreen}
        options={options}
      />
      <UEPStack.Screen
        name="ViewMediaScreen"
        component={ViewMediaScreen}
        options={options}
      />
      <UEPStack.Screen
        name="VideoPlayerScreen"
        component={VideoPlayerScreen}
        options={options}
      />
      <UEPStack.Screen
        name="ViewImage"
        component={ViewImage}
        options={options}
      />
      <UEPStack.Screen
        name="PackageScreen"
        component={PackageScreen}
        options={options}
      />
      <UEPStack.Screen name="UnderDev" component={UnderDev} options={options} />
      <UEPStack.Screen name="Logout" component={Logout} options={options} />
    </UEPStack.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const drawerStyle = {
  backgroundColor: "#232323",
};

const drawerContentOptions = {
  activeTintColor: "#FEDBB3",
  inactiveTintColor: "#FFFFFF",
  activeBackgroundColor: "#232323",

  itemStyle: { marginVertical: "0.5%", marginLeft: "10%" },
  labelStyle: {
    opacity: 1,
    fontSize: 17,
    fontFamily: fonts.AvenirNextCondensedBold,
  },
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName=" "
      drawerStyle={drawerStyle}
      drawerType="back"
      drawerContentOptions={drawerContentOptions}
    >
      <Drawer.Screen name=" " component={UEPStackNavigator} />
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      <Drawer.Screen name="My Profile" component={UserProfile} />
      <Drawer.Screen name="View Purchased Media" component={UnderDev} />
      <Drawer.Screen name="Search For A Routine" component={UnderDev} />
      <Drawer.Screen name="View My Cart" component={UnderDev} />
      <Drawer.Screen name="Checkout" component={UnderDev} />
      <Drawer.Screen name="Contact UEP" component={ContactUEP} />
      <Drawer.Screen name="Exit" component={Logout} />
    </Drawer.Navigator>
  );
};

const LoggedIn = () => {
  return <DrawerNavigator />;
};

export default LoggedIn;

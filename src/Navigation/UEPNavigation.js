import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserLogin from '../Screens/Auth/UserLogin'
import CreateAccount from '../Screens/Auth/CreateAccount';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import VerifyAccount from '../Screens/Auth/VerifyAccount';
import SetPassword from '../Screens/Auth/SetPassword';
import RegisterConfirm from '../Components/RegisterConfirm';
import VerifyForgotPassword from '../Screens/Auth/VerifyForgotPassword';
import ResetPassword from '../Screens/Auth/ResetPassword';

const options = { headerShown: false };

const AuthStack = createNativeStackNavigator();
const AuthNavigator = () => {
    return(
        <AuthStack.Navigator initialRouteName="UserLogin" screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="UserLogin" component={UserLogin}/>
        <AuthStack.Screen name="CreateAccount" component={CreateAccount}/>
        <AuthStack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <AuthStack.Screen name="VerifyAccount" component={VerifyAccount}/>
        <AuthStack.Screen name="SetPassword" component={SetPassword}/>
        <AuthStack.Screen name="RegisterConfirm" component={RegisterConfirm}/>
        <AuthStack.Screen name="VerifyForgotPassword" component={VerifyForgotPassword}/>
        <AuthStack.Screen name="ResetPassword" component={ResetPassword}/>
        </AuthStack.Navigator>
    )
}
export default AuthNavigator;
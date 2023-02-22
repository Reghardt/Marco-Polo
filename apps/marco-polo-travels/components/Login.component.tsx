import { View, Text, Button } from "react-native"

const Login = ({navigation}: {navigation: any}) => {


    return(
        <View>
            <Text>Login Component</Text>
            <Button
                title="Go to Details"
                onPress={() => navigation.navigate('FC')}
            />
        </View>
    )
}

export default Login


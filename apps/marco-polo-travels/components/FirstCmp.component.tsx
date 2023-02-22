import { View, Text } from "react-native"
import { trpc } from "../utils/trpc"

const FirstComponent = () => {

    const sayHello = trpc.hello.sayHello.useQuery({hello: "Hello there"})

    console.log("hello component")
    return(
        <View>
            <Text>Navigation test</Text>
            <Text>{sayHello.data}</Text>
        </View>
    )
}

export default FirstComponent


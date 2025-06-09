import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";

export default function Layout () {
  
	const { isSignedIn } = useUser();

	return <Stack screenOptions={{ headerShown: false }} />;

}
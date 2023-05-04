import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";

import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
ChartJS.register(ArcElement, Tooltip, Legend);
const inter = Inter({ subsets: ["latin"] });
import { useRouter } from "next/router";
import axios from "axios";
import { isAdmin } from "@/helper/auth";

const PostDetails = ({ post }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Data is loading</h1>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [values, setValues] = useState({
    loading: false,
    error: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // API CALL

  const signin = async (user) => {
    let res = await axios.post(
      "https://cloudmagician.co.in/api/auth/local",
      {
        identifier: user.email,
        password: user.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  };

  const authenticate = (data, next) => {
    console.log(data);
    console.log("I'm done!");
    if (typeof window !== "undefined") {
      localStorage.setItem("jwt", JSON.stringify(data));
      next();
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });

    signin({ email, password })
      .then((data) => {
        isAdmin(data.data.jwt).then((res) => {
          if (res.data.role.id == 3) {
            setValues({ ...values, error: false, loading: false });
            authenticate(data, () => {
              setValues({
                ...values,
                didRedirect: true,
              });
              router.push("/dashboard");
            });
          } else {
            setError("Unautharized Access");
          }
        });
      })
      .catch((err) => setError("Invalid email or password"));
  };

  // Define postData here
  const postData = {
    title: "My Blog Post",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  };

  return (
    <>
      <Head>
        <title>Peace Garden Seller Panel</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bgGradient="linear(to-l, #7928CA, #DA0155)"
        >
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
<Box rounded={"lg"} bg="white" boxShadow="lg" p={8}>
<Stack align={"center"}>
<Heading>Seller Login</Heading>
</Stack>
<Box mt={8}>
<form>
<Stack spacing={4}>
{error && <Text color="red">
{error}</Text>}
<Input
type="email"
placeholder="Email"
isRequired
onChange={(event) => setEmail(event.currentTarget.value)}
/>
<Input
type="password"
placeholder="Password"
isRequired
onChange={(event) =>
setPassword(event.currentTarget.value)
}
/>
<Button
colorScheme="purple"
type="submit"
onClick={(event) => onSubmit(event)}
>
Sign in
</Button>
</Stack>
</form>
</Box>
</Box>
</Stack>
</Flex>
<PostDetails post={postData} />
</main>
</>
);
}

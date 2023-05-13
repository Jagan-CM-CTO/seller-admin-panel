import Sidebar from "@/components/Sidebar";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  useToast,
  MenuButton,
  MenuItem,
  MenuList,
  Menu,
  Text,
  Stack,
  InputGroup,
  InputRightElement,
  Table,
  Thead,
  Divider,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Button,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/helper/auth";
import { API_URL } from "@/helper/API";

const ViewOrderModal = ({ btnText, order }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="brand.400" bg="brand.400" size="md" onClick={onOpen}>
        {btnText ? btnText : "View Details"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={"sm"} as={"b"}>
              Order ID
            </Text>
            <Text mb={2}>{order.id}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"}>
              Sadad Order ID
            </Text>
            <Text mb={2}>{order.attributes.order_id}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Transaction ID
            </Text>
            <Text mb={2}>
              {order.attributes.transaction?.data?.attributes?.transaction_id}
            </Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Order Status
            </Text>

            <Text mb={2}>
              <Badge colorScheme="green">{order.attributes.status}</Badge>
            </Text>

            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Customer Name
            </Text>
            <Text mb={2}>{order.attributes.customer_name}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Customer Email
            </Text>
            <Text mb={2}>{order.attributes.email}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Receiver Name
            </Text>
            <Text mb={2}>
              {order.attributes.shipping_address?.data?.attributes?.identifier}
            </Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Building Number
            </Text>
            <Text mb={2}>
              {
                order.attributes.shipping_address?.data?.attributes
                  ?.building_number
              }
            </Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Unit/floor Number
            </Text>
            <Text mb={2}>
              {order.attributes.shipping_address?.data?.attributes?.unit_number}
            </Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Street Number
            </Text>
            <Text mb={2}>
              {
                order.attributes.shipping_address?.data?.attributes
                  ?.street_number
              }
            </Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Zone Number
            </Text>
            <Text mb={2}>
              {order.attributes.shipping_address?.data?.attributes?.zone_number}
            </Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              City
            </Text>
            <Text mb={2}>
              {order.attributes.shipping_address?.data?.attributes?.city}
            </Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Country
            </Text>
            <Text mb={2}>
              {order.attributes.shipping_address?.data?.attributes?.country}
            </Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Mobile Number
            </Text>
            <Text mb={2}>
              {
                order.attributes.shipping_address?.data?.attributes
                  ?.mobile_number
              }
            </Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Phone Number
            </Text>
            <Text mb={2}>
              {
                order.attributes.shipping_address?.data?.attributes
                  ?.phone_number
              }
            </Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              {`Receiver's Peace Garden User ID`}
            </Text>
            <Text mb={2}>
              {
                order.attributes.shipping_address?.data?.attributes
                  ?.receiver_user_pg_id
              }
            </Text>
            <Divider />

            <Text fontSize={"sm"} as={"b"} mt={8}>
              Pincode
            </Text>
            <Text mb={2}>{order.attributes.pincode}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Amount
            </Text>
            <Text mb={2}>${order.attributes.amount}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Pincode
            </Text>
            <Text mb={2}>{order.attributes.pincode}</Text>
            <Divider />

            <Text fontSize={"sm"} as={"b"} mt={8}>
              Products
            </Text>
            {order.attributes.products.data.length ? (
              order.attributes.products.data.map((product, i) => (
                <Text mb={2} key={i}>
                  {product.attributes.product_name}
                </Text>
              ))
            ) : (
              <Text mb={2} _disabled>
                No products found
              </Text>
            )}
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Order Status
            </Text>
            <Text mb={2}>{order.attributes.status}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pendingSearch, setPendingSearch] = useState(false);
  const [completedSearch, setCompletedSearch] = useState(false);
  const [canceledSeach, setCanceledSeach] = useState(false);
  const toast = useToast();

  const updateStatus = async (id, status) => {
    console.log("hurrehh", status);
    let auth = isAuthenticated();
    let jwt = auth.data?.jwt;
    let reqBody = { status: status };

    let res = await axios.put(
      `${API_URL}orders/${id}`,
      {
        data: reqBody,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log(res);
    if (res.status == 200) {
      console.log("success", res.data);
      toast({
        title: "Success",
        description: "Status updated successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      getOrders();
    }
  };

  const auth = isAuthenticated();
  const jwt = auth.data?.jwt;
  const getOrders = async () => {
    console.log("I'm innnn");
    let res = await axios.get(
      `${API_URL}orders?pagination[pageSize]=100&populate=*`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    setOrders(res.data.data);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <Head>
        <title>Peace Garden</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Sidebar>
          <Flex justify={"space-between"}>
            <Text fontSize={"2xl"} fontWeight={"semibold"}>
              Manage Orders
            </Text>
          </Flex>

          <Flex
            justify={"space-between"}
            gap={10}
            mt={4}
            flexWrap={"wrap"}
            px={2}
          >
            <Stack
              minWidth="23vw"
              bg="white"
              rounded={"md"}
              overflow={"hidden"}
              boxShadow={"2xl"}
            >
              <Text
                fontSize={22}
                fontWeight={"semibold"}
                bg={"brand.400"}
                textAlign="center"
                py={2}
                color="white"
              >
                Pending Orders
              </Text>
              <InputGroup
                maxW="60vw"
                mx="auto"
                mt={6}
                bg="white"
                rounded="md"
                // boxShadow={"2xl"}
              >
                <InputRightElement color="brand.400">
                  <MdOutlineSearch />
                </InputRightElement>
                <Input
                  type="text"
                  name="Secrch"
                  placeholder="Search..."
                  onChange={(e) =>
                    setPendingSearch(e.target.value.toLowerCase())
                  }
                  py={4}
                />
              </InputGroup>
              <TableContainer bg={"#fff"} mt={5}>
                <Table variant="simple">
                  <Thead>
                    <tr textAlign="center">
                      <Th textAlign="center">Order ID</Th>
                      <Th textAlign="right">Update Status</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {orders
                      .filter((order) => {
                        if (!pendingSearch) {
                          return true;
                        }

                        if (order.id?.toString().includes(pendingSearch)) {
                          return true;
                        }

                        return false;
                      })
                      .filter((order) => order.attributes.status == "pending")
                      .map((order, i) => {
                        return (
                          <Tr key={i}>
                            <Td textAlign="center">
                              <ViewOrderModal
                                btnText={order.id}
                                order={order}
                                onUpdateStatus={() =>
                                  updateStatus(order.id, "canceled")
                                }
                              />
                            </Td>
                            <Td textAlign="right">
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  color="dark"
                                  bg="white.600"
                                  rightIcon={<ChevronDownIcon />}
                                >
                                  Update Status
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    as={Button}
                                    onClick={() =>
                                      updateStatus(order.id, "completed")
                                    }
                                  >
                                    Mark as Completed
                                  </MenuItem>
                                  <MenuItem
                                    as={Button}
                                    onClick={() =>
                                      updateStatus(order.id, "canceled")
                                    }
                                  >
                                    Mark as Canceled
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
            <Stack
              minWidth="23vw"
              bg="white"
              rounded={"md"}
              overflow={"hidden"}
              boxShadow={"2xl"}
            >
              <Text
                fontSize={22}
                fontWeight={"semibold"}
                bg={"brand.400"}
                textAlign="center"
                py={2}
                color="white"
              >
                Completed Orders
              </Text>
              <InputGroup
                mx={10}
                mt={4}
                mb={2}
                bg="white"
                rounded="none"
                // boxShadow={"2xl"}
              >
                <InputRightElement color="brand.400">
                  <MdOutlineSearch />
                </InputRightElement>
                <Input
                  type="text"
                  name="Secrch"
                  placeholder="Search..."
                  onChange={(e) =>
                    setCompletedSearch(e.target.value.toLowerCase())
                  }
                  py={4}
                />
              </InputGroup>
              <TableContainer bg={"#fff"} mt={5}>
                <Table variant="simple">
                  <Thead>
                    <tr>
                      <Th textAlign="center">Order ID</Th>
                      <Th textAlign="right">Update Status</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {orders
                      .filter((order) => {
                        if (!completedSearch) {
                          return true;
                        }

                        if (order.id?.toString().includes(completedSearch)) {
                          return true;
                        }

                        return false;
                      })
                      .filter((order) => order.attributes.status == "completed")
                      .map((order, i) => {
                        return (
                          <Tr key={i}>
                            <Td textAlign="center">
                              <ViewOrderModal
                                btnText={order.id}
                                order={order}
                              />
                            </Td>
                            <Td textAlign="right">
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  color="dark"
                                  bg="white.600"
                                  rightIcon={<ChevronDownIcon />}
                                >
                                  Update Status
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    as={Button}
                                    onClick={() =>
                                      updateStatus(order.id, "pending")
                                    }
                                  >
                                    Mark as Pending
                                  </MenuItem>
                                  <MenuItem
                                    as={Button}
                                    onClick={() =>
                                      updateStatus(order.id, "canceled")
                                    }
                                  >
                                    Mark as Canceled
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
            <Stack
              minWidth="23vw"
              bg="white"
              rounded={"md"}
              overflow={"hidden"}
              boxShadow={"2xl"}
            >
              <Text
                fontSize={22}
                fontWeight={"semibold"}
                bg={"brand.400"}
                textAlign="center"
                py={2}
                color="white"
              >
                Canceled Orders
              </Text>
              <InputGroup
                mx={10}
                mt={4}
                mb={2}
                bg="white"
                rounded="none"
                // boxShadow={"2xl"}
              >
                <InputRightElement color="brand.400">
                  <MdOutlineSearch />
                </InputRightElement>
                <Input
                  type="text"
                  name="Secrch"
                  placeholder="Search..."
                  onChange={(e) =>
                    setCanceledSeach(e.target.value.toLowerCase())
                  }
                  py={4}
                />
              </InputGroup>
              <TableContainer bg={"#fff"} mt={5}>
                <Table variant="simple">
                  <Thead>
                    <tr>
                      <Th textAlign={"center"}>Order ID</Th>
                      <Th textAlign={"right"}>Update Status</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {orders
                      .filter((order) => {
                        if (!canceledSeach) {
                          return true;
                        }

                        if (order.id?.toString().includes(canceledSeach)) {
                          return true;
                        }

                        return false;
                      })
                      .filter((order) => order.attributes.status == "canceled")
                      .map((order, i) => {
                        return (
                          <Tr key={i}>
                            <Td textAlign="center">
                              <ViewOrderModal
                                btnText={order.id}
                                order={order}
                              />
                            </Td>
                            <Td textAlign="right">
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  color="dark"
                                  bg="white.600"
                                  rightIcon={<ChevronDownIcon />}
                                >
                                  Update Status
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    as={Button}
                                    onClick={() =>
                                      updateStatus(order.id, "pending")
                                    }
                                  >
                                    Mark as Pending
                                  </MenuItem>
                                  <MenuItem
                                    as={Button}
                                    onClick={() =>
                                      updateStatus(order.id, "completed")
                                    }
                                  >
                                    Mark as Completed
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </Flex>
        </Sidebar>
      </main>
    </>
  );
};

export default Orders;

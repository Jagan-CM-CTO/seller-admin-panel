import Sidebar from "@/components/Sidebar";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  useToast,
  Image,
  Switch,
  Text,
  Table,
  Thead,
  Divider,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Button,
  Icon,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  ButtonGroup,
  PopoverCloseButton,
  useDisclosure,
  FormControl,
  Input,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  Select,
} from "@chakra-ui/react";

import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/router";
import { getSellerData, isAuthenticated } from "@/helper/auth";

const AddProductModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const user = isAuthenticated();

  const [values, setvalues] = useState({
    product_name: "",
    short_description: "",
    long_description: "",
    selling_price: "",
    retail_price: "",
    ecommerce_category: "",
    ecommerce_subcategory: "",
    product_image: "",
    seller_account: "",
    // loading: false,
    // error: "",
    // createdProduct: "",
    // getRedicrect: false,
    // formData: "",
  });

  const {
    product_name,
    short_description,
    long_description,
    selling_price,
    retail_price,
    ecommerce_category,
    ecommerce_subcategory,
    product_image,
    // formData,
  } = values;

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const router = useRouter();

  const getCategories = async () => {
    let res = await axios.get(
      "https://cloudmagician.co.in/api/ecommerce-frontpages?populate=*"
    );
    return res;
  };
  const auth = isAuthenticated();
  const jwt = auth.data?.jwt;

  const createProduct = async (product) => {
    console.log(product);
    let res = await axios.post(
      "https://cloudmagician.co.in/api/ecommerce-products",
      product,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return res;
  };

  const onCateogryChange = (event) => {
    event.preventDefault();
    let subCateList =
      categories[event.target.value].attributes.subcategories.data;
    console.log(subCateList);
    setvalues({ ...values, ecommerce_category: event.target.value.id });
    setSubCategories(subCateList);
  };

  const handleChange = (name) => (event) => {
    const value =
      name === "product_image" ? event.target.files[0] : event.target.value;

    setvalues({ ...values, [name]: value });
  };

  const seller = getSellerData();

  let sellerId = seller?.seller_account?.id;
  const onSubmit = (event) => {
    event.preventDefault();

    setvalues({ ...values, error: "", loading: true });
    values.seller_account = sellerId;
    let prod = new FormData();
    prod.append("data", JSON.stringify(values));
    product_image && prod.append("files.product_image", product_image);
    createProduct(prod).then((data) => {
      console.log(data);
      if (data.error) {
        setvalues({ ...values, error: data.error });
      } else {
        setvalues({
          ...values,
          product_name: "",
          short_description: "",
          long_description: "",
          selling_price: "",
          retail_price: "",
          ecommerce_subcategory: "",
        });
        console.log(data);
        toast({
          title: "Success",
          description: "Product created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        router.reload();
      }
    });
  };

  useEffect(() => {
    getCategories().then((data) => {
      console.log(data.data.data);
      setCategories(data.data.data);
      // setvalues({ ...values, formData: new FormData() });
    });
  }, []);

  return (
    <React.Fragment>
      <Button onClick={onOpen} colorScheme="brand.400" bg="brand.400" size="md">
        + Add Product
      </Button>

      <Modal
        blockScrollOnMount={true}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        scrollBehavior="outside"
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                placeholder="eg. Apple Airpods Pro"
                onChange={handleChange("product_name")}
                name="product_name"
                value={product_name}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Product Image</FormLabel>
              <Input
                onChange={handleChange("product_image")}
                type="file"
                name="product_image"
                accept="image"
                placeholder="choose a file"
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Short Description</FormLabel>
              <Textarea
                onChange={handleChange("short_description")}
                name="short_description"
                value={short_description}
                placeholder="Write a short decription of the product..."
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Long Description</FormLabel>
              <Textarea
                onChange={handleChange("long_description")}
                name="long_description"
                value={long_description}
                placeholder="Write a detailed decription of the product..."
              />
            </FormControl>
            <Flex mt={4}>
              <FormControl>
                <FormLabel>Selling Price</FormLabel>
                <NumberInput>
                  <NumberInputField
                    onChange={handleChange("selling_price")}
                    name="selling_price"
                    value={selling_price}
                  />
                </NumberInput>
              </FormControl>
              <FormControl ml={4}>
                <FormLabel>Retail Price</FormLabel>
                <NumberInput>
                  <NumberInputField
                    onChange={handleChange("retail_price")}
                    name="retail_price"
                    value={retail_price}
                  />
                </NumberInput>
              </FormControl>
            </Flex>
            <Flex mt={4}>
              <FormControl>
                <FormLabel>Choose Category</FormLabel>
                <Select
                  placeholder="Select Category"
                  onChange={(event) => {
                    onCateogryChange(event);
                  }}
                >
                  {categories.map((category, i) => {
                    return (
                      <option key={i} value={i}>
                        {category.attributes.title}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl ml={4}>
                <FormLabel>Choose subcategory</FormLabel>
                <Select
                  placeholder="Select subcategory"
                  onChange={handleChange("ecommerce_subcategory")}
                  name="ecommerce_subcategory"
                  value={ecommerce_subcategory}
                >
                  {subCategories?.map((subCategory, i) => {
                    return (
                      <option key={i} value={subCategory.id}>
                        {subCategory.attributes.title}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button bg="brand.400" color="white" onClick={onSubmit}>
              Add Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

const ViewProductModal = ({ productId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [values, setvalues] = useState({
    product_name: "",
    short_description: "",
    long_description: "",
    selling_price: "",
    retail_price: "",
    // ecommerce_category: "",
    ecommerce_subcategory: "",
    product_image: "",
    // loading: false,
    // error: "",
    // createdProduct: "",
    // getRedicrect: false,
    // formData: "",
  });

  const loadProduct = async () => {
    console.log(productId);
    let res = await axios.get(
      `https://cloudmagician.co.in/api/ecommerce-products/${productId}?populate=*`
    );
    let data = await res.data.data;
    console.log(data);
    console.log(data.attributes.selling_price);
    console.log(data.attributes.retail_price);

    setvalues({
      ...values,
      product_name: data.attributes.product_name
        ? data.attributes.product_name
        : "",
      short_description: data.attributes.short_description
        ? data.attributes.short_description
        : "",
      long_description: data.attributes.long_description
        ? data.attributes.long_description
        : "",
      selling_price: data.attributes.selling_price
        ? data.attributes.selling_price
        : "",
      retail_price: data.attributes.retail_price
        ? data.attributes.retail_price
        : "",
      ecommerce_category:
        data.attributes?.ecommerce_category?.data?.attributes?.title,
      ecommerce_subcategory:
        data.attributes?.ecommerce_subcategory?.data?.attributes?.title,
      // product_image: data.attributes?.ecommerce_category?.data?.attributes?.title,
    });
    console.log(values);
    onOpen();
  };

  return (
    <>
      <Button
        onClick={loadProduct}
        colorScheme="brand.400"
        bg="brand.400"
        size="md"
      >
        View
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={"sm"} as={"b"}>
              Product Name
            </Text>
            <Text mb={6}>{values.product_name}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Short Description
            </Text>
            <Text mb={2}>{values.short_description}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Long Description
            </Text>
            <Text mb={2}>{values.long_description}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Retail Price
            </Text>
            <Text mb={2}>${values.retail_price}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Selling Price
            </Text>
            <Text mb={2}>${values.selling_price}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Sub-category
            </Text>
            <Text mb={2}>{values.ecommerce_subcategory}</Text>
            <Divider />
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

const EditProductModal = ({ productId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [values, setvalues] = useState({
    product_name: "",
    short_description: "",
    long_description: "",
    selling_price: "",
    retail_price: "",
    // ecommerce_category: "",
    ecommerce_subcategory: "",
    visibility: "",
    product_image: "",
    // loading: false,
    // error: "",
    // createdProduct: "",
    // getRedicrect: false,
    // formData: "",
  });
  const [productImage, setProductImage] = useState({});
  const {
    product_name,
    short_description,
    long_description,
    selling_price,
    retail_price,
    // ecommerce_category,
    ecommerce_subcategory,
    product_image,
    visibility,
    // formData,
  } = values;

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const router = useRouter();

  const getCategories = async () => {
    let res = await axios.get(
      "https://cloudmagician.co.in/api/ecommerce-frontpages?populate=*"
    );
    return res;
  };

  const auth = isAuthenticated();
  const jwt = auth.data?.jwt;

  const updateProduct = async (product) => {
    console.log(product);
    let res = await axios.put(
      `https://cloudmagician.co.in/api/ecommerce-products/${productId}`,
      product,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return res;
  };

  const onCateogryChange = (event) => {
    event.preventDefault();
    let subCateList =
      categories[event.target.value].attributes.subcategories.data;
    console.log(subCateList);
    setSubCategories(subCateList);
  };

  const handleChange = (name) => (event) => {
    const value =
      name === "product_image" ? event.target.files[0] : event.target.value;

    setvalues({ ...values, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => Boolean(value))
    );

    setvalues({ ...values, error: "", loading: true });
    let prod = new FormData();
    prod.append("data", JSON.stringify(filteredValues));
    if (product_image) {
      prod.append("files.product_image", product_image);
    }

    updateProduct(prod).then((data) => {
      console.log(data);
      if (data.error) {
        setvalues({ ...values, error: data.error });
      } else {
        setvalues({
          ...values,
          product_name: "",
          short_description: "",
          long_description: "",
          selling_price: "",
          retail_price: "",
          ecommerce_subcategory: "",
        });
        console.log(data);
        toast({
          title: "Success",
          description: "Product updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        router.reload();
      }
    });
  };

  useEffect(() => {
    getCategories().then((data) => {
      console.log(data.data.data);
      setCategories(data.data.data);
      // setvalues({ ...values, formData: new FormData() });
    });
  }, []);

  const loadProduct = async () => {
    console.log(productId);
    let res = await axios.get(
      `https://cloudmagician.co.in/api/ecommerce-products/${productId}?populate=*`
    );
    let data = await res.data.data;

    setvalues({
      ...values,
      product_name: data.attributes.product_name
        ? data.attributes.product_name
        : "",
      short_description: data.attributes.short_description
        ? data.attributes.short_description
        : "",
      long_description: data.attributes.long_description
        ? data.attributes.long_description
        : "",
      selling_price: data.attributes.selling_price
        ? data.attributes.selling_price
        : "",
      retail_price: data.attributes.retail_price
        ? data.attributes.retail_price
        : "",
      visibility: data.attributes.retail_price
        ? data.attributes.visibility
        : "",
      // ecommerce_category:
      //   data.attributes?.ecommerce_category?.data?.attributes?.title,
      // ecommerce_subcategory:
      //   data.attributes?.ecommerce_subcategory?.data?.attributes?.title,
      // product_image: data.attributes?.ecommerce_category?.data?.attributes?.title,
    });
    console.log(values);
    onOpen();
  };
  let demoPrice = "550";

  return (
    <React.Fragment>
      <Button
        onClick={loadProduct}
        colorScheme="brand.400"
        bg="brand.400"
        size="md"
        ml="2"
      >
        Edit
      </Button>

      <Modal
        blockScrollOnMount={true}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        scrollBehavior="outside"
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                placeholder="eg. Apple Airpods Pro"
                onChange={handleChange("product_name")}
                name="product_name"
                value={product_name}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Product Image</FormLabel>
              <Input
                onChange={handleChange("product_image")}
                type="file"
                name="product_image"
                accept="image"
                placeholder="choose a file"
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Short Description</FormLabel>
              <Textarea
                onChange={handleChange("short_description")}
                name="short_description"
                value={short_description}
                placeholder="Write a short decription of the product..."
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Long Description</FormLabel>
              <Textarea
                onChange={handleChange("long_description")}
                name="long_description"
                value={long_description}
                placeholder="Write a detailed decription of the product..."
              />
            </FormControl>
            <Flex mt={4}>
              <FormControl>
                <FormLabel>Selling Price</FormLabel>

                <Input
                  type="number"
                  name="selling_price"
                  placeholder="selling_price"
                  onChange={handleChange("selling_price")}
                  value={selling_price}
                />
              </FormControl>
              <FormControl ml={4}>
                <FormLabel>Retail Price</FormLabel>
                <Input
                  type="number"
                  placeholder="Retail Price"
                  onChange={handleChange("retail_price")}
                  name="retail_price"
                  value={retail_price}
                />
              </FormControl>
            </Flex>
            <Flex mt={4}>
              <FormControl>
                <FormLabel>Choose Category</FormLabel>
                <Select
                  placeholder={
                    ecommerce_subcategory
                      ? ecommerce_subcategory
                      : "No category selected"
                  }
                  onChange={(event) => {
                    onCateogryChange(event);
                  }}
                >
                  {categories.map((category, i) => {
                    return (
                      <option key={i} value={i}>
                        {category.attributes.title}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl ml={4}>
                <FormLabel>Choose subcategory</FormLabel>
                <Select
                  placeholder={
                    ecommerce_subcategory
                      ? ecommerce_subcategory
                      : "No category selected"
                  }
                  onChange={handleChange("ecommerce_subcategory")}
                  name="ecommerce_subcategory"
                  value={ecommerce_subcategory}
                >
                  {subCategories?.map((subCategory, i) => {
                    return (
                      <option key={i} value={subCategory.id}>
                        {subCategory.attributes.title}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
            </Flex>
            <Flex mt={4}></Flex>
          </ModalBody>

          <ModalFooter>
            <FormControl>
              <FormLabel>Publish</FormLabel>
              <Switch
                id="visibility"
                size="lg"
                // colorScheme="brand.400"
                onChange={() => {
                  setvalues({ ...values, visibility: !visibility });
                }}
              />
            </FormControl>
            <FormControl textAlign={"right"}>
              <Button bg="brand.400" color="white" onClick={onSubmit}>
                Update Product
              </Button>
            </FormControl>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

const DeleteProductButton = ({ onClick }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const toast = useToast();

  return (
    <Popover placement="right">
      <PopoverTrigger>
        <Button ml="2" color="red.400">
          <Icon as={MdDeleteOutline} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Confirmation!</PopoverHeader>
        <PopoverBody>
          Are you sure you want remove
          <br /> this product?
        </PopoverBody>
        <PopoverFooter display="flex" justifyContent="flex-end">
          <ButtonGroup size="sm">
            <Button colorScheme="red" onClick={onClick}>
              Confirm
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

const Products = () => {
  const auth = isAuthenticated();
  const jwt = auth.data?.jwt;
  const [products, setProducts] = useState([]);
  const toast = useToast();

  const getProducts = async () => {
    let res = await axios.get(
      "https://cloudmagician.co.in/api/ecommerce-products?populate=*",
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log(res);
    return res;
  };

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data.data.data);
      console.log(products);
    });
  }, []);

  const handleDelete = async (id) => {
    let res = await axios.delete(
      `https://cloudmagician.co.in/api/ecommerce-products/${id}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.error) {
      toast({
        title: "Error",
        description: "Product deletion failed",
        status: "danger",
        duration: 2000,
        isClosable: true,
      });
    }
    toast({
      title: "Success",
      description: "Product deleted successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    getProducts().then((data) => {
      setProducts(data.data.data);
    });
    return res;
  };

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
              Manage Products
            </Text>
            <AddProductModal />
          </Flex>

          <TableContainer
            bg={"#fff"}
            rounded={10}
            shadow={30}
            overflowX={"scroll"}
            boxShadow={"md"}
            p={2}
            mt={5}
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Product Name</Th>
                  <Th>Sub-Category</Th>
                  <Th>Selling Price</Th>
                  <Th>Retail Price</Th>
                  <Th>Availability</Th>

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products?.map((product, i) => {
                  console.log(product);
                  console.log(
                    product.attributes.product_image?.data?.attributes?.url
                  );

                  return (
                    <Tr key={i}>
                      <Td>
                        <Flex align="center">
                          <Image
                            boxSize="70px"
                            objectFit="cover"
                            src={
                              product.attributes.product_image?.data?.attributes
                                ?.url
                            }
                            alt="product_img"
                            fallbackSrc="https://via.placeholder.com/70"
                            mr="2"
                          />
                          <Text>{product.attributes.product_name}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        {
                          product.attributes.ecommerce_subcategory?.data
                            ?.attributes?.title
                        }
                      </Td>
                      <Td>${product.attributes.selling_price}</Td>
                      <Td>${product.attributes.retail_price}</Td>
                      <Td>
                        <Badge colorScheme="green" textTransform={"none"}>
                          In-Stock
                        </Badge>
                      </Td>

                      <Td>
                        <ViewProductModal productId={product.id}>
                          View
                        </ViewProductModal>
                        <EditProductModal
                          onClick={() => handleDelete(product.id)}
                          productId={product.id}
                        />
                        <DeleteProductButton
                          onClick={() => handleDelete(product.id)}
                        />
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Sidebar>
      </main>
    </>
  );
};

export default Products;

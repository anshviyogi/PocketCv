import React, { useState } from "react";
import Image from "next/image";
import RegistrationInput from "@/components/common/RegistrationInput";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CHECK_USER_ROUTE, onRegisterUserRoute } from "@/utils/ApiRoutes";
import axios from "axios";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";

// Validation schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits")
    .required("Phone Number is required"),
});

export default function Register() {
  // Job / Business
  const [lookingFor, setLookingFor] = useState("job");
  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  const router = useRouter()

  const checkUser = async (email) => {
    const { data } = await axios.post(CHECK_USER_ROUTE, {
      email,
    });

    console.log(data,'data  ansh ????');
    

    // if (!data.status) {
    //   dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
    //   dispatch({
    //     type: reducerCases.SET_USER_INFO,
    //     userInfo: {
    //       name,
    //       email,
    //       profileImage,
    //       status: "Available",
    //     },
    //   });
    //   router.push("/onboarding");
    // } else {
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: {
          id: data.data.id,
          email: data.data.email,
          name: data.data.name,
          profileImage: data.data.profilePicture,
          status: data.data.about,
        },
      });

      localStorage.setItem("userInfo", JSON.stringify(data.data.email))
      router.push("/");
    // }
  }

  return (
    <div className="flex justify-between">
      {/* Logo and Logo Title */}
      <div className="bg-green-200 shadow-lg shadow-green-500 w-1/2 h-[100vh] flex items-center justify-center">
        <div>
          <Image
            src="/chatbot.png"
            alt="whatsapp-gif"
            height={300}
            width={300}
          />
          <h1 className="text-left mt-5 text-3xl ml-4">
            Be a part of the <br />
            <span className="text-green-500 font-semibold">Group</span>
          </h1>
        </div>
      </div>

      {/* Register Form */}
      <div className="w-1/2 mt-8 flex items-center justify-center">
        <div>
          <h1 className="text-center text-2xl">
            Register <span className="text-green-600">Now !</span>
          </h1>
          <div className="px-20 pt-5">
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                // Handle form submission
                values.name = `${values.firstName} ${values.lastName}`;
                delete values.firstName;
                delete values.lastName;

                values.userType = lookingFor;

                const { data } = await axios.post(onRegisterUserRoute, values);

                checkUser(values?.email);

              }}
            >
              {() => (
                <Form>
                  <div className="flex w-full">
                    <div className="w-full mr-5">
                      <Field
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        component={RegistrationInput}
                      />
                    </div>
                    <div className="w-full">
                      <Field
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        component={RegistrationInput}
                      />
                    </div>
                  </div>

                  <Field
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    component={RegistrationInput}
                  />

                  <Field
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone Number"
                    component={RegistrationInput}
                  />

                  {/* Skill column */}
                  <label className="text-xs text-gray-500 -top-2 mt-2 bg-white px-1">
                    Explain us about yourself
                  </label>
                  <div className="flex text-sm">
                    <div
                      className={`${
                        lookingFor === "business"
                          ? "border border-green-400"
                          : ""
                      } w-28 text-center rounded-md py-1 cursor-pointer mr-2 ${
                        lookingFor === "job" ? "bg-green-500 text-white" : ""
                      }`}
                      onClick={() => setLookingFor("job")}
                    >
                      Job Seaker
                    </div>
                    <div
                      className={`${
                        lookingFor === "job" ? "border border-green-400" : ""
                      } w-28 text-center rounded-md py-1 cursor-pointer mr-2 ${
                        lookingFor === "business"
                          ? "bg-green-500 text-white"
                          : ""
                      }`}
                      onClick={() => setLookingFor("business")}
                    >
                      Business
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="float-right mt-5 bg-green-500 text-white px-4 py-2 rounded outline-none"
                  >
                    Register
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

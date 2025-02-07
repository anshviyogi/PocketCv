import React, { useEffect, useState } from "react";
import Avatar from "../components/common/Avatar";
import Input from "../components/common/Input";
import axios from "axios";
import { onBoardUserRoute } from "../utils/ApiRoutes";

import Resizer from "react-image-file-resizer";

import Image from "next/image";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";

export default function OnBoarding() {
  const router = useRouter();

  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  const [image, setImage] = useState("/default_avatar.png");
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [resume, setResume] = useState(null); // New state for resume file

  useEffect(() => {
    if (!newUser && !userInfo?.email) router.push("/login");
    else if (!newUser && userInfo?.email) router.push("/");
  }, [newUser, userInfo, router]);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "PNG",
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

    const onBoardUser = async () => {
      if (validateDetails()) {
        const email = userInfo?.email;
        try {
          // Convert image to base64
          const base64Response = await fetch(`${image}`);
          const blob = await base64Response.blob();
          const resizedImage = await resizeFile(blob);
  
          // Create FormData
          const formData = new FormData();
          formData.append("email", email);
          formData.append("name", name);
          formData.append("about", about);
          formData.append("image", resizedImage);
          if (resume) {
            formData.append("resume", resume); // Add resume to the FormData
          }
  
          // Send FormData to the server
          const { data } = await axios.post(onBoardUserRoute, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
          if (data.status) {
            dispatch({ type: reducerCases.SET_NEW_USER, newUser: false });
            dispatch({
              type: reducerCases.SET_USER_INFO,
              userInfo: {
                name,
                email,
                profileImage: resizedImage,
                status: about,
              },
            });
  
            router.push("/");
          }
        } catch (error) {
          console.error("Error onboarding user:", error);
        }
      }
    };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const validateDetails = () => {
    if (name.length < 3) {
      // Toast Notification
      return false;
    }
    return true;
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        {/* <Image
          src="/whatsapp.gif"
          alt="whatsapp-gif"
          height={300}
          width={300}
        /> */}
        <span className="text-7xl">Hey Buddy !</span>
      </div>
      <div></div>
      <h2 className="text-2xl ">Create your profile</h2>
      <div className="flex gap-6 mt-6 ">
        <div className="flex flex-col items-center justify-between mt-5 gap-6">
          <Input name="Display Name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex flex-col items-center gap-4">
            <label htmlFor="resume" className="text-sm text-gray-300">
              Upload your resume (PDF, max 2MB)
            </label>
            <input
              type="file"
              id="resume"
              accept=".pdf"
              onChange={handleResumeChange}
              className="bg-search-input-container-background p-2 rounded-lg"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-search-input-container-background p-5 rounded-lg"
              onClick={onBoardUser}
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}

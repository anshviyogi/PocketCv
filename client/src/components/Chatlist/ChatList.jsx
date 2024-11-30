import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import List from "./List";
import SearchBar from "./SearchBar";
import ContactsList from "./ContactsList";
import { useStateProvider } from "@/context/StateContext";
import Profile from "./Profile";

export default function ChatList() {
  const [pageType, setPageType] = useState("default");
  const [{ contactsPage, profilePage }] = useStateProvider();

  console.log(profilePage , pageType, 'profilePage ?????');
  
  useEffect(() => {
    if (contactsPage) { 
      setPageType("all-contacts");
    } else if (profilePage) {
      setPageType("profile")
    } 
    else {
      setPageType("default");
    }
  }, [contactsPage, profilePage]);

  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20 ">
      {pageType === "default" && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {pageType === "all-contacts" && <ContactsList />}

      {pageType === "profile" && <Profile />}
    </div>
  );
}

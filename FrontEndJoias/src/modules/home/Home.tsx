import { useState } from "react";
import { Login } from "../Login";
import { Signup } from "./Signup";
import ThemeSelector from "../../components/theme/ThemeSelector";

export function Home() {
  const [selectedTab, setSelectedTab] = useState("login");

  const active = "inline-block p-2 text-green-600 border-b-2 border-green-600 rounded-t-lg dark:text-green-500 dark:border-green-500 cursor-pointer";
  const inactive = "inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer";


  return (
    <div className="h-screen place-content-center flex flex-col m-auto">
      <div className="text-sm font-medium text-center text-gray-500  border-gray-200  dark:border-gray-700 self-center -mt-40">
        <ul className="flex flex-wrap ml-8">
          <li className="me-2">
            <button className={selectedTab === "login" ? active : inactive} onClick={() => setSelectedTab("login")}>Login</button>
          </li>
          <li className="me-2">
            <button className={selectedTab === "signup" ? active : inactive} onClick={() => setSelectedTab("signup")}>Cadastro</button>
          </li>
        </ul>
      </div>
      <div className="self-center h-0">
        {selectedTab === "login" ? <Login /> : <Signup />}
      </div>
      <div className="fixed top-0 right-0">
        <ThemeSelector />
      </div>
    </div>
  );
}
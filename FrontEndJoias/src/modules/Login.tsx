import { LoginForm } from "@/components/forms/LoginForm";
import ThemeSelector from "../components/theme/ThemeSelector";

export const Login = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center dark:bg-gray-900 bg-gray-100 text-white">
      <LoginForm />
      <div className="fixed top-4 right-4" >
        <ThemeSelector />
      </div>
    </div>
  );
}
import { SignUpForm } from "@/components/forms/SignUpForm";
import ThemeSelector from "../components/theme/ThemeSelector";
export const SignUp = () => {
  return (
        <div className="flex min-h-screen w-full items-center justify-center dark:bg-gray-900 bg-gray-100 text-white">
          <SignUpForm />
          <div className="fixed top-4 right-4" >
            <ThemeSelector />
          </div>
        </div>
  );
}
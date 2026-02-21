
import { useTheme } from "../../providers/ThemeProvider";
import Switch from 'react-switch';
import { LuSunMedium, LuMoon } from "react-icons/lu";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
      <Switch
        className="inline mt-2 mr-2 z-10"
        checked={theme === 'light'}
        onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        checkedHandleIcon={<LuSunMedium className="text-black inline ml-1 -mt-1" />}
        uncheckedHandleIcon={<LuMoon className="inline dark:text-black ml-1 -mt-1" />}
        height={25}
        width={52}
        onColor="#155DFC"
        checkedIcon={null}
        uncheckedIcon={null}
      />
  );
}
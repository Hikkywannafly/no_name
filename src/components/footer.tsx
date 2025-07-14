import { ThemeSwitcher } from "@/components/theme";

const Footer = () => {
  return (
    <div className="flex w-full items-center justify-between pt-2">
      <div className="px-[2px] text-muted-foreground text-xs">Built with </div>
      <div className="text-muted text-xs">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Footer;

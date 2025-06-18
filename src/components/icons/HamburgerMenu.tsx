const HamburgerMenu = () => {
  return (
    <div suppressHydrationWarning className="block md:hidden">
      <div
        suppressHydrationWarning
        className="group relative flex h-[19px] w-[40px] cursor-pointer flex-col justify-between overflow-hidden transition-all duration-300"
      >
        <div
          suppressHydrationWarning
          className="h-[2px] w-7 transform rounded-lg bg-white transition-all duration-300"
        />
        <div
          suppressHydrationWarning
          className="h-[2px] w-4 transform rounded-lg bg-white transition-all duration-300 group-hover:translate-x-4"
        />
        <div
          suppressHydrationWarning
          className="h-[2px] w-8 transform rounded-lg bg-white transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default HamburgerMenu;

import Image from "next/image";
import Link from "next/link";
const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4 px-4 py-16 md:px-12">


      <div className="flex items-center space-x-4">
        {/* <ContactItem href={" "} Icon={FaDiscord} />
        <ContactItem href={" "} Icon={AiFillFacebook} /> */}
        <Image src="/icons/logo_nazuna.svg" alt="Nazuna" width={50} height={50} />
      </div>

      <div className="flex items-center space-x-8 text-center">
        <Link href="/tos">
          <p className="text-lg">Điều khoản</p>
        </Link>

        <Link href="/dmca">
          <p className="text-lg">DMCA</p>
        </Link>

        <Link href="/contact">
          <p className="text-lg">Liên hệ</p>
        </Link>

        <Link href="/deletion-privacy">
          <p className="text-lg">Quyền riêng tư</p>
        </Link>
      </div>



      <p className="text-center text-gray-300 text-sm">Nazuna.me</p>
    </div>
  );
};

export default Footer;

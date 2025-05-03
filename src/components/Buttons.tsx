"use client";
import Image from 'next/image';
import { useRouter } from "next/navigation";


interface ButtonsProps {
  icone: string;
  title: string;
  path?: string;
  dropdown?: string;
  onClick?: () => void;
}

export default function Buttons({ icone, title, path , dropdown }: ButtonsProps) {
    const router = useRouter();
    return(
        <div className="flex items-center border border-white px-4 py-2 rounded-full text-white cursor-pointer bg-gradient-to-r from-[${color}] to-[#1D1933] hover:from-[#9C60DA] hover:to-[#43A3D5] transition duration-300 text-base font-lexend text-white-700" onClick={() => path && router.push(path)}>
        <Image src={icone} alt={title} width={24} height={24} className="mr-2" />
        <span className="mr-2">{title} </span>
        <span className="text-gray-300">{dropdown}</span>

      </div>
    )
}
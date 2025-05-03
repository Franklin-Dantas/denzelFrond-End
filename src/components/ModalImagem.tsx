"use client";
import Image from "next/image";

interface Props {
  imagemUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalVisualizarImagem({ imagemUrl, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const token = "?sp=r&st=2025-05-02T16:27:54Z&se=2025-05-03T00:27:54Z&spr=https&sv=2024-11-04&sr=c&sig=rXRnZSbdwxiT0J79Q06R4uYYmvVa3kfrvRmcbSYlSC8%3D";

  const imagemValida = typeof imagemUrl === "string" && imagemUrl.startsWith("http");

  const urlComToken = imagemValida ? `${imagemUrl}${token}` : "";
  console.log("URL com token:", urlComToken);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#100D1E] rounded-lg p-4 max-w-[90%] max-h-[90%] overflow-auto">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-white text-xl font-bold">×</button>
        </div>

        {imagemValida ? (
          <Image
            src={urlComToken}
            alt="Imagem do Evento"
            width={800}
            height={600}
            className="rounded-md"
            unoptimized
          />
        ) : (
          <p className="text-white text-center text-lg py-8 font-semibold">
            Evento sem imagem alocada.
          </p>
        )}
      </div>
    </div>
  );
}

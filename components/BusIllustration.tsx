import Image from "next/image";

export default function BusIllustration({ className = "" }) {
  return (
    <div className={`relative aspect-[530/300] w-full overflow-hidden rounded-2xl ${className}`}>
      <Image
        src="/busahero-illustration.png"
        alt="BUSahero bus illustration"
        fill
        className="object-contain"
        sizes="(min-width: 768px) 50vw, 100vw"
      />
    </div>
  );
}
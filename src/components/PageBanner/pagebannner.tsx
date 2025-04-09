import Image from "next/image";

export default function PageBanner() {
  return (
    <section className="h-[90vh] relative flex items-center justify-center">
      <Image
        className="h-full w-full object-cover absolute top-0 left-0"
        src="/homepage-background.jpeg"
        width={1920}
        height={1000}
        alt="background"
      />
      <div className="relative text-center">
        <h1 className="text-9xl font-bold text-[#90e0ef]">We bake to make YOU happy</h1>
      </div>
    </section>
  )
}
import Image from 'next/image';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

export default function PageBannerSimple({ currentPage, title, text, image }: { currentPage: string, title: string, text: string, image: string }) {
  return (
    <section className="relative py-20 min-h-[50vh]">
      <Image src={image} alt="Page Banner" quality={100} className="absolute inset-0 object-cover z-0 brightness-[0.45]" fill />
      <div className="relative container mx-auto">
        <div className="flex flex-col items-center justify-center">
          <Breadcrumbs path={currentPage} />
          <h1 className="text-7xl text-white font-bold mt-9 text-center">{title}</h1>
          <p className="text-center text-white mt-16 max-w-4xl text-lg text-gray-700">{text}</p>
        </div>
      </div>
    </section>
  )
}
import Image from 'next/image';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

export default function PageBannerSimple({ currentPage, title, text, image }: { currentPage: string, title: string, text: string, image: string }) {
  return (
    <section className="relative py-16 min-h-[50vh] flex items-center">
      {}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt="Page Banner"
          quality={100}
          className="object-cover w-full h-full"
          fill
          priority
        />
        {}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">

          {}
          <div className="mb-16">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
              <Breadcrumbs path={currentPage} />
            </div>
          </div>

          {}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight mb-4">
              {title}
            </h1>
            {}
            <div className="w-16 h-1 bg-pink-400 mx-auto rounded"></div>
          </div>

          {}
          {text && (
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-100 leading-relaxed font-light">
                {text}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

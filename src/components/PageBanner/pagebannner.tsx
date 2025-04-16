export default function PageBanner() {
  return (
    <section className="h-[90vh] relative flex items-center justify-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover absolute top-0 left-0"
      >
        <source src="/videos/large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative text-center">
        <h1 className="text-9xl font-bold text-[#90e0ef]">We bake to make YOU happy</h1>
      </div>
    </section>
  )
}
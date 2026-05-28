export default function HeroSection() {
  return (
    <section className="relative bg-gray-50 overflow-hidden min-h-screen flex flex-col justify-center">
      
      <div className="container px-4 mx-auto py-20 z-10">
        <div className="flex flex-wrap xl:items-center -mx-4">
          
          <div className="w-full md:w-1/2 px-4 mb-16 md:mb-0">
            <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-white bg-green-500 uppercase rounded-full font-bold tracking-wider">
              Warsaw
            </span>
            <h1 className="font-heading mb-6 text-4xl md:text-5xl lg:text-7xl leading-tight font-extrabold tracking-tight text-gray-900">
              <span className="block">Discover the best </span>
              <span className="text-green-500 block">Beauty Salons </span>
              <span className="block">in Warsaw</span>
            </h1>
            <p className="mb-8 text-lg md:text-xl text-gray-500 font-medium max-w-lg">
              Search, filter, and compare beauty salons in every district. Find the perfect salon for your needs.
            </p>
            <div className="flex flex-wrap">
              <div className="w-full md:w-auto py-1 md:py-0">
                <a className="inline-block py-4 px-8 w-full text-base md:text-lg leading-4 text-white font-bold text-center bg-green-500 hover:bg-green-600 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-xl shadow-lg shadow-green-200" href="#explorer">
                  Browse Salons
                </a>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 px-4">
            <div className="relative mx-auto md:mr-0 max-w-max">
              <img className="relative rounded-3xl shadow-2xl object-cover w-full max-w-[600px] max-h-[500px]" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop" alt="Beauty Salon in Warsaw" />
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full text-white leading-none z-0 translate-y-[1px]">
        <svg viewBox="0 0 1440 116" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 sm:h-16 md:h-24 lg:h-32 drop-shadow-sm">
          <path d="M1440 51.4091H1090.08C833.336 51.4091 580.229 116 360 116C139.771 116 0 51.4091 0 51.4091V114H1440V51.4091Z" fill="currentColor" />
        </svg>
      </div>

    </section>
  )
}
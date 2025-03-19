

export default function Hero() {
    return (
      <section
        className="bg-cover bg-center"
        style={{ backgroundImage: "url('/images/banner-1.jpg')" }}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4">
              Organic Foods at your <span className="text-primary">Doorsteps</span>
            </h1>
            <p className="text-xl text-white mb-8">Dignissim massa diam elementum.</p>
            <div className="flex space-x-4">
              <a href="/shop" className="bg-primary text-white px-6 py-3 rounded-full">
                Start Shopping
              </a>
              <a href="/join" className="bg-dark text-white px-6 py-3 rounded-full">
                Join Now
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
export default function Footer() {
    return (
      <footer className="bg-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              {/* <img src="/images/logo.svg" alt="Logo" className="h-12 mb-4" /> */}
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <use xlinkHref="#facebook"></use>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <use xlinkHref="#twitter"></use>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Customer Service</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-primary">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Subscribe Us</h5>
              <p className="text-gray-400 mb-4">Get updates about our grand offers.</p>
              <form className="flex">
                <input type="email" placeholder="Email Address" className="bg-white px-4 py-2 rounded-l" />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-r">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </footer>
    );
  }
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Trending from './components/Trending';
import Footer from './components/Footer';

function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Products />
      <Trending />
      <Footer />
    </div>
  );
}

export default HomePage;
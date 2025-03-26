import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Trending from './components/Trending';
import Footer from './components/Footer';
import FeatureCards from './components/FeatureCards';

function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeatureCards />

      <Products />
      <Trending />
      <Footer />
    </div>
  );
}

export default HomePage;
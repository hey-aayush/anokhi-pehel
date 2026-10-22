import styles from "../../style";
import { Hero, Stats, CardDeal } from "../../components/Home";
import HomePageLayout from "../../components/Home/HomePageLayout";
import Testimonials from "../../components/Home/Testimonials";
import Billing from "../../components/Home/Billing";
import Admission from "../../components/Home/Admission"
import Antyodaya from "../../components/Home/Antyodaya"
import About from "../../components/Home/About";
const App = () => (
  <HomePageLayout>
    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
        
      </div>
    </div>
    

    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <About/>
        <Stats />
        {/* <Impact /> */}
        <Billing />
        <Admission />
        <Antyodaya/>
        <CardDeal />
        <Testimonials />
      </div>
    </div>
  </HomePageLayout>
);

export default App;

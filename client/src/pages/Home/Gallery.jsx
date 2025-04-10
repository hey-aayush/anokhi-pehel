import { motion } from "framer-motion";
import HomePageLayout from "../../components/Home/HomePageLayout";

const Gallery = () => {
  return (
    <HomePageLayout>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid gap-4">
          <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719392871/nfpydfecvgbw7ro5f0ee.jpg"
              alt=""
            />
          </div>
          <div className="grid grid-cols-5 gap-4">
            {[
              "irlga3gzcjnos6pdksbg",
              "jhro4bzrprizocr28lbo",
              "yifzqnhza7krnrgrnmkr",
              "ga4pojcylsnwmje3cmsw",
              "gy3s1yugypmmyoblavwk",
            ].map((id, index) => (
              <div
                key={index}
                className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105"
              >
                <img
                  className="h-auto max-w-full rounded-lg"
                  src={`https://res.cloudinary.com/dyuzmmpzb/image/upload/v171912700${index}/${id}.jpg`}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>

        <div className="my-5"></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Column 1 */}
          <div className="grid gap-4">
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1722844230/ap_donation_e9kstb.jpg"
                alt=""
              />
            </div>
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719129754/spzirvoqrh2pc2zombtx.jpg"
                alt=""
              />
            </div>
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719128917/lfjw0uvhzzv3sercnbjb.jpg"
                alt=""
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="grid gap-4">
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719130959/vb7hizjizthul8p3zvg4.jpg"
                alt=""
              />
            </div>
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719132774/qulnqgubxkqrzketlx6t.jpg"
                alt=""
              />
            </div>
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719128399/nxog0z4uvsnpo5w0ysc6.jpg"
                alt=""
              />
            </div>
          </div>

          {/* Column 3 */}
          <div className="grid gap-4">
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719132915/licrq9b5l4ebdr4ivckj.jpg"
                alt=""
              />
            </div>
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719130706/pd6vx8qtgurzicm0nlc0.jpg"
                alt=""
              />
            </div>
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719129099/tf9d84ilwzdegc0nmcuk.jpg"
                alt=""
              />
            </div>
          </div>

          {/* Column 4 */}
          <div className="grid gap-4">
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719130086/vhbd7ey5gisljfyp3tt2.jpg"
                alt=""
              />
            </div>
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719133659/zrqevro9wnu4fur4zqxg.jpg"
                alt=""
              />
            </div>
            <div className="bg-teal-500 p-0.5 rounded-lg transition-transform duration-300 hover:scale-105">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://res.cloudinary.com/dyuzmmpzb/image/upload/v1719128399/nxog0z4uvsnpo5w0ysc6.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </motion.div>
    </HomePageLayout>
  );
};

export default Gallery;

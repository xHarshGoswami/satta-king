
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import AdminInfo from '../../components/AdminInfo';
import './ContactUs.css';

const ContactUs: React.FC = () => {
  return (
    <div className="contact-container">
      <Header />
      <Navigation />
      <main className="contact-main">
        <section className="promo-section">
          <h1>Promote With Us</h1>
          <div className="promo-benefits">
            <div className="benefit-card">
              <span className="icon" role="img" aria-label="target">🎯</span>
              <h3>वाइड रीच</h3>
              <p>Connect with thousands of daily active users</p>
              <p className="hindi-text">हजारों डेली एक्टिव यूजर्स से जुड़ें</p>
            </div>
            <div className="benefit-card">
              <span className="icon" role="img" aria-label="diamond">💎</span>
              <h3>प्रीमियम स्पॉट</h3>
              <p>Get featured in prime locations</p>
              <p className="hindi-text">प्राइम लोकेशन पर फीचर करें</p>
            </div>
            <div className="benefit-card">
              <span className="icon" role="img" aria-label="rocket">🚀</span>
              <h3>फास्ट ग्रोथ</h3>
              <p>Rapid exposure to targeted audience</p>
              <p className="hindi-text">टारगेटेड ऑडियंस तक तेजी से पहुंचें</p>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <h2>संपर्क करें</h2>
          <p className="contact-desc">
            Want to promote your game?<br />
            Contact us now for premium spots!<br />
            <span className="hindi-text">
              अपना गेम प्रमोट करना चाहते हैं?<br />
              प्रीमियम स्पॉट के लिए अभी संपर्क करें!
            </span>
          </p>
          <AdminInfo />
        </section>
      </main>
    </div>
  );
};

export default ContactUs;
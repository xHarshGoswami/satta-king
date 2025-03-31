import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import './AdminInfo.css';

// Import images
import whatsappIcon from '../assets/homeImages/whatsapp.png';
import phoneIcon from '../assets/homeImages/phone-call.png';

interface AdminData {
  email: string;
  number: number;
  name: string;
}

const AdminInfo: React.FC = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const adminRef = ref(db, 'data');

    const unsubscribe = onValue(adminRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAdminData({
          email: data.email,
          number: data.number,
          name: data.name
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleWhatsAppClick = () => {
    if (adminData?.number) {
      window.open(`https://wa.me/91${adminData.number}?text=Hi, I want to know more about the game`, '_blank');
    }
  };

  if (!adminData) {
    return <div className="admin-info-loading">Loading...</div>;
  }

  return (
    <div className="admin-info-card">
      <div className="admin-info-header">
        <div className="flash-title">
          <span className="lightning">⚡</span>
          <h2>{adminData.name}</h2>
          <span className="lightning">⚡</span>
        </div>
        <div className="promo-text">
          <p className="hindi-text">🎯 लाखों के इनाम जीतने का मौका!</p>
          <p className="hindi-text">💎 MATKA KING से जुड़ें</p>
          <p className="blink-text">🔥 आज का Special Game 🔥</p>
        </div>
      </div>

      <div className="contact-buttons">
        <button
          className="contact-btn whatsapp pulse"
          onClick={handleWhatsAppClick}
        >
          <div className="btn-content">
            <img
              src={whatsappIcon}
              alt="WhatsApp"
              className="contact-icon"
            />
            <div className="btn-text">
              <span className="main-text">WhatsApp पर जुड़ें</span>
              <span className="sub-text">👉 Direct Game Play करें</span>
            </div>
          </div>
        </button>

        <a
          href={`tel:${adminData.number}`}
          className="contact-btn phone shine"
        >
          <div className="btn-content">
            <img
              src={phoneIcon}
              alt="Phone"
              className="contact-icon"
            />
            <div className="btn-text">
              <span className="main-text">{adminData.number}</span>
              <span className="sub-text">🎯 Call for VIP Game</span>
            </div>
          </div>
        </a>
      </div>

      <div className="bottom-text">
        <p className="guarantee">✅ 101% Trusted Platform</p>
        <p className="timing">🕙 Open: 24x7 Available</p>
      </div>
    </div>
  );
};

export default AdminInfo;
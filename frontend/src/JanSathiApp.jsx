import React, { useEffect, useState } from "react";
import { HeartPulse, Wrench, Store, Landmark, Siren, Wallet, ChevronRight, ArrowLeft, Plus, Minus, Trash2, Phone, ShieldAlert, Stethoscope, Sprout, ShoppingCart, MessageCircle, BriefcaseBusiness, CreditCard, ReceiptText, CloudSun, FileText } from "lucide-react";
import JanSathiPremiumLogo from "./JanSathiPremiumLogo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const MSG91_WIDGET_ID = import.meta.env.VITE_MSG91_WIDGET_ID;
const MSG91_WIDGET_TOKEN = import.meta.env.VITE_MSG91_WIDGET_TOKEN;

const loadMsg91Widget = () => new Promise((resolve, reject) => {
  if (typeof window.initSendOTP === "function") {
    resolve();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://verify.msg91.com/otp-provider.js";
  script.async = true;
  script.onload = () => typeof window.initSendOTP === "function"
    ? resolve()
    : reject(new Error("MSG91 widget load nahi hua"));
  script.onerror = () => reject(new Error("MSG91 widget service unavailable"));
  document.head.appendChild(script);
});

const fetchFeatureData = async () => {
  try {
    const response = await fetch(`${API_URL}/api/features`);
    if (!response.ok) throw new Error('Feature API failed');
    return await response.json();
  } catch (error) {
    console.warn('Using default feature data because API is unavailable:', error.message);
    return null;
  }
};

const PRODUCTS = [
  { id: 1, name: "Chawal (1kg)", price: 42, stock: 20 },
  { id: 2, name: "Atta (5kg)", price: 210, stock: 12 },
  { id: 3, name: "Dudh (1L)", price: 32, stock: 8 },
  { id: 4, name: "Cheeni (1kg)", price: 44, stock: 15 },
  { id: 5, name: "Chai patti (250g)", price: 65, stock: 10 },
  { id: 6, name: "Tel (1L)", price: 130, stock: 6 },
];

const DEFAULT_SCREENS = {
  sos: {
    title: "SOS Emergency",
    subtitle: "Ambulance, police, contact",
    bg: "#FBE7E7",
    accent: "#B23B3B",
    icon: Siren,
  },
  health: {
    title: "Health",
    subtitle: "Symptoms, doctor",
    bg: "#DFF3E8",
    accent: "#2F7A55",
    icon: HeartPulse,
  },
  sewa: {
    title: "Local Sewa",
    subtitle: "Electrician, tutor",
    bg: "#FBEDD9",
    accent: "#B67A2E",
    icon: Wrench,
  },
  price: {
    title: "Price Compare",
    subtitle: "Nearby dukaan",
    bg: "#E7E4F7",
    accent: "#5B4FA8",
    icon: Store,
  },
  yojana: {
    title: "Sarkari Yojana",
    subtitle: "Schemes, eligibility",
    bg: "#F3DCD8",
    accent: "#9C4A3E",
    icon: Landmark,
  },
  grocery: {
    title: "Kirana Mangao",
    subtitle: "Ghar baithe grocery, 30 min mein",
    bg: "#E3F3DC",
    accent: "#3B7A3E",
    icon: ShoppingCart,
  },
  community: {
    title: "Community Chat",
    subtitle: "Apne gaon se jude rahiye",
    bg: "#E1EFF6",
    accent: "#24708C",
    icon: MessageCircle,
    items: ["Gaon ki zaroori soochna", "Madad maangein ya dein", "Local issues par charcha"],
  },
  jobs: {
    title: "Local Jobs",
    subtitle: "Aas-paas ki naukriyan",
    bg: "#F4E7D6",
    accent: "#9B5B22",
    icon: BriefcaseBusiness,
    items: ["Delivery helper - ₹12,000/mahina", "Computer operator - ₹15,000/mahina", "Kheti sahayak - Aaj apply karein"],
  },
  payments: {
    title: "Digital Payment",
    subtitle: "UPI aur wallet services",
    bg: "#E8E3F6",
    accent: "#6651A6",
    icon: CreditCard,
    items: ["UPI se paise bhejein", "Mobile recharge karein", "Wallet balance dekhein"],
  },
  bills: {
    title: "Utility Bills",
    subtitle: "Bijli, pani aur gas bill",
    bg: "#FCE9D9",
    accent: "#B96126",
    icon: ReceiptText,
    items: ["Bijli bill bharein", "Pani bill bharein", "Gas booking aur payment"],
  },
  farming: {
    title: "Kisan Sathi",
    subtitle: "Mausam, mandi aur fasal salah",
    bg: "#E2F0DF",
    accent: "#3D7C45",
    icon: CloudSun,
    items: ["Aaj ka mausam: 29°C, halki baarish", "Gehu mandi bhav: ₹2,425/quintal", "Fasal ki salah aur pest management"],
  },
  assistant: {
    title: "Jan Sathi Assistant",
    subtitle: "Sawal poochiye, seedhi salah lijiye",
    bg: "#E8F0FF",
    accent: "#2459A6",
    icon: MessageCircle,
  },
  karosub: {
    title: "KaroSub",
    subtitle: "Premium membership aur plan upgrades",
    bg: "#EEE8FF",
    accent: "#5D3FD3",
    icon: CreditCard,
  },
  privacy: { title: "Privacy Policy", subtitle: "Aapka data kaise use hota hai", bg: "#EEF3FA", accent: "#2459A6", icon: FileText },
  terms: { title: "Terms & Conditions", subtitle: "App use karne ke niyam", bg: "#EEF3FA", accent: "#2459A6", icon: FileText },
};

const ENGLISH_COPY = {
  sos: ["SOS Emergency", "Ambulance, police, contact"], health: ["Health", "Symptoms and doctor"], sewa: ["Local Services", "Electrician, tutor"], price: ["Price Compare", "Nearby shops"], yojana: ["Government Schemes", "Schemes and eligibility"], grocery: ["Order Groceries", "Home delivery grocery"], community: ["Community Chat", "Connect with your village"], jobs: ["Local Jobs", "Jobs near you"], payments: ["Digital Payment", "UPI and wallet services"], bills: ["Utility Bills", "Electricity, water and gas"], farming: ["Kisan Sathi", "Weather, market and crop advice"], assistant: ["Jan Sathi Assistant", "Ask a question, get guidance"], privacy: ["Privacy Policy", "How your data is used"], terms: ["Terms & Conditions", "Rules for using the app"],
};

function localizeScreens(screens, language) {
  if (language === "hi") return screens;
  return Object.fromEntries(Object.keys(DEFAULT_SCREENS).map((key) => {
    const defaults = DEFAULT_SCREENS[key];
    const current = screens[key] || {};
    const copy = ENGLISH_COPY[key];
    return [key, {
      ...defaults,
      ...current,
      icon: defaults.icon,
      ...(copy ? { title: copy[0], subtitle: copy[1] } : {}),
    }];
  }));
}

function HomeCard({ icon: Icon, title, subtitle, bg, accent, onClick, wide }) {
  const CardIcon = Icon || FileText;

  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        border: "none",
        borderRadius: 16,
        padding: "16px 18px",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        flexDirection: wide ? "row" : "column",
        alignItems: wide ? "center" : "flex-start",
        gap: wide ? 12 : 10,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <CardIcon size={22} color={accent} strokeWidth={2} />
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#2b2b2b" }}>{title}</div>
        <div style={{ fontSize: 14, color: "#6b6b6b", marginTop: 4 }}>{subtitle}</div>
      </div>
    </button>
  );
}

function DetailScreen({ screenKey, onBack, screens, userName, onNavigate, language, homeAddress, onSaveHomeAddress }) {
  const s = screens[screenKey];
  const Icon = s.icon;
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobSearch, setJobSearch] = useState("");
  const [jobType, setJobType] = useState("all");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [communityMessage, setCommunityMessage] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [billType, setBillType] = useState("Bijli bill");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [farmTopic, setFarmTopic] = useState(null);
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [assistantError, setAssistantError] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [compareProducts, setCompareProducts] = useState([]);
  const [karosubConfig, setKaroSubConfig] = useState({ enabled: false, plans: { starter: 499, pro: 999, elite: 1999 } });
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [karosubStatus, setKaroSubStatus] = useState("");
  const [karosubLoading, setKaroSubLoading] = useState(false);
  const [bookingProvider, setBookingProvider] = useState(null);
  const [bookingTime, setBookingTime] = useState("Jaldi se jaldi");
  const [bookingNote, setBookingNote] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    if (screenKey !== "price") return;
    fetch(`${API_URL}/api/products`)
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setCompareProducts(Array.isArray(data) ? data : []))
      .catch(() => setCompareProducts([]));
  }, [screenKey]);

  useEffect(() => {
    if (screenKey !== "karosub") return;
    fetch(`${API_URL}/api/karosub/config`)
      .then((response) => response.ok ? response.json() : { enabled: false, plans: { starter: 499, pro: 999, elite: 1999 } })
      .then((data) => {
        setKaroSubConfig({ enabled: Boolean(data.enabled), plans: data.plans || { starter: 499, pro: 999, elite: 1999 } });
      })
      .catch(() => setKaroSubConfig({ enabled: false, plans: { starter: 499, pro: 999, elite: 1999 } }));
  }, [screenKey]);

  useEffect(() => {
    if (screenKey !== "community") return;
    const loadCommunityPosts = () => fetch(`${API_URL}/api/community/posts`)
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setCommunityPosts(Array.isArray(data) ? data : []))
      .catch(() => setCommunityPosts([]));
    loadCommunityPosts();
    const refreshTimer = window.setInterval(loadCommunityPosts, 5000);
    return () => window.clearInterval(refreshTimer);
  }, [screenKey]);

  const postCommunityMessage = async () => {
    const message = communityMessage.trim();
    if (!message) return;
    const response = await fetch(`${API_URL}/api/community/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, author: userName || "Jan Sathi user" }),
    });
    if (!response.ok) return;
    const post = await response.json();
    setCommunityPosts((current) => [post, ...current]);
    setCommunityMessage("");
  };

  const visibleItems = screenKey === "jobs"
    ? (s.items || []).filter((item) => {
      const matchesType = jobType === "all" || (item.type || "private") === jobType;
      const matchesSearch = !jobSearch.trim() || JSON.stringify(item).toLowerCase().includes(jobSearch.toLowerCase());
      return matchesType && matchesSearch;
    })
    : s.items;

  const askAssistant = async () => {
    const question = assistantQuestion.trim();
    if (!question) return;
    setAssistantLoading(true);
    setAssistantError("");
    try {
      const response = await fetch(`${API_URL}/api/ask-claude`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Assistant unavailable");
      setAssistantAnswer(data.answer);
    } catch (error) {
      setAssistantError(error.message === "ANTHROPIC_API_KEY is not configured" ? "Assistant setup pending: backend me ANTHROPIC_API_KEY add karein." : "Assistant abhi available nahi hai.");
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleKaroSubCheckout = async () => {
    setKaroSubLoading(true);
    setKaroSubStatus("");
    try {
      const response = await fetch(`${API_URL}/api/karosub/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          amount: karosubConfig.plans[selectedPlan] || 499,
          customerName: userName || "Jan Sathi User",
          phone: userPhone || "",
          email: "",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "KaroSub checkout unavailable");
      }
      if (data.paymentUrl) {
        window.open(data.paymentUrl, "_blank", "noopener,noreferrer");
        setKaroSubStatus(`KaroSub checkout opened for ${selectedPlan} plan.`);
      } else {
        setKaroSubStatus("KaroSub checkout started successfully.");
      }
    } catch (error) {
      setKaroSubStatus(error.message || "KaroSub checkout failed.");
    } finally {
      setKaroSubLoading(false);
    }
  };

  const sendServiceBooking = () => {
    if (!bookingProvider || !homeAddress.trim()) {
      setBookingStatus("Pehle apna ghar ka address likho.");
      return;
    }
    const message = [
      "Namaste, mujhe ghar par service chahiye.",
      `Service: ${bookingProvider.title}`,
      `Address: ${homeAddress.trim()}`,
      `Samay: ${bookingTime}`,
      bookingNote.trim() ? `Kaam ki jankari: ${bookingNote.trim()}` : "",
    ].filter(Boolean).join("\n");
    onSaveHomeAddress(homeAddress.trim());
    window.open(`https://wa.me/${bookingProvider.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setBookingStatus("Request provider ko bhej di gayi. Woh aapse jaldi contact karega.");
  };

  return (
    <div style={{ padding: "20px 18px", minHeight: 500 }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#5a5a5a",
          fontSize: 14,
          cursor: "pointer",
          padding: 0,
          marginBottom: 18,
        }}
      >
        <ArrowLeft size={18} /> Wapas
      </button>

      <div style={{ background: s.bg, borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <Icon size={30} color={s.accent} />
        <div style={{ fontSize: 20, fontWeight: 700, color: "#2b2b2b", marginTop: 10 }}>{s.title}</div>
        <div style={{ fontSize: 14, color: "#6b6b6b", marginTop: 4 }}>{s.subtitle}</div>
      </div>

      {screenKey === "sos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Ambulance", num: "108", icon: ShieldAlert },
            { label: "Police", num: "100", icon: ShieldAlert },
            { label: "Fire Brigade", num: "101", icon: Siren },
            { label: "Nearest doctor", num: "Dr. Mehta - 2.1 km", icon: Stethoscope },
          ].map((r) => (
            <a
              key={r.label}
              href={r.label === "Nearest doctor" ? "https://www.google.com/maps/search/doctor+near+me" : `tel:${r.num}`}
              target={r.label === "Nearest doctor" ? "_blank" : undefined}
              rel={r.label === "Nearest doctor" ? "noreferrer" : undefined}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "12px 14px", textDecoration: "none" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <r.icon size={18} color={s.accent} />
                <span style={{ fontSize: 14, color: "#333" }}>{r.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: s.accent, fontWeight: 600, fontSize: 14 }}>
                <Phone size={14} /> {r.num}
              </div>
            </a>
          ))}
        </div>
      )}

      {screenKey === "health" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 13.5, color: "#555" }}>Apne symptoms batao, ya doctor dhundo:</p>
          <button
            onClick={() => {
              const openMaps = (query) => window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, "_blank");
              if (!navigator.geolocation) {
                openMaps("doctor near me");
                return;
              }
              navigator.geolocation.getCurrentPosition(
                ({ coords }) => openMaps(`doctor near ${coords.latitude},${coords.longitude}`),
                () => openMaps("doctor near me"),
              );
            }}
            style={{ background: s.accent, color: "#fff", border: "none", borderRadius: 12, padding: "12px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "left" }}
          >
            📍 Aas-paas doctor ki location dekho
          </button>
          {["Bukhar / Fever", "Khansi / Cough", "Pet dard / Stomach ache", "Doctor se baat karo"].map((t) => (
            <div key={t} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#333" }}>{t}</div>
          ))}
        </div>
      )}

      {screenKey === "sewa" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bookingProvider && (
            <div style={{ background: "#F4FAF2", border: "1px solid #B7D8A8", borderRadius: 12, padding: "14px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#254C2C" }}>{bookingProvider.title} ko ghar par bulao</div>
              <div style={{ fontSize: 12.5, color: "#5a6b5d", marginTop: 4 }}>Address aur samay bhej dijiye. Provider WhatsApp par request paayega.</div>
              <textarea value={homeAddress} onChange={(event) => onSaveHomeAddress(event.target.value)} placeholder="Ghar ka poora address likho" rows={3} style={{ width: "100%", boxSizing: "border-box", marginTop: 10, border: "1px solid #c9d9c7", borderRadius: 8, padding: "9px", fontSize: 13, fontFamily: "inherit", resize: "vertical" }} />
              <select value={bookingTime} onChange={(event) => setBookingTime(event.target.value)} style={{ width: "100%", marginTop: 8, border: "1px solid #c9d9c7", borderRadius: 8, padding: "9px", background: "#fff", fontSize: 13 }}>
                <option>Jaldi se jaldi</option>
                <option>Aaj subah</option>
                <option>Aaj shaam</option>
                <option>Kal</option>
              </select>
              <input value={bookingNote} onChange={(event) => setBookingNote(event.target.value)} placeholder="Kaam ki jankari (optional)" style={{ width: "100%", boxSizing: "border-box", marginTop: 8, border: "1px solid #c9d9c7", borderRadius: 8, padding: "9px", fontSize: 13 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={sendServiceBooking} style={{ flex: 1, background: "#2F7A55", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Request bhejo</button>
                <button onClick={() => { setBookingProvider(null); setBookingStatus(""); }} style={{ background: "#fff", color: "#555", border: "1px solid #c9d9c7", borderRadius: 8, padding: "10px 12px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              </div>
              {bookingStatus && <div style={{ color: "#2F6B35", fontSize: 12.5, marginTop: 9 }}>{bookingStatus}</div>}
            </div>
          )}
          {[
            { title: "Electrician", providerName: "Rajesh Electric Works", location: "Ward No. 7, Main Road", phone: "+91 98765 43210", serviceId: "ELE-104" },
            { title: "Plumber", providerName: "Sharma Plumbing Service", location: "Near Bus Stand", phone: "+91 99887 66554", serviceId: "PLU-206" },
            { title: "Mistri / Carpenter", providerName: "Mohan Furniture & Repair", location: "Kisan Chowk", phone: "+91 98111 22334", serviceId: "CAR-309" },
            { title: "Construction Helper", providerName: "Bharat Building Support", location: "Industrial Road", phone: "+91 97654 22111", serviceId: "CON-440" },
          ].map((serviceItem) => {
            const provider = screens.services?.find((service) => service.title === serviceItem.title)
              || { providerName: serviceItem.providerName, location: serviceItem.location, phone: serviceItem.phone, serviceId: serviceItem.serviceId, price: 0 };
            const location = provider?.location || serviceItem.location;
            const providerName = provider?.providerName || serviceItem.providerName;
            const phone = provider?.phone || serviceItem.phone;
            const serviceId = provider?.serviceId || serviceItem.serviceId;
            const whatsapp = provider?.whatsapp || phone;
            const mapQuery = `${providerName} ${serviceItem.title} ${location}`;
            return (
              <div key={serviceItem.title} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, color: "#333", fontWeight: 600 }}>
                  {serviceItem.title} <ChevronRight size={16} color="#999" />
                </div>
                <div style={{ fontSize: 12.5, color: "#777", marginTop: 5 }}>
                  {providerName} · {location}{provider?.price ? ` · ₹${provider.price}` : ""}
                </div>
                <div style={{ fontSize: 12, color: "#4d4d4d", marginTop: 8 }}>
                  <strong>Contact:</strong> {phone}
                </div>
                <div style={{ fontSize: 12, color: "#4d4d4d", marginTop: 4 }}>
                  <strong>ID:</strong> {serviceId}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => window.open(`tel:${phone.replace(/\s+/g, "")}`, "_self")}
                    style={{ background: s.bg, color: s.accent, border: "none", borderRadius: 8, padding: "7px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                  >
                    📞 Call
                  </button>
                  <button
                    onClick={() => window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank", "noopener,noreferrer")}
                    style={{ background: "#E7F9EE", color: "#1C8C52", border: "none", borderRadius: 8, padding: "7px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                  >
                    💬 WhatsApp
                  </button>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(mapQuery)}`, "_blank")}
                    style={{ background: s.bg, color: s.accent, border: "none", borderRadius: 8, padding: "7px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                  >
                    📍 Map
                  </button>
                </div>
                <button
                  onClick={() => { setBookingProvider({ title: serviceItem.title, phone: whatsapp }); setBookingStatus(""); }}
                  style={{ width: "100%", marginTop: 9, background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: 8, padding: "8px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  🏠 Ghar par bulao
                </button>
              </div>
            );
          })}
        </div>
      )}

      {screenKey === "price" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 13.5, color: "#555" }}>Nearby dukaano ke daam compare karo:</p>
          <button
            onClick={() => window.open("https://www.google.com/maps/search/kirana+store+near+me", "_blank")}
            style={{ background: s.accent, color: "#fff", border: "none", borderRadius: 12, padding: "12px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "left" }}
          >
            📍 Nearby kirana stores dekho
          </button>
          {(compareProducts.length ? compareProducts : [
            { name: "Chawal (1kg)", price: 42 },
            { name: "Atta (5kg)", price: 210 },
          ]).map((product) => (
            <div key={product.name} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{product.name}</div>
              <div style={{ fontSize: 12.5, color: "#777", marginTop: 2 }}>Jan Sathi current listing · ₹{product.price}</div>
            </div>
          ))}
        </div>
      )}

      {screenKey === "yojana" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { name: "PM Kisan Samman Nidhi", note: "Farmers ke liye ₹6000/saal" },
            { name: "Ayushman Bharat", note: "Free ₹5 lakh tak ilaaj" },
            { name: "PM Awas Yojana", note: "Ghar banane ke liye sahayata" },
          ].map((r) => (
            <div key={r.name} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sprout size={16} color={s.accent} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{r.name}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "#777", marginTop: 4 }}>{r.note}</div>
              <button
                onClick={() => setSelectedScheme(r.name)}
                style={{ marginTop: 9, background: s.bg, color: s.accent, border: "none", borderRadius: 8, padding: "7px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
              >
                App me poori jankari dekho
              </button>
            </div>
          ))}
          {selectedScheme && (
            <div style={{ background: "#fff", border: `1px solid ${s.accent}`, borderRadius: 12, padding: "14px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#333" }}>{selectedScheme}</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}><b>Benefit:</b> {selectedScheme === "PM Kisan Samman Nidhi" ? "Eligible farmers ko ₹6,000 saalana teen installments me milte hain." : selectedScheme === "Ayushman Bharat" ? "Eligible parivaar ko listed hospitals me cashless ilaaj ki suvidha mil sakti hai." : "Eligible parivaar ko ghar banane ya sudharne ke liye sarkari sahayata mil sakti hai."}</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}><b>Eligibility:</b> Aapki zameen, aay, parivaar aur rajya ke rules ke hisaab se eligibility check hoti hai.</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}><b>Documents:</b> Aadhaar card, mobile number, bank details aur address proof</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}><b>Apply:</b> Najdeeki CSC centre, bank ya sambandhit sarkari office me documents ke saath apply karein.</div>
              <div style={{ fontSize: 11.5, color: "#777", marginTop: 10 }}>Details ko local office se verify karke hi application submit karein.</div>
            </div>
          )}
        </div>
      )}

      {screenKey === "community" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={communityMessage} onChange={(event) => setCommunityMessage(event.target.value)} placeholder="Gaon ki baat likhein..." maxLength={500} style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", fontSize: 13.5 }} />
            <button onClick={postCommunityMessage} style={{ background: s.accent, border: "none", borderRadius: 10, padding: "0 13px", color: "#fff", cursor: "pointer" }}>Post</button>
          </div>
          {communityPosts.length === 0 && <div style={{ fontSize: 13.5, color: "#999", textAlign: "center", padding: 12 }}>Abhi koi message nahi hai.</div>}
          {communityPosts.map((post) => (
            <div key={post._id} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "11px 13px" }}>
              <div style={{ fontSize: 12, color: s.accent, fontWeight: 700 }}>{post.author}</div>
              <div style={{ fontSize: 14, color: "#333", marginTop: 5 }}>{post.message}</div>
            </div>
          ))}
        </div>
      )}

      {screenKey === "payments" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>Jan Sathi Pay</div>
            <div style={{ fontSize: 12.5, color: "#777", marginTop: 5 }}>UPI ID aur amount daalkar apne UPI app se secure payment karein.</div>
            <input value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="example@upi" style={{ width: "100%", boxSizing: "border-box", marginTop: 12, padding: "10px 12px", borderRadius: 9, border: "1px solid #ddd", fontSize: 13.5 }} />
            <input value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="Amount (₹)" inputMode="decimal" style={{ width: "100%", boxSizing: "border-box", marginTop: 8, padding: "10px 12px", borderRadius: 9, border: "1px solid #ddd", fontSize: 13.5 }} />
            <button
              onClick={() => {
                if (!upiId.trim() || !Number(paymentAmount) || Number(paymentAmount) <= 0) {
                  setPaymentError("Valid UPI ID aur amount daalein.");
                  return;
                }
                const link = `upi://pay?pa=${encodeURIComponent(upiId.trim())}&pn=Jan%20Sathi&am=${encodeURIComponent(paymentAmount)}&cu=INR`;
                setPaymentError("");
                setPaymentLink(link);
                window.location.href = link;
              }}
              style={{ width: "100%", marginTop: 10, background: s.accent, color: "#fff", border: "none", borderRadius: 9, padding: "11px 12px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
            >
              Payment request kholo
            </button>
            {paymentError && <div style={{ color: "#B23B3B", fontSize: 12.5, marginTop: 8 }}>{paymentError}</div>}
            {paymentLink && (
              <div style={{ marginTop: 10, background: "#F5F9FF", borderRadius: 9, padding: 10 }}>
                <div style={{ fontSize: 11.5, color: "#555", wordBreak: "break-all" }}>{paymentLink}</div>
                <button onClick={() => navigator.clipboard?.writeText(paymentLink)} style={{ marginTop: 8, background: "#fff", border: "1px solid #ccd8eb", borderRadius: 7, padding: "6px 9px", color: "#2459a6", fontSize: 12, cursor: "pointer" }}>Payment link copy karo</button>
              </div>
            )}
          </div>
          <div style={{ background: "#FFF4D6", color: "#765B16", borderRadius: 10, padding: "10px 12px", fontSize: 11.5 }}>Payment approve karne se pehle receiver name aur amount check karein. Job ke liye kabhi payment na karein.</div>
          <div style={{ fontSize: 11.5, color: "#777" }}>Jan Sathi Pay payment ko hold nahi karta; final approval aapke Google Pay, PhonePe, Paytm ya BHIM app me hota hai.</div>
        </div>
      )}

      {screenKey === "bills" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>Utility Bill Payment</div>
            <div style={{ fontSize: 12.5, color: "#777", marginTop: 5 }}>Bill type, consumer number aur verified amount daalein.</div>
            <select value={billType} onChange={(event) => setBillType(event.target.value)} style={{ width: "100%", marginTop: 12, padding: "10px 12px", borderRadius: 9, border: "1px solid #ddd", fontSize: 13.5 }}>
              <option>Bijli bill</option>
              <option>Pani bill</option>
              <option>Gas booking</option>
            </select>
            <input value={consumerNumber} onChange={(event) => setConsumerNumber(event.target.value)} placeholder="Consumer number / LPG number" style={{ width: "100%", boxSizing: "border-box", marginTop: 8, padding: "10px 12px", borderRadius: 9, border: "1px solid #ddd", fontSize: 13.5 }} />
            <input value={billAmount} onChange={(event) => setBillAmount(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="Verified bill amount (₹)" inputMode="decimal" style={{ width: "100%", boxSizing: "border-box", marginTop: 8, padding: "10px 12px", borderRadius: 9, border: "1px solid #ddd", fontSize: 13.5 }} />
            <button
              onClick={() => {
                if (!consumerNumber.trim() || !Number(billAmount)) return;
                setUpiId(consumerNumber.includes("@") ? consumerNumber : "billpay@upi");
                setPaymentAmount(billAmount);
                setPaymentError("");
                onNavigate("payments");
              }}
              style={{ width: "100%", marginTop: 10, background: s.accent, color: "#fff", border: "none", borderRadius: 9, padding: "11px 12px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
            >
              Bill payment ke liye UPI kholo
            </button>
          </div>
          <div style={{ background: "#FFF4D6", color: "#765B16", borderRadius: 10, padding: "10px 12px", fontSize: 11.5 }}>Payment se pehle official bill app/receipt par consumer number aur amount verify karein.</div>
        </div>
      )}

      {screenKey === "farming" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { title: "Aaj ka Mausam", icon: "🌦️", detail: "29°C, halki baarish ka chance. Khet me spray karne se pehle local weather zaroor check karein." },
            { title: "Mandi Bhav", icon: "🌾", detail: "Gehu ka aaj ka sample bhav ₹2,425/quintal. Apni najdeeki mandi me final rate confirm karein." },
            { title: "Fasal Salah", icon: "🌱", detail: "Fasal me keede ya rog dikhein to photo, fasal ka naam aur gaon ke saath Krishi Sahayak se salah lein." },
          ].map((topic) => (
            <button key={topic.title} onClick={() => setFarmTopic(topic)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "13px 14px", textAlign: "left", cursor: "pointer" }}>
              <span style={{ fontSize: 22 }}>{topic.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{topic.title}</span>
              <ChevronRight size={16} color={s.accent} style={{ marginLeft: "auto" }} />
            </button>
          ))}
          {farmTopic && <div style={{ background: "#fff", border: `1px solid ${s.accent}`, borderRadius: 12, padding: 14 }}><div style={{ fontSize: 16, fontWeight: 700, color: "#333" }}>{farmTopic.title}</div><div style={{ fontSize: 13, color: "#555", marginTop: 8 }}>{farmTopic.detail}</div><div style={{ fontSize: 11.5, color: "#777", marginTop: 9 }}>Ye general information hai; local Krishi Vibhag se final salah verify karein.</div></div>}
        </div>
      )}

      {screenKey === "assistant" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <textarea value={assistantQuestion} onChange={(event) => setAssistantQuestion(event.target.value)} placeholder="Jaise: PM Kisan yojana ke documents kya hain?" rows={4} style={{ resize: "vertical", padding: "11px 12px", borderRadius: 10, border: "1px solid #ddd", fontSize: 13.5 }} />
          <button onClick={askAssistant} disabled={assistantLoading} style={{ background: s.accent, color: "#fff", border: "none", borderRadius: 10, padding: "11px 12px", fontSize: 13.5, fontWeight: 600, cursor: assistantLoading ? "wait" : "pointer" }}>{assistantLoading ? "Soch raha hoon..." : "Sawal poochho"}</button>
          {assistantError && <div style={{ background: "#FFF4D6", color: "#765B16", borderRadius: 10, padding: "10px 12px", fontSize: 12.5 }}>{assistantError}</div>}
          {assistantAnswer && <div style={{ whiteSpace: "pre-wrap", background: "#fff", border: "1px solid #dbe6f7", borderRadius: 12, padding: 14, color: "#333", fontSize: 13.5 }}>{assistantAnswer}</div>}
          <div style={{ fontSize: 11.5, color: "#777" }}>OTP, UPI PIN, bank password ya secret key kabhi share na karein. Emergency me 112/doctor se contact karein.</div>
        </div>
      )}

      {screenKey === "karosub" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>Choose a KaroSub plan</div>
            <div style={{ fontSize: 12.5, color: "#666", marginTop: 5 }}>Premium access ke liye table below se plan select karein.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {Object.entries(karosubConfig.plans).map(([planKey, price]) => {
                const active = selectedPlan === planKey;
                return (
                  <button
                    key={planKey}
                    onClick={() => setSelectedPlan(planKey)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: active ? "1px solid #5D3FD3" : "1px solid #ddd",
                      background: active ? "#F3EEFF" : "#fff",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, fontWeight: 700, color: "#2d2d2d" }}>
                      <span>{planKey.charAt(0).toUpperCase() + planKey.slice(1)}</span>
                      <span>₹{price}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "#666", marginTop: 3 }}>
                      {planKey === "starter" ? "Basic premium access" : planKey === "pro" ? "Advanced features and support" : "Full premium suite and concierge"}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleKaroSubCheckout}
              disabled={karosubLoading || !karosubConfig.enabled}
              style={{ width: "100%", marginTop: 12, background: karosubConfig.enabled ? s.accent : "#c8c8c8", color: "#fff", border: "none", borderRadius: 9, padding: "12px 12px", fontSize: 13.5, fontWeight: 700, cursor: karosubLoading ? "wait" : "pointer" }}
            >
              {karosubLoading ? "Processing..." : `Pay ₹${karosubConfig.plans[selectedPlan] || 499} via KaroSub`}
            </button>
            {karosubStatus && <div style={{ background: "#EEF7FF", color: "#2459A6", borderRadius: 9, padding: "10px 12px", fontSize: 12.5, marginTop: 10 }}>{karosubStatus}</div>}
            {!karosubConfig.enabled && (
              <div style={{ marginTop: 10, background: "#FFF4D6", color: "#765B16", borderRadius: 9, padding: "10px 12px", fontSize: 12.5 }}>
                KaroSub not configured yet. Backend me KAROSUB_API_KEY aur KAROSUB_BASE_URL add karna hai.
              </div>
            )}
          </div>
        </div>
      )}

      {screenKey === "privacy" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 14, color: "#444", fontSize: 13, lineHeight: 1.55 }}>
          {language === "hi" ? <><b>Hum kya collect karte hain</b><p>Phone number, profile details, orders, expenses aur app messages service dene ke liye save ho sakte hain.</p><b>Payment safety</b><p>Jan Sathi UPI PIN, bank password ya OTP store nahi karta. Payment approval UPI app/bank screen par hota hai.</p><b>AI Assistant</b><p>Assistant ke sawal answer ke liye AI provider ko process ho sakte hain. Sensitive details share na karein.</p><b>Data control</b><p>Account ya data delete karne ke liye Jan Sathi support/admin se request karein.</p></> : <><b>What we collect</b><p>Your phone number, profile details, orders, expenses, and app messages may be stored to provide the service.</p><b>Payment safety</b><p>Jan Sathi never stores your UPI PIN, bank password, or OTP. Payment approval happens in your UPI app or bank screen.</p><b>AI Assistant</b><p>Questions sent to the Assistant may be processed by an AI provider to generate answers. Do not share sensitive details.</p><b>Your control</b><p>Contact Jan Sathi support/admin to request account or data deletion.</p></>}
        </div>
      )}

      {screenKey === "terms" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 14, color: "#444", fontSize: 13, lineHeight: 1.55 }}>
          {language === "hi" ? <><b>App use</b><p>Jan Sathi local services, information, jobs, community aur payments ka platform hai. Final verification user ki responsibility hai.</p><b>Jobs</b><p>Naukri ke liye kisi ko advance payment na karein. Company aur job details verify karke apply karein.</p><b>Health, schemes aur farming</b><p>App ki information general guidance hai. Emergency, medical ya government application me official authority se verify karein.</p><b>Payments</b><p>Receiver name, UPI ID aur amount check karke hi payment approve karein. Jan Sathi fake payment success guarantee nahi karta.</p></> : <><b>Using the app</b><p>Jan Sathi provides local services, information, jobs, community, and payment tools. Users must verify important information themselves.</p><b>Jobs</b><p>Never pay an advance fee for a job. Verify the company and job details before applying.</p><b>Health, schemes, and farming</b><p>Information is general guidance. Verify emergencies, medical advice, and government applications with official authorities.</p><b>Payments</b><p>Check the receiver name, UPI ID, and amount before approving a payment. Jan Sathi does not guarantee fake payment success.</p></>}
        </div>
      )}

      {s.items && !["community", "payments", "bills", "farming", "assistant"].includes(screenKey) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {screenKey === "jobs" && (
            <>
              <input
                value={jobSearch}
                onChange={(event) => setJobSearch(event.target.value)}
                placeholder="Job, company, location search karo"
                style={{ padding: "11px 12px", borderRadius: 10, border: "1px solid #ddd", fontSize: 13.5 }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                {[['all', 'Sabhi'], ['government', 'Sarkari'], ['private', 'Private']].map(([value, label]) => (
                  <button key={value} onClick={() => setJobType(value)} style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: "8px 4px", background: jobType === value ? s.bg : "#fff", color: jobType === value ? s.accent : "#666", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>{label}</button>
                ))}
              </div>
            </>
          )}
          {screenKey === "jobs" && <div style={{ fontSize: 12, color: "#777" }}>Sarkari aur private dono jobs</div>}
          {visibleItems?.map((item) => {
            const label = typeof item === "string" ? item : item.title || item.name;
            const detail = typeof item === "string" ? "" : [item.type === "government" ? "Sarkari" : "Private", item.company, item.salary, item.location].filter(Boolean).join(" · ");
            return (
              <button key={label} onClick={() => screenKey === "jobs" && setSelectedJob(typeof item === "string" ? { title: item } : item)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "12px 14px", color: "#333", fontSize: 14, textAlign: "left", cursor: "pointer" }}>
                <span>
                  <span style={{ display: "block" }}>{label}</span>
                  {detail && <span style={{ display: "block", marginTop: 4, color: "#777", fontSize: 12.5 }}>{detail}</span>}
                </span>
                <ChevronRight size={16} color={s.accent} />
              </button>
            );
          })}
          {screenKey === "jobs" && visibleItems?.length === 0 && <div style={{ fontSize: 13.5, color: "#999", textAlign: "center", padding: 12 }}>Is search me koi job nahi mili.</div>}
        </div>
      )}
      {screenKey === "jobs" && selectedJob && (
        <div style={{ marginTop: 14, background: "#fff", border: `1px solid ${s.accent}`, borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#333" }}>{selectedJob.title}</div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 7 }}><b>Salary:</b> {selectedJob.salary || "Company se confirm karein"}</div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 5 }}><b>Location:</b> {selectedJob.location || "Local area"}</div>
          {selectedJob.description && <div style={{ fontSize: 13, color: "#555", marginTop: 5 }}>{selectedJob.description}</div>}
          <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}><b>Apply:</b> Apna Aadhaar, phone number aur resume lekar diye gaye location par sampark karein.</div>
          <div style={{ fontSize: 11.5, color: "#777", marginTop: 9 }}>Job details employer se verify karke hi koi payment karein.</div>
        </div>
      )}
    </div>
  );
}

function GroceryScreen({ onBack, cart, setCart, screens, products, setProducts, userId }) {
  const s = screens.grocery;
  const [orderMessage, setOrderMessage] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("piece");
  const [newItemStock, setNewItemStock] = useState("10");

  const changeQty = (id, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] || 0) + delta;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const itemCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = products.reduce((sum, product) => sum + (cart[product._id || product.id] || 0) * product.price, 0);

  const requestShopDelivery = () => {
    if (itemCount === 0) {
      setOrderMessage("Pehle shop se kuch items add karo.");
      return;
    }
    setOrderMessage("Shop ko delivery request bhej diya gaya. Shop owner aapke address par delivery ke liye contact karega.");
  };

  const placeOrder = async () => {
    const items = products
      .filter((product) => cart[product._id || product.id])
      .map((product) => ({ productId: product._id, name: product.name, quantity: cart[product._id || product.id], price: product.price }));
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items, total }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Order failed");
      setOrderMessage(`Order #${data._id.slice(-6)} placed successfully`);
      setCart({});
    } catch (error) {
      setOrderMessage("Order nahi ho paya. Dobara try karo.");
    }
  };

  const addShopItem = async () => {
    const price = Number(newItemPrice);
    const stock = Number(newItemStock);
    if (!newItemName.trim() || !price || price <= 0 || stock < 0) {
      setOrderMessage("Samaan ka naam, sahi price aur stock likho.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName.trim(), price, unit: newItemUnit, category: "Kirana", stock }),
      });
      const product = await response.json();
      if (!response.ok) throw new Error(product.message || "Product add failed");
      setProducts((current) => [product, ...current]);
      setNewItemName("");
      setNewItemPrice("");
      setNewItemUnit("piece");
      setNewItemStock("10");
      setShowAddItem(false);
      setOrderMessage(`${product.name} dukaan me add ho gaya.`);
    } catch (error) {
      setOrderMessage("Samaan add nahi hua. Dobara try karo.");
    }
  };

  return (
    <div style={{ padding: "20px 18px", minHeight: 500, paddingBottom: itemCount > 0 ? 90 : 20 }}>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: "#5a5a5a", fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 18 }}
      >
        <ArrowLeft size={18} /> Wapas
      </button>

      <div style={{ background: s.bg, borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <ShoppingCart size={30} color={s.accent} />
        <div style={{ fontSize: 20, fontWeight: 700, color: "#2b2b2b", marginTop: 10 }}>{s.title}</div>
        <div style={{ fontSize: 14, color: "#6b6b6b", marginTop: 4 }}>{s.subtitle}</div>
      </div>

      <button onClick={() => setShowAddItem((current) => !current)} style={{ width: "100%", background: "#fff", color: "#2D6A3F", border: "1px solid #B7D8A8", borderRadius: 10, padding: "11px 12px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
        {showAddItem ? "Samaan add karna band karo" : "Shop owner: naya samaan add karo"}
      </button>

      {showAddItem && (
        <div style={{ background: "#F4FAF2", border: "1px solid #B7D8A8", borderRadius: 12, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#254C2C", marginBottom: 9 }}>Dukaan ka samaan add karo</div>
          <input value={newItemName} onChange={(event) => setNewItemName(event.target.value)} placeholder="Samaan ka naam, jaise Biscuit" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #c9d9c7", borderRadius: 8, padding: "10px", fontSize: 13, marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newItemPrice} onChange={(event) => setNewItemPrice(event.target.value)} inputMode="decimal" placeholder="Price" style={{ flex: 1, minWidth: 0, border: "1px solid #c9d9c7", borderRadius: 8, padding: "10px", fontSize: 13 }} />
            <select value={newItemUnit} onChange={(event) => setNewItemUnit(event.target.value)} style={{ width: 100, border: "1px solid #c9d9c7", borderRadius: 8, padding: "10px", background: "#fff", fontSize: 13 }}>
              <option value="piece">piece</option>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="packet">packet</option>
            </select>
          </div>
          <input value={newItemStock} onChange={(event) => setNewItemStock(event.target.value)} inputMode="numeric" placeholder="Kitne item available hain" style={{ width: "100%", boxSizing: "border-box", marginTop: 8, border: "1px solid #c9d9c7", borderRadius: 8, padding: "10px", fontSize: 13 }} />
          <button onClick={addShopItem} style={{ width: "100%", marginTop: 9, background: "#2F7A55", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Dukaan me add karo</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {products.map((p) => {
          const productId = p._id || p.id;
          const qty = cart[productId] || 0;
          const isAvailable = p.stock === undefined || Number(p.stock) > 0;
          return (
            <div key={productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "12px 14px" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{p.name}</div>
                <div style={{ fontSize: 12.5, color: "#777", marginTop: 2 }}>₹{p.price} / {p.unit || "piece"}</div>
                <div style={{ display: "inline-block", marginTop: 6, background: isAvailable ? "#E7F7E8" : "#FCE8E6", color: isAvailable ? "#26723B" : "#B3261E", borderRadius: 999, padding: "3px 7px", fontSize: 11, fontWeight: 700 }}>
                  {isAvailable ? `Available${p.stock !== undefined ? ` · ${p.stock} left` : ""}` : "Out of stock"}
                </div>
              </div>
              {qty === 0 ? (
                <button
                  onClick={() => changeQty(productId, 1)}
                  disabled={!isAvailable}
                  style={{ background: isAvailable ? s.bg : "#f1f1f1", color: isAvailable ? s.accent : "#999", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: isAvailable ? "pointer" : "not-allowed" }}
                >
                  {isAvailable ? "Add" : "Unavailable"}
                </button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: s.bg, borderRadius: 8, padding: "4px 8px" }}>
                  <button onClick={() => changeQty(productId, -1)} style={{ background: "none", border: "none", cursor: "pointer", color: s.accent }}>
                    <Minus size={15} />
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 600, color: s.accent, minWidth: 14, textAlign: "center" }}>{qty}</span>
                  <button onClick={() => changeQty(productId, 1)} style={{ background: "none", border: "none", cursor: "pointer", color: s.accent }}>
                    <Plus size={15} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {itemCount > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "#fff", borderTop: "1px solid #eee", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12.5, color: "#777" }}>{itemCount} item{itemCount > 1 ? "s" : ""}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#2b2b2b" }}>₹{total}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={requestShopDelivery} style={{ background: "#EAF3EA", color: "#2D6A3F", border: "none", borderRadius: 10, padding: "10px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              Delivery mangao
            </button>
            <button onClick={placeOrder} style={{ background: s.accent, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Order karo
            </button>
          </div>
        </div>
      )}
      {orderMessage && <div style={{ marginTop: 16, background: "#E3F3DC", color: "#2F6B35", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>{orderMessage}</div>}
    </div>
  );
}

function KharchaTracker({ onBack, expenses, setExpenses, userId }) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");

  const total = Array.isArray(expenses) ? expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0) : 0;

  const addExpense = async () => {
    const amt = parseFloat(amount);
    if (!label.trim() || !amt || amt <= 0) return;
    const response = await fetch(`${API_URL}/api/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId || undefined, label: label.trim(), amount: amt }),
    });
    if (!response.ok) return;
    const expense = await response.json();
    setExpenses([expense, ...expenses]);
    setLabel("");
    setAmount("");
  };

  const removeExpense = async (id) => {
    if (String(id).length === 24) {
      await fetch(`${API_URL}/api/expenses/${id}`, { method: "DELETE" });
    }
    setExpenses(expenses.filter((e) => (e._id || e.id) !== id));
  };

  return (
    <div style={{ padding: "20px 18px", minHeight: 500 }}>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: "#5a5a5a", fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 18 }}
      >
        <ArrowLeft size={18} /> Wapas
      </button>

      <div style={{ background: "#F1EEE6", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Wallet size={22} color="#5a5a4a" />
          <span style={{ fontSize: 20, fontWeight: 700, color: "#2b2b2b" }}>Kharcha Tracker</span>
        </div>
        <div style={{ fontSize: 14, color: "#6b6b6b", marginTop: 6 }}>Aaj: ₹{total} kharch hua</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Kya kharcha hua?"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ flex: 2, padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14 }}
        />
        <input
          placeholder="₹"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14 }}
        />
        <button
          onClick={addExpense}
          style={{ background: "#4C7A5E", border: "none", borderRadius: 10, padding: "0 14px", color: "#fff", cursor: "pointer" }}
        >
          <Plus size={18} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {expenses.length === 0 && (
          <p style={{ fontSize: 13.5, color: "#999", textAlign: "center", marginTop: 20 }}>Abhi tak koi kharcha nahi jada gaya.</p>
        )}
        {expenses.map((e) => (
          <div key={e._id || e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "10px 14px" }}>
            <span style={{ fontSize: 14, color: "#333" }}>{e.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>₹{e.amount}</span>
              <button onClick={() => removeExpense(e._id || e.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c66" }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersScreen({ onBack, orders }) {
  const statusLabel = (status) => ({
    pending: "Shop ko bheja gaya",
    accepted: "Shop ne accept kiya",
    preparing: "Order taiyar ho raha hai",
    out_for_delivery: "Delivery raste me hai",
    delivered: "Deliver ho gaya",
    cancelled: "Cancel ho gaya",
  }[status] || "Shop ko bheja gaya");

  return (
    <div style={{ padding: "20px 18px", minHeight: 500 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: "#5a5a5a", fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 18 }}>
        <ArrowLeft size={18} /> Wapas
      </button>
      <div style={{ background: "#E3F3DC", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <ShoppingCart size={28} color="#3B7A3E" />
        <div style={{ fontSize: 20, fontWeight: 700, color: "#2b2b2b", marginTop: 10 }}>Mere Orders</div>
        <div style={{ fontSize: 14, color: "#6b6b6b", marginTop: 4 }}>Aapke grocery orders ka status</div>
      </div>
      {orders.length === 0 ? (
        <p style={{ fontSize: 13.5, color: "#999", textAlign: "center" }}>Abhi koi order nahi hai.</p>
      ) : orders.map((order) => (
        <div key={order._id} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, color: "#333" }}>
            <span>Order #{order._id.slice(-6)}</span><span style={{ color: "#3B7A3E" }}>{statusLabel(order.status)}</span>
          </div>
          <div style={{ fontSize: 12.5, color: "#777", marginTop: 5 }}>{order.items?.map((item) => `${item.name} x${item.quantity}`).join(", ")}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginTop: 6 }}>₹{order.total}</div>
        </div>
      ))}
    </div>
  );
}

function AdminScreen({ onBack }) {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  const loadCounts = async () => {
    setLoading(true);
    const resources = ["users", "products", "jobs", "services", "orders", "community/posts"];
    const entries = await Promise.all(resources.map(async (resource) => {
      try {
        const response = await fetch(`${API_URL}/api/${resource}`);
        const data = await response.json();
        return [resource, Array.isArray(data) ? data.length : 0];
      } catch {
        return [resource, 0];
      }
    }));
    setCounts(Object.fromEntries(entries));
    setLoading(false);
  };

  useEffect(() => { if (authorized) loadCounts(); }, [authorized]);

  const login = async () => {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Admin login failed");
      return;
    }
    setError("");
    setAuthorized(true);
    loadCounts();
  };

  return (
    <div style={{ padding: "20px 18px", minHeight: 500 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: "#5a5a5a", fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 18 }}><ArrowLeft size={18} /> Wapas</button>
      <div style={{ background: "#E8F0FF", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <Landmark size={28} color="#2459A6" />
        <div style={{ fontSize: 20, fontWeight: 700, color: "#2b2b2b", marginTop: 10 }}>Jan Sathi Admin</div>
        <div style={{ fontSize: 14, color: "#6b6b6b", marginTop: 4 }}>Live data dashboard</div>
      </div>
      {!authorized ? (
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>Admin login required</div>
          <input type="password" value={pin} onChange={(event) => setPin(event.target.value)} placeholder="Admin PIN" style={{ width: "100%", boxSizing: "border-box", marginTop: 10, padding: "11px 12px", borderRadius: 9, border: "1px solid #ddd", fontSize: 14 }} />
          {error && <div style={{ color: "#B23B3B", fontSize: 12.5, marginTop: 7 }}>{error}</div>}
          <button onClick={login} style={{ width: "100%", marginTop: 10, background: "#2459A6", color: "#fff", border: "none", borderRadius: 9, padding: "11px", fontWeight: 600, cursor: "pointer" }}>Login karo</button>
        </div>
      ) : (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {["users", "products", "jobs", "services", "orders", "community/posts"].map((resource) => (
          <div key={resource} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, color: "#777" }}>{resource === "community/posts" ? "Community posts" : resource}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#2459A6", marginTop: 5 }}>{loading ? "..." : counts[resource]}</div>
          </div>
        ))}
      </div>
      )}
      <button onClick={loadCounts} style={{ width: "100%", marginTop: 16, background: "#2459A6", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 600, cursor: "pointer" }}>Dashboard refresh karo</button>
      <div style={{ fontSize: 11.5, color: "#777", marginTop: 12 }}>Production launch se pehle is screen ko admin login se protect karein.</div>
    </div>
  );
}

function EmailLoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [phoneLogin, setPhoneLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Valid email daalo');
      return;
    }
    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye');
      return;
    }
    if (mode === 'register' && name.trim().length < 2) {
      setError('Apna naam daalo');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('Dono password same hone chahiye');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/${mode === 'register' ? 'register' : 'login-email'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'register' ? { name: name.trim(), email, password } : { email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Login failed');
        return;
      }
      onLogin(email, data.user);
    } catch (requestError) {
      setError('Server se connect nahi hua. Backend check karo.');
    }
  };

  if (phoneLogin) {
    return <LoginScreen onLogin={onLogin} />;
  }

  return (
    <div style={{ padding: "40px 24px", minHeight: 500, display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(180deg, #fbf8f1 0%, #eef4f0 100%)" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ margin: "0 auto 14px", width: 82, height: 82 }}><JanSathiPremiumLogo size={82} variant="navy-gold" animated /></div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#102A43", letterSpacing: "1.5px" }}>JAN SATHI</div>
        <div style={{ fontSize: 12.5, color: "#9D6F24", marginTop: 6, fontWeight: 700, letterSpacing: "0.6px" }}>Har Zaroorat, Ek Jagah</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => { setMode('login'); setError(''); }} style={{ flex: 1, padding: "10px 4px", borderRadius: 9, border: "1px solid #174A68", background: mode === 'login' ? '#174A68' : '#fffdf8', color: mode === 'login' ? '#fff' : '#174A68', fontWeight: 600, cursor: 'pointer' }}>Login</button>
        <button onClick={() => { setMode('register'); setError(''); }} style={{ flex: 1, padding: "10px 4px", borderRadius: 9, border: "1px solid #174A68", background: mode === 'register' ? '#174A68' : '#fffdf8', color: mode === 'register' ? '#fff' : '#174A68', fontWeight: 600, cursor: 'pointer' }}>Create new account</button>
      </div>
      <button onClick={() => setPhoneLogin(true)} style={{ width: "100%", background: "#edf4f1", color: "#174A68", border: "1px solid #b8d2c9", borderRadius: 10, padding: "10px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>Phone se OTP login</button>
      {mode === 'register' && <input type="text" placeholder="Aapka naam" value={name} onChange={(event) => setName(event.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box", marginBottom: 8 }} />}
      <input type="email" placeholder="Email ID" value={email} onChange={(event) => setEmail(event.target.value.trim())} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box", marginBottom: 8 }} />
      <input type="password" placeholder="Password (minimum 6 characters)" value={password} onChange={(event) => setPassword(event.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box", marginBottom: 8 }} />
      {mode === 'register' && <input type="password" placeholder="Password dobara daalo" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box", marginBottom: 8 }} />}
      {error && <div style={{ color: "#B23B3B", fontSize: 12.5, marginBottom: 8 }}>{error}</div>}
      <button onClick={submit} style={{ width: "100%", background: "linear-gradient(135deg, #0052CC 0%, #0066FF 100%)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6, boxShadow: "0 12px 18px rgba(0, 102, 255, 0.22)" }}>{mode === 'register' ? 'Account banao' : 'Login karo'}</button>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [step, setStep] = useState("phone");
  const [loginMethod, setLoginMethod] = useState("otp");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [msg91VerificationId, setMsg91VerificationId] = useState("");

  const openMsg91Widget = async () => {
    if (!/^\d{10}$/.test(phone)) {
      setError('Sahi 10 anko ka phone number daalo');
      return;
    }
    if (!MSG91_WIDGET_ID || !MSG91_WIDGET_TOKEN) {
      setError('MSG91 widget configuration missing hai');
      return;
    }

    try {
      setError('');
      await loadMsg91Widget();
      window.initSendOTP({
        widgetId: MSG91_WIDGET_ID,
        tokenAuth: MSG91_WIDGET_TOKEN,
        identifier: `+91${phone}`,
        exposeMethods: false,
        success: async (widgetResponse) => {
          const accessToken = widgetResponse?.accessToken
            || widgetResponse?.['access-token']
            || widgetResponse?.token
            || widgetResponse?.message;
          if (!accessToken) {
            setError('MSG91 verification token nahi mila');
            return;
          }

          const response = await fetch(`${API_URL}/api/auth/verify-msg91-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, accessToken }),
          });
          const data = await response.json();
          if (!response.ok || !data.success) {
            setError(data.message || 'MSG91 OTP verify failed');
            return;
          }

          setError('');
          setMsg91VerificationId(data.verificationId || '');
          if (data.needsProfileSetup) {
            setStep('profile');
          } else {
            onLogin(phone, data.user);
          }
        },
        failure: (widgetError) => {
          const message = widgetError?.message || '';
          setError(message.includes('403') || message.toLowerCase().includes('invalid request')
            ? 'MSG91 account mein balance/KYC ya channel permission check karo.'
            : message || 'MSG91 OTP verification failed');
        },
      });
    } catch (widgetError) {
      setError(widgetError.message || 'MSG91 widget load nahi hua');
    }
  };

  const sendOtp = async (forgotPassword = false) => {
    if (!/^\d{10}$/.test(phone)) {
      setError('Sahi 10 anko ka phone number daalo');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'OTP send failed');
        return;
      }

      setSentOtp(data.otp);
      setError('');
      setStep(forgotPassword ? 'forgot-otp' : 'otp');
    } catch (error) {
      setError('Server se connect nahi hua. Backend check karo.');
    }
  };

  const loginWithPassword = async () => {
    if (!/^\d{10}$/.test(phone) || password.length < 6) {
      setError('Phone number aur 6+ character password daalo');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Login failed');
        return;
      }
      onLogin(phone, data.user);
    } catch (error) {
      setError('Server se connect nahi hua. Backend check karo.');
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{4}$/.test(otp)) {
      setError('4 anko ka OTP daalo');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'OTP verify failed');
        return;
      }

      setError('');
      if (data.needsProfileSetup) {
        setStep('profile');
      } else {
        onLogin(phone, data.user);
      }
    } catch (error) {
      setError('Server se connect nahi hua. Backend check karo.');
    }
  };

  const completeFirstLogin = async () => {
    if (name.trim().length < 2) {
      setError('Apna naam daalo');
      return;
    }
    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye');
      return;
    }
    if (password !== confirmPassword) {
      setError('Dono password same hone chahiye');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/complete-first-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, verificationId: msg91VerificationId, name: name.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Profile setup failed');
        return;
      }
      onLogin(phone, data.user);
    } catch (error) {
      setError('Server se connect nahi hua. Backend check karo.');
    }
  };

  const resetPassword = async () => {
    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye');
      return;
    }
    if (password !== confirmPassword) {
      setError('Dono password same hone chahiye');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Password reset failed');
        return;
      }
      onLogin(phone, data.user);
    } catch (error) {
      setError('Server se connect nahi hua. Backend check karo.');
    }
  };

  return (
<div style={{ padding: "40px 24px", minHeight: 500, display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(180deg, #fbf8f1 0%, #eef4f0 100%)" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ margin: "0 auto 14px", width: 82, height: 82 }}><JanSathiPremiumLogo size={82} variant="navy-gold" animated /></div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#0052CC", letterSpacing: "0.5px" }}>JAN SATHI</div>
        <div style={{ fontSize: 12.5, color: "#E74C3C", marginTop: 6, fontWeight: 700, letterSpacing: "0.2px" }}>Har Zaroorat, Ek Jagah</div>
      </div>

      {step === "phone" ? (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button onClick={() => { setLoginMethod("otp"); setError(""); }} style={{ flex: 1, padding: "9px 4px", borderRadius: 9, border: "1px solid #0052CC", background: loginMethod === "otp" ? "#0052CC" : "#fff", color: loginMethod === "otp" ? "#fff" : "#0052CC", fontWeight: 600, cursor: "pointer" }}>OTP login</button>
            <button onClick={() => { setLoginMethod("password"); setError(""); }} style={{ flex: 1, padding: "9px 4px", borderRadius: 9, border: "1px solid #0052CC", background: loginMethod === "password" ? "#0052CC" : "#fff", color: loginMethod === "password" ? "#fff" : "#0052CC", fontWeight: 600, cursor: "pointer" }}>Password login</button>
          </div>
          <label style={{ fontSize: 13, color: "#555", marginBottom: 6, display: "block" }}>Phone number</label>
          <input
            type="tel"
            placeholder="10 anko ka number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 15, boxSizing: "border-box", marginBottom: 8 }}
          />
          {error && <div style={{ color: "#B23B3B", fontSize: 12.5, marginBottom: 8 }}>{error}</div>}
          {loginMethod === "password" && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 15, boxSizing: "border-box", marginBottom: 8 }}
            />
          )}
          <button
            onClick={loginMethod === "password" ? loginWithPassword : openMsg91Widget}
            style={{ width: "100%", background: "linear-gradient(135deg, #0052CC 0%, #0066FF 100%)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6, boxShadow: "0 12px 18px rgba(0, 102, 255, 0.22)" }}
          >
            {loginMethod === "password" ? "Login karo" : "OTP bhejo"}
          </button>
          {loginMethod === "password" && (
            <button
              onClick={() => { setIsForgotPassword(true); setError(''); sendOtp(true); }}
              style={{ width: "100%", background: "none", border: "none", color: "#0052CC", fontSize: 13, cursor: "pointer", marginTop: 12, padding: 0 }}
            >
              Password bhool gaye?
            </button>
          )}
        </>
      ) : step === "otp" || step === "forgot-otp" ? (
        <>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 10 }}>
            +91 {phone} pe OTP bheja gaya (demo: <b>{sentOtp}</b>)
          </div>
          <input
            type="tel"
            placeholder="4 anko ka OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 15, boxSizing: "border-box", marginBottom: 8, letterSpacing: 4, textAlign: "center" }}
          />
          {error && <div style={{ color: "#B23B3B", fontSize: 12.5, marginBottom: 8 }}>{error}</div>}
          <button
            onClick={isForgotPassword ? () => { if (!/^\d{4}$/.test(otp)) { setError('4 anko ka OTP daalo'); return; } setError(''); setStep('reset-password'); } : verifyOtp}
            style={{ width: "100%", background: "linear-gradient(135deg, #0052CC 0%, #0066FF 100%)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6, boxShadow: "0 12px 18px rgba(0, 102, 255, 0.22)" }}
          >
            {isForgotPassword ? "OTP verify karo" : "Verify karo"}
          </button>
          <button
            onClick={() => { setStep("phone"); setIsForgotPassword(false); }}
            style={{ width: "100%", background: "none", border: "none", color: "#5a5a5a", fontSize: 13, cursor: "pointer", marginTop: 12, padding: 0 }}
          >
            Number badlo
          </button>
        </>
      ) : step === "profile" || step === "reset-password" ? (
        <>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#222", marginBottom: 6 }}>{step === "profile" ? "Apna profile banao" : "Naya password banao"}</div>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 14 }}>{step === "profile" ? "Pehli baar login ke liye naam aur password set karo." : "Apna naya password set karo."}</div>
          {step === "profile" && <input
            type="text"
            placeholder="Aapka naam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 15, boxSizing: "border-box", marginBottom: 8 }}
          />}
          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 15, boxSizing: "border-box", marginBottom: 8 }}
          />
          <input
            type="password"
            placeholder="Password dobara daalo"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 15, boxSizing: "border-box", marginBottom: 8 }}
          />
          {error && <div style={{ color: "#B23B3B", fontSize: 12.5, marginBottom: 8 }}>{error}</div>}
          <button
            onClick={step === "profile" ? completeFirstLogin : resetPassword}
            style={{ width: "100%", background: "linear-gradient(135deg, #0052CC 0%, #0066FF 100%)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6, boxShadow: "0 12px 18px rgba(0, 102, 255, 0.22)" }}
          >
            {step === "profile" ? "Login complete karo" : "Password reset karo"}
          </button>
        </>
      ) : null}
    </div>
  );
}

export default function JanSathiApp() {
  const [screen, setScreen] = useState("home");
  const [screens, setScreens] = useState(DEFAULT_SCREENS);
  const [products, setProducts] = useState(PRODUCTS);
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([
    { id: 1, label: "Sabzi", amount: 120 },
    { id: 2, label: "Bus kiraya", amount: 40 },
    { id: 3, label: "Chai", amount: 180 },
  ]);
  const [cart, setCart] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("Vipul Kiwana");
  const [userId, setUserId] = useState("");
  const [language, setLanguage] = useState("hi");
  const [homeAddress, setHomeAddress] = useState(() => localStorage.getItem("janSathiHomeAddress") || "");

  useEffect(() => {
    localStorage.setItem("janSathiHomeAddress", homeAddress);
  }, [homeAddress]);

  useEffect(() => {
    const loadFeatures = async () => {
      const data = await fetchFeatureData();
      if (data && Object.keys(data).length > 0) {
        const mergedScreens = Object.fromEntries(
          Object.entries(DEFAULT_SCREENS).map(([key, defaults]) => [
            key,
            { ...defaults, ...(data[key] || {}), icon: defaults.icon, items: defaults.items },
          ]),
        );
        setScreens(mergedScreens);
      } else {
        setScreens(DEFAULT_SCREENS);
      }
    };

    const loadExpenses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/expenses`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          setExpenses(data);
        }
      } catch (error) {
        console.warn('Expenses API unavailable');
      }
    };

    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          setProducts(data);
        }
      } catch (error) {
        console.warn('Products API unavailable');
      }
    };

    const loadServices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data)) {
          setServices(data);
        }
      } catch (error) {
        console.warn('Services API unavailable');
      }
    };

    const loadJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobs`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          setJobs(data);
        }
      } catch (error) {
        console.warn('Jobs API unavailable');
      }
    };

    loadFeatures();
    loadExpenses();
    loadProducts();
    loadServices();
    loadJobs();
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/api/orders?userId=${userId}`)
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]));
  }, [userId]);

  const total = Array.isArray(expenses) ? expenses.reduce((s, e) => s + Number(e.amount || 0), 0) : 0;
  const localizedScreens = localizeScreens(screens, language);
  const quickActions = [
    { label: "Electrician", subtitle: "Ghar par aa kar", phone: "+919876543210", message: "Namaste, mujhe electrician chahiye. Kya aap ghar par aa sakte hain?" },
    { label: "Plumber", subtitle: "Pipe fix", phone: "+919988766554", message: "Namaste, mujhe plumber chahiye. Kya aap ghar par aa sakte hain?" },
    { label: "Kirana", subtitle: "Delivery", phone: "+919900112233", message: "Namaste, mujhe kirana delivery chahiye. Kya aap ghar par delivery kar sakte hain?" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #eef5ff 0%, #dfeeff 100%)", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: "min(420px, 100%)", background: "linear-gradient(180deg, #fffdf8 0%, #f3f6f1 100%)", borderRadius: 28, margin: "20px 0", boxShadow: "0 28px 70px rgba(16, 42, 67, 0.18), 0 4px 14px rgba(201, 154, 62, 0.10)", overflow: "hidden", border: "1px solid rgba(201, 154, 62, 0.22)" }}>
        {!isLoggedIn ? (
          <EmailLoginScreen
            onLogin={(phone, user) => {
              setUserPhone(phone);
              setUserName(user?.name || `User ${phone.slice(-4)}`);
              setUserId(user?._id || "");
              setIsLoggedIn(true);
            }}
          />
        ) : screen === "home" ? (
          <div style={{ padding: "24px 20px" }}>
            <button onClick={() => setScreen("home")} aria-label="Jan Sathi home" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "10px 12px", borderRadius: 18, background: "linear-gradient(135deg, rgba(0, 82, 204, 0.09), rgba(255, 107, 107, 0.06))", border: "1px solid rgba(0, 82, 204, 0.06)", textAlign: "left", cursor: "pointer" }}>
              <JanSathiPremiumLogo size={50} variant="navy-gold" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0052CC" }}>JAN SATHI</div>
                <div style={{ fontSize: 11.5, color: "#4f6ca8" }}>{userName} · +91 {userPhone}</div>
              </div>
            </button>

            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#0052CC" }}>JAN SATHI</div>
              <div style={{ fontSize: 12.5, color: "#E74C3C", marginTop: 5, fontWeight: 700 }}>Har Zaroorat, Ek Jagah</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
              {[['hi', 'हिंदी'], ['en', 'English']].map(([value, label]) => <button key={value} onClick={() => setLanguage(value)} style={{ border: "1px solid #dbe6f7", borderRadius: 8, padding: "6px 12px", background: language === value ? "#0052CC" : "#fff", color: language === value ? "#fff" : "#2459A6", fontSize: 12, cursor: "pointer" }}>{label}</button>)}
            </div>

            <div style={{ background: "linear-gradient(135deg, #ecf7ff 0%, #fef6eb 100%)", border: "1px solid rgba(0, 82, 204, 0.08)", borderRadius: 18, padding: "16px 14px", marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0d2347" }}>Quick help</div>
                  <div style={{ fontSize: 12, color: "#5d6b82", marginTop: 2 }}>Ek click me madad mangao</div>
                </div>
                <div style={{ background: "#EAF3FF", color: "#0052CC", borderRadius: 999, padding: "5px 8px", fontSize: 11, fontWeight: 700 }}>LIVE</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => window.open(`https://wa.me/${action.phone.replace(/\D/g, "")}?text=${encodeURIComponent(action.message)}`, "_blank", "noopener,noreferrer")}
                    style={{ background: "#fff", border: "1px solid #dfe9f8", borderRadius: 12, padding: "10px 8px", cursor: "pointer", textAlign: "center" }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1f2d3d" }}>{action.label}</div>
                    <div style={{ fontSize: 10.5, color: "#66758c", marginTop: 4 }}>{action.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#10213f" }}>Zaroori services</div>
              <div style={{ fontSize: 14, color: "#5d6b82", marginTop: 4 }}>Apne aas-paas ki madad ek jagah paaiye.</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <HomeCard {...localizedScreens.sos} onClick={() => setScreen("sos")} wide />
            </div>

            <div style={{ marginBottom: 12 }}>
              <HomeCard {...localizedScreens.grocery} onClick={() => setScreen("grocery")} wide />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <HomeCard {...localizedScreens.health} onClick={() => setScreen("health")} />
              <HomeCard {...localizedScreens.sewa} onClick={() => setScreen("sewa")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <HomeCard {...localizedScreens.price} onClick={() => setScreen("price")} />
              <HomeCard {...localizedScreens.yojana} onClick={() => setScreen("yojana")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <HomeCard {...localizedScreens.community} onClick={() => setScreen("community")} />
              <HomeCard {...localizedScreens.jobs} onClick={() => setScreen("jobs")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <HomeCard {...localizedScreens.payments} onClick={() => setScreen("payments")} />
              <HomeCard {...localizedScreens.bills} onClick={() => setScreen("bills")} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <HomeCard {...localizedScreens.farming} onClick={() => setScreen("farming")} wide />
            </div>
            <div style={{ marginBottom: 12 }}>
              <HomeCard {...localizedScreens.assistant} onClick={() => setScreen("assistant")} wide />
            </div>
            <div style={{ marginBottom: 12 }}>
              <HomeCard {...localizedScreens.karosub} onClick={() => setScreen("karosub")} wide />
            </div>

            <button
              onClick={() => setScreen("kharcha")}
              style={{ width: "100%", background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Wallet size={19} color="#5a5a4a" />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#2b2b2b" }}>Kharcha Tracker</div>
                  <div style={{ fontSize: 12, color: "#8a8a8a" }}>Aaj: ₹{total} kharch hua</div>
                </div>
              </div>
              <ChevronRight size={18} color="#aaa" />
            </button>

            <button
              onClick={() => setScreen("orders")}
              style={{ width: "100%", background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "14px 16px", marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShoppingCart size={19} color="#3B7A3E" />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#2b2b2b" }}>Mere Orders</div>
                  <div style={{ fontSize: 12, color: "#8a8a8a" }}>{orders.length} order{orders.length === 1 ? "" : "s"}</div>
                </div>
              </div>
              <ChevronRight size={18} color="#aaa" />
            </button>

            <button onClick={() => setScreen("admin")} style={{ width: "100%", background: "#fff", border: "1px solid #dbe6f7", borderRadius: 14, padding: "12px 16px", marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: "#2459A6" }}><Landmark size={18} /> Admin Panel</span><ChevronRight size={18} color="#aaa" />
            </button>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 18 }}>
              <button onClick={() => setScreen("privacy")} style={{ background: "none", border: "none", color: "#2459A6", fontSize: 12, cursor: "pointer" }}>Privacy Policy</button>
              <button onClick={() => setScreen("terms")} style={{ background: "none", border: "none", color: "#2459A6", fontSize: 12, cursor: "pointer" }}>Terms & Conditions</button>
            </div>
          </div>
        ) : screen === "kharcha" ? (
          <KharchaTracker onBack={() => setScreen("home")} expenses={expenses} setExpenses={setExpenses} userId={userId} />
        ) : screen === "orders" ? (
          <OrdersScreen onBack={() => setScreen("home")} orders={orders} />
        ) : screen === "admin" ? (
          <AdminScreen onBack={() => setScreen("home")} />
        ) : screen === "grocery" ? (
          <div style={{ position: "relative" }}>
            <GroceryScreen onBack={() => setScreen("home")} cart={cart} setCart={setCart} screens={screens} products={products} setProducts={setProducts} userId={userId} />
          </div>
        ) : (
          <DetailScreen screenKey={screen} onBack={() => setScreen("home")} onNavigate={setScreen} screens={{ ...localizedScreens, services, jobs: { ...localizedScreens.jobs, items: jobs.length ? jobs : localizedScreens.jobs.items } }} userName={userName} language={language} homeAddress={homeAddress} onSaveHomeAddress={setHomeAddress} />
        )}
      </div>
    </div>
  );
}

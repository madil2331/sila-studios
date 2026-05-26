// TODO: Update WHATSAPP_NUMBER below with your actual WhatsApp number
const WHATSAPP_NUMBER = '+92-316-3973017'

const items = [
  'Free delivery on orders above Rs. 6,000.',
  'Free delivery on orders above Rs. 6,000.',
  'Free delivery on orders above Rs. 6,000.',
]

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        {items.map((item, i) => (
          <span className="announcement-item" key={i}>
            <span className="dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

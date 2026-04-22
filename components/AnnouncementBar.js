// TODO: Update WHATSAPP_NUMBER below with your actual WhatsApp number
const WHATSAPP_NUMBER = '+92-316-3973017'

const items = [
  'New Collection — Spring 2025',
  'Free Delivery Within Karachi',
  'Order Via WhatsApp',
  'Custom Stitching Available',
  'New Collection — Spring 2025',
  'Free Delivery Within Karachi',
  'Order Via WhatsApp',
  'Custom Stitching Available',
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

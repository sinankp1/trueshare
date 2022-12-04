import "./style.css"
export default function ChatOnline() {
  return (
    <div className="chatOnline">
        <div className="chatOnlineFriend">
            <div className="chatOnlineImgContainer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg" alt="" className="chatOnlineImg" />
                <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">Dheeraj</span>
        </div>
    </div>
  )
}

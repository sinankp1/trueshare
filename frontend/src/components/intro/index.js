import { useState } from "react"
import "./style.css"
export default function Intro({details}) {
  const initial = {
    bio: details?.bio ? details.bio : "",
    bio: details?.bio ? details.bio : "",
    bio: details?.bio ? details.bio : "",
    bio: details?.bio ? details.bio : "",
    bio: details?.bio ? details.bio : "",
    bio: details?.bio ? details.bio : "",
    bio: details?.bio ? details.bio : "",
  }
  const [infos,setInfos] = useState(initial)
  return (
    <div className="profile_card" >
      <div className="profile_card_header">
        Intro
      </div>
    </div>
  )
}

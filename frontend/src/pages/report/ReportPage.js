import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { reportSubmit } from "../../functions/user";
import ReportItem from "./ReportItem";
import "./style.css";
export default function ReportPost() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const { postId } = useParams();
  const [inside, setInside] = useState("");
  const reportSubmitHandler = async () => {
    const res = await reportSubmit(postId, inside, user.token);
    navigate('/');
  };
  return (
    <div className="blur1">
      <div className="report_popup">
        <div className="c_header">
          {inside && (
            <div className="lArrow" onClick={() => setInside("")}>
              <i className="right_icon"></i>
            </div>
          )}
          Report Post
          <div className="small_circle" onClick={()=>navigate(-1)}>
            <i className="exit_icon"></i>
          </div>
        </div>
        <div className="c_body">
          {inside ? (
            <div className="selectedItem">
              <span>{inside}</span>
              <span>
                We will only remove content that goes against out community
                guidlines.
                {inside !== "Terrorism" && "We don't allow things such as:"}
              </span>
              {inside === "Nudity" ? (
                <ul>
                  <li>Sexual activity</li>
                  <li>Offering or requesting sexual activity</li>
                  <li>Nudity showing genitals</li>
                  <li>Sexually explicit language</li>
                </ul>
              ) : inside === "Terrorism" ? (
                <div className="terrorism">
                  We remove content about any non-governmental group or person
                  that engages in or supports planned acts of violence for
                  political, religious or ideological reasons.
                </div>
              ) : inside === "Violence" ? (
                <ul>
                  <li>Threats to commit violence</li>
                  <li>Dangerous persons or organisations</li>
                  <li>Extreme graphic violence</li>
                  <li>Another kind of violence</li>
                </ul>
              ) : inside === "Hate speech" ? (
                <ul>
                  <li>Violent or dehumanising speech</li>
                  <li>Dangerous persons or organisations</li>
                  <li>Slurs</li>
                  <li>Call for exclusion or segregation</li>
                </ul>
              ) : (
                ""
              )}
              <button onClick={reportSubmitHandler}>Submit</button>
            </div>
          ) : (
            <>
              <div className="body_header">
                <span>Please select a problem</span>
                <span>
                  If someone is in immediate danger, get help before reporting
                  to trueshare. Don't wait.
                </span>
              </div>
              <div className="reportItems">
                <ReportItem type="Nudity" setInside={setInside} />
                <ReportItem type="Terrorism" setInside={setInside} />
                <ReportItem type="Violence" setInside={setInside} />
                <ReportItem type="Hate speech" setInside={setInside} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

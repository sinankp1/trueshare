export default function ReportItem({ type,setInside }) {
  return (
    <div className="reportItem" onClick={()=>setInside(type)}>
      <span>{type}</span>
      <div className="rArrow">
        <i className="right_icon"></i>
      </div>
    </div>
  );
}

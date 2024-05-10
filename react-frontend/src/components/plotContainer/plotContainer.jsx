import "./plotContainer.scss"

export const PlotContainer = ({title = '' , content = null, width = "100%" , height = "100%"}) =>{
    return <div className="plotContainer" style={{width , height}}> 
        <div className="plotContainerTitle"> {title}</div>
        <div className="plotContainerContent">{content}</div>
    </div>
}
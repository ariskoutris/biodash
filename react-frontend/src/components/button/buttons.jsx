import './buttons.css'
export const Button = ({onClick , content = '' , isPressed = false, ...options}) => {
    return <button
        {...options}
        onClick={onClick ||(()=>{})} 
        className={isPressed?'mainButtonPressed' : 'mainButton'}
        >
            {content}
        </button>
}
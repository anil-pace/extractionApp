var React =   require('react');

var Tab= function(props){
    return (
        <li className={"tab "+props.linkClassName +(props.isActive ? " active" : "")}
        onClick={!props.disabled ? function(event){
                    event.preventDefault();
                    props.onClick(props.tabIndex);
                } : null}>
                {props.tabName}
            
        </li>
        )
}

module.exports = Tab;


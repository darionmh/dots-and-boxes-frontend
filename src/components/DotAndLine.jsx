import React, { Component } from 'react'
import PropTypes from 'prop-types'
import "../styles/dotAndLine.scss"

export default class DotAndLine extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        id: PropTypes.number.isRequired,
        orientation: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        claimedBy: PropTypes.string,
    }   

    render() {
        return (
            <div className={`line-wrapper ${this.props.orientation}`} onClick={() => this.props.onClick(this.props.id)}>
                <div style={{backgroundColor: this.props.color}} className={`line ${this.props.orientation}`}/>
            </div>
        )
    }
}

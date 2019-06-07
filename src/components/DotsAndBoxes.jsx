import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DotAndLine from "./DotAndLine"

import "../styles/dotsAndBoxes.scss"
import PlayerPreferences from './PlayerPreferences';
import { Icon } from 'semantic-ui-react';

const URL = process.env.WS_ADDR ? process.env.WS_ADDR : 'ws://localhost:3030'
console.log(URL)

const BOARD_SIZE = 11

const type = ({
    box: "box",
    dot: "dot",
    line: "line",
})

const SET_PLAYER_PREFS = "SET_PLAYER_PREFS"
const LINE_SELECT = "LINE_SELECT"

export default class DotsAndBoxes extends Component {
    state = {
        connected: false,
        playerName: "",
        color: "red",
        players: [],
        board: [],
    }

    static propTypes = {
    }

    ws = new WebSocket(URL)

    lineClick = (lineId) => {
        console.log(lineId)
        if(this.validateLineSelect(lineId))
            this.ws.send(JSON.stringify({payload: {lineId}, type: LINE_SELECT}))
    }

    validateLineSelect = (lineId) => {
        return (this.state.board.find(it => it.id === lineId).color === "") && this.state.players[this.state.turn].name === this.state.playerName
    }

    mapBoard = (boardData) => {
        let board = boardData.map(
            it => {
                if(it.type === type.line) return <DotAndLine key={it.id} orientation={it.orientation} id={it.id} color={it.color} onClick={this.lineClick}/>
                if(it.type === type.box) return <div style={{backgroundColor: it.color}} className="box"/>
                if(it.type === type.dot) return <div className="dot"/>
            }
        )

        return board
    }

    componentDidMount() {
        this.ws.onopen = ((evt) => {
            console.log("connected!")
            this.setState({connected: true})

            const {playerName, color} = this.state
        })

        this.ws.onmessage = ((evt) => {
            const message = JSON.parse(evt.data)
            console.log(message)
            this.setState({...message})
        })

        this.ws.onclose = ((evt) => {
            this.setState({connected: false})
        })

        this.ws.onerror = evt => {
            console.log("error", evt)
        }
    }

    setPrefs = (name, color) => {
        this.setState({
            playerName: name,
            color
        }, () => {
            const {playerName, color} = this.state
            this.ws.send(JSON.stringify({payload: {name: playerName, color}, type: SET_PLAYER_PREFS}))
        })
    }
    
    render() {
        console.log(this.state)
        
        let scoreComponents = []
        this.state.players.forEach(it => {
            const myTurn = this.state.players.length > 0 && this.state.players[this.state.turn].name === it.name

            scoreComponents.push(myTurn ? <Icon name="arrow right" style={{color: it.color}}/> : <div/>)
            scoreComponents.push(<div className="player-list-item" style={{color: it.color}}>{it.name}</div>)
            scoreComponents.push(<div style={{color: it.color}}>-</div>)
            scoreComponents.push(<div style={{color: it.color}}>{it.score}</div>)
        })
        return (
            <div className="game-wrapper">
                <PlayerPreferences visible={this.state.playerName === ""} onSubmit={this.setPrefs}/>
                <div className="player-list">
                    {scoreComponents}
                </div>
                <div className="board">
                    {this.mapBoard(this.state.board)}
                </div>
                <div className="spacer">
                </div>
            </div>
        )
    }
}

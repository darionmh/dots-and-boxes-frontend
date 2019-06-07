import React, { Component } from 'react'
import {Modal, Button, Form, Dropdown, Icon, Input} from "semantic-ui-react"
import {options} from "./Colors"

export default class PlayerPreferences extends Component {
    onSubmit = () => {
        if(typeof this.name === "undefined" || this.name === ""){
            alert("Enter a name.")
            return
        }
        if(typeof this.color === "undefined"){
            alert("Choose a color.")
            return
        }
        console.log(this.color)
        console.log(this.name)
        this.props.onSubmit(this.name, this.color)
    }

    render() {
        const colors = options.map(it => (
            {
                key: it.id,
                text: it.label,
                value: it.color,
                icon: <Icon name="circle" style={{color: `${it.color}`}}/>
            }
        ))

        return (
            <Modal open={this.props.visible}>
                <Modal.Header>Setup your profile.</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Field>
                            <label>Name</label>
                            <Input placeholder='Name' onChange={(e, data) => this.name = data.value}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Color</label>
                            <Dropdown
                                placeholder='Select Color'
                                fluid
                                selection
                                options={colors}
                                onChange={(e, data) => this.color = data.value}
                            />
                        </Form.Field>
                        <Button type='submit'>Save</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

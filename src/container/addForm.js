import React, { Component } from 'react'
import soap from '../lib/soap'
import dateFns from 'date-fns'
import {Form, Message} from "semantic-ui-react";

class AddForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            status: {code:{}, message:''},
            title: '',
            from: this.props.date,
            to: dateFns.addMinutes(this.props.date, 30),
            location: '',
            attendee: [],
            body:''
        }
    }

    addMeeting = () => {
        //soap()
    }

    hours = [...Array(24)].map((_, key) => {
        return {
            key: key,
            text: key < 10 ? '0' + key : key,
            value: key
        }
    });
    minutes = [...Array(60)].map((_, key) => {
        return {
            key: key,
            text: key < 10 ? '0' + key : key,
            value: key
        }
    });

    render(){
        let fromHour = parseInt(dateFns.format(this.state.from, 'H'), 10)
        let fromMin = parseInt(dateFns.format(this.state.from, 'm'), 10)
        let toHour = parseInt(dateFns.format(this.state.to, 'H'), 10)
        let toMin = parseInt(dateFns.format(this.state.to, 'm'), 10)

        return (
            <Form {...this.state.status.code}>
                <Message
                    success
                    header={this.state.status.message}
                />
                <Message
                    error
                    header={this.state.status.message}
                />
                <Form.Input fluid label='Title' placeholder='Title' value={this.state.title} onChange={(e, {value}) => this.setState({title: value})}/>
                <Form.Group widths='equal' inline>
                    <Form.Select fluid label='From' placeholder='Hour' options = {this.hours} value={fromHour} onChange={(e, {value}) => {this.setState({from: dateFns.setHours(this.state.from, value)});}}/>
                    <Form.Select fluid label='' placeholder='Minute' options = {this.minutes} value={fromMin} onChange={(e, {value}) => {this.setState({from: dateFns.setMinutes(this.state.from, value)});}}/>
                    <Form.Select fluid label='To' placeholder='Hour' options = {this.hours} value={toHour} onChange={(e, {value}) => {this.setState({to: dateFns.setHours(this.state.to, value)});}}/>
                    <Form.Select fluid label='' placeholder='Minute' options = {this.minutes} value={toMin} onChange={(e, {value}) => {this.setState({to: dateFns.setMinutes(this.state.to, value)});}}/>
                </Form.Group>
                <Form.Input fluid label='Location' placeholder='Location' value={this.state.location} onChange={(e, {value}) => this.setState({location: value})}/>
                <Form.Select fluid multiple label='Attendee' options={[
                    { key: 'bruce.zhao@esi-asia.com', text: 'Bruce Zhao', value: 'bruce.zhao@esi-asia.com' },
                    { key: 'test', text: 'test', value: 'test' },
                ]} placeholder='Attendee' value={this.state.attendee} onChange={(e, {value}) => this.setState({attendee: value})}/>
                <Form.TextArea label='Body' placeholder='Body' value={this.state.body} onChange={(e, {value}) => this.setState({body: value})}/>
                <Form.Button
                    onClick={this.addMeeting}
                    positive
                    labelPosition='right'
                    icon='checkmark'
                    content='Confirm'
                />
            </Form>
        )
    }

}

export default AddForm
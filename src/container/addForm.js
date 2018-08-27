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

    textChange = (e) => {
        this.setState({title: e.target.value})
    }



    render(){
        console.log(dateFns.format(this.state.from, 'H'))
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
                <Form.Input fluid label='Title' placeholder='Title' value={this.state.title} onChange={this.textChange}/>
                <Form.Group widths='equal' inline>
                    <Form.Select fluid label='From' placeholder='Hour' options = {this.hours} value={dateFns.format(this.state.from, 'H')}/>
                    <Form.Select fluid label='' placeholder='Minute' options = {this.minutes} value={dateFns.format(this.state.from, 'M')}/>
                    <Form.Select fluid label='To' placeholder='Hour' options = {this.hours} value={dateFns.format(this.state.to, 'H')}/>
                    <Form.Select fluid label='' placeholder='Minute' options = {this.minutes} value={dateFns.format(this.state.to, 'M')}/>
                </Form.Group>
                <Form.Input fluid label='Location' placeholder='Location' value={this.state.location}/>
                <Form.Select fluid multiple label='Attendee' options={[
                    { key: 'bruce.zhao@esi-asia.com', text: 'Bruce Zhao', value: 'bruce.zhao@esi-asia.com' },
                    { key: 'test', text: 'test', value: 'test' },
                ]} placeholder='Gender' />
                <Form.TextArea label='Body' placeholder='Body' value={this.state.body}/>
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
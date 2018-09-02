import React, { Component } from 'react'
import soap from '../lib/soap'
import dateFns from 'date-fns'
import {Form, Message} from "semantic-ui-react";
import xml2js from "xml2js";

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

        const {title, body, from, to, location, attendee} = this.state;
        const query = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
            '               xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n' +
            '               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"\n' +
            '               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">\n' +
            '  <soap:Body>\n' +
            '    <CreateItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"\n' +
            '                xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types" \n' +
            '                SendMeetingInvitations="SendToAllAndSaveCopy" >\n' +
            '      <SavedItemFolderId>\n' +
            '        <t:DistinguishedFolderId Id="calendar"/>\n' +
            '      </SavedItemFolderId>\n' +
            '      <Items>\n' +
            '        <t:CalendarItem xmlns="http://schemas.microsoft.com/exchange/services/2006/types">\n' +
            `          <Subject>${title}</Subject>\n` +
            `          <Body BodyType="Text">${body}</Body>\n` +
            '          <ReminderIsSet>true</ReminderIsSet>\n' +
            '          <ReminderMinutesBeforeStart>60</ReminderMinutesBeforeStart>\n' +
            `          <Start>${dateFns.format(dateFns.subHours(from, 8), 'YYYY-MM-DD[T]HH:mm:ss')}</Start>\n` +
            `          <End>${dateFns.format(dateFns.subHours(to, 8), 'YYYY-MM-DD[T]HH:mm:ss')}</End>\n` +
            '          <IsAllDayEvent>false</IsAllDayEvent>\n' +
            '          <LegacyFreeBusyStatus>Busy</LegacyFreeBusyStatus>\n' +
            `          <Location>${location}</Location>\n` +
            '          <RequiredAttendees>\n' +
            attendee.map((v, _) => {
                return '            <Attendee>\n' +
                    '              <Mailbox>\n' +
                    `                <EmailAddress>${v}</EmailAddress>\n` +
                    '              </Mailbox>\n' +
                    '            </Attendee>\n'
            }).join() +
            '          </RequiredAttendees>\n' +
            '        </t:CalendarItem>\n' +
            '      </Items>\n' +
            '    </CreateItem>\n' +
            '  </soap:Body>\n' +
            '</soap:Envelope>';

        soap(query).then(res => {
            return res.text()
        }).then((data) => {
            //console.log(data);
            let that = this
            xml2js.parseString(data, function (err, result) {
                if (!err){
                    //console.log(result);
                    let res = result['s:Envelope']["s:Body"][0]["m:CreateItemResponse"][0]["m:ResponseMessages"][0]["m:CreateItemResponseMessage"][0]
                    let responseClass = res["$"]["ResponseClass"]
                    let responseCode = res["m:ResponseCode"]
                    if (responseClass === 'Success'){
                        that.setState({
                            status: {
                                code: {success: true},
                                message: 'Meeting has been scheduled'
                            },

                        })
                    }
                }//
            });

        })
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